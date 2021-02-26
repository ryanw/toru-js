precision mediump float;

uniform float uTime;
uniform sampler2D uSampler;
uniform float uContrast;

varying vec2 vTexCoord;

void main(void) {
	float contrast = uContrast > 0.0 ? uContrast : 1.0;
	gl_FragColor = (texture2D(uSampler, vTexCoord) - (1.0 - (1.0 / contrast))) * contrast;
}
