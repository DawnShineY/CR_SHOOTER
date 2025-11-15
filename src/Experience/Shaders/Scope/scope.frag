precision mediump float;
uniform sampler2D uAlphaMap;
varying vec2 vUv;
uniform vec2 uPointer;
uniform float uAspectRatio;
uniform float uSize;
uniform float uTime;
void main()
{
	vec2 newUv = vUv;
	newUv.x *= uAspectRatio;
	newUv.x -= uPointer.x * uAspectRatio / 2.0;
	newUv.y -= uPointer.y / 2.0;

	float strength = step(0.5, distance(newUv, vec2(0.5 * uAspectRatio, 0.5)) + 0.5 - uSize) - 0.2;
	float colorIntensity = abs(sin(uTime * 2.0)) - 0.8;

	gl_FragColor = vec4(colorIntensity, 0.0, 0.0, strength);
}