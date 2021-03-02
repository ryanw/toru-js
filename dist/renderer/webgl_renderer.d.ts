import { Renderer } from './renderer';
import { Shader, ShaderOptions } from '../shader';
import { Vertex } from './vertex';
import { Actor, Instance } from '../actor';
import { Matrix4 } from '../geom';
import { Mesh } from '../mesh';
import { Scene } from '../scene';
import { Texture } from '../texture';
import { UniformValues } from '../shader';
import { RenderTexture } from '../render_texture';
declare type ExtWheelEvent = WheelEvent & {
    wheelDelta: number;
    axis: number;
    HORIZONTAL_AXIS: 0x01;
    VERTICAL_AXIS: 0x02;
};
export declare class WebGLRenderer extends Renderer {
    canvas: HTMLCanvasElement;
    debugEl: HTMLElement;
    defaultShader: Shader;
    scale: number;
    lineWidth: number;
    antiAlias: boolean;
    vsync: boolean;
    lastFrameAt: number;
    frameAverage: number;
    frame: number;
    isGrabbed: boolean;
    seed: number;
    private dragDelta;
    private context;
    private textures;
    private meshes;
    private renderTargets;
    constructor(el: HTMLElement);
    get isDragging(): boolean;
    /**
     * The canvas's parent element
     */
    get parentElement(): HTMLCanvasElement['parentElement'];
    /**
     * The WebGL drawing context
     */
    get gl(): WebGLRenderingContext;
    get width(): number;
    get height(): number;
    /**
     * Creates the WebGL buffers, compiles the shaders, etc.
     */
    private initWebGL;
    grab(lock?: boolean): void;
    release(): void;
    private addEventListeners;
    private removeEventListeners;
    onPointerLockChange: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onKeyUp: (e: KeyboardEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onWheel: (e: ExtWheelEvent) => void;
    clear(): void;
    drawActorWithShader(shader: Shader, actor: Actor, projection?: Matrix4, options?: {
        parentModel?: Matrix4;
    }): void;
    drawActor(actor: Actor, projection?: Matrix4, options?: {
        parentModel?: Matrix4;
        uniforms?: UniformValues;
    }): void;
    uploadMesh(mesh: Mesh): void;
    uploadMeshInstances<I extends Instance = Instance>(mesh: Mesh, instances: I[]): void;
    removeMesh(mesh: Mesh<Vertex>): void;
    uploadTexture(texture: Texture, unit?: number): number;
    bindTexture(texture: Texture): number;
    unbindTexture(texture: Texture): void;
    createShader(vertSource: string, fragSource: string, options?: ShaderOptions): Shader;
    /**
     * Wait for next animation frame and redraw everything
     */
    drawScene(scene: Scene, target?: RenderTexture): Promise<number>;
    drawSync(scene: Scene, texture?: RenderTexture): void;
    /**
     * Update the framebuffer of the canvas to match its container's size
     */
    updateSize(width?: number, height?: number): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions): void;
    /**
     * Insert the canvas into a HTMLElement
     */
    attach(el?: HTMLElement): void;
}
export {};
