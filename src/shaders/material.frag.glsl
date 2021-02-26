precision highp float;

struct Material {
	bool castsShadows;
	bool receivesShadows;
	bool hasTexture;
	vec4 color;
	sampler2D texture;
};

uniform vec4 uFillColor;
uniform mat4 uView;
uniform sampler2D uShadowMap;
uniform vec3 uLightDir;
uniform Material uMaterial;

varying vec3 vNormal;
varying vec3 vViewNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec4 vPositionInLight;

void main(void) {
	vec3 lightColor = vec3(1.0);
	vec3 ambient = 0.1 * lightColor;
	vec3 lightDir = (vec4(uLightDir, 0.0) * uView).xyz;


	float diff = max(dot(vNormal, uLightDir), 0.0);
	vec3 diffuse = diff * lightColor;

	vec3 viewDir = normalize(-vPosition);
	vec3 reflectDir = reflect(-uLightDir, vNormal);
	float spec = 0.0;
	if (diff > 0.0) {
		spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
	}
	vec3 specular = 0.5 * spec * lightColor;

	vec4 texColor;
	if (uMaterial.hasTexture) {
		texColor = texture2D(uMaterial.texture, vTexCoord);
	} else {
		texColor = uMaterial.color;
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
