#pragma glslify: Material = require('./structs/material')
#define PI 3.1415926535897932384626433832795

uniform mat4 uViewProj;
uniform mat4 uView;
uniform mat4 uModel;
uniform mat4 uLight;
uniform Material uMaterial;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec3 vNormal;
varying vec3 vViewNormal;
varying vec4 vPosition;
varying vec3 vBasePosition;
varying vec2 vTexCoord;
varying vec4 vPositionInLight;

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
	mat4 mvp = uModel  * uViewProj;
	vec2 uv = lonLatToUV(toLonLat(position));
	vec3 pos = position;
	if (uMaterial.hasDisplacementMap) {
		vec3 texNormal = texture2D(uMaterial.displacementMap, uv).rgb;
		pos += normal * texNormal * uMaterial.displacementMultiplier;
	}
	gl_Position = vec4(pos, 1.0) * mvp;
	vBasePosition = pos;
	vPosition = vec4(pos, 1.0) * uModel;
	//vNormal = normalize((vec4(normal, 0.0) * uModel)).xyz;
	vNormal = normal;
	vViewNormal = normalize((vec4(normal, 0.0) * uModel * uView)).xyz;
	vPositionInLight = vec4(pos, 1.0) * uModel * uLight;
	vTexCoord = uv;
}
