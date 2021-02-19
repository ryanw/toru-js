import { Shader } from '../shader';
import vertexSource from './material.vert.glsl';
import fragmentSource from './material.frag.glsl';

export class MaterialShader extends Shader {
	make(gl: WebGLRenderingContext) {
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
				"uMaterial.texture": {
					type: WebGLRenderingContext.INT,
				},
				uTexture: {
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
