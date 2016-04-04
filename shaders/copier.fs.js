#define COPY_MODE   1
#define SUM_MODE    2
#define XOR_MODE    3
#define VALUE_MODE  4
#define HWORK_MODE  5
#define REVERT_MODE 6
#define SCRYPT_MODE 7

/* Variables */
uniform sampler2D uSampler;
varying vec2 vTextCoord;

uniform int source;
uniform int destination;
uniform int len;
uniform int mode;
uniform vec2 val;

int start;

vec2 fromRGBA(in vec4 rgba) {
    rgba = floor(rgba*e255);
    float x = ((rgba.r * 256.) + rgba.g);
    float y = ((rgba.b * 256.) + rgba.a);
    return vec2(x, y);
}

vec4 _(in int offset) {
	 float loc = float(start+offset);
    vec2 coordinate = vec2(floor(mod(loc, float(TEXTURE_SIZE))), floor(loc/float(TEXTURE_SIZE)));
    return texture2D(uSampler, coordinate / float(TEXTURE_SIZE));
}

vec2 e(in int offset) {
    return fromRGBA(_(offset));
}

void main () {
    vec4 c = floor(gl_FragCoord);
    int position = int(c.y) * TEXTURE_SIZE + int(c.x);
    int offset = int(mod(float(position), F_BLOCK_SIZE)+0.5);
    int block = position / BLOCK_SIZE;

    start = block * BLOCK_SIZE;
    int o = offset - destination;
	 
    if (offset >= destination && offset < destination + len) {
        if ( mode == SUM_MODE ) {
            gl_FragColor = toRGBA(safe_add(e(offset), e(source + o)));
        } else if ( mode == XOR_MODE ) {
            gl_FragColor = toRGBA(xor(e(offset), e(source + o)));
        } else if ( mode == VALUE_MODE ) {
            gl_FragColor = toRGBA(val);
        } else if ( mode == REVERT_MODE ) {
            gl_FragColor = _(source + o).abgr;
        } else if ( mode == SCRYPT_MODE ) {
            int k = int(and16(e(destination + 16).y, 1023.)+0.5) * 32;
//            int k = int(fract(e(destination+16).y/1024.)*1024. + 0.5) * 32;
            gl_FragColor = toRGBA(xor(e(offset), e(source + k + o)));
        } else {
            gl_FragColor = _(source + o);
        }
    } else if (mode == HWORK_MODE && offset < destination + 16) {
        if (offset == destination + len) {
            gl_FragColor = toRGBA(vec2(32768., 0.)); //last bit
        } else if (offset == destination + 15) {
            gl_FragColor = toRGBA(val); //bits length
        } else {
            gl_FragColor = vec4(0.);
        }
    } else {
        gl_FragColor = texture2D(uSampler, vTextCoord.st);
    }
}
