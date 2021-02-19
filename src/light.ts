import { Color } from './material';
import { Camera } from './camera';

export class Light extends Camera {
	color: Color = [1.0, 1.0, 1.0, 1.0];
	castsShadows = true;
}
