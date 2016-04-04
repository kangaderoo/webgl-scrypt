/* Math functions */
/* Note: shift should be a power of two, e.g. to shift 3 steps, use 2^3. */
vec2 sftr (in vec2 a, in float shift)
{
    vec2 ret = a / shift;
    ret = vec2(floor (ret.x), floor(ret.y) + fract(ret.x) * float(Ox10000));
    return ret;
}


vec2 blend (in vec2 m16, in vec2 m15, in vec2 m07, in vec2 m02)
{
    vec2 s0 = xor (rotr (m15   , POW_2_07), xor (rotr (m15.yx, POW_2_02), sftr (m15, POW_2_03)));
    vec2 s1 = xor (rotr (m02.yx, POW_2_01), xor (rotr (m02.yx, POW_2_03), sftr (m02, POW_2_10)));
    return safe_add (safe_add (m16, s0), safe_add (m07, s1));
}

/* Variables */
uniform sampler2D uSampler;
varying vec2 vTextCoord;

uniform int round;

//Start position for work block in texture
int start;
// Round offset related to the block offset
int inBlockOffset;
//Work array
vec2 w[2];

vec4 _(in int offset) {
	 float loc = float(start+offset);
    vec2 coordinate = vec2(floor(mod(loc, float(TEXTURE_SIZE))), floor(loc/float(TEXTURE_SIZE)));
    return texture2D(uSampler, coordinate / float(TEXTURE_SIZE));
}

vec2 e(in int offset) {
    vec4 rgba = floor(_(offset + inBlockOffset)*e255);
    float x = ((rgba.r * 256.) + rgba.g);
    float y = ((rgba.b * 256.) + rgba.a);
    return vec2(x, y);
}

#define PREDEFINED_BLOCKS 16
#define WORKS_PER_ROUND 2

void main () {
    vec4 c = floor(gl_FragCoord);
    int position = int(c.y) * TEXTURE_SIZE + int(c.x);
    int offset = int(mod(float(position), float(BLOCK_SIZE))+0.5);
    int block = position / BLOCK_SIZE;

    inBlockOffset = PREDEFINED_BLOCKS + (round * WORKS_PER_ROUND);
    if ( offset >= (TMP_WORK_OFFSET + inBlockOffset) && offset < (TMP_WORK_OFFSET + inBlockOffset + WORKS_PER_ROUND)) {
        start = block * BLOCK_SIZE + TMP_WORK_OFFSET;

        w[0] = blend(e(-16), e(-15), e(-7), e(-2));
        w[1] = blend(e(-15), e(-14), e(-6), e(-1));

        for (int i = 0; i < WORKS_PER_ROUND; i++ ) {
            if ( offset == (TMP_WORK_OFFSET + inBlockOffset + i)) {
                gl_FragColor = toRGBA(w[i]);
                break;
            }
        }
    } else {
        gl_FragColor = texture2D(uSampler, vTextCoord.st);
    }
}
