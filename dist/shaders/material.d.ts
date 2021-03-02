import { Shader } from '../shader';
export declare class MaterialShader extends Shader {
    make(gl: WebGLRenderingContext, vertSource?: string, fragSource?: string): void;
}
export declare class SphereMaterialShader extends MaterialShader {
    make(gl: WebGLRenderingContext): void;
}
