import { Texture } from './texture';

export type Color = [number, number, number, number?];

export interface MaterialOptions {
	color?: Color;
	texture?: Texture;
	normalMap?: Texture;
	specularMap?: Texture;
	receivesShadows?: boolean;
	castsShadows?: boolean;
	emissive?: boolean;
}

export class Material {
	color: Color = [1.0, 0.0, 0.0, 0.0];
	texture?: Texture = null;
	normalMap?: Texture = null;
	specularMap?: Texture = null;
	receivesShadows = true;
	castsShadows = true;
	emissive = false;

	constructor(props?: MaterialOptions) {
		if (props?.color != null) {
			this.color = props.color;
		}
		if (props?.texture != null) {
			this.texture = props.texture;
		}
		if (props?.normalMap != null) {
			this.normalMap = props.normalMap;
		}
		if (props?.specularMap != null) {
			this.specularMap = props.specularMap;
		}
		if (props?.receivesShadows != null) {
			this.receivesShadows = props.receivesShadows;
		}
		if (props?.castsShadows != null) {
			this.castsShadows = props.castsShadows;
		}
		if (props?.emissive != null) {
			this.emissive = props.emissive;
		}
	}
}
