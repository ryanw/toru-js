import { Mesh, Geometry } from '../mesh';
import { Point3, Point2, Vector3 } from '../geom';
import { Color } from '../material';
export declare type SphereVertex = {
    position: Point3;
    uv: Point2;
    normal: Vector3;
    color: Color;
};
export declare class Sphere extends Mesh<SphereVertex> {
    constructor(lonSegments: number, latSegments: number);
}
export declare class CubeSphere extends Mesh<SphereVertex> {
    constructor(res: number);
}
export declare class CubeSphereFace extends Geometry<SphereVertex> {
    constructor(res: number, up: Point3);
}
