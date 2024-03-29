export enum ScaleFilter {
	LINEAR,
	NEAREST,
}

export interface TextureOptions {
	minFilter?: ScaleFilter;
	magFilter?: ScaleFilter;
}

export class Texture {
	pixels: ImageData | HTMLImageElement;
	minFilter = ScaleFilter.LINEAR;
	magFilter = ScaleFilter.LINEAR;

	constructor(imageOrURL?: HTMLImageElement | ImageData | string, options?: TextureOptions) {
		this.putPixels(new ImageData(new Uint8ClampedArray([255, 0, 255, 255]), 1, 1));
		if (options?.minFilter) {
			this.minFilter = options.minFilter;
		}
		if (options?.magFilter) {
			this.magFilter = options.magFilter;
		}

		if (imageOrURL) {
			if (typeof imageOrURL === 'string') {
				const image = new Image();
				image.src = imageOrURL;
				this.putImage(image);
			} else if (imageOrURL instanceof HTMLImageElement) {
				this.putImage(imageOrURL);
			} else {
				this.putPixels(imageOrURL);
			}
		}
	}

	static async fromUrl(url: string, options?: TextureOptions): Promise<Texture> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = url;
			image.addEventListener('load', () => {
				resolve(new Texture(image, options));
			});
			image.addEventListener('error', e => {
				reject(e);
			});
		});
	}

	putImage(image: HTMLImageElement) {
		if (image.complete) {
			this.putPixels(image);
		} else {
			// Image hasn't puted yet; wait for it
			image.addEventListener('load', () => {
				this.putImage(image);
			});
		}
	}

	putPixels(pixels: ImageData | HTMLImageElement) {
		if (pixels instanceof HTMLImageElement && !pixels.complete) {
			throw 'Attempted to use incomplete image as texture';
		}

		this.pixels = pixels;
	}

	get data(): Uint8ClampedArray {
		if (this.pixels instanceof ImageData) {
			return this.pixels.data;
		}
		throw `Can't get data of an HTMLImageElement`;
	}

	get width(): number {
		return this.pixels.width;
	}

	get height(): number {
		return this.pixels.height;
	}
}
