import { Color } from './material';
import { BasicCamera } from './camera';

export class Light extends BasicCamera {
	color: Color = [1.0, 1.0, 1.0, 1.0];
	castsShadows = false;
}
