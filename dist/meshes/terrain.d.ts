import { Mesh } from '../mesh';
import { Point3 } from '../geom';
export declare type HeightFunction = (x: number, y: number, t?: number) => number;
export declare type Vertex = {
    position: Point3;
    barycentric: Point3;
};
export declare class Terrain extends Mesh<Vertex> {
    width: number;
    depth: number;
    constructor();
    build(): void;
}
