import { Scene } from '../scene';
import { Renderer } from '../renderer';
import { OrbitCamera } from '../camera';
import { Actor } from '../actor';
import { LonLat, Point2 } from '../geom';
export declare class Planets extends Scene {
    backgroundColor: [1.0, 0.0, 0.0, 1.0];
    earth: Actor;
    moon: Actor;
    bulbs: Actor[];
    camera: OrbitCamera;
    zoom: number;
    constructor(renderer: Renderer);
    draw(): Promise<number>;
    private build;
    pixelToLonLat(point: Point2): LonLat;
    private update;
    private buildCamera;
    private buildLight;
    private buildStars;
    private buildEarth;
    private buildMoon;
    private updateCamera;
    private updateLight;
    private updateSun;
    private updateEarth;
    private updateMoon;
}
