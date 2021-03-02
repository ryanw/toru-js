import { Texture } from './texture';
export declare enum Attachment {
    COLOR = 0,
    DEPTH = 1
}
export declare class RenderTexture extends Texture {
    size: number;
    attachment: Attachment;
    constructor(size: number, attachment?: Attachment);
}
