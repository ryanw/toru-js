import { Texture } from '../texture';
export declare class WebGLRendererTexture {
    gl: WebGLRenderingContext;
    texture: WebGLTexture;
    unusedColorTexture: WebGLTexture;
    unit: number;
    level: number;
    internalFormat: number;
    srcFormat: number;
    srcType: number;
    minFilter: number;
    magFilter: number;
    static fromTexture(gl: WebGLRenderingContext, src: Texture): WebGLRendererTexture;
    constructor(gl: WebGLRenderingContext);
    upload(texture: Texture, unit?: number): void;
    bind(): number;
    unbind(): void;
}
