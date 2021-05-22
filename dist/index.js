(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["toru"] = factory();
	else
		root["toru"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shaders/material.frag.glsl":
/*!****************************************!*\
  !*** ./src/shaders/material.frag.glsl ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision highp float;\n#define GLSLIFY 1\n\nstruct Material {\n\tbool castsShadows;\n\tbool receivesShadows;\n\tbool hasTexture;\n\tbool hasNormalMap;\n\tbool hasSpecularMap;\n\tbool hasDisplacementMap;\n\tbool emissive;\n\tvec4 color;\n\tfloat displacementMultiplier;\n\tsampler2D texture;\n\tsampler2D normalMap;\n\tsampler2D specularMap;\n\tsampler2D displacementMap;\n};\n\nstruct Light {\n\tvec3 position;\n\tvec3 ambient;\n\tvec3 diffuse;\n\tvec3 specular;\n\n\tfloat constant;\n\tfloat linear;\n\tfloat quadratic;\n};\n\nuniform mat4 uModel;\nuniform vec4 uFillColor;\nuniform mat4 uView;\nuniform sampler2D uShadowMap;\nuniform vec3 uLightDir;\nuniform Material uMaterial;\nuniform int uLightCount;\nuniform Light uLights[32];\n\nvarying vec3 vNormal;\nvarying vec3 vViewNormal;\nvarying vec4 vPosition;\nvarying vec2 vTexCoord;\nvarying vec4 vPositionInLight;\n\nvoid main(void) {\n\tvec3 texNormal;\n\tif (uMaterial.hasNormalMap) {\n\t\ttexNormal = normalize(vec4(normalize(vNormal) * texture2D(uMaterial.normalMap, vTexCoord).rgb, 0.0) * uModel * uView).xyz;\n\t}\n\telse {\n\t\ttexNormal = normalize(vec4(normalize(vNormal), 0.0) * uModel * uView).xyz;\n\t}\n\tvec4 texColor;\n\tif (uMaterial.hasTexture) {\n\t\ttexColor = texture2D(uMaterial.texture, vTexCoord);\n\t} else {\n\t\ttexColor = uMaterial.color;\n\t}\n\tfloat texSpecular = 0.0;\n\tif (uMaterial.hasSpecularMap) {\n\t\ttexSpecular = texture2D(uMaterial.specularMap, vTexCoord).r;\n\t}\n\n\tif (uMaterial.emissive) {\n\t\tgl_FragColor = texColor;\n\t\treturn;\n\t}\n\n\tvec4 vertPos4 = vPosition * uView;\n\tvec3 vertPos = vertPos4.xyz / vertPos4.w;\n\n\tvec3 ambient = vec3(0.0);\n\tvec3 diffuse = vec3(0.0);\n\tvec3 specular = vec3(0.0);\n\n\tfor (int i = 0; i < 32; i++) {\n\t\tif (i >= uLightCount) break;\n\n\t\tvec4 lightPos4 = vec4(uLights[i].position, 1.0) * uView;\n\t\tvec3 lightPos = lightPos4.xyz / lightPos4.w;\n\n\t\tvec3 lightDir = normalize(lightPos - vertPos);\n\t\tvec3 lightColor = uLights[i].diffuse;\n\t\tambient += uLights[i].ambient;\n\n\t\tfloat diff = max(dot(texNormal, lightDir), 0.0);\n\t\tdiffuse += diff * lightColor;\n\n\t\tfloat lambertian = max(dot(texNormal, lightDir), 0.0);\n\t\tfloat spec = 0.0;\n\n\t\tif (lambertian > 0.0) {\n\t\t\tvec3 reflectDir = reflect(-lightDir, texNormal);\n\t\t\tvec3 viewDir = normalize(-vertPos);\n\n\t\t\tfloat specAngle = max(dot(reflectDir, viewDir), 0.0);\n\t\t\tspec = pow(specAngle, 64.0) * texSpecular;\n\t\t}\n\t\tspecular += spec * lightColor;\n\t}\n\n\tfloat shade = 0.0;\n\n\tif (uMaterial.receivesShadows) {\n\t\tfloat edge = 1.0/1024.0;\n\t\tvec3 shadowPos = (vPositionInLight.xyz / vPositionInLight.w) * 0.5 + 0.5;\n\n\t\tfloat shadows[9];\n\n\t\tshadows[0] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y)).r;\n\t\tshadows[1] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y)).r;\n\t\tshadows[2] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y)).r;\n\t\tshadows[3] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y - edge)).r;\n\t\tshadows[4] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y + edge)).r;\n\t\tshadows[5] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y - edge)).r;\n\t\tshadows[6] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y - edge)).r;\n\t\tshadows[7] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y + edge)).r;\n\t\tshadows[8] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y + edge)).r;\n\n\t\tfloat distanceFromLight = shadowPos.z;\n\n\t\tfloat bias = 0.00001;\n\t\tfor (int i = 0; i < 9; i++) {\n\t\t\tif (distanceFromLight > shadows[i] + bias) {\n\t\t\t\tshade += 0.08;\n\t\t\t}\n\t\t}\n\t}\n\tvec3 shadowColor = vec3(0.0);\n\n\tvec3 color = mix(texColor.rgb, shadowColor, shade);\n\tcolor = (ambient + diffuse + specular) * color;\n\tgl_FragColor = vec4(color, texColor.a);\n}\n");

/***/ }),

/***/ "./src/shaders/material.vert.glsl":
/*!****************************************!*\
  !*** ./src/shaders/material.vert.glsl ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#define GLSLIFY 1\nuniform mat4 uViewProj;\nuniform mat4 uView;\nuniform mat4 uModel;\nuniform mat4 uLight;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n\nvarying vec3 vNormal;\nvarying vec3 vViewNormal;\nvarying vec4 vPosition;\nvarying vec3 vBasePosition;\nvarying vec2 vTexCoord;\nvarying vec4 vPositionInLight;\n\nvoid main(void) {\n\tmat4 mvp = uModel  * uViewProj;\n\tgl_Position = vec4(position, 1.0) * mvp;\n\tvBasePosition = position;\n\tvPosition = vec4(position, 1.0) * uModel;\n\t//vNormal = normalize((vec4(normal, 0.0) * uModel)).xyz;\n\tvNormal = normal;\n\tvViewNormal = normalize((vec4(normal, 0.0) * uModel * uView)).xyz;\n\tvPositionInLight = vec4(position, 1.0) * uModel * uLight;\n\tvTexCoord = uv;\n}\n");

/***/ }),

/***/ "./src/shaders/material_sphere.frag.glsl":
/*!***********************************************!*\
  !*** ./src/shaders/material_sphere.frag.glsl ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision highp float;\n#define GLSLIFY 1\n\nstruct Material {\n\tbool castsShadows;\n\tbool receivesShadows;\n\tbool hasTexture;\n\tbool hasNormalMap;\n\tbool hasSpecularMap;\n\tbool hasDisplacementMap;\n\tbool emissive;\n\tvec4 color;\n\tfloat displacementMultiplier;\n\tsampler2D texture;\n\tsampler2D normalMap;\n\tsampler2D specularMap;\n\tsampler2D displacementMap;\n};\n\nstruct Light {\n\tvec3 position;\n\tvec3 ambient;\n\tvec3 diffuse;\n\tvec3 specular;\n\n\tfloat constant;\n\tfloat linear;\n\tfloat quadratic;\n};\n\nuniform mat4 uModel;\nuniform vec4 uFillColor;\nuniform mat4 uView;\nuniform sampler2D uShadowMap;\nuniform vec3 uLightDir;\nuniform Material uMaterial;\nuniform int uLightCount;\nuniform Light uLights[32];\n\nvarying vec3 vNormal;\nvarying vec3 vViewNormal;\nvarying vec4 vPosition;\nvarying vec2 vTexCoord;\nvarying vec4 vPositionInLight;\nvarying vec3 vBasePosition;\n\n#define PI 3.1415926535897932384626433832795\n\nvec2 toLonLat(vec3 point) {\n\tvec3 v = normalize(point);\n\tfloat lat = acos(v.y) - PI / 2.0;\n\tfloat lon = atan(v.z, v.x) + PI / 2.0;\n\treturn vec2(lon, lat);\n}\n\nvec2 lonLatToUV(vec2 ll) {\n\tfloat x = -ll.x / PI / 2.0;\n\tfloat y = ll.y / PI + 0.5;\n\treturn vec2(fract(x), fract(y));\n}\n\nvoid main(void) {\n\tvec2 uv = lonLatToUV(toLonLat(vBasePosition));\n\n\tvec4 texColor;\n\tif (uMaterial.hasTexture) {\n\t\ttexColor = texture2D(uMaterial.texture, uv);\n\t} else {\n\t\ttexColor = uMaterial.color;\n\t}\n\n\tvec3 texNormal;\n\tif (uMaterial.hasNormalMap) {\n\t\ttexNormal = normalize(vec4(normalize(vNormal) * texture2D(uMaterial.normalMap, uv).rgb, 0.0) * uModel * uView).xyz;\n\t}\n\telse {\n\t\ttexNormal = normalize(vec4(normalize(vNormal), 0.0) * uModel * uView).xyz;\n\t}\n\n\tfloat texSpecular = 0.0;\n\tif (uMaterial.hasSpecularMap) {\n\t\ttexSpecular = texture2D(uMaterial.specularMap, uv).r;\n\t}\n\n\tif (uMaterial.emissive) {\n\t\tgl_FragColor = texColor;\n\t\treturn;\n\t}\n\n\tvec4 vertPos4 = vPosition * uView;\n\tvec3 vertPos = vertPos4.xyz / vertPos4.w;\n\n\tvec3 ambient = vec3(0.0);\n\tvec3 diffuse = vec3(0.0);\n\tvec3 specular = vec3(0.0);\n\n\tfor (int i = 0; i < 32; i++) {\n\t\tif (i >= uLightCount) break;\n\n\t\tvec4 lightPos4 = vec4(uLights[i].position, 1.0) * uView;\n\t\tvec3 lightPos = lightPos4.xyz / lightPos4.w;\n\n\t\tvec3 lightDir = normalize(lightPos - vertPos);\n\t\tvec3 lightColor = uLights[i].diffuse;\n\t\tambient += uLights[i].ambient;\n\n\t\tfloat diff = max(dot(texNormal, lightDir), 0.0);\n\t\tdiffuse += diff * lightColor;\n\n\t\tfloat lambertian = max(dot(texNormal, lightDir), 0.0);\n\t\tfloat spec = 0.0;\n\n\t\tif (lambertian > 0.0) {\n\t\t\tvec3 reflectDir = reflect(-lightDir, texNormal);\n\t\t\tvec3 viewDir = normalize(-vertPos);\n\n\t\t\tfloat specAngle = max(dot(reflectDir, viewDir), 0.0);\n\t\t\tspec = pow(specAngle, 64.0) * texSpecular;\n\t\t}\n\t\tspecular += spec * lightColor;\n\t}\n\n\tfloat shade = 0.0;\n\n\tif (uMaterial.receivesShadows) {\n\t\tfloat edge = 1.0/1024.0;\n\t\tvec3 shadowPos = (vPositionInLight.xyz / vPositionInLight.w) * 0.5 + 0.5;\n\n\t\tfloat shadows[9];\n\n\t\tshadows[0] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y)).r;\n\t\tshadows[1] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y)).r;\n\t\tshadows[2] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y)).r;\n\t\tshadows[3] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y - edge)).r;\n\t\tshadows[4] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y + edge)).r;\n\t\tshadows[5] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y - edge)).r;\n\t\tshadows[6] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y - edge)).r;\n\t\tshadows[7] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y + edge)).r;\n\t\tshadows[8] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y + edge)).r;\n\n\t\tfloat distanceFromLight = shadowPos.z;\n\n\t\tfloat bias = 0.00001;\n\t\tfor (int i = 0; i < 9; i++) {\n\t\t\tif (distanceFromLight > shadows[i] + bias) {\n\t\t\t\tshade += 0.08;\n\t\t\t}\n\t\t}\n\t}\n\tvec3 shadowColor = vec3(0.0);\n\n\tvec3 color = mix(texColor.rgb, shadowColor, shade);\n\tcolor = (ambient + diffuse + specular) * color;\n\tgl_FragColor = vec4(color, texColor.a);\n}\n");

/***/ }),

/***/ "./src/shaders/material_sphere.vert.glsl":
/*!***********************************************!*\
  !*** ./src/shaders/material_sphere.vert.glsl ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#define GLSLIFY 1\nstruct Material {\n\tbool castsShadows;\n\tbool receivesShadows;\n\tbool hasTexture;\n\tbool hasNormalMap;\n\tbool hasSpecularMap;\n\tbool hasDisplacementMap;\n\tbool emissive;\n\tvec4 color;\n\tfloat displacementMultiplier;\n\tsampler2D texture;\n\tsampler2D normalMap;\n\tsampler2D specularMap;\n\tsampler2D displacementMap;\n};\n\n#define PI 3.1415926535897932384626433832795\n\nuniform mat4 uViewProj;\nuniform mat4 uView;\nuniform mat4 uModel;\nuniform mat4 uLight;\nuniform Material uMaterial;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\n\nvarying vec3 vNormal;\nvarying vec3 vViewNormal;\nvarying vec4 vPosition;\nvarying vec3 vBasePosition;\nvarying vec2 vTexCoord;\nvarying vec4 vPositionInLight;\n\nvec2 toLonLat(vec3 point) {\n\tvec3 v = normalize(point);\n\tfloat lat = acos(v.y) - PI / 2.0;\n\tfloat lon = atan(v.z, v.x) + PI / 2.0;\n\treturn vec2(lon, lat);\n}\n\nvec2 lonLatToUV(vec2 ll) {\n\tfloat x = -ll.x / PI / 2.0;\n\tfloat y = ll.y / PI + 0.5;\n\treturn vec2(fract(x), fract(y));\n}\n\nvoid main(void) {\n\tmat4 mvp = uModel  * uViewProj;\n\tvec2 uv = lonLatToUV(toLonLat(position));\n\tvec3 pos = position;\n\tif (uMaterial.hasDisplacementMap) {\n\t\tvec3 texNormal = texture2D(uMaterial.displacementMap, uv).rgb;\n\t\tpos += normal * texNormal * uMaterial.displacementMultiplier;\n\t}\n\tgl_Position = vec4(pos, 1.0) * mvp;\n\tvBasePosition = pos;\n\tvPosition = vec4(pos, 1.0) * uModel;\n\t//vNormal = normalize((vec4(normal, 0.0) * uModel)).xyz;\n\tvNormal = normal;\n\tvViewNormal = normalize((vec4(normal, 0.0) * uModel * uView)).xyz;\n\tvPositionInLight = vec4(pos, 1.0) * uModel * uLight;\n\tvTexCoord = uv;\n}\n");

/***/ }),

/***/ "./src/shaders/simple.frag.glsl":
/*!**************************************!*\
  !*** ./src/shaders/simple.frag.glsl ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n#define GLSLIFY 1\n\nuniform float uTime;\nuniform vec4 uFillColor;\nuniform sampler2D uShadowMap;\nuniform vec3 uLightDir;\n\nvarying vec4 vColor;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvarying vec4 vPositionInLight;\nvarying vec2 vTexCoord;\n\nvoid main(void) {\n\tvec3 lightColor = vec3(1.0);\n\tvec3 ambient = 0.1 * lightColor;\n\n\tfloat diff = max(dot(vNormal, uLightDir), 0.0);\n\tvec3 diffuse = diff * lightColor;\n\n\tvec3 viewDir = normalize(-vPosition);\n\tvec3 reflectDir = reflect(-uLightDir, vNormal);\n\tfloat spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0);\n\tvec3 specular = 0.5 * spec * lightColor;\n\n\tvec3 color = (ambient + diffuse + specular) * vColor.rgb;\n\n\tif (uFillColor.a > 0.0) {\n\t\tfloat shade = 0.0;\n\n\t\tfloat edge = 1.0/1024.0;\n\t\tvec3 shadowPos = (vPositionInLight.xyz / vPositionInLight.w) * 0.5 + 0.5;\n\n\t\tfloat shadows[9];\n\n\t\tshadows[0] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y)).r;\n\t\tshadows[1] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y)).r;\n\t\tshadows[2] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y)).r;\n\t\tshadows[3] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y - edge)).r;\n\t\tshadows[4] = texture2D(uShadowMap, vec2(shadowPos.x, shadowPos.y + edge)).r;\n\t\tshadows[5] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y - edge)).r;\n\t\tshadows[6] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y - edge)).r;\n\t\tshadows[7] = texture2D(uShadowMap, vec2(shadowPos.x - edge, shadowPos.y + edge)).r;\n\t\tshadows[8] = texture2D(uShadowMap, vec2(shadowPos.x + edge, shadowPos.y + edge)).r;\n\n\t\tfloat distanceFromLight = shadowPos.z;\n\n\t\tfloat bias = 0.0001;\n\t\tfor (int i = 0; i < 9; i++) {\n\t\t\tif (distanceFromLight > shadows[i] + bias) {\n\t\t\t\tshade += 0.08;\n\t\t\t}\n\t\t}\n\t\tvec3 shadowColor = vec3(0.0);\n\t\tgl_FragColor = vec4(mix(uFillColor.rgb, shadowColor, shade), vColor.a);\n\t} else {\n\t\tgl_FragColor = vec4(color, vColor.a);\n\t}\n}\n");

/***/ }),

/***/ "./src/shaders/simple.vert.glsl":
/*!**************************************!*\
  !*** ./src/shaders/simple.vert.glsl ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#define GLSLIFY 1\nuniform mat4 uViewProj;\nuniform mat4 uView;\nuniform mat4 uModel;\nuniform mat4 uLight;\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec4 color;\nattribute vec2 uv;\n\nvarying vec4 vColor;\nvarying vec3 vNormal;\nvarying vec3 vPosition;\nvarying vec4 vPositionInLight;\nvarying vec2 vTexCoord;\n\nvoid main(void) {\n\tmat4 mvp = uModel  * uViewProj;\n\tgl_Position = vec4(position, 1.0) * mvp;\n\tvColor = color;\n\tvPosition = (vec4(position, 1.0) * uModel * uView).xyz;\n\tvPositionInLight = vec4(position, 1.0) * uModel * uLight;\n\tvNormal = normalize((vec4(normal, 0.0) * uModel)).xyz;\n\tvTexCoord = uv;\n}\n");

/***/ }),

/***/ "./src/shaders/sprite.frag.glsl":
/*!**************************************!*\
  !*** ./src/shaders/sprite.frag.glsl ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n#define GLSLIFY 1\n\nuniform float uTime;\nuniform sampler2D uSampler;\nuniform float uContrast;\n\nvarying vec2 vTexCoord;\n\nvoid main(void) {\n\tfloat contrast = uContrast > 0.0 ? uContrast : 1.0;\n\tgl_FragColor = (texture2D(uSampler, vTexCoord) - (1.0 - (1.0 / contrast))) * contrast;\n}\n");

/***/ }),

/***/ "./src/shaders/sprite.vert.glsl":
/*!**************************************!*\
  !*** ./src/shaders/sprite.vert.glsl ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#define GLSLIFY 1\nuniform mat4 uViewProj;\nuniform mat4 uModel;\n\nattribute vec3 position;\nattribute vec2 uv;\n\nvarying vec2 vTexCoord;\n\nvoid main(void) {\n\tmat4 mvp = uModel * uViewProj;\n\tgl_Position = vec4(position, 1.0) * mvp;\n\tvTexCoord = vec2(uv.x, 1.0 - uv.y);\n}\n\n");

/***/ }),

/***/ "./src/shaders/wireframe.frag.glsl":
/*!*****************************************!*\
  !*** ./src/shaders/wireframe.frag.glsl ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n\nvarying vec4 vFogColor;\nvarying float vFogDepth;\nvarying vec3 vBarycentric;\nvarying float vLineWidth;\nvarying vec4 vColor;\n\n#extension GL_OES_standard_derivatives : enable\n#define GLSLIFY 1\n\nfloat edgeDistance(vec3 barycentric) {\n\tvec3 d = fwidth(barycentric);\n\tvec3 a = smoothstep(vec3(0.0), d * 2.0, barycentric);\n\treturn min(min(a.x, a.y), a.z);\n}\n\nvoid main(void) {\n\tvec4 lineColor = vColor;\n\tvec4 faceColor = vec4(0.0, 0.0, 0.0, vColor.a);\n\tvec4 color;\n\tfloat d = edgeDistance(vBarycentric);\n\tif (d < 1.0) {\n\t\tcolor = mix(lineColor, faceColor, d);\n\t}\n\telse {\n\t\tcolor = faceColor;\n\t}\n\n\tgl_FragColor = mix(color, vFogColor, vFogDepth);\n}\n");

/***/ }),

/***/ "./src/shaders/wireframe.vert.glsl":
/*!*****************************************!*\
  !*** ./src/shaders/wireframe.vert.glsl ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#define GLSLIFY 1\nuniform mat4 uViewProj;\nuniform mat4 uModel;\nuniform vec4 uFogColor;\nuniform float uLineWidth;\n\nattribute vec3 position;\nattribute vec3 barycentric;\nattribute vec4 color;\n\nvarying vec4 vFogColor;\nvarying float vFogDepth;\nvarying vec3 vBarycentric;\nvarying float vLineWidth;\nvarying vec4 vColor;\n\nfloat fog_dist = 1000.0;\n\nvoid main(void) {\n\tmat4 mvp = uModel * uViewProj;\n\n\tgl_Position = vec4(position, 1.0) * mvp;\n\tvFogDepth = max(0.0, min(1.0, gl_Position.z / fog_dist));\n\tvFogColor = uFogColor;\n\tvLineWidth = uLineWidth;\n\n\tvColor = color;\n\tvBarycentric = barycentric;\n}\n");

/***/ }),

/***/ "./src/actor.ts":
/*!**********************!*\
  !*** ./src/actor.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Actor": () => (/* binding */ Actor)
/* harmony export */ });
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geom */ "./src/geom.ts");
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mesh */ "./src/mesh.ts");
/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./material */ "./src/material.ts");
/* harmony import */ var _components_static_mesh__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/static_mesh */ "./src/components/static_mesh.ts");




class Actor {
    constructor(meshOrOptions, options = {}) {
        this.visible = true;
        this.components = [];
        this.model = _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.identity();
        this.uniforms = {};
        this.children = [];
        this.instances = new Map();
        this.nextInstanceId = 1;
        if (meshOrOptions instanceof Array) {
            this.children = meshOrOptions;
        }
        else if (meshOrOptions instanceof _mesh__WEBPACK_IMPORTED_MODULE_1__.Mesh) {
            this.components.push(new _components_static_mesh__WEBPACK_IMPORTED_MODULE_3__.StaticMesh(meshOrOptions));
        }
        else if (typeof meshOrOptions === 'object') {
            options = meshOrOptions;
        }
        const material = options.material || new _material__WEBPACK_IMPORTED_MODULE_2__.Material();
        material.color = options.color || material.color;
        this.material = material;
        if (options.model) {
            this.model = options.model;
        }
        if (options.shader) {
            this.shader = options.shader;
        }
        if (options.uniforms) {
            this.uniforms = Object.assign(Object.assign({}, this.uniforms), options.uniforms);
        }
        if (options.components) {
            this.components = [
                ...this.components,
                ...options.components,
            ];
        }
    }
    instance(data) {
        const id = this.nextInstanceId++;
        const instance = {
            id,
            pawn: this,
            data: Object.assign({}, data),
        };
        this.instances.set(id, instance);
        return id;
    }
    get hasInstances() {
        return this.instances.size !== 0;
    }
    get translationMatrix() {
        return this.model.extractTranslation();
    }
    get rotationMatrix() {
        return this.model.extractRotation();
    }
    get position() {
        return this.model.transformPoint3([0.0, 0.0, 0.0]);
    }
    set position(pos) {
        const mat = this.model.toArray();
        mat[3] = pos[0];
        mat[7] = pos[1];
        mat[11] = pos[2];
        this.model = new _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4(mat);
    }
    get rotationVector() {
        const vec = this.model.multiplyVector4([0.0, 0.0, 1.0, 0.0]);
        return [vec[0], vec[1], vec[2]];
    }
    getComponentsOfType(klass) {
        return this.components.filter(c => c instanceof klass);
    }
    hasComponentOfType(klass) {
        return Boolean(this.components.find(c => c instanceof klass));
    }
}


/***/ }),

/***/ "./src/camera.ts":
/*!***********************!*\
  !*** ./src/camera.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OrbitCamera": () => (/* binding */ OrbitCamera),
/* harmony export */   "BasicCamera": () => (/* binding */ BasicCamera)
/* harmony export */ });
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geom */ "./src/geom.ts");
/* harmony import */ var _actor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actor */ "./src/actor.ts");


class OrbitCamera extends _actor__WEBPACK_IMPORTED_MODULE_1__.Actor {
    constructor() {
        super();
        this.near = 0.1;
        this.far = 1000.0;
        this.distance = 10.0;
        this.target = [0.0, 0.0, 0.0];
        this.rotation = { lon: 0.0, lat: 0.0 };
        this.resize(1024, 768);
    }
    get view() {
        const pos = this.target;
        return _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.identity()
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.translation(pos[0], pos[1], pos[2]))
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.rotation(0.0, this.rotation.lon, 0.0))
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.rotation(this.rotation.lat, 0.0, 0.0))
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.translation(0.0, 0.0, this.distance));
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.projection = _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.perspective(width / height, 45.0, this.near, this.far);
    }
    zoom(amount) {
        this.distance += amount;
    }
    rotate(lon, lat) {
        this.rotation = {
            lon: this.rotation.lon + lon,
            lat: this.rotation.lat + lat,
        };
        if (this.rotation.lat < -Math.PI / 2) {
            this.rotation.lat = -Math.PI / 2;
        }
        if (this.rotation.lat > Math.PI / 2) {
            this.rotation.lat = Math.PI / 2;
        }
    }
}
class BasicCamera extends _actor__WEBPACK_IMPORTED_MODULE_1__.Actor {
    constructor() {
        super();
        this.near = 1.0;
        this.far = 2000.0;
        this.position = [0.0, 1.0, 0.0];
        this.rotation = [0.0, 0.0, 0.0];
        this.scaling = [1.0, 1.0, 1.0];
        this.resize(1024, 768);
    }
    get view() {
        return _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.identity()
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.translation(...this.position))
            .multiply(this.rotationMatrix)
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.scaling(...this.scaling));
    }
    get rotationMatrix() {
        return _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.identity()
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.rotation(0, 0, this.rotation[2]))
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.rotation(0, this.rotation[1], 0))
            .multiply(_geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.rotation(this.rotation[0], 0, 0));
    }
    updateModel() {
        this.model = this.view;
    }
    rotate(x, y) {
        this.rotation[0] -= Math.PI * x;
        this.rotation[1] -= Math.PI * y;
        if (this.rotation[0] < -Math.PI / 2 + 0.01) {
            this.rotation[0] = -Math.PI / 2 + 0.01;
        }
        if (this.rotation[0] > Math.PI / 2 - 0.01) {
            this.rotation[0] = Math.PI / 2 - 0.01;
        }
        this.updateModel();
    }
    translate(x, y, z) {
        const trans = _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.translation(x, y, z);
        const rotation = this.rotationVector;
        // Ignore tilt
        const oldX = rotation[0];
        rotation[0] = 0.0;
        const rot = this.rotationMatrix;
        rotation[0] = oldX;
        const invRot = rot.inverse();
        let newPosition = trans.multiply(invRot).transformPoint3(this.position);
        newPosition = rot.transformPoint3(newPosition);
        this.position = newPosition;
        this.updateModel();
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.projection = _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.perspective(width / height, 45.0, this.near, this.far);
        this.updateModel();
    }
}


/***/ }),

/***/ "./src/component.ts":
/*!**************************!*\
  !*** ./src/component.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
class Component {
}


/***/ }),

/***/ "./src/components/light.ts":
/*!*********************************!*\
  !*** ./src/components/light.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Light": () => (/* binding */ Light)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component.ts");

class Light extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(options = {}) {
        super();
        if (options.ambient) {
            this.ambient = options.ambient;
        }
        if (options.diffuse) {
            this.diffuse = options.diffuse;
        }
        if (options.specular) {
            this.specular = options.specular;
        }
        if (options.constant) {
            this.constant = options.constant;
        }
        if (options.linear) {
            this.linear = options.linear;
        }
        if (options.quadratic) {
            this.quadratic = options.quadratic;
        }
    }
}


/***/ }),

/***/ "./src/components/static_mesh.ts":
/*!***************************************!*\
  !*** ./src/components/static_mesh.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StaticMesh": () => (/* binding */ StaticMesh)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component.ts");

class StaticMesh extends _component__WEBPACK_IMPORTED_MODULE_0__.Component {
    constructor(mesh) {
        super();
        this.mesh = mesh;
    }
}


/***/ }),

/***/ "./src/geom.ts":
/*!*********************!*\
  !*** ./src/geom.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Matrix4": () => (/* binding */ Matrix4),
/* harmony export */   "scaleVector4": () => (/* binding */ scaleVector4),
/* harmony export */   "addVector4": () => (/* binding */ addVector4),
/* harmony export */   "subtractVector4": () => (/* binding */ subtractVector4),
/* harmony export */   "multiplyVector4": () => (/* binding */ multiplyVector4),
/* harmony export */   "scaleVector3": () => (/* binding */ scaleVector3),
/* harmony export */   "addVector3": () => (/* binding */ addVector3),
/* harmony export */   "subtractVector3": () => (/* binding */ subtractVector3),
/* harmony export */   "multiplyVector3": () => (/* binding */ multiplyVector3),
/* harmony export */   "distanceVector3": () => (/* binding */ distanceVector3),
/* harmony export */   "cross": () => (/* binding */ cross),
/* harmony export */   "dot": () => (/* binding */ dot),
/* harmony export */   "normalize": () => (/* binding */ normalize),
/* harmony export */   "magnitude": () => (/* binding */ magnitude),
/* harmony export */   "raySphereIntersection": () => (/* binding */ raySphereIntersection),
/* harmony export */   "pointToLonLat": () => (/* binding */ pointToLonLat),
/* harmony export */   "lonLatToPoint": () => (/* binding */ lonLatToPoint)
/* harmony export */ });
// prettier-ignore
class Matrix4 {
    constructor(data) {
        this._data = new Float32Array(16);
        if (data) {
            for (let i = 0; i < 16; i++) {
                this._data[i] = data[i];
            }
        }
    }
    static identity() {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }
    static fromColumns(cols) {
        return new Matrix4([
            cols[0][0], cols[1][0], cols[2][0], cols[3][0],
            cols[0][1], cols[1][1], cols[2][1], cols[3][1],
            cols[0][2], cols[1][2], cols[2][2], cols[3][2],
            cols[0][3], cols[1][3], cols[2][3], cols[3][3],
        ]);
    }
    static perspective(aspect, fov, near, far) {
        const fovRad = fov * (Math.PI / 180);
        const f = 1.0 / Math.tan(fovRad / 2.0);
        const range = 1.0 / (near - far);
        return new Matrix4([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * range, near * far * range * 2,
            0, 0, -1, 0,
        ]);
    }
    static rotation(x, y, z) {
        const axisangle = [x, y, z];
        function cosSin(axis) {
            return [Math.cos(axisangle[axis]), Math.sin(axisangle[axis])];
        }
        const [cosx, sinx] = cosSin(0);
        const [cosy, siny] = cosSin(1);
        const [cosz, sinz] = cosSin(2);
        const rotx = new Matrix4([
            1, 0, 0, 0,
            0, cosx, -sinx, 0,
            0, sinx, cosx, 0,
            0, 0, 0, 1,
        ]);
        const roty = new Matrix4([
            cosy, 0, siny, 0,
            0, 1, 0, 0,
            -siny, 0, cosy, 0,
            0, 0, 0, 1,
        ]);
        const rotz = new Matrix4([
            cosz, -sinz, 0, 0,
            sinz, cosz, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
        return rotx.multiply(roty.multiply(rotz));
    }
    static translation(x, y, z) {
        return new Matrix4([
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1,
        ]);
    }
    static scaling(x, y, z) {
        if (y == null)
            y = x;
        if (z == null)
            z = y;
        return new Matrix4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ]);
    }
    static lookAt(from, to) {
        const forward = normalize([
            from[0] - to[0],
            from[1] - to[1],
            from[2] - to[2],
        ]);
        const right = cross([0.0, 1.0, 0.0], forward);
        const up = cross(forward, right);
        const view = new Matrix4([
            right[0], up[0], forward[0], from[0],
            right[1], up[1], forward[1], from[1],
            right[2], up[2], forward[2], from[2],
            0, 0, 0, 1,
        ]);
        return view;
    }
    clone() {
        return new Matrix4(this._data);
    }
    toArray() {
        return Array.from(this._data);
    }
    at(col, row) {
        const idx = row * 4 + col;
        return this._data[idx];
    }
    column(axis) {
        const d = this._data;
        return [
            d[axis + 0],
            d[axis + 4],
            d[axis + 8],
            d[axis + 12],
        ];
    }
    row(axis) {
        const d = this._data;
        const o = 4 * axis;
        return [
            d[o + 0],
            d[o + 1],
            d[o + 2],
            d[o + 3],
        ];
    }
    get columns() {
        return [
            this.column(0),
            this.column(1),
            this.column(2),
            this.column(3),
        ];
    }
    get rows() {
        return [
            this.row(0),
            this.row(1),
            this.row(2),
            this.row(3),
        ];
    }
    multiply(other) {
        const [colx, coly, colz, colw] = other.columns;
        const columns = [
            this.multiplyVector4(colx),
            this.multiplyVector4(coly),
            this.multiplyVector4(colz),
            this.multiplyVector4(colw),
        ];
        return Matrix4.fromColumns(columns);
    }
    multiplyVector4(vec) {
        const cols = this.columns;
        const x = scaleVector4(cols[0], vec[0]);
        const y = scaleVector4(cols[1], vec[1]);
        const z = scaleVector4(cols[2], vec[2]);
        const w = scaleVector4(cols[3], vec[3]);
        return [
            (x[0] + y[0] + z[0] + w[0]),
            (x[1] + y[1] + z[1] + w[1]),
            (x[2] + y[2] + z[2] + w[2]),
            (x[3] + y[3] + z[3] + w[3]),
        ];
    }
    transformPoint3(point) {
        const vec = this.multiplyVector4([point[0], point[1], point[2], 1]);
        return [
            vec[0] / vec[3],
            vec[1] / vec[3],
            vec[2] / vec[3],
        ];
    }
    inverse() {
        const inv = new Array(16);
        const m = this.toArray();
        inv[0] = m[5] * m[10] * m[15] -
            m[5] * m[14] * m[11] -
            m[6] * m[9] * m[15] +
            m[6] * m[13] * m[11] +
            m[7] * m[9] * m[14] -
            m[7] * m[13] * m[10];
        inv[1] = -m[1] * m[10] * m[15] +
            m[1] * m[14] * m[11] +
            m[2] * m[9] * m[15] -
            m[2] * m[13] * m[11] -
            m[3] * m[9] * m[14] +
            m[3] * m[13] * m[10];
        inv[2] = m[1] * m[6] * m[15] -
            m[1] * m[14] * m[7] -
            m[2] * m[5] * m[15] +
            m[2] * m[13] * m[7] +
            m[3] * m[5] * m[14] -
            m[3] * m[13] * m[6];
        inv[3] = -m[1] * m[6] * m[11] +
            m[1] * m[10] * m[7] +
            m[2] * m[5] * m[11] -
            m[2] * m[9] * m[7] -
            m[3] * m[5] * m[10] +
            m[3] * m[9] * m[6];
        inv[4] = -m[4] * m[10] * m[15] +
            m[4] * m[14] * m[11] +
            m[6] * m[8] * m[15] -
            m[6] * m[12] * m[11] -
            m[7] * m[8] * m[14] +
            m[7] * m[12] * m[10];
        inv[5] = m[0] * m[10] * m[15] -
            m[0] * m[14] * m[11] -
            m[2] * m[8] * m[15] +
            m[2] * m[12] * m[11] +
            m[3] * m[8] * m[14] -
            m[3] * m[12] * m[10];
        inv[6] = -m[0] * m[6] * m[15] +
            m[0] * m[14] * m[7] +
            m[2] * m[4] * m[15] -
            m[2] * m[12] * m[7] -
            m[3] * m[4] * m[14] +
            m[3] * m[12] * m[6];
        inv[7] = m[0] * m[6] * m[11] -
            m[0] * m[10] * m[7] -
            m[2] * m[4] * m[11] +
            m[2] * m[8] * m[7] +
            m[3] * m[4] * m[10] -
            m[3] * m[8] * m[6];
        inv[8] = m[4] * m[9] * m[15] -
            m[4] * m[13] * m[11] -
            m[5] * m[8] * m[15] +
            m[5] * m[12] * m[11] +
            m[7] * m[8] * m[13] -
            m[7] * m[12] * m[9];
        inv[9] = -m[0] * m[9] * m[15] +
            m[0] * m[13] * m[11] +
            m[1] * m[8] * m[15] -
            m[1] * m[12] * m[11] -
            m[3] * m[8] * m[13] +
            m[3] * m[12] * m[9];
        inv[10] = m[0] * m[5] * m[15] -
            m[0] * m[13] * m[7] -
            m[1] * m[4] * m[15] +
            m[1] * m[12] * m[7] +
            m[3] * m[4] * m[13] -
            m[3] * m[12] * m[5];
        inv[11] = -m[0] * m[5] * m[11] +
            m[0] * m[9] * m[7] +
            m[1] * m[4] * m[11] -
            m[1] * m[8] * m[7] -
            m[3] * m[4] * m[9] +
            m[3] * m[8] * m[5];
        inv[12] = -m[4] * m[9] * m[14] +
            m[4] * m[13] * m[10] +
            m[5] * m[8] * m[14] -
            m[5] * m[12] * m[10] -
            m[6] * m[8] * m[13] +
            m[6] * m[12] * m[9];
        inv[13] = m[0] * m[9] * m[14] -
            m[0] * m[13] * m[10] -
            m[1] * m[8] * m[14] +
            m[1] * m[12] * m[10] +
            m[2] * m[8] * m[13] -
            m[2] * m[12] * m[9];
        inv[14] = -m[0] * m[5] * m[14] +
            m[0] * m[13] * m[6] +
            m[1] * m[4] * m[14] -
            m[1] * m[12] * m[6] -
            m[2] * m[4] * m[13] +
            m[2] * m[12] * m[5];
        inv[15] = m[0] * m[5] * m[10] -
            m[0] * m[9] * m[6] -
            m[1] * m[4] * m[10] +
            m[1] * m[8] * m[6] +
            m[2] * m[4] * m[9] -
            m[2] * m[8] * m[5];
        const det = m[0] * inv[0] + m[4] * inv[4] + m[8] * inv[8] + m[12] * inv[12];
        if (det == 0) {
            return null;
        }
        return new Matrix4(inv);
    }
    extractTranslation() {
        const x = this._data[3];
        const y = this._data[7];
        const z = this._data[11];
        return Matrix4.translation(x, y, z);
    }
    extractScaling() {
        const x = 0;
        const y = 0;
        const z = 0;
        return Matrix4.scaling(x, y, z);
    }
    extractRotation() {
        const x = 0;
        const y = 0;
        const z = 0;
        return Matrix4.rotation(x, y, z);
    }
    eulerAngles() {
        const sy = Math.sqrt(this.at(0, 0) * this.at(0, 0) + this.at(1, 0) * this.at(1, 0));
        const singular = sy < 1e-6;
        let x = 0.0;
        let y = 0.0;
        let z = 0.0;
        if (singular) {
            x = Math.atan2(this.at(1, 2), this.at(1, 1));
            y = Math.atan2(this.at(2, 0), sy);
            z = 0;
        }
        else {
            x = Math.atan2(-this.at(2, 1), this.at(2, 2));
            y = Math.atan2(this.at(2, 0), sy);
            z = Math.atan2(-this.at(1, 0), this.at(0, 0));
        }
        return [x, y, z];
    }
}
function scaleVector4(vec, scale) {
    return [vec[0] * scale, vec[1] * scale, vec[2] * scale, vec[3] * scale];
}
function addVector4(vec, other) {
    return [vec[0] + other[0], vec[1] + other[1], vec[2] + other[2], vec[3] + other[3]];
}
function subtractVector4(vec, other) {
    return [vec[0] - other[0], vec[1] - other[1], vec[2] - other[2], vec[3] - other[3]];
}
function multiplyVector4(vec, other) {
    return [vec[0] * other[0], vec[1] * other[1], vec[2] * other[2], vec[3] * other[3]];
}
function scaleVector3(vec, scale) {
    return [vec[0] * scale, vec[1] * scale, vec[2] * scale];
}
function addVector3(vec, other) {
    return [vec[0] + other[0], vec[1] + other[1], vec[2] + other[2]];
}
function subtractVector3(vec, other) {
    return [vec[0] - other[0], vec[1] - other[1], vec[2] - other[2]];
}
function multiplyVector3(vec, other) {
    return [vec[0] * other[0], vec[1] * other[1], vec[2] * other[2]];
}
function distanceVector3(vec, other) {
    const diff = subtractVector3(vec, other);
    return Math.abs(magnitude(diff));
}
function cross(p0, p1) {
    const x = p0[1] * p1[2] - p0[2] * p1[1];
    const y = p0[2] * p1[0] - p0[0] * p1[2];
    const z = p0[0] * p1[1] - p0[1] * p1[0];
    return [x, y, z];
}
function dot(p0, p1) {
    const x = p0[0] * p1[0];
    const y = p0[1] * p1[1];
    const z = p0[2] * p1[2];
    return x + y + z;
}
function normalize(v) {
    const norm = magnitude(v);
    return [v[0] / norm, v[1] / norm, v[2] / norm];
}
function magnitude(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}
function raySphereIntersection(center, radius, origin, direction) {
    const p = [
        origin[0] - center[0],
        origin[1] - center[1],
        origin[2] - center[2],
    ];
    const a = Math.pow(magnitude(direction), 2);
    const b = dot(direction, p);
    const c = Math.pow(magnitude(p), 2) - radius * radius;
    const delta = b * b - a * c;
    if (delta < 0) {
        return null;
    }
    const deltaSqrt = Math.sqrt(delta);
    const tmin = (-b - deltaSqrt) / a;
    const tmax = (-b + deltaSqrt) / a;
    if (tmax < 0) {
        return null;
    }
    const t = tmin >= 0 ? tmin : tmax;
    return [
        origin[0] + t * direction[0],
        origin[1] + t * direction[1],
        origin[2] + t * direction[2],
    ];
}
function pointToLonLat(point) {
    const v = normalize(point);
    const p = normalize([v[0], 0, v[2]]);
    let lat = Math.acos(dot(p, v));
    if (v[1] < 0) {
        lat *= -1;
    }
    let lon = -Math.atan2(-v[2], -v[0]) - Math.PI / 2;
    if (lon < -Math.PI) {
        lon += Math.PI * 2;
    }
    return [lon, lat];
}
function lonLatToPoint(ll, radius = 1) {
    const lon = ll[0] - Math.PI;
    const lat = ll[1] - Math.PI / 2;
    const x = radius * Math.sin(lat) * Math.sin(lon);
    const y = radius * Math.cos(lat);
    const z = radius * Math.sin(lat) * Math.cos(lon);
    return [x, y, z];
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Renderer": () => (/* reexport safe */ _renderer__WEBPACK_IMPORTED_MODULE_0__.Renderer),
/* harmony export */   "WebGLRenderer": () => (/* reexport safe */ _renderer_webgl_renderer__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer),
/* harmony export */   "Actor": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_2__.Actor),
/* harmony export */   "Scene": () => (/* reexport safe */ _scene__WEBPACK_IMPORTED_MODULE_3__.Scene),
/* harmony export */   "BasicCamera": () => (/* reexport safe */ _camera__WEBPACK_IMPORTED_MODULE_4__.BasicCamera),
/* harmony export */   "OrbitCamera": () => (/* reexport safe */ _camera__WEBPACK_IMPORTED_MODULE_4__.OrbitCamera),
/* harmony export */   "Material": () => (/* reexport safe */ _material__WEBPACK_IMPORTED_MODULE_5__.Material),
/* harmony export */   "Matrix4": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.Matrix4),
/* harmony export */   "addVector3": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.addVector3),
/* harmony export */   "addVector4": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.addVector4),
/* harmony export */   "cross": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.cross),
/* harmony export */   "distanceVector3": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.distanceVector3),
/* harmony export */   "dot": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.dot),
/* harmony export */   "lonLatToPoint": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.lonLatToPoint),
/* harmony export */   "magnitude": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.magnitude),
/* harmony export */   "multiplyVector3": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.multiplyVector3),
/* harmony export */   "multiplyVector4": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.multiplyVector4),
/* harmony export */   "normalize": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.normalize),
/* harmony export */   "pointToLonLat": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.pointToLonLat),
/* harmony export */   "raySphereIntersection": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.raySphereIntersection),
/* harmony export */   "scaleVector3": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.scaleVector3),
/* harmony export */   "scaleVector4": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.scaleVector4),
/* harmony export */   "subtractVector3": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.subtractVector3),
/* harmony export */   "subtractVector4": () => (/* reexport safe */ _geom__WEBPACK_IMPORTED_MODULE_6__.subtractVector4),
/* harmony export */   "ScaleFilter": () => (/* reexport safe */ _texture__WEBPACK_IMPORTED_MODULE_7__.ScaleFilter),
/* harmony export */   "Texture": () => (/* reexport safe */ _texture__WEBPACK_IMPORTED_MODULE_7__.Texture),
/* harmony export */   "Shader": () => (/* reexport safe */ _shader__WEBPACK_IMPORTED_MODULE_8__.Shader),
/* harmony export */   "Geometry": () => (/* reexport safe */ _mesh__WEBPACK_IMPORTED_MODULE_9__.Geometry),
/* harmony export */   "Mesh": () => (/* reexport safe */ _mesh__WEBPACK_IMPORTED_MODULE_9__.Mesh),
/* harmony export */   "Light": () => (/* reexport safe */ _light__WEBPACK_IMPORTED_MODULE_10__.Light),
/* harmony export */   "Component": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_11__.Component),
/* harmony export */   "Attachment": () => (/* reexport safe */ _render_texture__WEBPACK_IMPORTED_MODULE_12__.Attachment),
/* harmony export */   "RenderTexture": () => (/* reexport safe */ _render_texture__WEBPACK_IMPORTED_MODULE_12__.RenderTexture),
/* harmony export */   "MaterialShader": () => (/* reexport safe */ _shaders_material__WEBPACK_IMPORTED_MODULE_13__.MaterialShader),
/* harmony export */   "SphereMaterialShader": () => (/* reexport safe */ _shaders_material__WEBPACK_IMPORTED_MODULE_13__.SphereMaterialShader),
/* harmony export */   "SpriteShader": () => (/* reexport safe */ _shaders_sprite__WEBPACK_IMPORTED_MODULE_14__.SpriteShader),
/* harmony export */   "SimpleShader": () => (/* reexport safe */ _shaders_simple__WEBPACK_IMPORTED_MODULE_15__.SimpleShader),
/* harmony export */   "StaticMesh": () => (/* reexport safe */ _components_static_mesh__WEBPACK_IMPORTED_MODULE_16__.StaticMesh),
/* harmony export */   "LightComponent": () => (/* reexport safe */ _components_light__WEBPACK_IMPORTED_MODULE_17__.Light),
/* harmony export */   "Obj": () => (/* reexport safe */ _meshes_obj__WEBPACK_IMPORTED_MODULE_18__.Obj),
/* harmony export */   "Cube": () => (/* reexport safe */ _meshes_cube__WEBPACK_IMPORTED_MODULE_19__.Cube),
/* harmony export */   "CubeSphere": () => (/* reexport safe */ _meshes_sphere__WEBPACK_IMPORTED_MODULE_20__.CubeSphere),
/* harmony export */   "CubeSphereFace": () => (/* reexport safe */ _meshes_sphere__WEBPACK_IMPORTED_MODULE_20__.CubeSphereFace),
/* harmony export */   "Sphere": () => (/* reexport safe */ _meshes_sphere__WEBPACK_IMPORTED_MODULE_20__.Sphere),
/* harmony export */   "Quad": () => (/* reexport safe */ _meshes_quad__WEBPACK_IMPORTED_MODULE_21__.Quad)
/* harmony export */ });
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./src/renderer/index.ts");
/* harmony import */ var _renderer_webgl_renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer/webgl_renderer */ "./src/renderer/webgl_renderer.ts");
/* harmony import */ var _actor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actor */ "./src/actor.ts");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scene */ "./src/scene.ts");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./camera */ "./src/camera.ts");
/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./material */ "./src/material.ts");
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./geom */ "./src/geom.ts");
/* harmony import */ var _texture__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./texture */ "./src/texture.ts");
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shader */ "./src/shader.ts");
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mesh */ "./src/mesh.ts");
/* harmony import */ var _light__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./light */ "./src/light.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./component */ "./src/component.ts");
/* harmony import */ var _render_texture__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./render_texture */ "./src/render_texture.ts");
/* harmony import */ var _shaders_material__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shaders/material */ "./src/shaders/material.ts");
/* harmony import */ var _shaders_sprite__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./shaders/sprite */ "./src/shaders/sprite.ts");
/* harmony import */ var _shaders_simple__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./shaders/simple */ "./src/shaders/simple.ts");
/* harmony import */ var _components_static_mesh__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/static_mesh */ "./src/components/static_mesh.ts");
/* harmony import */ var _components_light__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/light */ "./src/components/light.ts");
/* harmony import */ var _meshes_obj__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./meshes/obj */ "./src/meshes/obj.ts");
/* harmony import */ var _meshes_cube__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./meshes/cube */ "./src/meshes/cube.ts");
/* harmony import */ var _meshes_sphere__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./meshes/sphere */ "./src/meshes/sphere.ts");
/* harmony import */ var _meshes_quad__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./meshes/quad */ "./src/meshes/quad.ts");
























/***/ }),

/***/ "./src/light.ts":
/*!**********************!*\
  !*** ./src/light.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Light": () => (/* binding */ Light)
/* harmony export */ });
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ "./src/camera.ts");

class Light extends _camera__WEBPACK_IMPORTED_MODULE_0__.BasicCamera {
    constructor() {
        super(...arguments);
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.castsShadows = false;
    }
}


/***/ }),

/***/ "./src/material.ts":
/*!*************************!*\
  !*** ./src/material.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Material": () => (/* binding */ Material)
/* harmony export */ });
class Material {
    constructor(props) {
        this.color = [1.0, 0.0, 0.0, 0.0];
        this.texture = null;
        this.normalMap = null;
        this.specularMap = null;
        this.displacementMap = null;
        this.displacementMultiplier = 1.0;
        this.receivesShadows = true;
        this.castsShadows = true;
        this.emissive = false;
        this.wireframe = false;
        if ((props === null || props === void 0 ? void 0 : props.color) != null) {
            this.color = props.color;
        }
        if ((props === null || props === void 0 ? void 0 : props.texture) != null) {
            this.texture = props.texture;
        }
        if ((props === null || props === void 0 ? void 0 : props.normalMap) != null) {
            this.normalMap = props.normalMap;
        }
        if ((props === null || props === void 0 ? void 0 : props.specularMap) != null) {
            this.specularMap = props.specularMap;
        }
        if ((props === null || props === void 0 ? void 0 : props.displacementMap) != null) {
            this.displacementMap = props.displacementMap;
        }
        if ((props === null || props === void 0 ? void 0 : props.displacementMultiplier) != null) {
            this.displacementMultiplier = props.displacementMultiplier;
        }
        if ((props === null || props === void 0 ? void 0 : props.receivesShadows) != null) {
            this.receivesShadows = props.receivesShadows;
        }
        if ((props === null || props === void 0 ? void 0 : props.castsShadows) != null) {
            this.castsShadows = props.castsShadows;
        }
        if ((props === null || props === void 0 ? void 0 : props.emissive) != null) {
            this.emissive = props.emissive;
        }
        if ((props === null || props === void 0 ? void 0 : props.wireframe) != null) {
            this.wireframe = props.wireframe;
        }
    }
}


/***/ }),

/***/ "./src/mesh.ts":
/*!*********************!*\
  !*** ./src/mesh.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Geometry": () => (/* binding */ Geometry),
/* harmony export */   "Mesh": () => (/* binding */ Mesh)
/* harmony export */ });
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geom */ "./src/geom.ts");

class Geometry {
    constructor(vertices, options) {
        this.vertices = [];
        this.transform = _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4.identity();
        if (vertices) {
            this.vertices = [...vertices];
        }
        if (options === null || options === void 0 ? void 0 : options.transform) {
            this.transform = options.transform;
        }
    }
    clone() {
        return new Geometry(this.vertices.map((v) => (Object.assign({}, v))), { transform: this.transform.clone() });
    }
    calculateNormals() {
        if (this.vertices.length === 0)
            return;
        const vertices = this.vertices;
        if (!('normal' in vertices[0])) {
            throw `Geometry Vertex doesn't have a 'normal' attribute`;
        }
        for (let i = 0; i < this.vertices.length; i += 3) {
            const p0 = vertices[i + 0].position;
            const p1 = vertices[i + 1].position;
            const p2 = vertices[i + 2].position;
            const v0 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
            const v1 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
            const normal = (0,_geom__WEBPACK_IMPORTED_MODULE_0__.normalize)((0,_geom__WEBPACK_IMPORTED_MODULE_0__.cross)(v0, v1));
            vertices[i + 0].normal = normal;
            vertices[i + 1].normal = normal;
            vertices[i + 2].normal = normal;
        }
    }
}
class Mesh {
    constructor(geom) {
        this.geometries = [];
        if (geom) {
            if (Array.isArray(geom)) {
                if (geom.length === 0 || geom[0] instanceof Geometry) {
                    this.geometries = [...geom];
                }
                else {
                    this.geometries = [new Geometry(geom)];
                }
            }
            else {
                this.geometries = [geom];
            }
        }
    }
    clone() {
        return new Mesh(this.geometries.map((g) => g.clone()));
    }
    get vertexCount() {
        let count = 0;
        for (const geom of this.geometries) {
            count += geom.vertices.length;
        }
        return count;
    }
    get vertices() {
        // Preallocate the array as it's much faster than a bunch of `Array.concat`
        const data = new Array(this.vertexCount);
        let i = 0;
        for (const geom of this.geometries) {
            for (const vertex of geom.vertices) {
                data[i] = Object.assign(Object.assign({}, vertex), { position: geom.transform.transformPoint3(vertex.position) });
                i++;
            }
        }
        return data;
    }
    calculateNormals() {
        for (const geom of this.geometries) {
            geom.calculateNormals();
        }
    }
}


/***/ }),

/***/ "./src/meshes/cube.ts":
/*!****************************!*\
  !*** ./src/meshes/cube.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Cube": () => (/* binding */ Cube)
/* harmony export */ });
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mesh */ "./src/mesh.ts");

class Cube extends _mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh {
    constructor() {
        const data = new Array(FACE_VERTICES.length / 3);
        for (let i = 0; i < data.length; i++) {
            // prettier-ignore
            const position = [
                FACE_VERTICES[i * 3 + 0],
                FACE_VERTICES[i * 3 + 1],
                FACE_VERTICES[i * 3 + 2],
            ];
            // prettier-ignore
            const uv = [
                FACE_UV[(i * 2 + 0) % FACE_UV.length],
                FACE_UV[(i * 2 + 1) % FACE_UV.length],
            ];
            const normal = [0.0, 0.0, 0.0];
            data[i] = { position, uv, normal, color: [0.0, 1.0, 0.0, 1.0] };
        }
        super(data);
        this.calculateNormals();
    }
}
// prettier-ignore
const FACE_UV = [
    1.0, 0.0,
    0.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
];
// prettier-ignore
const FACE_VERTICES = [
    // Far
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    // Near
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    // Left
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, -1.0,
    // Right
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, 1.0,
    // Top
    1.0, 1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
    // Bottom
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
];


/***/ }),

/***/ "./src/meshes/obj.ts":
/*!***************************!*\
  !*** ./src/meshes/obj.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Obj": () => (/* binding */ Obj)
/* harmony export */ });
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mesh */ "./src/mesh.ts");
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../geom */ "./src/geom.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class Obj extends _mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh {
    constructor(data, options) {
        let { vertices, normals, uvs } = parseObj(data);
        if (options === null || options === void 0 ? void 0 : options.scale) {
            const scaling = _geom__WEBPACK_IMPORTED_MODULE_1__.Matrix4.scaling(options.scale, options.scale, options.scale);
            vertices = vertices.map((v) => scaling.transformPoint3(v));
        }
        if (options === null || options === void 0 ? void 0 : options.flipFaces) {
            for (let i = 0; i < vertices.length; i += 3) {
                const v0 = vertices[i];
                const v1 = vertices[i + 2];
                vertices[i] = v1;
                vertices[i + 2] = v0;
            }
        }
        const geom = vertices.map((position, i) => {
            return {
                position,
                normal: normals[i],
                uv: uvs[i],
            };
        });
        super(geom);
    }
    static fromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            const data = yield response.text();
            return new Obj(data);
        });
    }
}
function parseObj(data) {
    const vertices = [];
    const faces = [];
    const normals = [];
    const uvs = [];
    for (const line of data.split('\n')) {
        const leader = line.split(' ')[0];
        switch (leader) {
            // Vertex
            case 'v':
                vertices.push(parseObjVertex(line));
                break;
            // Face
            case 'f':
                faces.push(parseObjFace(line));
                break;
            // Vertex Texture
            case 'vt':
                uvs.push(parseObjUV(line));
                break;
            // Vertex Normal
            case 'vn':
                normals.push(parseObjNormal(line));
                break;
        }
    }
    return {
        vertices: faces.flat().map((f) => vertices[f[0]]),
        normals: faces.flat().map((f) => normals[f[2]]),
        uvs: faces.flat().map((f) => uvs[f[1]]),
    };
}
function parseObjVertex(line) {
    return line
        .split(' ')
        .filter((s) => s)
        .slice(1)
        .map(parseFloat);
}
function parseObjNormal(line) {
    return line
        .split(' ')
        .filter((s) => s)
        .slice(1)
        .map(parseFloat);
}
function parseObjUV(line) {
    const p = line
        .split(' ')
        .filter((s) => s)
        .slice(1)
        .map(i => parseFloat(i));
    return [p[0], 1 - p[1]];
}
function parseObjFace(line) {
    return line
        .split(' ')
        .filter((s) => s)
        .slice(1)
        .map((f) => f.split('/').map(i => parseInt(i, 10) - 1));
}


/***/ }),

/***/ "./src/meshes/quad.ts":
/*!****************************!*\
  !*** ./src/meshes/quad.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Quad": () => (/* binding */ Quad)
/* harmony export */ });
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mesh */ "./src/mesh.ts");

class Quad extends _mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh {
    constructor() {
        super([
            { position: [1.0, 1.0, 0.0], uv: [1.0, 0.0], color: [0.0, 0.0, 0.0, 1.0], normal: [0.0, 0.0, 1.0] },
            { position: [-1.0, 1.0, 0.0], uv: [0.0, 0.0], color: [0.0, 0.0, 0.0, 1.0], normal: [0.0, 0.0, 1.0] },
            { position: [1.0, -1.0, 0.0], uv: [1.0, 1.0], color: [0.0, 0.0, 0.0, 1.0], normal: [0.0, 0.0, 1.0] },
            { position: [-1.0, -1.0, 0.0], uv: [0.0, 1.0], color: [0.0, 0.0, 0.0, 1.0], normal: [0.0, 0.0, 1.0] },
            { position: [1.0, -1.0, 0.0], uv: [1.0, 1.0], color: [0.0, 0.0, 0.0, 1.0], normal: [0.0, 0.0, 1.0] },
            { position: [-1.0, 1.0, 0.0], uv: [0.0, 0.0], color: [0.0, 0.0, 0.0, 1.0], normal: [0.0, 0.0, 1.0] },
        ]);
        this.calculateNormals();
    }
}


/***/ }),

/***/ "./src/meshes/sphere.ts":
/*!******************************!*\
  !*** ./src/meshes/sphere.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sphere": () => (/* binding */ Sphere),
/* harmony export */   "CubeSphere": () => (/* binding */ CubeSphere),
/* harmony export */   "CubeSphereFace": () => (/* binding */ CubeSphereFace)
/* harmony export */ });
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mesh */ "./src/mesh.ts");
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../geom */ "./src/geom.ts");


class Sphere extends _mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh {
    constructor(lonSegments, latSegments) {
        const data = new Array(lonSegments * latSegments * 6);
        let i = 0;
        for (let y = latSegments * -0.5; y < latSegments * 0.5; y++) {
            const lat0 = Math.PI * (y / latSegments);
            const lat1 = Math.PI * ((y + 1) / latSegments);
            for (let x = lonSegments * -0.5; x < lonSegments * 0.5; x++) {
                const lon0 = 2 * Math.PI * (x / lonSegments);
                const lon1 = 2 * Math.PI * ((x + 1) / lonSegments);
                const quad = [
                    [lon1, lat1],
                    [lon0, lat1],
                    [lon0, lat0],
                    [lon1, lat0],
                    [lon1, lat1],
                    [lon0, lat0],
                ];
                for (const p of quad) {
                    const position = sphericalToCartesian(p[0], p[1]);
                    const normal = (0,_geom__WEBPACK_IMPORTED_MODULE_1__.normalize)(position);
                    const vertex = {
                        position,
                        normal,
                        uv: sphericalToUV(p[0], p[1]),
                        color: [1.0, 0.0, 0.0, 1.0],
                    };
                    data[i++] = vertex;
                }
            }
        }
        super(data);
    }
}
class CubeSphere extends _mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh {
    constructor(res) {
        super([
            new CubeSphereFace(res, [0, 1, 0]),
            new CubeSphereFace(res, [0, -1, 0]),
            new CubeSphereFace(res, [1, 0, 0]),
            new CubeSphereFace(res, [-1, 0, 0]),
            new CubeSphereFace(res, [0, 0, 1]),
            new CubeSphereFace(res, [0, 0, -1]),
        ]);
    }
}
class CubeSphereFace extends _mesh__WEBPACK_IMPORTED_MODULE_0__.Geometry {
    constructor(res, up) {
        const data = new Array(res * res);
        const axisA = [up[1], up[2], up[0]];
        const axisB = (0,_geom__WEBPACK_IMPORTED_MODULE_1__.cross)(up, axisA);
        const vertices = new Array(res * res);
        const triangles = new Array((res - 1) * (res - 1));
        let tri = 0;
        const sub = 1 / (res - 1);
        for (let y = 0; y < res; y++) {
            for (let x = 0; x < res; x++) {
                const p = [
                    x * sub,
                    y * sub,
                ];
                const hp = [
                    (p[0] - 0.5) * 2.0,
                    (p[1] - 0.5) * 2.0,
                ];
                let position = up;
                position = (0,_geom__WEBPACK_IMPORTED_MODULE_1__.addVector3)(position, (0,_geom__WEBPACK_IMPORTED_MODULE_1__.multiplyVector3)([hp[0], hp[0], hp[0]], axisA));
                position = (0,_geom__WEBPACK_IMPORTED_MODULE_1__.addVector3)(position, (0,_geom__WEBPACK_IMPORTED_MODULE_1__.multiplyVector3)([hp[1], hp[1], hp[1]], axisB));
                position = (0,_geom__WEBPACK_IMPORTED_MODULE_1__.normalize)(position);
                const vertex = {
                    position,
                    normal: position,
                    uv: [0, 0],
                    color: [1.0, 0.0, 0.0, 1.0],
                };
                const i = x + y * res;
                vertices[i] = vertex;
                if (x < res - 1 && y < res - 1) {
                    triangles[tri++] = i;
                    triangles[tri++] = i + res + 1;
                    triangles[tri++] = i + res;
                    triangles[tri++] = i;
                    triangles[tri++] = i + 1;
                    triangles[tri++] = i + res + 1;
                }
            }
        }
        for (let i = 0; i < triangles.length; i++) {
            data[i] = vertices[triangles[i]];
        }
        super(data);
    }
}
function sphericalToCartesian(lon, lat) {
    return [
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.cos(lon),
    ];
}
function sphericalToUV(lon, lat) {
    const x = lon / Math.PI / 2 + 0.5;
    const y = -lat / Math.PI + 0.5;
    return [x, y];
}


/***/ }),

/***/ "./src/render_texture.ts":
/*!*******************************!*\
  !*** ./src/render_texture.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Attachment": () => (/* binding */ Attachment),
/* harmony export */   "RenderTexture": () => (/* binding */ RenderTexture)
/* harmony export */ });
/* harmony import */ var _texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./texture */ "./src/texture.ts");

var Attachment;
(function (Attachment) {
    Attachment[Attachment["COLOR"] = 0] = "COLOR";
    Attachment[Attachment["DEPTH"] = 1] = "DEPTH";
})(Attachment || (Attachment = {}));
class RenderTexture extends _texture__WEBPACK_IMPORTED_MODULE_0__.Texture {
    constructor(size, attachment = Attachment.COLOR) {
        super();
        this.attachment = attachment;
        this.size = size;
        const pixels = new Uint8ClampedArray(size * size * 4);
        pixels.fill(255);
        this.putPixels(new ImageData(pixels, size));
    }
}


/***/ }),

/***/ "./src/renderer/index.ts":
/*!*******************************!*\
  !*** ./src/renderer/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Renderer": () => (/* reexport safe */ _renderer__WEBPACK_IMPORTED_MODULE_0__.Renderer)
/* harmony export */ });
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./src/renderer/renderer.ts");



/***/ }),

/***/ "./src/renderer/renderer.ts":
/*!**********************************!*\
  !*** ./src/renderer/renderer.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Renderer": () => (/* binding */ Renderer)
/* harmony export */ });
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../camera */ "./src/camera.ts");

class Renderer {
    constructor() {
        this.camera = new _camera__WEBPACK_IMPORTED_MODULE_0__.BasicCamera();
        this.mousePosition = [0.0, 0.0];
        this.mouseMovement = [0.0, 0.0];
        this.wheelMovement = [0.0, 0.0];
        this.mouseButtons = new Set();
        this.heldKeys = new Set();
        this.backgroundColor = [0.0, 0.0, 0.0, 1.0];
    }
    updateSize(_width, _height) { }
    resetMouseMovement() {
        this.mouseMovement[0] = 0;
        this.mouseMovement[1] = 0;
        this.wheelMovement[0] = 0;
        this.wheelMovement[1] = 0;
    }
    addEventListener(_type, _listener, _options) { }
    removeEventListener(_type, _listener, _options) { }
    get isDragging() {
        return false;
    }
}


/***/ }),

/***/ "./src/renderer/webgl_mesh.ts":
/*!************************************!*\
  !*** ./src/renderer/webgl_mesh.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebGLMesh": () => (/* binding */ WebGLMesh)
/* harmony export */ });
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../geom */ "./src/geom.ts");

const FLOAT32_SIZE = 4;
class WebGLMesh {
    constructor(gl) {
        this.offsets = new Map();
        this.instanceOffsets = new Map();
        this.gl = gl;
    }
    upload(mesh) {
        const gl = this.gl;
        if (!this.buffer) {
            this.buffer = gl.createBuffer();
        }
        const vertices = mesh.vertices;
        this.length = vertices.length;
        if (vertices.length === 0) {
            return;
        }
        const attributeNames = Object.keys(vertices[0]).sort();
        // Calculate offsets, stride, and vertex size
        let vertexSize = 0;
        for (const name of attributeNames) {
            const attr = vertices[0][name];
            this.offsets.set(name, vertexSize * FLOAT32_SIZE);
            if (Array.isArray(attr)) {
                vertexSize += attr.length;
            }
            else {
                vertexSize += 1;
            }
        }
        this.stride = vertexSize * FLOAT32_SIZE;
        // Convert Array<Vertex> into Float32Array
        let i = 0;
        const data = new Float32Array(vertices.length * vertexSize);
        for (const vertex of vertices) {
            for (const attr of attributeNames) {
                const value = vertex[attr];
                if (Array.isArray(value)) {
                    for (const num of value) {
                        data[i] = num;
                        i++;
                    }
                }
                else {
                    data[i] = value;
                    i++;
                }
            }
        }
        // Upload data to the GPU
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    }
    uploadInstances(instances) {
        if (instances.length === 0) {
            return;
        }
        const gl = this.gl;
        const attributeNames = Object.keys(instances[0]).sort();
        // Calculate offsets, stride, and instance size
        let instanceSize = 0;
        for (const name of attributeNames) {
            const attr = instances[0][name];
            this.instanceOffsets.set(name, instanceSize * FLOAT32_SIZE);
            if (Array.isArray(attr)) {
                instanceSize += attr.length;
            }
            else if (attr instanceof _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4) {
                instanceSize += attr.toArray().length;
            }
            else {
                instanceSize += 1;
            }
        }
        this.instanceStride = instanceSize * FLOAT32_SIZE;
        // Convert Array<Instance> into Float32Array
        let i = 0;
        const data = new Float32Array(instances.length * instanceSize);
        for (const instance of instances) {
            for (const attr of attributeNames) {
                const value = instance[attr];
                if (Array.isArray(value)) {
                    for (const num of value) {
                        data[i] = num;
                        i++;
                    }
                }
                else if (value instanceof _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4) {
                    for (const num of value.toArray()) {
                        data[i] = num;
                        i++;
                    }
                }
                else {
                    data[i] = value;
                    i++;
                }
            }
        }
        if (!this.instanceBuffer) {
            this.instanceBuffer = gl.createBuffer();
        }
        this.instanceLength = instances.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    }
    bind() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
    draw() {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.length);
    }
    drawLines() {
        this.gl.lineWidth(1);
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.length);
    }
    drawInstances() {
        const ext = this.gl.getExtension('ANGLE_instanced_arrays');
        ext.drawArraysInstancedANGLE(this.gl.TRIANGLES, 0, this.length, this.instanceLength);
    }
}


/***/ }),

/***/ "./src/renderer/webgl_render_target.ts":
/*!*********************************************!*\
  !*** ./src/renderer/webgl_render_target.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebGLRenderTarget": () => (/* binding */ WebGLRenderTarget)
/* harmony export */ });
class WebGLRenderTarget {
    constructor(gl, size, texture) {
        this.attachment = WebGLRenderingContext.COLOR_ATTACHMENT0;
        this.gl = gl;
        this.size = size;
        this.texture = texture;
        this.framebuffer = gl.createFramebuffer();
        this.renderbuffer = gl.createRenderbuffer();
    }
    bind() {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, this.attachment, gl.TEXTURE_2D, this.texture.texture, 0);
        if (this.attachment == WebGLRenderingContext.DEPTH_ATTACHMENT) {
            // Safari requries a Color texture, even if we're only rendering to a Depth texture
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.unusedColorTexture, 0);
        }
        else {
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.size, this.size);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
        }
    }
    unbind() {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}


/***/ }),

/***/ "./src/renderer/webgl_renderer.ts":
/*!****************************************!*\
  !*** ./src/renderer/webgl_renderer.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebGLRenderer": () => (/* binding */ WebGLRenderer)
/* harmony export */ });
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./src/renderer/renderer.ts");
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shader */ "./src/shader.ts");
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mesh */ "./src/mesh.ts");
/* harmony import */ var _webgl_mesh__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./webgl_mesh */ "./src/renderer/webgl_mesh.ts");
/* harmony import */ var _webgl_texture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./webgl_texture */ "./src/renderer/webgl_texture.ts");
/* harmony import */ var _webgl_render_target__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./webgl_render_target */ "./src/renderer/webgl_render_target.ts");
/* harmony import */ var _components_static_mesh__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/static_mesh */ "./src/components/static_mesh.ts");
/* harmony import */ var _components_light__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/light */ "./src/components/light.ts");
/* harmony import */ var _render_texture__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../render_texture */ "./src/render_texture.ts");
/* harmony import */ var _shaders_wireframe_vert_glsl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../shaders/wireframe.vert.glsl */ "./src/shaders/wireframe.vert.glsl");
/* harmony import */ var _shaders_wireframe_frag_glsl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../shaders/wireframe.frag.glsl */ "./src/shaders/wireframe.frag.glsl");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











const DEBUG_ENABLED =  true || 0;
class WebGLRenderer extends _renderer__WEBPACK_IMPORTED_MODULE_0__.Renderer {
    constructor(el) {
        super();
        this.scale = 1.0 * window.devicePixelRatio;
        this.lineWidth = 2 * window.devicePixelRatio;
        this.antiAlias = true;
        this.vsync = true;
        this.lastFrameAt = 0;
        this.frameAverage = 0;
        this.frame = 0;
        this.isGrabbed = false;
        this.seed = Math.random();
        this.dragDelta = [0, 0];
        this.textures = new Map();
        this.meshes = new Map();
        this.renderTargets = new Map();
        this.onPointerLockChange = () => {
            if (!this.isGrabbed) {
                this.removeEventListeners();
            }
        };
        this.onKeyDown = (e) => {
            this.heldKeys.add(e.key.toLowerCase());
        };
        this.onKeyUp = (e) => {
            this.heldKeys.delete(e.key.toLowerCase());
        };
        this.onMouseDown = (e) => {
            this.dragDelta[0] = 0;
            this.dragDelta[1] = 0;
            this.mouseButtons.add(e.button);
        };
        this.onMouseUp = (e) => {
            setTimeout(() => {
                this.dragDelta[0] = 0;
                this.dragDelta[1] = 0;
            }, 1);
            this.mouseButtons.delete(e.button);
        };
        this.onMouseMove = (e) => {
            if (this.mouseButtons.size > 0) {
                this.dragDelta[0] += e.movementX;
                this.dragDelta[1] += e.movementY;
            }
            this.mousePosition[0] = e.clientX;
            this.mousePosition[1] = e.clientY;
            this.mouseMovement[0] += e.movementX;
            this.mouseMovement[1] += e.movementY;
        };
        this.onWheel = (e) => {
            // Ignore Firefox 'onwheel'
            if (!e.axis && !e.wheelDelta)
                return;
            e.preventDefault();
            let dx = 0;
            let dy = 0;
            if (!e.wheelDelta && e.detail) {
                // Firefox (DOMMouseScroll)
                const amount = e.detail * 53 / 3;
                if (e.axis === e.HORIZONTAL_AXIS) {
                    dx = amount;
                }
                else {
                    dy = amount;
                }
            }
            else {
                // Proper wheel event
                dx = e.deltaX;
                dy = e.deltaY;
            }
            this.wheelMovement[0] += dx;
            this.wheelMovement[1] += dy;
        };
        if (el instanceof HTMLCanvasElement) {
            this.canvas = el;
        }
        else {
            this.canvas = document.createElement('canvas');
            if (el instanceof HTMLElement) {
                this.attach(el);
            }
        }
        Object.assign(this.canvas.style, {
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        });
    }
    get isDragging() {
        if (Math.abs(this.dragDelta[0]) > 4 || Math.abs(this.dragDelta[1]) > 4) {
            return true;
        }
        return false;
    }
    /**
     * The canvas's parent element
     */
    get parentElement() {
        return this.canvas.parentElement;
    }
    /**
     * The WebGL drawing context
     */
    get gl() {
        if (this.context) {
            return this.context;
        }
        const options = {
            antialias: this.antiAlias,
        };
        this.context = this.canvas.getContext('webgl', options);
        if (!this.context) {
            this.parentElement.innerHTML = 'Failed to create a WebGL context';
            throw 'Failed to create WebGL context';
        }
        return this.context;
    }
    get width() {
        return this.canvas.clientWidth;
    }
    get height() {
        return this.canvas.clientHeight;
    }
    /**
     * Creates the WebGL buffers, compiles the shaders, etc.
     */
    initWebGL() {
        const gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.defaultShader = this.createShader(_shaders_wireframe_vert_glsl__WEBPACK_IMPORTED_MODULE_9__.default, _shaders_wireframe_frag_glsl__WEBPACK_IMPORTED_MODULE_10__.default);
    }
    grab(lock = false) {
        if (lock) {
            this.canvas.requestPointerLock();
        }
        this.isGrabbed = true;
        this.addEventListeners();
    }
    release() {
        this.isGrabbed = false;
        document.exitPointerLock();
        this.removeEventListeners();
    }
    addEventListeners() {
        document.addEventListener('pointerlockchange', this.onPointerLockChange);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('wheel', this.onWheel, { passive: false });
        window.addEventListener('DOMMouseScroll', this.onWheel, { passive: false });
    }
    removeEventListeners() {
        this.heldKeys.clear();
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('DOMMouseScroll', this.onWheel);
    }
    clear() {
        const gl = this.gl;
        gl.clearDepth(1.0);
        gl.clearColor(...this.backgroundColor);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    drawActorWithShader(shader, actor, projection, options = {}) {
        var _a;
        if (!actor.visible)
            return;
        const { model, material, children } = actor;
        const { parentModel } = options;
        const actorModel = parentModel ? parentModel.multiply(model) : model;
        if (material) {
            actor.uniforms['uMaterial.color'] = material.color.length === 3 ? [...material.color, 1.0] : material.color;
            actor.uniforms['uFillColor'] = actor.uniforms['uMaterial.color'];
            actor.uniforms['uMaterial.hasTexture'] = !!material.texture;
            actor.uniforms['uMaterial.hasNormalMap'] = !!material.normalMap;
            actor.uniforms['uMaterial.hasSpecularMap'] = !!material.specularMap;
            actor.uniforms['uMaterial.hasDisplacementMap'] = !!material.displacementMap;
            actor.uniforms['uMaterial.castsShadows'] = material.castsShadows;
            actor.uniforms['uMaterial.receivesShadows'] = material.receivesShadows;
            actor.uniforms['uMaterial.emissive'] = material.emissive;
            actor.uniforms['uMaterial.displacementMultiplier'] = material.displacementMultiplier;
            if (material.texture) {
                actor.uniforms['uMaterial.texture'] = this.bindTexture(material.texture);
            }
            if (material.normalMap) {
                actor.uniforms['uMaterial.normalMap'] = this.bindTexture(material.normalMap);
            }
            if (material.specularMap) {
                actor.uniforms['uMaterial.specularMap'] = this.bindTexture(material.specularMap);
            }
            if (material.displacementMap) {
                actor.uniforms['uMaterial.displacementMap'] = this.bindTexture(material.displacementMap);
            }
        }
        if (projection) {
            shader.setUniform('uViewProj', projection);
        }
        shader.setUniform('uModel', actorModel);
        for (const uniformName in actor.uniforms) {
            shader.setUniform(uniformName, actor.uniforms[uniformName]);
        }
        // Find mesh to draw
        const mesh = (_a = actor.getComponentsOfType(_components_static_mesh__WEBPACK_IMPORTED_MODULE_6__.StaticMesh)[0]) === null || _a === void 0 ? void 0 : _a.mesh;
        if (mesh) {
            let glMesh = this.meshes.get(mesh);
            if (!glMesh) {
                this.uploadMesh(mesh);
                glMesh = this.meshes.get(mesh);
            }
            shader.bind(glMesh);
            if (actor.hasInstances) {
                shader.bindInstances(this.gl, glMesh);
                glMesh.drawInstances();
            }
            else if (material.wireframe) {
                glMesh.drawLines();
            }
            else {
                glMesh.draw();
            }
        }
        // Draw children
        for (const child of children) {
            this.drawActorWithShader(shader, child, projection, Object.assign(Object.assign({}, options), { parentModel: actorModel }));
        }
    }
    drawActor(actor, projection, options = {}) {
        var _a;
        if (!actor.visible)
            return;
        const { model, material, children } = actor;
        const { parentModel } = options;
        const actorModel = parentModel ? parentModel.multiply(model) : model;
        if (material) {
            actor.uniforms['uMaterial.color'] = material.color.length === 3 ? [...material.color, 1.0] : material.color;
            actor.uniforms['uMaterial.hasTexture'] = !!material.texture;
            actor.uniforms['uMaterial.hasNormalMap'] = !!material.normalMap;
            actor.uniforms['uMaterial.hasSpecularMap'] = !!material.specularMap;
            actor.uniforms['uMaterial.hasDisplacementMap'] = !!material.displacementMap;
            actor.uniforms['uMaterial.castsShadows'] = material.castsShadows;
            actor.uniforms['uMaterial.receivesShadows'] = material.receivesShadows;
            actor.uniforms['uMaterial.emissive'] = material.emissive;
            actor.uniforms['uMaterial.displacementMultiplier'] = material.displacementMultiplier;
            if (material.texture) {
                actor.uniforms['uMaterial.texture'] = this.bindTexture(material.texture);
            }
            if (material.normalMap) {
                actor.uniforms['uMaterial.normalMap'] = this.bindTexture(material.normalMap);
            }
            if (material.specularMap) {
                actor.uniforms['uMaterial.specularMap'] = this.bindTexture(material.specularMap);
            }
            if (material.displacementMap) {
                actor.uniforms['uMaterial.displacementMap'] = this.bindTexture(material.displacementMap);
            }
        }
        // TODO support multiple meshes on one actor?
        const mesh = (_a = actor.getComponentsOfType(_components_static_mesh__WEBPACK_IMPORTED_MODULE_6__.StaticMesh)[0]) === null || _a === void 0 ? void 0 : _a.mesh;
        if (actor.shader && !actor.shader.compiled) {
            actor.shader.make(this.gl);
        }
        // FIXME reuse this
        const view = this.camera.view.inverse();
        if (mesh instanceof _mesh__WEBPACK_IMPORTED_MODULE_2__.Mesh) {
            const gl = this.gl;
            const shader = actor.shader || this.defaultShader;
            const uniforms = shader.uniforms;
            shader.use();
            let glMesh = this.meshes.get(mesh);
            if (!glMesh) {
                this.uploadMesh(mesh);
                glMesh = this.meshes.get(mesh);
            }
            // FIXME deprecate all this
            if (projection) {
                gl.uniformMatrix4fv(uniforms.uViewProj.location, false, projection.toArray());
            }
            gl.uniformMatrix4fv(uniforms.uView.location, false, view.toArray());
            gl.uniform4fv(uniforms.uFogColor.location, this.backgroundColor);
            gl.uniform1f(uniforms.uLineWidth.location, this.lineWidth);
            gl.uniform1f(uniforms.uTime.location, performance.now());
            gl.uniform2fv(uniforms.uResolution.location, [this.camera.width, this.camera.height]);
            gl.uniform1f(uniforms.uSeed.location, this.seed);
            gl.uniformMatrix4fv(uniforms.uModel.location, false, actorModel.toArray());
            if (material === null || material === void 0 ? void 0 : material.color) {
                gl.uniform4fv(uniforms.uFillColor.location, actor.uniforms['uMaterial.color']);
            }
            if (options === null || options === void 0 ? void 0 : options.uniforms) {
                for (const uniformName in options.uniforms) {
                    if (shader.uniforms[uniformName]) {
                        shader.setUniform(uniformName, options.uniforms[uniformName]);
                    }
                }
            }
            for (const uniformName in actor.uniforms) {
                shader.setUniform(uniformName, actor.uniforms[uniformName]);
            }
            shader.bind(glMesh);
            if (actor.hasInstances) {
                shader.bindInstances(gl, glMesh);
                glMesh.drawInstances();
            }
            else {
                glMesh.draw();
            }
        }
        for (const child of children) {
            this.drawActor(child, projection, Object.assign(Object.assign({}, options), { parentModel: actorModel }));
        }
    }
    uploadMesh(mesh) {
        const gl = this.gl;
        // Link a Mesh with its WebGLMesh
        let glMesh = this.meshes.get(mesh);
        if (!glMesh) {
            glMesh = new _webgl_mesh__WEBPACK_IMPORTED_MODULE_3__.WebGLMesh(gl);
            this.meshes.set(mesh, glMesh);
        }
        glMesh.upload(mesh);
    }
    uploadMeshInstances(mesh, instances) {
        const gl = this.gl;
        // Link a Mesh with its WebGLMesh
        let glMesh = this.meshes.get(mesh);
        if (!glMesh) {
            glMesh = new _webgl_mesh__WEBPACK_IMPORTED_MODULE_3__.WebGLMesh(gl);
            this.meshes.set(mesh, glMesh);
            glMesh.upload(mesh);
        }
        glMesh.uploadInstances(instances);
    }
    removeMesh(mesh) {
        const glMesh = this.meshes.get(mesh);
        if (!glMesh)
            return;
        throw 'not yet implemented';
    }
    uploadTexture(texture, unit = null) {
        const gl = this.gl;
        // Link a Texture with its WebGLRendererTexture
        let glTexture = this.textures.get(texture);
        if (!glTexture) {
            glTexture = _webgl_texture__WEBPACK_IMPORTED_MODULE_4__.WebGLRendererTexture.fromTexture(gl, texture);
            this.textures.set(texture, glTexture);
        }
        if (unit == null && glTexture.unit == null) {
            unit = this.textures.size - 1;
        }
        glTexture.upload(texture, unit != null ? unit : glTexture.unit);
        return unit;
    }
    bindTexture(texture) {
        let glTexture = this.textures.get(texture);
        if (!glTexture) {
            this.uploadTexture(texture);
            glTexture = this.textures.get(texture);
        }
        return glTexture.bind();
    }
    unbindTexture(texture) {
        let glTexture = this.textures.get(texture);
        if (!glTexture) {
            return;
        }
        glTexture.unbind();
    }
    createShader(vertSource, fragSource, options) {
        return new _shader__WEBPACK_IMPORTED_MODULE_1__.Shader(this.gl, vertSource, fragSource, options);
    }
    /**
     * Wait for next animation frame and redraw everything
     */
    drawScene(scene, target) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const draw = () => {
                    const now = performance.now();
                    const dt = (now - this.lastFrameAt) / 1000.0;
                    this.drawSync(scene, target);
                    this.frame++;
                    if (DEBUG_ENABLED && this.frame % 60 === 0) {
                        const frameRate = (performance.now() - this.frameAverage) / 60;
                        this.frameAverage = performance.now();
                        const fps = (1 / (frameRate / 1000)) | 0;
                        this.debugEl.innerHTML = `${fps} fps`;
                    }
                    resolve(dt);
                };
                if (target) {
                    this.drawSync(scene, target);
                    resolve(0);
                }
                else if (this.vsync) {
                    window.requestAnimationFrame(draw);
                }
                else {
                    setTimeout(draw, 0);
                }
            });
        });
    }
    drawSync(scene, texture) {
        // Drawing to a texture
        let target;
        if (texture) {
            target = this.renderTargets.get(texture);
            if (!target) {
                this.uploadTexture(texture);
                const glTexture = this.textures.get(texture);
                target = new _webgl_render_target__WEBPACK_IMPORTED_MODULE_5__.WebGLRenderTarget(this.gl, texture.size, glTexture);
                if (texture.attachment === _render_texture__WEBPACK_IMPORTED_MODULE_8__.Attachment.DEPTH) {
                    target.attachment = this.gl.DEPTH_ATTACHMENT;
                }
                this.renderTargets.set(texture, target);
            }
            // Resize to match size of texture
            this.updateSize(texture.size, texture.size);
            target.bind();
        }
        this.backgroundColor = [...scene.backgroundColor];
        const now = performance.now();
        this.lastFrameAt = now;
        this.gl.viewport(0, 0, this.camera.width, this.camera.height);
        this.clear();
        // Uniforms
        const proj = this.camera.projection.clone();
        const view = this.camera.view.inverse();
        const viewProj = proj.multiply(view);
        // Batch shaders together
        const shaderMap = new Map();
        for (const actor of scene.actors) {
            const shader = actor.shader;
            if (!shader)
                continue;
            if (!shaderMap.get(shader)) {
                shaderMap.set(shader, []);
            }
            shaderMap.get(shader).push(actor);
        }
        for (const shader of shaderMap.keys()) {
            if (!shader.compiled) {
                shader.make(this.gl);
            }
            shader.use();
            // Various global uniforms
            shader.setUniform('uView', view);
            shader.setUniform('uFogColor', this.backgroundColor);
            shader.setUniform('uLineWidth', this.lineWidth);
            shader.setUniform('uTime', performance.now());
            shader.setUniform('uResolution', [this.camera.width, this.camera.height]);
            shader.setUniform('uSeed', this.seed);
            // Scene defined uniforms
            for (const uniformName in scene.uniforms) {
                shader.setUniform(uniformName, scene.uniforms[uniformName]);
            }
            // Lights
            const lightCount = scene.lights.length;
            shader.setUniform('uLightCount', lightCount);
            for (let i = 0; i < lightCount; i++) {
                const position = scene.lights[i].position;
                const light = scene.lights[i].getComponentsOfType(_components_light__WEBPACK_IMPORTED_MODULE_7__.Light)[0];
                shader.setUniform(`uLights[${i}].position`, position);
                shader.setUniform(`uLights[${i}].diffuse`, light.diffuse);
                shader.setUniform(`uLights[${i}].ambient`, light.ambient);
            }
            // Draw actors with this shader
            for (const actor of shaderMap.get(shader)) {
                this.drawActorWithShader(shader, actor, viewProj);
            }
        }
        // Cleanup after drawing to texture
        if (texture) {
            target.unbind();
            // FIXME depth attachment check is so we don't resize the light (which is assigned to this.camera)
            if (texture.attachment != _render_texture__WEBPACK_IMPORTED_MODULE_8__.Attachment.DEPTH) {
                this.updateSize();
            }
        }
    }
    /**
     * Update the framebuffer of the canvas to match its container's size
     */
    updateSize(width, height) {
        if (!this.parentElement) {
            return;
        }
        const parentWidth = this.parentElement.clientWidth * this.scale | 0;
        const parentHeight = this.parentElement.clientHeight * this.scale | 0;
        width = width != null ? width : parentWidth;
        height = height != null ? height : parentHeight;
        this.camera.resize(width, height);
        this.canvas.style.imageRendering = 'crisp-edges'; // Firefox
        this.canvas.style.imageRendering = 'pixelated'; // Webkit
        this.canvas.style.width = this.parentElement.clientWidth + 'px';
        this.canvas.style.height = this.parentElement.clientHeight + 'px';
        this.canvas.setAttribute('width', parentWidth.toString());
        this.canvas.setAttribute('height', parentHeight.toString());
    }
    addEventListener(type, listener, options) {
        if (!this.canvas)
            return;
        this.canvas.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        if (!this.canvas)
            return;
        this.canvas.removeEventListener(type, listener, options);
    }
    /**
     * Insert the canvas into a HTMLElement
     */
    attach(el = null) {
        var _a;
        el === null || el === void 0 ? void 0 : el.appendChild(this.canvas);
        window.addEventListener('resize', this.updateSize.bind(this, null, null));
        this.updateSize();
        this.initWebGL();
        this.addEventListeners();
        if (DEBUG_ENABLED) {
            this.debugEl = document.createElement('div');
            (_a = this.canvas.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(this.debugEl);
            Object.assign(this.debugEl.style, {
                position: 'fixed',
                borderRadius: '12px',
                zIndex: 10,
                right: '10px',
                top: '10px',
                color: 'red',
                fontSize: '32px',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '10px',
            });
        }
    }
}


/***/ }),

/***/ "./src/renderer/webgl_shader.ts":
/*!**************************************!*\
  !*** ./src/renderer/webgl_shader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebGLShader": () => (/* binding */ WebGLShader)
/* harmony export */ });
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../geom */ "./src/geom.ts");

class WebGLShader {
    constructor(gl, vertSource, fragSource, options) {
        this.compiled = false;
        this.attributes = {
            position: {
                type: WebGLRenderingContext.FLOAT,
                size: 3,
                location: null,
            },
        };
        this.instanceAttributes = {};
        this.uniforms = {
            uTime: {
                type: WebGLRenderingContext.FLOAT,
                location: null,
            },
            uViewProj: {
                type: WebGLRenderingContext.FLOAT_MAT4,
                location: null,
            },
            uView: {
                type: WebGLRenderingContext.FLOAT_MAT4,
                location: null,
            },
            uModel: {
                type: WebGLRenderingContext.FLOAT_MAT4,
                location: null,
            },
            uFillColor: {
                type: WebGLRenderingContext.FLOAT_VEC4,
                location: null,
            },
            uFogColor: {
                type: WebGLRenderingContext.FLOAT_VEC4,
                location: null,
            },
            uLineWidth: {
                type: WebGLRenderingContext.FLOAT,
                location: null,
            },
            uResolution: {
                type: WebGLRenderingContext.FLOAT_VEC2,
                location: null,
            },
            uSeed: {
                type: WebGLRenderingContext.FLOAT,
                location: null,
            },
        };
        if (gl) {
            this.make(gl, vertSource, fragSource, options);
        }
    }
    make(gl, vertSource, fragSource, options) {
        this.gl = gl;
        if (!vertSource) {
            throw 'You must provide vertex shader source code';
        }
        if (!fragSource) {
            throw 'You must provide fragment shader source code';
        }
        const program = gl.createProgram();
        if (options === null || options === void 0 ? void 0 : options.attributes) {
            this.attributes = Object.assign(Object.assign({}, this.attributes), options.attributes);
        }
        if (options === null || options === void 0 ? void 0 : options.instanceAttributes) {
            this.instanceAttributes = Object.assign(Object.assign({}, this.instanceAttributes), options.instanceAttributes);
        }
        if (options === null || options === void 0 ? void 0 : options.uniforms) {
            this.uniforms = Object.assign(Object.assign({}, this.uniforms), options.uniforms);
        }
        // Enable `fwidth` in shader
        gl.getExtension('OES_standard_derivatives');
        const vert = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vert, vertSource);
        gl.attachShader(program, vert);
        gl.compileShader(vert);
        // Did the vertex shader compile?
        if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(vert);
            throw `Could not compile Vertex shader: ${info}`;
        }
        const frag = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(frag, fragSource);
        gl.attachShader(program, frag);
        gl.compileShader(frag);
        // Did the fragment shader compile?
        if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(frag);
            throw `Could not compile Fragment shader: ${info}`;
        }
        gl.linkProgram(program);
        // Did the program link successfully?
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            const shaderName = this.constructor.name;
            throw `Could not link WebGL program (${shaderName}): ${info}`;
        }
        // Uniform locations
        for (const uniformName in this.uniforms) {
            this.uniforms[uniformName].location = gl.getUniformLocation(program, uniformName);
        }
        // Attribute locations
        for (const attributeName in this.attributes) {
            this.attributes[attributeName].location = gl.getAttribLocation(program, attributeName);
        }
        for (const attributeName in this.instanceAttributes) {
            this.instanceAttributes[attributeName].location = gl.getAttribLocation(program, attributeName);
        }
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        this.program = program;
        this.compiled = true;
    }
    use() {
        this.gl.useProgram(this.program);
    }
    bind(mesh) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
        const ext = gl.getExtension('ANGLE_instanced_arrays');
        for (const attributeName in this.attributes) {
            const attribute = this.attributes[attributeName];
            if (attribute.location == null || attribute.location === -1) {
                continue;
            }
            ext.vertexAttribDivisorANGLE(attribute.location, 0);
            const stride = mesh.stride;
            const offset = mesh.offsets.get(attributeName);
            if (offset == null) {
                if (true) {
                    console.warn(`Unable to find attribute offset for ${attributeName}`);
                }
                gl.disableVertexAttribArray(attribute.location);
                continue;
            }
            gl.enableVertexAttribArray(attribute.location);
            gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, false, stride, offset);
        }
    }
    unbind() {
        const gl = this.gl;
        for (const attributeName in this.attributes) {
            const attribute = this.attributes[attributeName];
            if (attribute.location == null || attribute.location === -1) {
                continue;
            }
            gl.disableVertexAttribArray(attribute.location);
        }
    }
    bindInstances(gl, mesh) {
        const ext = gl.getExtension('ANGLE_instanced_arrays');
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.instanceBuffer);
        for (const attributeName in this.instanceAttributes) {
            const attribute = this.instanceAttributes[attributeName];
            if (attribute.location == null || attribute.location === -1) {
                continue;
            }
            const stride = mesh.instanceStride;
            let offset = mesh.instanceOffsets.get(attributeName);
            if (offset == null) {
                throw `Unable to find instanceOffset for ${attributeName}`;
            }
            // mat4 is really 4x vec4
            if (attribute.size === 4 * 4) {
                for (let i = 0; i < 4; i++) {
                    const location = attribute.location + i;
                    gl.enableVertexAttribArray(location);
                    gl.vertexAttribPointer(location, 4, attribute.type, false, stride, offset);
                    ext.vertexAttribDivisorANGLE(location, 1);
                    offset += 4 * 4;
                }
            }
        }
    }
    unbindInstances(gl) {
        const ext = gl.getExtension('ANGLE_instanced_arrays');
        for (const attributeName in this.instanceAttributes) {
            const attribute = this.instanceAttributes[attributeName];
            if (attribute.location == null || attribute.location === -1) {
                continue;
            }
            // mat4 is really 4x vec4
            if (attribute.size === 4 * 4) {
                for (let i = 0; i < 4; i++) {
                    const location = attribute.location + i;
                    gl.disableVertexAttribArray(location);
                    ext.vertexAttribDivisorANGLE(location, 0);
                }
            }
        }
    }
    setUniform(name, value) {
        if (value == null)
            return;
        const gl = this.gl;
        const uniform = this.uniforms[name];
        if (!uniform) {
            return;
        }
        switch (uniform.type) {
            case WebGLRenderingContext.BOOL:
                if (typeof value !== 'boolean') {
                    throw `Uniform '${name}' expected boolean but got: ${typeof value}`;
                }
                gl.uniform1i(uniform.location, value ? 1 : 0);
                break;
            case WebGLRenderingContext.FLOAT:
                if (typeof value === 'number') {
                    gl.uniform1f(uniform.location, value);
                }
                else if (Array.isArray(value) && typeof value[0] === 'number') {
                    gl.uniform1fv(uniform.location, value);
                }
                else {
                    throw `Uniform '${name}' expected number but got: ${typeof value}`;
                }
                break;
            case WebGLRenderingContext.INT:
                if (typeof value === 'number') {
                    gl.uniform1i(uniform.location, value);
                }
                else if (Array.isArray(value) && typeof value[0] === 'number') {
                    gl.uniform1iv(uniform.location, value);
                }
                else {
                    throw `Uniform '${name}' expected number but got: ${typeof value}`;
                }
                break;
            case WebGLRenderingContext.FLOAT_VEC2:
                if (!Array.isArray(value) ||
                    value.length !== 2 ||
                    typeof value[0] !== 'number' ||
                    typeof value[1] !== 'number') {
                    throw `Uniform '${name}' expected an array of 2 numbers but got something else`;
                }
                gl.uniform2fv(uniform.location, value);
                break;
            case WebGLRenderingContext.FLOAT_VEC3:
                if (!Array.isArray(value) ||
                    value.length !== 3 ||
                    typeof value[0] !== 'number' ||
                    typeof value[1] !== 'number' ||
                    typeof value[2] !== 'number') {
                    throw `Uniform '${name}' expected an array of 3 numbers but got something else`;
                }
                gl.uniform3fv(uniform.location, value);
                break;
            case WebGLRenderingContext.FLOAT_VEC4:
                if (!Array.isArray(value) ||
                    value.length !== 4 ||
                    typeof value[0] !== 'number' ||
                    typeof value[1] !== 'number' ||
                    typeof value[2] !== 'number' ||
                    typeof value[3] !== 'number') {
                    throw `Uniform '${name}' expected an array of 4 numbers but got something else`;
                }
                gl.uniform4fv(uniform.location, value);
                break;
            case WebGLRenderingContext.FLOAT_MAT4:
                if (!(value instanceof _geom__WEBPACK_IMPORTED_MODULE_0__.Matrix4)) {
                    throw `Uniform '${name}' expected a Matrix4 but got something else`;
                }
                gl.uniformMatrix4fv(uniform.location, false, value.toArray());
                break;
            // TODO other uniform types
            default:
                throw `Unsupported uniform type: ${uniform.type}`;
        }
    }
}


/***/ }),

/***/ "./src/renderer/webgl_texture.ts":
/*!***************************************!*\
  !*** ./src/renderer/webgl_texture.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebGLRendererTexture": () => (/* binding */ WebGLRendererTexture)
/* harmony export */ });
/* harmony import */ var _texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../texture */ "./src/texture.ts");
/* harmony import */ var _render_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../render_texture */ "./src/render_texture.ts");


const FILTER_MAP = {
    [_texture__WEBPACK_IMPORTED_MODULE_0__.ScaleFilter.LINEAR]: WebGLRenderingContext.LINEAR,
    [_texture__WEBPACK_IMPORTED_MODULE_0__.ScaleFilter.NEAREST]: WebGLRenderingContext.NEAREST,
};
class WebGLRendererTexture {
    constructor(gl) {
        this.level = 0;
        this.internalFormat = WebGLRenderingContext.RGBA;
        this.srcFormat = WebGLRenderingContext.RGBA;
        this.srcType = WebGLRenderingContext.UNSIGNED_BYTE;
        this.minFilter = WebGLRenderingContext.LINEAR;
        this.magFilter = WebGLRenderingContext.LINEAR;
        this.gl = gl;
        this.texture = gl.createTexture();
    }
    static fromTexture(gl, src) {
        const texture = new WebGLRendererTexture(gl);
        texture.minFilter = FILTER_MAP[src.minFilter];
        texture.magFilter = FILTER_MAP[src.magFilter];
        if (src instanceof _render_texture__WEBPACK_IMPORTED_MODULE_1__.RenderTexture && src.attachment === _render_texture__WEBPACK_IMPORTED_MODULE_1__.Attachment.DEPTH) {
            texture.internalFormat = gl.DEPTH_COMPONENT;
            texture.srcFormat = gl.DEPTH_COMPONENT;
            texture.srcType = gl.UNSIGNED_INT;
            texture.unusedColorTexture = gl.createTexture();
        }
        return texture;
    }
    upload(texture, unit = null) {
        const pixels = texture instanceof _render_texture__WEBPACK_IMPORTED_MODULE_1__.RenderTexture ? null : texture.pixels;
        if (pixels instanceof HTMLImageElement && !pixels.complete) {
            throw 'Attempted to use incomplete image as texture';
        }
        this.unit = unit;
        const gl = this.gl;
        if (texture instanceof _render_texture__WEBPACK_IMPORTED_MODULE_1__.RenderTexture) {
            // Safari requries a Color texture, even if we're only rendering to a Depth texture
            if (this.unusedColorTexture) {
                gl.activeTexture(gl.TEXTURE0 + this.unit);
                gl.bindTexture(gl.TEXTURE_2D, this.unusedColorTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texture.size, texture.size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
            }
            this.bind();
            gl.texImage2D(gl.TEXTURE_2D, this.level, this.internalFormat, texture.size, texture.size, 0, this.srcFormat, this.srcType, null);
        }
        else {
            this.bind();
            gl.texImage2D(gl.TEXTURE_2D, this.level, this.internalFormat, this.srcFormat, this.srcType, pixels);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
    }
    bind() {
        if (this.unit == null) {
            throw `Cannot bind texture that hasn't been uploaded`;
        }
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + this.unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        return this.unit;
    }
    unbind() {
        if (this.unit == null) {
            throw `Cannot unbind texture that hasn't been uploaded`;
        }
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + this.unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}


/***/ }),

/***/ "./src/scene.ts":
/*!**********************!*\
  !*** ./src/scene.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scene": () => (/* binding */ Scene)
/* harmony export */ });
/* harmony import */ var _components_static_mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/static_mesh */ "./src/components/static_mesh.ts");
/* harmony import */ var _components_light__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/light */ "./src/components/light.ts");
/* harmony import */ var _render_texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render_texture */ "./src/render_texture.ts");
/* harmony import */ var _geom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./geom */ "./src/geom.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




class Scene {
    constructor(renderer) {
        this.actors = [];
        this.textures = new Map();
        this.backgroundColor = [0.0, 0.0, 0.0, 1.0];
        this.lights = [];
        this.uniforms = {
            uShadowMap: null,
            uLight: null,
            uLightDir: null,
        };
        this.renderer = renderer;
    }
    addActor(actor) {
        const { children } = actor;
        const uploadActor = (actor) => {
            var _a, _b, _c, _d;
            // Keep track of lights
            if (actor.hasComponentOfType(_components_light__WEBPACK_IMPORTED_MODULE_1__.Light)) {
                this.lights.push(actor);
            }
            // Upload the mesh
            for (const component of actor.getComponentsOfType(_components_static_mesh__WEBPACK_IMPORTED_MODULE_0__.StaticMesh)) {
                this.renderer.uploadMesh(component.mesh);
            }
            // Upload textures
            if ((_a = actor.material) === null || _a === void 0 ? void 0 : _a.texture) {
                this.addTexture(actor.material.texture);
            }
            if ((_b = actor.material) === null || _b === void 0 ? void 0 : _b.normalMap) {
                this.addTexture(actor.material.normalMap);
            }
            if ((_c = actor.material) === null || _c === void 0 ? void 0 : _c.specularMap) {
                this.addTexture(actor.material.specularMap);
            }
            if ((_d = actor.material) === null || _d === void 0 ? void 0 : _d.displacementMap) {
                this.addTexture(actor.material.displacementMap);
            }
            this.uploadActorInstances(actor);
        };
        uploadActor(actor);
        for (const child of children) {
            uploadActor(child);
        }
        this.actors.push(actor);
        return this.actors.length - 1;
    }
    uploadActorInstances(actor) {
        const { hasInstances } = actor;
        if (!hasInstances) {
            return;
        }
        const data = Array.from(actor.instances.values()).map((i) => i.data);
        for (const component of actor.getComponentsOfType(_components_static_mesh__WEBPACK_IMPORTED_MODULE_0__.StaticMesh)) {
            this.renderer.uploadMeshInstances(component.mesh, data);
        }
    }
    addTexture(texture) {
        const id = this.renderer.uploadTexture(texture);
        this.textures.set(id, texture);
        return id;
    }
    getIdOfTexture(texture) {
        for (let [id, value] of this.textures.entries()) {
            if (value === texture)
                return id;
        }
        return null;
    }
    updateTexture(textureOrId) {
        if (typeof textureOrId === 'number') {
            const texture = this.textures.get(textureOrId);
            if (!texture) {
                throw `Unable to find texture ${textureOrId}`;
            }
            this.renderer.uploadTexture(texture, textureOrId);
        }
        else {
            const id = this.getIdOfTexture(textureOrId);
            if (id == null) {
                throw `Attempted to upload an unknown texture`;
            }
            this.renderer.uploadTexture(textureOrId, id);
        }
    }
    bindTexture(textureOrId) {
        const texture = typeof textureOrId === 'number' ? this.textures.get(textureOrId) : textureOrId;
        if (!texture) {
            throw `Unable to find texture`;
        }
        return this.renderer.bindTexture(texture);
    }
    unbindTexture(textureOrId) {
        const texture = typeof textureOrId === 'number' ? this.textures.get(textureOrId) : textureOrId;
        if (!texture) {
            throw `Unable to find texture`;
        }
        this.renderer.unbindTexture(texture);
    }
    draw() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.castShadows) {
                this.updateShadowMap();
            }
            this.updateLightView();
            return yield this.renderer.drawScene(this);
        });
    }
    createShadowMap() {
        const gl = this.renderer.gl;
        const ext = gl.getExtension('WEBGL_depth_texture');
        if (!ext) {
            throw `WEBGL_depth_texture extension is not supported`;
        }
        this.shadowMap = new _render_texture__WEBPACK_IMPORTED_MODULE_2__.RenderTexture(1024, _render_texture__WEBPACK_IMPORTED_MODULE_2__.Attachment.DEPTH);
    }
    updateShadowMap() {
        if (!this.light)
            return;
        if (!this.shadowMap)
            this.createShadowMap();
        const hiddenActors = [];
        for (const actor of this.actors) {
            if (actor.visible && actor.material && !actor.material.castsShadows) {
                actor.visible = false;
                hiddenActors.push(actor);
            }
        }
        this.disableShadows();
        const oldCamera = this.renderer.camera;
        this.renderer.camera = this.light;
        this.renderer.drawScene(this, this.shadowMap);
        this.renderer.camera = oldCamera;
        this.enableShadows();
        for (const actor of hiddenActors) {
            actor.visible = true;
        }
    }
    updateLightView() {
        if (!this.light)
            return;
        const proj = this.light.projection.clone();
        const view = this.light.view.inverse();
        const viewProj = proj.multiply(view);
        const forward = this.light.view.multiplyVector4([0.0, 0.0, 1.0, 0.0]);
        const lightDir = (0,_geom__WEBPACK_IMPORTED_MODULE_3__.normalize)([forward[0], forward[1], forward[2]]);
        this.uniforms.uLightDir = lightDir;
        this.uniforms.uLight = viewProj;
    }
    enableShadows() {
        this.uniforms.uShadowMap = this.bindTexture(this.shadowMap);
    }
    disableShadows() {
        this.unbindTexture(this.shadowMap);
        this.uniforms.uShadowMap = null;
    }
}


/***/ }),

/***/ "./src/shader.ts":
/*!***********************!*\
  !*** ./src/shader.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Shader": () => (/* reexport safe */ _renderer_webgl_shader__WEBPACK_IMPORTED_MODULE_0__.WebGLShader)
/* harmony export */ });
/* harmony import */ var _renderer_webgl_shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer/webgl_shader */ "./src/renderer/webgl_shader.ts");
// TODO make a shader abstraction



/***/ }),

/***/ "./src/shaders/material.ts":
/*!*********************************!*\
  !*** ./src/shaders/material.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MaterialShader": () => (/* binding */ MaterialShader),
/* harmony export */   "SphereMaterialShader": () => (/* binding */ SphereMaterialShader)
/* harmony export */ });
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shader */ "./src/shader.ts");
/* harmony import */ var _material_vert_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./material.vert.glsl */ "./src/shaders/material.vert.glsl");
/* harmony import */ var _material_sphere_vert_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./material_sphere.vert.glsl */ "./src/shaders/material_sphere.vert.glsl");
/* harmony import */ var _material_frag_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./material.frag.glsl */ "./src/shaders/material.frag.glsl");
/* harmony import */ var _material_sphere_frag_glsl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./material_sphere.frag.glsl */ "./src/shaders/material_sphere.frag.glsl");





const MAX_LIGHT_COUNT = 8;
class MaterialShader extends _shader__WEBPACK_IMPORTED_MODULE_0__.Shader {
    make(gl, vertSource, fragSource) {
        const lightUniforms = {
            uLightCount: {
                type: WebGLRenderingContext.INT,
            },
        };
        for (let i = 0; i < MAX_LIGHT_COUNT; i++) {
            const uniformName = `uLights[${i}]`;
            // @prettier-ignore
            lightUniforms[`${uniformName}.position`] = { type: WebGLRenderingContext.FLOAT_VEC3 };
            lightUniforms[`${uniformName}.ambient`] = { type: WebGLRenderingContext.FLOAT_VEC3 };
            lightUniforms[`${uniformName}.diffuse`] = { type: WebGLRenderingContext.FLOAT_VEC3 };
            lightUniforms[`${uniformName}.specular`] = { type: WebGLRenderingContext.FLOAT_VEC3 };
            lightUniforms[`${uniformName}.constant`] = { type: WebGLRenderingContext.FLOAT };
            lightUniforms[`${uniformName}.linear`] = { type: WebGLRenderingContext.FLOAT };
            lightUniforms[`${uniformName}.quadratic`] = { type: WebGLRenderingContext.FLOAT };
        }
        super.make(gl, vertSource || _material_vert_glsl__WEBPACK_IMPORTED_MODULE_1__.default, fragSource || _material_frag_glsl__WEBPACK_IMPORTED_MODULE_3__.default, {
            attributes: {
                color: {
                    type: WebGLRenderingContext.FLOAT,
                    size: 4,
                },
                normal: {
                    type: WebGLRenderingContext.FLOAT,
                    size: 3,
                },
                uv: {
                    type: WebGLRenderingContext.FLOAT,
                    size: 2,
                },
            },
            uniforms: Object.assign(Object.assign({}, lightUniforms), { 
                // uMaterial
                "uMaterial.color": {
                    type: WebGLRenderingContext.FLOAT_VEC4,
                }, "uMaterial.castsShadows": {
                    type: WebGLRenderingContext.BOOL,
                }, "uMaterial.receivesShadows": {
                    type: WebGLRenderingContext.BOOL,
                }, "uMaterial.displacementMultiplier": {
                    type: WebGLRenderingContext.FLOAT,
                }, "uMaterial.hasTexture": {
                    type: WebGLRenderingContext.BOOL,
                }, "uMaterial.hasNormalMap": {
                    type: WebGLRenderingContext.BOOL,
                }, "uMaterial.hasSpecularMap": {
                    type: WebGLRenderingContext.BOOL,
                }, "uMaterial.hasDisplacementMap": {
                    type: WebGLRenderingContext.BOOL,
                }, "uMaterial.texture": {
                    type: WebGLRenderingContext.INT,
                }, "uMaterial.normalMap": {
                    type: WebGLRenderingContext.INT,
                }, "uMaterial.specularMap": {
                    type: WebGLRenderingContext.INT,
                }, "uMaterial.displacementMap": {
                    type: WebGLRenderingContext.INT,
                }, "uMaterial.emissive": {
                    type: WebGLRenderingContext.BOOL,
                }, uTexture: {
                    type: WebGLRenderingContext.INT,
                }, uNormalMap: {
                    type: WebGLRenderingContext.INT,
                }, uLight: {
                    type: WebGLRenderingContext.FLOAT_MAT4,
                }, uLightDir: {
                    type: WebGLRenderingContext.FLOAT_VEC3,
                }, uShadowMap: {
                    type: WebGLRenderingContext.INT,
                } }),
        });
    }
}
class SphereMaterialShader extends MaterialShader {
    make(gl) {
        super.make(gl, _material_sphere_vert_glsl__WEBPACK_IMPORTED_MODULE_2__.default, _material_sphere_frag_glsl__WEBPACK_IMPORTED_MODULE_4__.default);
    }
}


/***/ }),

/***/ "./src/shaders/simple.ts":
/*!*******************************!*\
  !*** ./src/shaders/simple.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SimpleShader": () => (/* binding */ SimpleShader)
/* harmony export */ });
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shader */ "./src/shader.ts");
/* harmony import */ var _simple_vert_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./simple.vert.glsl */ "./src/shaders/simple.vert.glsl");
/* harmony import */ var _simple_frag_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./simple.frag.glsl */ "./src/shaders/simple.frag.glsl");



class SimpleShader extends _shader__WEBPACK_IMPORTED_MODULE_0__.Shader {
    make(gl) {
        super.make(gl, _simple_vert_glsl__WEBPACK_IMPORTED_MODULE_1__.default, _simple_frag_glsl__WEBPACK_IMPORTED_MODULE_2__.default, {
            attributes: {
                color: {
                    type: WebGLRenderingContext.FLOAT,
                    size: 4,
                },
                normal: {
                    type: WebGLRenderingContext.FLOAT,
                    size: 3,
                },
                uv: {
                    type: WebGLRenderingContext.FLOAT,
                    size: 2,
                },
            },
            uniforms: {
                uLight: {
                    type: WebGLRenderingContext.FLOAT_MAT4,
                },
                uLightDir: {
                    type: WebGLRenderingContext.FLOAT_VEC3,
                },
                uShadowMap: {
                    type: WebGLRenderingContext.INT,
                },
            },
        });
    }
}


/***/ }),

/***/ "./src/shaders/sprite.ts":
/*!*******************************!*\
  !*** ./src/shaders/sprite.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpriteShader": () => (/* binding */ SpriteShader)
/* harmony export */ });
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shader */ "./src/shader.ts");
/* harmony import */ var _sprite_vert_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sprite.vert.glsl */ "./src/shaders/sprite.vert.glsl");
/* harmony import */ var _sprite_frag_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sprite.frag.glsl */ "./src/shaders/sprite.frag.glsl");



class SpriteShader extends _shader__WEBPACK_IMPORTED_MODULE_0__.Shader {
    make(gl) {
        super.make(gl, _sprite_vert_glsl__WEBPACK_IMPORTED_MODULE_1__.default, _sprite_frag_glsl__WEBPACK_IMPORTED_MODULE_2__.default, {
            attributes: {
                uv: {
                    type: WebGLRenderingContext.FLOAT,
                    size: 2,
                },
            },
            uniforms: {
                uSampler: {
                    type: WebGLRenderingContext.INT,
                },
                uContrast: {
                    type: WebGLRenderingContext.FLOAT,
                },
            },
        });
    }
}


/***/ }),

/***/ "./src/texture.ts":
/*!************************!*\
  !*** ./src/texture.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ScaleFilter": () => (/* binding */ ScaleFilter),
/* harmony export */   "Texture": () => (/* binding */ Texture)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ScaleFilter;
(function (ScaleFilter) {
    ScaleFilter[ScaleFilter["LINEAR"] = 0] = "LINEAR";
    ScaleFilter[ScaleFilter["NEAREST"] = 1] = "NEAREST";
})(ScaleFilter || (ScaleFilter = {}));
class Texture {
    constructor(imageOrURL, options) {
        this.minFilter = ScaleFilter.LINEAR;
        this.magFilter = ScaleFilter.LINEAR;
        this.putPixels(new ImageData(new Uint8ClampedArray([255, 0, 255, 255]), 1, 1));
        if (options === null || options === void 0 ? void 0 : options.minFilter) {
            this.minFilter = options.minFilter;
        }
        if (options === null || options === void 0 ? void 0 : options.magFilter) {
            this.magFilter = options.magFilter;
        }
        if (imageOrURL) {
            if (typeof imageOrURL === 'string') {
                const image = new Image();
                image.src = imageOrURL;
                this.putImage(image);
            }
            else if (imageOrURL instanceof HTMLImageElement) {
                this.putImage(imageOrURL);
            }
            else {
                this.putPixels(imageOrURL);
            }
        }
    }
    static fromUrl(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.src = url;
                image.addEventListener('load', () => {
                    resolve(new Texture(image, options));
                });
                image.addEventListener('error', (e) => {
                    reject(e);
                });
            });
        });
    }
    putImage(image) {
        if (image.complete) {
            this.putPixels(image);
        }
        else {
            // Image hasn't puted yet; wait for it
            image.addEventListener('load', () => {
                this.putImage(image);
            });
        }
    }
    putPixels(pixels) {
        if (pixels instanceof HTMLImageElement && !pixels.complete) {
            throw 'Attempted to use incomplete image as texture';
        }
        this.pixels = pixels;
    }
    get data() {
        if (this.pixels instanceof ImageData) {
            return this.pixels.data;
        }
        throw `Can't get data of an HTMLImageElement`;
    }
    get width() {
        return this.pixels.width;
    }
    get height() {
        return this.pixels.height;
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()
;
});
//# sourceMappingURL=index.js.map