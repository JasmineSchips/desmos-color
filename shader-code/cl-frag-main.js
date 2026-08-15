export const cl_fragMain =
/* glsl */ `vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 getColor(vec2 p) {
  p = renderedFunc(cl(p));
  float theta = p.y / 6.28318530718 ;
  float mag = p.x / log(2.);
  float f_mag = fract(mag);
  float delta = fwidth(mag);
  float smoothing = smoothstep(1.0 - delta, 1.0, f_mag);
  float adjusted_mag = mix(f_mag, 0.0, smoothing);
  float br = 0.5 + 0.5 * adjusted_mag;
  vec3 col = vec3(theta, 1., br);
  return hsv2rgb(col);
}

void main() {
  vec2 p = (gl_FragCoord.xy / Resolution);
  p = (Viewport.zw - Viewport.xy) * p + Viewport.xy;
  vec3 col = getColor(p);
  fragColor = vec4(col,1.);
  }`;