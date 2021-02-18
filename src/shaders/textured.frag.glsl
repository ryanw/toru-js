precision mediump float;

uniform vec4 uFillColor;
uniform sampler2D uTexture;
uniform sampler2D uShadow;
uniform vec3 uLightDir;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;
varying vec4 vPositionInLight;

void main(void) {
	vec3 lightColor = vec3(1.0);
	vec3 ambient = 0.1 * lightColor;


	float diff = max(dot(vNormal, uLightDir), 0.0);
	vec3 diffuse = diff * lightColor;

	vec3 viewDir = normalize(-vPosition);
	vec3 reflectDir = reflect(-uLightDir, vNormal);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
	vec3 specular = 0.5 * spec * lightColor;


	vec4 texColor = texture2D(uTexture, vTexCoord);
	vec3 color = (ambient + diffuse + specular) * texColor.rgb;

	float shade = 0.0;

	float edge = 1.0/1024.0;
	vec3 shadowPos = (vPositionInLight.xyz / vPositionInLight.w) * 0.5 + 0.5;

	float shadows[9];

	shadows[0] = texture2D(uShadow, vec2(shadowPos.x, shadowPos.y)).r;
	shadows[1] = texture2D(uShadow, vec2(shadowPos.x - edge, shadowPos.y)).r;
	shadows[2] = texture2D(uShadow, vec2(shadowPos.x + edge, shadowPos.y)).r;
	shadows[3] = texture2D(uShadow, vec2(shadowPos.x, shadowPos.y - edge)).r;
	shadows[4] = texture2D(uShadow, vec2(shadowPos.x, shadowPos.y + edge)).r;
	shadows[5] = texture2D(uShadow, vec2(shadowPos.x - edge, shadowPos.y - edge)).r;
	shadows[6] = texture2D(uShadow, vec2(shadowPos.x + edge, shadowPos.y - edge)).r;
	shadows[7] = texture2D(uShadow, vec2(shadowPos.x - edge, shadowPos.y + edge)).r;
	shadows[8] = texture2D(uShadow, vec2(shadowPos.x + edge, shadowPos.y + edge)).r;

	float distanceFromLight = shadowPos.z;

	float bias = 0.0001;
	for (int i = 0; i < 9; i++) {
		if (distanceFromLight > shadows[i] + bias) {
			shade += 0.08;
		}
	}
	vec3 shadowColor = vec3(0.0);

	gl_FragColor = vec4(mix(color, shadowColor, shade), texColor.a);
}
