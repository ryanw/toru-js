import { Matrix4 } from './geom';
import { Vertex } from './renderer/vertex';
export { Vertex };
export interface GeometryOptions {
    transform?: Matrix4;
}
export declare class Geometry<V extends Vertex> {
    vertices: V[];
    transform: Matrix4;
    constructor(vertices?: V[], options?: GeometryOptions);
    clone(): Geometry<V>;
    calculateNormals(): void;
}
export declare class Mesh<V extends Vertex = Vertex> {
    doubleSided: boolean;
    geometries: Geometry<V>[];
    constructor(geom?: Geometry<V> | Geometry<V>[] | V[]);
    clone(): Mesh<V>;
    get vertexCount(): number;
    get vertices(): V[];
    calculateNormals(): void;
}
