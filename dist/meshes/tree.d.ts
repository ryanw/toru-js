import { Mesh } from '../mesh';
import { Point3, Vector3 } from '../geom';
import { Color } from '../material';
export declare type TreeVertex = {
    position: Point3;
    color: Color;
    barycentric: Point3;
    normal: Vector3;
};
export declare class Tree extends Mesh<TreeVertex> {
    constructor();
}
