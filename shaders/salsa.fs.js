/* Variables */
uniform sampler2D uSampler;
uniform sampler2D kSampler;
uniform int round;
uniform float part;
varying vec2 vTextCoord;
float start;

vec4 _(in float offset) {
	 float loc = start + offset;
    vec2 coordinate = vec2(floor(mod(loc, float(TEXTURE_SIZE))), floor(loc/float(TEXTURE_SIZE)));
    return texture2D(uSampler, coordinate / float(TEXTURE_SIZE));
}

vec2 fromRGBA(vec4 rgba) {
    rgba = floor(rgba*e255);
    float x = ((rgba.r * 256.) + rgba.g);
    float y = ((rgba.b * 256.) + rgba.a);
    return vec2(x, y);
}

vec2 e(in float offset) {
    return fromRGBA(_(offset));
}

vec2 f(in float me, in float one, in float two, in float pow, in bool flip) {
    vec2 sum = safe_add(e(one), e(two));
    if( flip ) {
        sum = sum.yx;
    }
    return xor(e(me), rotr(sum, pow));
}

vec2 f(in float me, in float one, in float two, in float pow) {
    return f(me, one, two, pow, true);
}


void main () {
    vec4 c = floor(gl_FragCoord);
    int position = int(c.y) * TEXTURE_SIZE + int(c.x);
    int offset = int(mod(float(position), F_BLOCK_SIZE)+0.5);
 	
    if (offset >= TMP_SCRYPT_X_OFFSET && offset < TMP_SCRYPT_X_OFFSET + 16) {
  	     int block = position / BLOCK_SIZE;	
        start = float(block * BLOCK_SIZE + TMP_SCRYPT_X_OFFSET);
        float o = float(offset - TMP_SCRYPT_X_OFFSET);

        vec4 point = floor(texture2D(kSampler, vec2(o/16.,part/2.))*e255);
        if (int(point.g) == round && round == 1) {
            gl_FragColor = toRGBA(f(o, point.b, point.a, POW_2_09));
        } else if (int(point.g) == round && round == 2) {
            gl_FragColor = toRGBA(f(o, point.b, point.a, POW_2_07));
        } else if (int(point.g) == round && round == 3) {
           gl_FragColor = toRGBA(f(o, point.b, point.a, POW_2_03));
        } else if (int(point.g) == round && round == 4) {
            gl_FragColor = toRGBA(f(o, point.b, point.a, POW_2_14, false));
        } else {
            gl_FragColor = texture2D(uSampler, vTextCoord.st);
        }
    } else {
        gl_FragColor = texture2D(uSampler, vTextCoord.st);
    }
}
