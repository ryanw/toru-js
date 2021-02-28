precision highp float;

#pragma glslify: Material = require('./structs/material')
#pragma glslify: Light = require('./structs/light')

uniform mat4 uModel;
uniform vec4 uFillColor;
uniform mat4 uView;
uniform sampler2D uShadowMap;
uniform vec3 uLightDir;
uniform Material uMaterial;
uniform int uLightCount;
uniform Light uLights[32];

varying vec3 vNormal;
varying vec3 vViewNormal;
varying vec4 vPosition;
varying vec2 vTexCoord;
varying vec4 vPositionInLight;
varying vec3 vBasePosition;

#define PI 3.1415926535897932384626433832795

vec2 toLonLat(vec3 point) {
	vec3 v = normalize(point);
	float lat = acos(v.y) - PI / 2.0;
	float lon = atan(v.z, v.x) + PI / 2.0;
	return vec2(lon, lat);
}

vec2 lonLatToUV(vec2 ll) {
	float x = -ll.x / PI / 2.0;
	float y = ll.y / PI + 0.5;
	return vec2(fract(x), fract(y));
}

void main(void) {
	vec2 uv = lonLatToUV(toLonLat(vBasePosition));

	vec4 texColor;
	if (uMaterial.hasTexture) {
		texColor = texture2D(uMaterial.texture, uv);
	} else {
		texColor = uMaterial.color;
	}

	vec3 texNormal;
	if (uMaterial.hasNormalMap) {
		texNormal = normalize(vec4(normalize(vNormal) * texture2D(uMaterial.normalMap, uv).rgb, 0.0) * uModel * uView).xyz;
	}
	else {
		texNormal = normalize(vec4(normalize(vNormal), 0.0) * uModel * uView).xyz;
	}

	float texSpecular = 0.0;
	if (uMaterial.hasSpecularMap) {
		texSpecular = texture2D(uMaterial.specularMap, uv).r;
	}

	if (uMaterial.emissive) {
		gl_FragColor = texColor;
		return;
	}

	vec4 vertPos4 = vPosition * uView;
	vec3 vertPos = vertPos4.xyz / vertPos4.w;

	vec3 ambient = vec3(0.0);
	vec3 diffuse = vec3(0.0);
	vec3 specular = vec3(0.0);


	for (int i = 0; i < 32; i++) {
		if (i >= uLightCount) break;

		vec4 lightPos4 = vec4(uLights[i].position, 1.0) * uView;
		vec3 lightPos = lightPos4.xyz / lightPos4.w;

		vec3 lightDir = normalize(lightPos - vertPos);
		vec3 lightColor = uLights[i].diffuse;
		ambient += uLights[i].ambient;

		float diff = max(dot(texNormal, lightDir), 0.0);
		diffuse += diff * lightColor;

		float lambertian = max(dot(texNormal, lightDir), 0.0);
		float spec = 0.0;

		if (lambertian > 0.0) {
			vec3 reflectDir = reflect(-lightDir, texNormal);
			vec3 viewDir = normalize(-vertPos);

			float specAngle = max(dot(reflectDir, viewDir), 0.0);
			spec = pow(specAngle, 64.0) * texSpecular;
		}
		specular += spec * lightColor;
	}


	float shade = 0.0;

	if (uMaterial.receivesShadows) {
		float edge = 1.0/1024.0;
		vec3 shadowPos = (vPositionInLight.xyz / vPositionInLight.w) * 0.5 + 0.5;

		float shadows[9];

		shadows[0] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y)).r;
		shadows[1] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y)).r;
		shadows[2] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y)).r;
		shadows[3] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y - edge)).r;
		shadows[4] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y + edge)).r;
		shadows[5] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y - edge)).r;
		shadows[6] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y - edge)).r;
		shadows[7] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y + edge)).r;
		shadows[8] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y + edge)).r;

		float distanceFromLight = shadowPos.z;

		float bias = 0.00001;
		for (int i = 0; i < 9; i++) {
			if (distanceFromLight > shadows[i] + bias) {
				shade += 0.08;
			}
		}
	}
	vec3 shadowColor = vec3(0.0);

	vec3 color = mix(texColor.rgb, shadowColor, shade);
	color = (ambient + diffuse + specular) * color;
	gl_FragColor = vec4(color, texColor.a);
}
