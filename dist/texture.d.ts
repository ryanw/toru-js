export declare enum ScaleFilter {
    LINEAR = 0,
    NEAREST = 1
}
export interface TextureOptions {
    minFilter?: ScaleFilter;
    magFilter?: ScaleFilter;
}
export declare class Texture {
    pixels: ImageData | HTMLImageElement;
    minFilter: ScaleFilter;
    magFilter: ScaleFilter;
    constructor(imageOrURL?: HTMLImageElement | ImageData | string, options?: TextureOptions);
    static fromUrl(url: string, options?: TextureOptions): Promise<Texture>;
    putImage(image: HTMLImageElement): void;
    putPixels(pixels: ImageData | HTMLImageElement): void;
    get data(): Uint8ClampedArray;
    get width(): number;
    get height(): number;
}
