import { Shader } from '../shader';
import vertexSource from './simple.vert.glsl';
import fragmentSource from './simple.frag.glsl';

export class SimpleShader extends Shader {
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
