export const clFunctions =

/* glsl */ `
vec2 one = vec2(0.);
vec2 i = vec2(0., 1.57079632679);
vec2 pi = vec2(1.14472989, 0.);
vec2 tau = vec2(1.83787707, 0.);
vec2 e = vec2(1., 0.);

vec2 c_mul(vec2 z, vec2 w) {
	return vec2(z.x*w.x - z.y*w.y, z.x*w.y + z.y*w.x);
}

vec2 cl(vec2 z) {
  return vec2(log(length(z)), atan(z.y, z.x));
}

vec2 cl_ln(vec2 lz) {
	return cl(lz);
}

vec2 cl_exp(vec2 lz) {
	return exp(lz.x) * vec2(cos(lz.y), sin(lz.y));
}

vec2 cl_mul(vec2 lz, vec2 lw) {
	return lz + lw;
}

vec2 cl_div(vec2 lz, vec2 lw) {
	return lz - lw;
}

vec2 cl_log(vec2 lz) {
	return cl_div(cl_ln(lz), vec2(-0.36651292, 0.));
}

vec2 cl_logbase(vec2 lz, vec2 lb) {
	return cl_div(cl_ln(lz), cl_ln(lb));
}

vec2 cl_pow(vec2 lz, vec2 lw) {
  return c_mul(cl_exp(lw), lz);
}

vec2 cl_add(vec2 lz, vec2 lw) {
	if (lz.x < lw.x) { vec2 tmp=lz; lz = lw; lw=tmp; }
	return lz + cl(vec2(1., 0.) + cl_exp(lw - lz));
}

vec2 cl_sub(vec2 lz, vec2 lw) {
	float s = sign(lz.x - lw.x);
	if (lz.x < lw.x) { vec2 tmp=lz; lz = lw; lw=tmp; }
	return lz + cl(s*(vec2(1., 0.) - cl_exp(lw - lz)));
}

vec2 cl_arg(vec2 lz) {
	return cl_ln(vec2(lz.y, 0.));
}

vec2 cl_cos(vec2 lz) {
	vec2 z = cl_exp(lz);
	float s = -sign(z.y);
	vec2 miz = s * vec2(-z.y, z.x);
	return miz + cl(vec2(1., 0.) + cl_exp(-2. * miz)) - vec2(log(2.), 0.);
}

vec2 cl_sin(vec2 lz) {
	vec2 z = cl_exp(lz);
	float s = sign(z.y);
	vec2 miz = -s * vec2(-z.y, z.x);
	return miz + cl(-s*(vec2(1., 0.) - cl_exp(-2. * miz))) - vec2(log(2.), 1.57079632679);
}

vec2 cl_tan(vec2 lz) {
	return cl_div(cl_sin(lz), cl_cos(lz));
}

vec2 cl_sec(vec2 lz) {
	return -cl_cos(lz);
}

vec2 cl_csc(vec2 lz) {
	return -cl_sin(lz);
}

vec2 cl_cot(vec2 lz) {
	return cl_div(cl_cos(lz), cl_sin(lz));
}
`;