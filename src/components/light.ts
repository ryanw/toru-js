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

export class Light extends Component {
	ambient: Color;
	diffuse: Color;
	specular: Color;

	constant: number;
	linear: number;
	quadratic: number;

	constructor(options: LightOptions = {}) {
		super();

		if (options.ambient) {
			this.ambient = options.ambient;
		}
		if (options.diffuse) {
			this.diffuse = options.diffuse;
		}
		if (options.specular) {
			this.specular = options.specular;
		}
		if (options.constant) {
			this.constant = options.constant;
		}
		if (options.linear) {
			this.linear = options.linear;
		}
		if (options.quadratic) {
			this.quadratic = options.quadratic;
		}
	}
}

