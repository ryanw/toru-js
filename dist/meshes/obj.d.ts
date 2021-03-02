import { Mesh } from '../mesh';
import { Point2, Point3, Vector3 } from '../geom';
export declare type ObjVertex = {
    position: Point3;
    normal: Vector3;
    uv: Point2;
};
export interface ObjOptions {
    flipFaces?: boolean;
    scale?: number;
}
export interface ObjFile {
    vertices: Point3[];
    normals: Vector3[];
    uvs: Point2[];
}
export declare class Obj extends Mesh<ObjVertex> {
    constructor(data: string, options?: ObjOptions);
    static fromUrl(url: string): Promise<Obj>;
}
