import { Scene } from '../scene';
import { Renderer } from '../renderer';
import { BasicCamera } from '../camera';
import { Actor } from '../actor';
import { Color } from '../material';
export declare class Spaceman extends Scene {
    backgroundColor: Color;
    camera: BasicCamera;
    tree: Actor;
    cube: Actor;
    car: Actor;
    earth: Actor;
    floor: Actor;
    constructor(renderer: Renderer);
    draw(): Promise<number>;
    private build;
    private update;
    private buildLight;
    private buildCamera;
    private updateCamera;
}
