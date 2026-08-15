export const complexFunctions =

/* glsl */ `
vec2 one = vec2(1., 0.);
vec2 i = vec2(0., 1.);
vec2 pi = vec2(3.14159265359, 0.);
vec2 tau = vec2(6.28318530718, 0.);
vec2 e = vec2(2.71828182846, 0.);

vec2 c_add(vec2 z, vec2 w) {
	return z + w;
}

vec2 c_sub(vec2 z, vec2 w) {
	return z - w;
}

vec2 c_mul(vec2 z, vec2 w) {
    return vec2(z.x*w.x - z.y*w.y, z.x*w.y + z.y*w.x);
}
vec2 c_div(vec2 z, vec2 w) {
    return vec2(dot(z, w), z.y*w.x - z.x*w.y) / dot(w,w);
}
vec2 c_exp(vec2 z) {
    return exp(z.x) * vec2(cos(z.y), sin(z.y));
}

vec2 c_ln(vec2 z) {
  return vec2(log(length(z)), atan(z.y, z.x));
}

vec2 c_logbase(vec2 z, vec2 b) {
	return c_div(c_ln(z), c_ln(b));
}

vec2 c_log(vec2 z) {
    return c_logbase(z, 2. * one);
}

vec2 c_pow(vec2 z, vec2 w) {
    if (length(z) == 0.0) return vec2(0.);
    vec2 lz = c_ln(z);
    return c_exp(c_mul(w, lz));
}

vec2 c_sqrt(vec2 z) {
    return c_pow(z, vec2(0.5, 0.));
}
vec2 c_sin(vec2 z) {
    return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));
}
vec2 c_cos(vec2 z) {
    return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));
}
vec2 c_tan(vec2 z) {
    return c_div(c_sin(z), c_cos(z));
}

vec2 c_csc(vec2 z) {
	return c_div(one, c_sin(z));
}

vec2 c_sec(vec2 z) {
	return c_div(one, c_cos(z));
}

vec2 c_cot(vec2 z) {
	return c_div(c_cos(z), c_sin(z));
}

vec2 c_arcsin(vec2 z) {
	return c_mul(i, c_ln(c_sqrt(one - c_mul(z,z)) - c_mul(i, z)));
}

vec2 c_arccos(vec2 z) {
	return c_mul(i, c_ln(z - c_mul(i, c_sqrt(one - c_mul(z,z)))));
}

vec2 c_arctan(vec2 z) {
	return c_mul(-i/2., c_ln(c_div(one + c_mul(i, z), one - c_mul(i,z))));
}

vec2 c_arccot(vec2 z) {
	return c_mul(-i/2., c_ln(c_div(c_mul(i, z) - one, c_mul(i,z) + one)));
}

vec2 c_arcsec(vec2 z) {
	return c_mul(i, c_ln(c_div(one, z) - c_mul(i, c_sqrt(one - c_div(one, c_mul(z,z))))));
}

vec2 c_arccsc(vec2 z) {
	return c_mul(i, c_ln(c_sqrt(one - c_div(one, c_mul(z,z))) - c_div(i, z)));
}

vec2 c_arg(vec2 z) {
	return vec2(atan(z.y,z.x), 0.);
}

vec2 c_lanczos(vec2 z) {
  vec2 g = vec2(7., 0.);
  // float n = vec2(9., 0.);
  vec2 p[9];
  p[0] = vec2(0.99999999999980993, 0.);
  p[1] = vec2(676.5203681218851, 0.);
  p[2] = vec2(-1259.1392167224028, 0.);
  p[3] = vec2(771.32342877765313, 0.);
  p[4] = vec2(-176.61502916214059, 0.);
  p[5] = vec2(12.507343278686905, 0.);
  p[6] = vec2(-0.13857109526572012, 0.);
  p[7] = vec2(9.9843695780195716e-6, 0.);
  p[8] = vec2(1.5056327351493116e-7, 0.);

  z -= one;
  vec2 x = p[0];
  for (int j = 1; j < 9; j += 1) {
    x += c_div(p[j], z + vec2(float(j), 0.));
  }
  vec2 t = z + g + one/2.;
  return 2.50662827 * c_mul(c_mul(c_pow(t, z + one/2.), c_exp(-t)), x);
}

vec2 c_gamma(vec2 z) {
  if (z.x < 0.5) {
    return c_div(pi, c_mul(c_sin(c_mul(pi, z)), c_lanczos(one - z)));
  }
  else return c_lanczos(z);
}

vec2 c_factorial(vec2 z) {
  return c_gamma(z + one);
}`;