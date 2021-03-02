import { Mesh } from '../mesh';
import { Point3, Point2 } from '../geom';
export declare type BuildingVertex = {
    position: Point3;
    uv: Point2;
    barycentric: Point3;
    scale: Point2;
};
export declare class Building extends Mesh<BuildingVertex> {
    constructor(width?: number, height?: number, depth?: number);
}
