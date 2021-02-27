import { Shader } from '../shader';
import vertexSource from './material.vert.glsl';
import fragmentSource from './material.frag.glsl';

const MAX_LIGHT_COUNT = 8;

type UniformMap = Shader['uniforms'];

export class MaterialShader extends Shader {
	make(gl: WebGLRenderingContext) {
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

		super.make(gl, vertexSource, fragmentSource, {
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
				"uMaterial.hasTexture": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.hasNormalMap": {
					type: WebGLRenderingContext.BOOL,
				},
				"uMaterial.hasSpecularMap": {
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
