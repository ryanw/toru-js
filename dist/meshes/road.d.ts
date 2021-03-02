import { Mesh } from '../mesh';
import { Point3 } from '../geom';
export declare type RoadVertex = {
    position: Point3;
    barycentric: Point3;
    direction: number;
};
export declare class Road extends Mesh<RoadVertex> {
    constructor();
}
