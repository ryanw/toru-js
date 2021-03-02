import { Mesh } from '../mesh';
import { Point3, Point2, Vector3 } from '../geom';
import { Color } from '../material';
export declare type Vertex = {
    position: Point3;
    uv: Point2;
    color: Color;
    normal: Vector3;
};
export declare class Quad extends Mesh<Vertex> {
    constructor();
}
