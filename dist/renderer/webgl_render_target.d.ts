import { WebGLRendererTexture } from './webgl_texture';
export declare class WebGLRenderTarget {
    gl: WebGLRenderingContext;
    texture: WebGLRendererTexture;
    size: number;
    framebuffer: WebGLFramebuffer;
    renderbuffer: WebGLRenderbuffer;
    attachment: number;
    constructor(gl: WebGLRenderingContext, size: number, texture: WebGLRendererTexture);
    bind(): void;
    unbind(): void;
}
