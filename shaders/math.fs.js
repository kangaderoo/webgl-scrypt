
/* Note: shift should be a power of two, e.g. to rotate 3 steps, use 2^3. */
vec2 rotr (in vec2 a, in float shift)
{
    vec2 ret = a / shift;
    ret = floor(ret) + floor(fract(ret.yx) * eOx10000);
    return ret;
}


vec2 safe_add (in vec2 a, in vec2 b)
{
    vec2 ret = a + b;
    if (ret.y >= Ox10000) {
        ret += vec2(1.0, -Ox10000);
    }
    if (ret.x >= Ox10000) {
        ret.x -= Ox10000;
    }
    return ret;
}

float and16 (in float a, in float b)
{
	float ret = OxZERO;
	float fact = Ox8000;
   const int maxi = 16;
   float j = OxZERO;

	for (int i=0; i < maxi; i++)
	{
      if (min(a, b) >= fact)
         ret += fact;

      if (a >= fact) a -= fact;
      if (b >= fact) b -= fact;
     fact /= 2.0;
	}
	return ret;
}

vec2 and_old(in vec2 a, in vec2 b)
{
      return vec2 (and16 (a.x, b.x), and16 (a.y, b.y));
}


vec2 and(in vec2 a, in vec2 b)
{ 
   vec4 calc_a;
   vec4 calc_b;
   float pwr=1.0;
   vec2 ret = vec2(OxZERO);
   const int maxi = 4;

	for (int i=0; i< maxi; i++){
		a = a/16.0;
		b = b/16.0;
		calc_a = bin_encode * fract(a.x);
		calc_b = bin_encode * fract(b.x);
		calc_a = mod(calc_a, 2.0);
		calc_b = mod(calc_b, 2.0);
		calc_a = floor(calc_a);
		calc_b = floor(calc_b);
		calc_a = calc_a * calc_b;
		ret.x += pwr*dot(calc_a,bin_recode); 
		calc_a = bin_encode * fract(a.y);
		calc_b = bin_encode * fract(b.y);
		calc_a = mod(calc_a, 2.0);
		calc_b = mod(calc_b, 2.0);
		calc_a = floor(calc_a);
		calc_b = floor(calc_b);
		calc_a = calc_a * calc_b;
		ret.y += pwr*dot(calc_a,bin_recode);
		pwr = pwr * 16.0;
	}	
   return ret;
}

float xor16 (in float a, in float b)
{
    float ret = OxZERO;
    float fact = Ox8000;
    const int maxi = 16;

    for (int i=0; i < maxi; i++)
    {
	  
        if ((max(a,b) >= fact) && (min(a,b) < fact))
            ret += fact;

        if (a >= fact) a -= fact;
        if (b >= fact) b -= fact;

        fact /= 2.0;
    }
    
	 return ret;
}

vec2 xor_old(in vec2 a, in vec2 b)
{
        return vec2 (xor16 (a.x, b.x), xor16 (a.y, b.y));
}

vec2 xor(in vec2 a, in vec2 b)
{
   vec4 calc_a;
   vec4 calc_b;
   float pwr = 1.0;
   vec2 ret = vec2(OxZERO);
   const int maxi = 4;

	for (int i=0; i< maxi; i++){
		a /= 16.0;
		b /= 16.0;
		calc_a = bin_encode * fract(a.x);
		calc_b = bin_encode * fract(b.x);
		calc_a = mod(calc_a, 2.0);
		calc_b = mod(calc_b, 2.0);
		calc_a = floor(calc_a);
		calc_b = floor(calc_b);
		calc_a += calc_b;
		calc_a = mod(calc_a,2.0);
		ret.x += pwr*dot(calc_a,bin_recode); 
		calc_a = bin_encode * fract(a.y);
		calc_b = bin_encode * fract(b.y);
		calc_a = mod(calc_a, 2.0);
		calc_b = mod(calc_b, 2.0);
		calc_a = floor(calc_a);
		calc_b = floor(calc_b);
		calc_a += calc_b;
		calc_a = mod(calc_a,2.0);
		ret.y += pwr*dot(calc_a,bin_recode);
		pwr *= 16.0;
	}
   return ret;
}