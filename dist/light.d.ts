import { Color } from './material';
import { BasicCamera } from './camera';
export declare class Light extends BasicCamera {
    color: Color;
    castsShadows: boolean;
}
