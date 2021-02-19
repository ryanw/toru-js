import { Texture } from './texture';

export type Color = [number, number, number, number];

export interface MaterialOptions {
	color?: Color;
	texture?: Texture;
	receivesShadows?: boolean;
	castsShadows?: boolean;
}

export class Material {
	color: Color = [1.0, 0.0, 0.0, 0.0];
	texture?: Texture = null;
	receivesShadows = true;
	castsShadows = true;

	constructor(props?: MaterialOptions) {
		if (props?.color != null) {
			this.color = props.color;
		}
		if (props?.texture != null) {
			this.texture = props.texture;
		}
		if (props?.receivesShadows != null) {
			this.receivesShadows = props.receivesShadows;
		}
		if (props?.castsShadows != null) {
			this.castsShadows = props.castsShadows;
		}
	}
}
