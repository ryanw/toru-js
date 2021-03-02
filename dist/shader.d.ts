import { Matrix4 } from './geom';
export { WebGLShader as Shader, ShaderOptions } from './renderer/webgl_shader';
export declare type UniformValues = {
    [key: string]: boolean | number | number[] | Matrix4;
};
