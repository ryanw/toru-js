import { Shader } from '../shader';
import vertexSource from './building.vert.glsl';
import fragmentSource from './building.frag.glsl';

export class BuildingShader extends Shader {
	make(gl: WebGLRenderingContext) {
		super.make(gl, vertexSource, fragmentSource, {
			uniforms: {
				// Size of the door
				door: {
					type: WebGLRenderingContext.FLOAT_VEC2,
				},
			},
			attributes: {
				// Determines how many windows will fit
				scale: {
					type: WebGLRenderingContext.FLOAT,
					size: 2,
				},
				uv: {
					type: WebGLRenderingContext.FLOAT,
					size: 2,
				},
			},
		});
	}
}