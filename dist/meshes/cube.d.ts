import { Mesh } from '../mesh';
import { Point3, Point2, Vector3 } from '../geom';
import { Color } from '../material';
export declare type CubeVertex = {
    position: Point3;
    uv: Point2;
    normal: Vector3;
    color: Color;
};
export declare class Cube extends Mesh<CubeVertex> {
    constructor();
}
