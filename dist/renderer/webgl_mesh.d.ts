import { Vertex } from './vertex';
import { Mesh } from '../mesh';
import { Instance } from '../actor';
export declare class WebGLMesh<T extends Vertex = Vertex> {
    buffer: WebGLBuffer;
    stride: number;
    offsets: Map<keyof T, number>;
    length: number;
    instanceBuffer: WebGLBuffer;
    instanceStride: number;
    instanceOffsets: Map<keyof T, number>;
    instanceLength: number;
    gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext);
    upload(mesh: Mesh<T>): Promise<void>;
    uploadInstances<I extends Instance>(instances: I[]): void;
    bind(): void;
    draw(): void;
    drawLines(): void;
    drawInstances(): void;
}
