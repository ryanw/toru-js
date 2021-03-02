import { Mesh } from '../mesh';
import { Instance } from '../actor';
import { Scene } from '../scene';
import { Texture } from '../texture';
import { Camera, BasicCamera } from '../camera';
import { RenderTexture } from '../render_texture';
import { Color } from '../material';

export abstract class Renderer {
	camera: Camera = new BasicCamera();
	mousePosition = [0.0, 0.0];
	mouseMovement = [0.0, 0.0];
	wheelMovement = [0.0, 0.0];
	mouseButtons = new Set();
	heldKeys = new Set();
	backgroundColor: Color = [0.0, 0.0, 0.0, 1.0];
	updateSize(_width?: number, _height?: number): void {}
	resetMouseMovement() {
		this.mouseMovement[0] = 0;
		this.mouseMovement[1] = 0;
		this.wheelMovement[0] = 0;
		this.wheelMovement[1] = 0;
	}
	addEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _options?: AddEventListenerOptions): void {}
	removeEventListener(_type: string, _listener: EventListenerOrEventListenerObject, _options?: EventListenerOptions): void {}
	get isDragging(): boolean {
		return false;
	}
	abstract uploadMesh(mesh: Mesh): void;
	abstract uploadMeshInstances<I extends Instance = Instance>(mesh: Mesh, instances: I[]): void;
	abstract uploadTexture(texture: Texture, unit?: number): number;
	abstract bindTexture(texture: Texture): number;
	abstract unbindTexture(texture: Texture): void;
	abstract async drawScene(scene: Scene, target?: RenderTexture): Promise<number>;
	abstract get width(): number;
	abstract get height(): number;
}
