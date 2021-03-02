import { Mesh } from '../mesh';
import { Instance } from '../actor';
import { Scene } from '../scene';
import { Texture } from '../texture';
import { Camera } from '../camera';
import { RenderTexture } from '../render_texture';
import { Color } from '../material';
export declare abstract class Renderer {
    camera: Camera;
    mousePosition: number[];
    mouseMovement: number[];
    wheelMovement: number[];
    mouseButtons: Set<unknown>;
    heldKeys: Set<unknown>;
    backgroundColor: Color;
    updateSize(_width?: number, _height?: number): void;
    resetMouseMovement(): void;
    addEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _options?: AddEventListenerOptions): void;
    removeEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _options?: EventListenerOptions): void;
    get isDragging(): boolean;
    abstract uploadMesh(mesh: Mesh): void;
    abstract uploadMeshInstances<I extends Instance = Instance>(mesh: Mesh, instances: I[]): void;
    abstract uploadTexture(texture: Texture, unit?: number): number;
    abstract bindTexture(texture: Texture): number;
    abstract unbindTexture(texture: Texture): void;
    abstract drawScene(scene: Scene, target?: RenderTexture): Promise<number>;
    abstract get width(): number;
    abstract get height(): number;
}
