import { Texture } from './texture';
export declare type Color = [number, number, number, number?];
export interface MaterialOptions {
    color?: Color;
    texture?: Texture;
    normalMap?: Texture;
    specularMap?: Texture;
    displacementMap?: Texture;
    displacementMultiplier?: number;
    receivesShadows?: boolean;
    castsShadows?: boolean;
    emissive?: boolean;
    wireframe?: boolean;
}
export declare class Material {
    color: Color;
    texture?: Texture;
    normalMap?: Texture;
    specularMap?: Texture;
    displacementMap?: Texture;
    displacementMultiplier: number;
    receivesShadows: boolean;
    castsShadows: boolean;
    emissive: boolean;
    wireframe: boolean;
    constructor(props?: MaterialOptions);
}
