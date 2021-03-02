import { Shader } from '../shader';
import vertexSource from './material.vert.glsl';
import vertexSourceSphere from './material_sphere.vert.glsl';
import fragmentSource from './material.frag.glsl';
import fragmentSourceSphere from './material_sphere.frag.glsl';

const MAX_LIGHT_COUNT = 8;

type UniformMap = Shader['uniforms'];

export class MaterialShader extends Shader {
	make(gl: WebGLRenderingContext, vertSource?: string, fragSource?: string) {
		const lightUniforms: UniformMap = {
			uLightCount: {
				type: WebGLRenderingContext.INT,
			},
		};
		for (let i = 0; i < MAX_LIGHT_COUNT; i++) {
			const uniformName = `uLights[${i}]`;
			// @prettier-ignore
			lightUniforms[`${uniformName}.position`]  = { type: WebGLRenderingContext.FLOAT_VEC3 };
			lightUniforms[`${uniformName}.ambient`]   = { type: WebGLRenderingContext.FLOAT_VEC3 };
			lightUniforms[`${uniformName}.diffuse`]   = { type: WebGLRenderingContext.FLOAT_VEC3 };
			lightUniforms[`${uniformName}.specular`]  = { type: WebGLRenderingContext.FLOAT_VEC3 };
			lightUniforms[`${uniformName}.constant`]  = { type: WebGLRenderingContext.FLOAT };
			lightUniforms[`${uniformName}.linear`]    = { type: WebGLRenderingContext.FLOAT };
			lightUniforms[`${uniformName}.quadratic`] = { type: WebGLRenderingContext.FLOAT };
		}

		super.make(gl, vertSource || vertexSource, fragSource || fragmentSource, {
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
				...lightUniforms,
				// uMaterial
				"uMaterial.color": {
					type: WebGLRenderingContext.FLOAT_VEC4,
				},
				"uMaterial.castsShadows": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.receivesShadows": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.displacementMultiplier": {
					type: WebGLRenderingContext.FLOAT,
				},
				"uMaterial.hasTexture": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.hasNormalMap": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.hasSpecularMap": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.hasDisplacementMap": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.texture": {
					type: WebGLRenderingContext.INT,
				},
				"uMaterial.normalMap": {
					type: WebGLRenderingContext.INT,
				},
				"uMaterial.specularMap": {
					type: WebGLRenderingContext.INT,
				},
				"uMaterial.displacementMap": {
					type: WebGLRenderingContext.INT,
				},
				"uMaterial.emissive": {
					type: WebGLRenderingContext.BOOL,
				},
				uTexture: {
					type: WebGLRenderingContext.INT,
				},
				uNormalMap: {
					type: WebGLRenderingContext.INT,
				},
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

export class SphereMaterialShader extends MaterialShader {
	make(gl: WebGLRenderingContext) {
		super.make(gl, vertexSourceSphere, fragmentSourceSphere);
	}
}
