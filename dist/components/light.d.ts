import { Component } from '../component';
import { Color } from '../material';
export interface LightOptions {
    ambient?: Color;
    diffuse?: Color;
    specular?: Color;
    constant?: number;
    linear?: number;
    quadratic?: number;
}
export declare class Light extends Component {
    ambient: Color;
    diffuse: Color;
    specular: Color;
    constant: number;
    linear: number;
    quadratic: number;
    constructor(options?: LightOptions);
}
