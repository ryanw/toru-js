import { Matrix4, Point3, Vector3 } from './geom';
import { Actor } from './actor';
export interface Camera {
    width: number;
    height: number;
    view: Matrix4;
    projection: Matrix4;
    resize(width: number, height: number): void;
}
export declare class OrbitCamera extends Actor implements Camera {
    width: number;
    height: number;
    near: number;
    far: number;
    projection: Matrix4;
    distance: number;
    target: Point3;
    rotation: {
        lon: number;
        lat: number;
    };
    constructor();
    get view(): Matrix4;
    resize(width: number, height: number): void;
    zoom(amount: number): void;
    rotate(lon: number, lat: number): void;
}
export declare class BasicCamera extends Actor implements Camera {
    width: number;
    height: number;
    near: number;
    far: number;
    projection: Matrix4;
    position: Point3;
    rotation: Vector3;
    scaling: Vector3;
    constructor();
    get view(): Matrix4;
    get rotationMatrix(): Matrix4;
    updateModel(): void;
    rotate(x: number, y: number): void;
    translate(x: number, y: number, z: number): void;
    resize(width: number, height: number): void;
}
