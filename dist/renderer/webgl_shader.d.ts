import { Matrix4 } from '../geom';
import { WebGLMesh } from './webgl_mesh';
export interface ShaderOptions {
    attributes?: {
        [key: string]: WebGLAttribute;
    };
    instanceAttributes?: {
        [key: string]: WebGLAttribute;
    };
    uniforms?: {
        [key: string]: WebGLUniform;
    };
}
export interface WebGLAttribute {
    location?: number;
    size: number;
    type: number;
}
export interface WebGLUniform {
    location?: WebGLUniformLocation;
    type: number;
}
export declare type WebGLUniformMap = {
    [key: string]: WebGLUniform;
};
export declare type WebGLAttributeMap = {
    [key: string]: WebGLAttribute;
};
export declare class WebGLShader {
    gl: WebGLRenderingContext;
    compiled: boolean;
    program: WebGLProgram;
    attributes: WebGLAttributeMap;
    instanceAttributes: WebGLAttributeMap;
    uniforms: WebGLUniformMap;
    constructor(gl?: WebGLRenderingContext, vertSource?: string, fragSource?: string, options?: ShaderOptions);
    make(gl: WebGLRenderingContext, vertSource?: string, fragSource?: string, options?: ShaderOptions): void;
    use(): void;
    bind(mesh: WebGLMesh): void;
    unbind(): void;
    bindInstances(gl: WebGLRenderingContext, mesh: WebGLMesh): void;
    unbindInstances(gl: WebGLRenderingContext): void;
    setUniform(name: string, value: boolean | number | number[] | Matrix4): void;
}
