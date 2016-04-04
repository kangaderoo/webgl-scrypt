var t = 0, r = 0;

/* SHA-256 related stuff */
var h =  [0x6a09, 0xe667, 0xbb67, 0xae85,
          0x3c6e, 0xf372, 0xa54f, 0xf53a,
          0x510e, 0x527f, 0x9b05, 0x688c,
          0x1f83, 0xd9ab, 0x5be0, 0xcd19];

var k = new Uint8Array([
          0x42, 0x8a, 0x2f, 0x98, 0x71, 0x37, 0x44, 0x91,
          0xb5, 0xc0, 0xfb, 0xcf, 0xe9, 0xb5, 0xdb, 0xa5,
          0x39, 0x56, 0xc2, 0x5b, 0x59, 0xf1, 0x11, 0xf1,
          0x92, 0x3f, 0x82, 0xa4, 0xab, 0x1c, 0x5e, 0xd5,
          0xd8, 0x07, 0xaa, 0x98, 0x12, 0x83, 0x5b, 0x01,
          0x24, 0x31, 0x85, 0xbe, 0x55, 0x0c, 0x7d, 0xc3,
          0x72, 0xbe, 0x5d, 0x74, 0x80, 0xde, 0xb1, 0xfe,
          0x9b, 0xdc, 0x06, 0xa7, 0xc1, 0x9b, 0xf1, 0x74,
          0xe4, 0x9b, 0x69, 0xc1, 0xef, 0xbe, 0x47, 0x86,
          0x0f, 0xc1, 0x9d, 0xc6, 0x24, 0x0c, 0xa1, 0xcc,
          0x2d, 0xe9, 0x2c, 0x6f, 0x4a, 0x74, 0x84, 0xaa,
          0x5c, 0xb0, 0xa9, 0xdc, 0x76, 0xf9, 0x88, 0xda,
          0x98, 0x3e, 0x51, 0x52, 0xa8, 0x31, 0xc6, 0x6d,
          0xb0, 0x03, 0x27, 0xc8, 0xbf, 0x59, 0x7f, 0xc7,
          0xc6, 0xe0, 0x0b, 0xf3, 0xd5, 0xa7, 0x91, 0x47,
          0x06, 0xca, 0x63, 0x51, 0x14, 0x29, 0x29, 0x67,
          0x27, 0xb7, 0x0a, 0x85, 0x2e, 0x1b, 0x21, 0x38,
          0x4d, 0x2c, 0x6d, 0xfc, 0x53, 0x38, 0x0d, 0x13,
          0x65, 0x0a, 0x73, 0x54, 0x76, 0x6a, 0x0a, 0xbb,
          0x81, 0xc2, 0xc9, 0x2e, 0x92, 0x72, 0x2c, 0x85,
          0xa2, 0xbf, 0xe8, 0xa1, 0xa8, 0x1a, 0x66, 0x4b,
          0xc2, 0x4b, 0x8b, 0x70, 0xc7, 0x6c, 0x51, 0xa3,
          0xd1, 0x92, 0xe8, 0x19, 0xd6, 0x99, 0x06, 0x24,
          0xf4, 0x0e, 0x35, 0x85, 0x10, 0x6a, 0xa0, 0x70,
          0x19, 0xa4, 0xc1, 0x16, 0x1e, 0x37, 0x6c, 0x08,
          0x27, 0x48, 0x77, 0x4c, 0x34, 0xb0, 0xbc, 0xb5,
          0x39, 0x1c, 0x0c, 0xb3, 0x4e, 0xd8, 0xaa, 0x4a,
          0x5b, 0x9c, 0xca, 0x4f, 0x68, 0x2e, 0x6f, 0xf3,
          0x74, 0x8f, 0x82, 0xee, 0x78, 0xa5, 0x63, 0x6f,
          0x84, 0xc8, 0x78, 0x14, 0x8c, 0xc7, 0x02, 0x08,
          0x90, 0xbe, 0xff, 0xfa, 0xa4, 0x50, 0x6c, 0xeb,
          0xbe, 0xf9, 0xa3, 0xf7, 0xc6, 0x71, 0x78, 0xf2
]);

//Pixels
var salsa = new Uint8Array([
        //First part
        0, 4, 12, 8,     0, 3, 13, 9,
        0, 2, 14, 10,    0, 1, 15, 11,
        0, 1, 0,  12,    0, 4, 1,  13,
        0, 3, 2,  14,    0, 2, 3,  15,
        0, 2, 4,  0,     0, 1, 5,  1,
        0, 4, 6,  2,     0, 3, 7,  3,
        0, 3, 8,  4,     0, 2, 9,  5,
        0, 1, 10, 6,     0, 4, 11, 7,
        //Second part
        0, 4, 3,  2,     0, 1, 0,  3,
        0, 2, 1,  0,     0, 3, 2,  1,
        0, 3, 7,  6,     0, 4, 4,  7,
        0, 1, 5,  4,     0, 2, 6,  5,
        0, 2, 11, 10,    0, 3, 8,  11,
        0, 4, 9,  8,     0, 1, 10, 9,
        0, 1, 15, 14,    0, 2, 12, 15,
        0, 3, 13, 12,    0, 4, 14, 13
]);

var gl;
var _ = {
    buffers: {},
    framebuffers: {},
    textures: {},
    programs: {},

    COPY_MODE:   1,
    SUM_MODE:    2,
    XOR_MODE:    3,
    VALUE_MODE:  4,
    HWORK_MODE:  5,
    REVERT_MODE: 6,
    SCRYPT_MODE: 7,

    BLOCK_SIZE: 33012,
    TEXTURE_SIZE: textureSize,

    TMP_HASH_OFFSET:        0,
    TMP_WORK_OFFSET:        8,
    NONCED_HEADER_OFFSET:   72,
    HEADER_HASH1_OFFSET:    92,
    PADDED_HEADER_OFFSET:   100,
    IKEY_OFFSET:            116,
    OKEY_OFFSET:            132,
    HMAC_KEY_HASH_OFFSET:   148,
    IKEY_HASH1_OFFSET:      156,
    OKEY_HASH1_OFFSET:      164,
    INITIAL_HASH_OFFSET:    172,
    TEMP_HASH_OFFSET:       180,
    FINAL_SCRYPT_OFFSET:    188,
    TMP_SCRYPT_X_OFFSET:    196,
    SCRYPT_X_OFFSET:        212,
    SCRYPT_V_OFFSET:        244
}

_.BLOCKS_PER_TEXTURE = Math.floor(_.TEXTURE_SIZE*_.TEXTURE_SIZE/_.BLOCK_SIZE);
_.SUBPIXEL = 1 / _.TEXTURE_SIZE; //Size of 0.5 pixel in float

function loadResource(n) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", n, false);
    xhr.send(null);
    var x = xhr.responseText;
    return x;
};

function initGL() {
    canvas = document.createElement('canvas');
    if (debug || true) document.body.appendChild(canvas)
    canvas.height = textureSize;
    canvas.width = textureSize;

    var names = [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ];

    for(var i in names) {
        try {
            gl = canvas.getContext(names[i], {
                preserveDrawingBuffer: true,
                antialias            : false,
            });
            if (gl) { break; }
        } catch (e) { }
    }

    if (!gl) {
        throw "Your browser doesn't support WebGL";
    }

    gl.clearColor ( 1.0, 1.0, 1.0, 1.0 );
    gl.clear ( gl.COLOR_BUFFER_BIT );
    gl.viewport(0, 0, canvas.width, canvas.height);

    _.context = gl;
}

function establishProgram(vertex_shader, fragment_shader) {
//     console.log(vertex_shader);
//     console.log(fragment_shader);
     var program = gl.createProgram(),
        vShader = gl.createShader(gl.VERTEX_SHADER),
        vShaderSource = loadResource(vertex_shader),
        fShader = gl.createShader(gl.FRAGMENT_SHADER),
        fShaderSource = loadResource(fragment_shader);
        fPrependShaderSource = loadResource("shaders/prepend.fs.js").replace('%%TEXTURE_SIZE%%', _.TEXTURE_SIZE);
        fMathShaderSource = loadResource("shaders/math.fs.js");

    gl.shaderSource(vShader, vShaderSource);
    gl.compileShader(vShader);
   if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(vShader);
    }
    gl.attachShader(program, vShader);

    gl.shaderSource(fShader, [fPrependShaderSource, fMathShaderSource, fShaderSource].join("\n"));
    gl.compileShader(fShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
        throw gl.getShaderInfoLog(fShader);
    }
    gl.attachShader(program, fShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw gl.getProgramInfoLog(program);
    }

    return program;
}

function initFramebuffers() {
    _.framebuffers.primary   = gl.createFramebuffer();
    _.framebuffers.secondary = gl.createFramebuffer();
}

function initTextures() {
    _.textures.salsa = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, _.textures.salsa);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, salsa);

    _.textures.K = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, _.textures.K);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, k);

    //Init two texture for ping ponging
    /* First texture */
    _.textures.primary = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, _.textures.primary);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, _.framebuffers.primary);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _.textures.primary, 0);

    /* Second texture */
    _.textures.secondary = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, _.textures.secondary);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureSize, textureSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, _.framebuffers.secondary);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _.textures.secondary, 0);

    gl.activeTexture(gl.TEXTURE0);

    (function() {
        var pingpong = false;
        _.textures.swap = function() {
            t++;
            if ( pingpong ) {
                _.textures.setPrimary();
            } else {
                _.textures.setSecondary();
            }
        }
        _.textures.setPrimary = function() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, _.framebuffers.secondary);
            gl.bindTexture(gl.TEXTURE_2D, _.textures.primary);

            pingpong = false;
        }

        _.textures.setSecondary = function() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, _.framebuffers.primary);
            gl.bindTexture(gl.TEXTURE_2D, _.textures.secondary);

            pingpong = true;
        }
    })();

    /* revert all to default */
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

/* Normalize function
* Converts from pixels coordinates to normalized float from -1 to 1
* The input of this function is actual pixels [0- TEXTURE_SIZE-1] for both X and Y.
* It needs to be normalised to [-1,1] ... but the pixels should have a offset of 0.5 pixel.
*/
function _normalize(points) {
    for(var i in points) {
        var x = points[i],
            nX = x / (_.TEXTURE_SIZE - 1),
            normalized = (nX * 2) - 1;            

        var pixelCorrection = _.SUBPIXEL * normalized;
  	     normalized -= pixelCorrection;

        points[i] = normalized;
    }
    return new Float32Array(points);
}

/*
* Select what to render.
* the canvas must be seen a shared memory, with the origin bottom left.
* if the whole canvas needs to be rendered it will be done using triangles.
* If only a selection needs to be rendered, as is usually the case when the canvas is used as memory
* It will be done in lines.
* Each line requires 4 elementes (xstart, ystart, xstop, ystop).
*/

function whatToRender(offset, length) {
    if(offset == "whole") {
        _.buffers.mode = gl.TRIANGLE_STRIP;
        _.buffers.size = 4;

        gl.bindBuffer(gl.ARRAY_BUFFER, _.buffers.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            1,  1,
           -1,  1,
            1, -1,
           -1, -1
        ]), gl.STATIC_DRAW);
    } else {
        var points = [];
        for(var i = 0; i < _.BLOCKS_PER_TEXTURE; i++) {
            var total = (i*_.BLOCK_SIZE)+offset;

            var start_height = Math.floor(total / _.TEXTURE_SIZE),
                start_width  = total % _.TEXTURE_SIZE,
                end_height   = Math.floor((total + length) / _.TEXTURE_SIZE);
                end_width    = (total + length) % _.TEXTURE_SIZE;

            //Start line point
            points.push(start_width);
            points.push(start_height);

            //If the end point on the same height
            if (start_height == end_height) {
                points.push(end_width);
                points.push(start_height);
            } else {
                //Add start height to the end of texture
                points.push(_.TEXTURE_SIZE);
                points.push(start_height);

                start_height++;

                //Fill all lines before end_height
                while(start_height < end_height) {
                    points.push(0);
                    points.push(start_height);
                    points.push(_.TEXTURE_SIZE);
                    points.push(start_height);

                    start_height++;
                }

                //Fill the line until end_with and end_height
                points.push(0);
                points.push(start_height);
                points.push(end_width);
                points.push(start_height);
            }
        }

        _.buffers.size = points.length / 2;
        _.buffers.mode = gl.LINES;

        gl.bindBuffer(gl.ARRAY_BUFFER, _.buffers.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, _normalize(points), gl.STATIC_DRAW);
    }
}

function initBuffers() {
    _.buffers.vertices = gl.createBuffer();
}

function initPrograms() {
    initSHA256Program();
    fillSHA256workProgram();
    computeSHA256Program();
    copierProgram();
    salsaProgram();
    textureCopyProgram();
}

/**
* Shader fills 8 initial hash words (32 bytes) with initial values from H array
* And fills 16 predefined work elements
*/
function initSHA256Program () {
    var locations = {};
    return program("init-sha256", "shaders/init-sha256-fs.js", function(program) {
        locations = {
            H:       gl.getUniformLocation(program, "H"),
            header:  gl.getUniformLocation(program, "header"),
            nonce:   gl.getUniformLocation(program, "base_nonce")
        };
        return locations;
    }, function(header, nonce) {
        gl.uniform2fv(locations.header, header);
        gl.uniform2f(locations.nonce, nonce[0], nonce[1]);
    }, function() {
        gl.uniform2fv(locations.H, h);
    });
}

/**
* Shader uses 2 rounds to fill 64*4 bytes array with work.
* Call this shader 24 times (24*2 = 48 without 16 predefined elements) with rounds 0..24
*/
function fillSHA256workProgram() {
    var locations = {};
    return program("fill-sha256-work", "shaders/fill-sha256-work.fs.js", function(program) {
        locations = {
            round: gl.getUniformLocation(program, "round"),
            sampler: gl.getUniformLocation(program, "uSampler")
        };
        return locations;
    }, function(round) {
        gl.uniform1i(locations.round, round);
    }, function() {
        gl.uniform1i(locations.sampler, 0);
    });
}
/**
* Shader uses 2 rounds to execute main SHA256 computation
* Call this shader 32 times (32*2 = 64 total rounds) with rounds 0..31
*/
function computeSHA256Program() {
    var locations = {};
    return program("compute-sha256", "shaders/compute-sha256.fs.js", function(program) {
        locations = {
            round: gl.getUniformLocation(program, "round"),
            sampler: gl.getUniformLocation(program, "uSampler"),
            kSampler: gl.getUniformLocation(program, "kSampler")
        };
        return locations;
    }, function(round) {
        gl.uniform1i(locations.round, round);
    }, function() {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, _.textures.K);
        gl.activeTexture(gl.TEXTURE0);

        gl.uniform1i(locations.sampler, 0);
        gl.uniform1i(locations.kSampler, 1);
    });
}

/**
* Shader copies N pixels from one source to the destination
*
* @arg source      Source offset
* @arg destination Destination offset
* @arg length      Length of pixels to copy
* @arg mode        Copy mode:
*       COPY_MODE  - Just copy pixels from src to dst
*       SUM_MODE   - Sum src and dst pixel and write to dst
*       XOR_MODE   - xor src and dst pixel and write to dst
*       VALUE_MODE - Set dst pixel with passed value
*       HWORK_MODE - hash finalization mode
*                       Copies length pixels from source, adds last bit
*                       and bits length in the end.
*                       Set bits length in VALUE uniform
*       REVERT_MODE  The same mode as COPY_MODE, but result value will convert
*                       Biggest byte becomes littest and vice versa
*       SCRYPT_MODE  Specific for scrypt mode. Find the correct offset in V array
*                       and xor it with X array
* @arg value       Value used in VALUE_MODE
* src_offset, dst_offset, length and mode flag
*/
function copierProgram() {
    var locations = {};
    return program("copier", "shaders/copier.fs.js", function(program) {
        locations = {
            source:      gl.getUniformLocation(program, "source"),
            destination: gl.getUniformLocation(program, "destination"),
            len:         gl.getUniformLocation(program, "len"),
            mode:        gl.getUniformLocation(program, "mode"),
            val:         gl.getUniformLocation(program, "val"),
            sampler:     gl.getUniformLocation(program, "uSampler"),
        };
        return locations;
    }, function(src, dst, len, mode, val) {
        gl.uniform1i(locations.source, src);
        gl.uniform1i(locations.destination, dst);
        gl.uniform1i(locations.len, len);
        gl.uniform1i(locations.mode, mode);
        if( mode == _.VALUE_MODE ) {
            gl.uniform2f(locations.val, val[0], val[1]);
        }
        if( mode == _.HWORK_MODE ) {
            gl.uniform2f(locations.val, 0, val);
        }
    }, function() {
        gl.uniform1i(locations.sampler, 0);
    });
}

/**
* Easiest shader that copies input texture to framebuffer
*/
function textureCopyProgram() {
    var locations = {};
    return program("texture-copy", "shaders/texture-copy.fs.js", function(program) {
        locations = {
            sampler:     gl.getUniformLocation(program, "uSampler")
        };
        return locations;
    }, function() {
    }, function() {
        gl.uniform1i(locations.sampler, 0);
    });
}

/*
* Salsa shader to compute the salsa
* Due the complexity and unposibility to parallelism
* You have to call it 8 times per round. 4 rounds at all
*
* @arg part    Should be 0 or 1
* @arg round   Round from 0 to 3
*/
function salsaProgram() {
    var locations = {};
    return program("salsa", "shaders/salsa.fs.js", function(program) {
        locations = {
            round:       gl.getUniformLocation(program, "round"),
            part:        gl.getUniformLocation(program, "part"),
            sampler:     gl.getUniformLocation(program, "uSampler"),
            kSampler:    gl.getUniformLocation(program, "kSampler")
        };
        return locations;
    }, function(part, round) {
        gl.uniform1f(locations.part, part);
        gl.uniform1i(locations.round, round+1);
    }, function() {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, _.textures.salsa);
        gl.activeTexture(gl.TEXTURE0);

        gl.uniform1i(locations.sampler, 0);
        gl.uniform1i(locations.kSampler, 1);
    });
}


function program(name, fragment_code, locations, render, init) {
    var program = establishProgram("shaders/default-vs.js", fragment_code);

    var locations = locations(program);
    var attributes = {
        position: gl.getAttribLocation(program, "aPosition")
    }

    var ret = {
        P: program,
        L: locations,
        A: attributes,
        use: function() {
            gl.useProgram(program);

            gl.enableVertexAttribArray(attributes.position);
            gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);

            init();

            _.programs.active = name;

            return ret;
        },
        render: function() {
            if (_.programs.active != name) {
                ret.use();
            }
            r++;

            render.apply(this, Array.prototype.slice.call(arguments, 0));

            gl.drawArrays(_.buffers.mode, 0, _.buffers.size);
        }
    };
    _.programs[name] = ret;
    return ret;
}

function printBuffer(buf, length) {
    var result = [];
    for(var i = 0; i < length*4; i+=2) {
        result.push((buf[i]*256) + buf[i+1]);
    }
    return ___.uint16_array_to_hex(result);
}

function match(name, expected, actual) {
    if ( expected == actual) {
        console.log(name + " match");
    } else {
        console.log(name + " mismatch");
        console.log("Actual: ");
        console.log(actual);
        console.log("Expected: ");
        console.log(expected);
    }
}

/*
* Function to calculate sha256
* @target      Target offset. Computed hash will be copied there
* @dont_copy   Flag to set initial hash copying.
*               Set to true if initial hash is already set
*
* First 16 words should be already copied into sha256 work array
*/
function sha256_round(target, dont_copy) {
    /* Compute and fill work elements */

    /* Fill work arrays */
    whatToRender(_.TMP_WORK_OFFSET + 16, 48);
    for(var i = 0; i < 24; i++) {
        _.textures.swap();
        _.programs['fill-sha256-work'].render(i);
    }
    _.textures.swap();
    _.programs['texture-copy'].render();

    /* Compute the hash */
    whatToRender(_.TMP_HASH_OFFSET, 8);
    if (!dont_copy) {
        //Copy initial hash
        _.textures.swap();
        _.programs['copier'].render(target, _.TMP_HASH_OFFSET, 8, _.COPY_MODE);
    }
    for(var i = 0; i < 8; i++) {
        _.textures.swap();
        _.programs['compute-sha256'].render(i);
    }

    /* Copy the result to target block */
    whatToRender(target, 8);
    _.textures.swap();
    _.programs['copier'].render(_.TMP_HASH_OFFSET, target, 8, _.SUM_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();
}

function PBKDF2_SHA256_80_128() {
    for( var i = 0; i < 4; i++ ) {
        /* TODO: iKey || Header round 1 is always the same */
        whatToRender(_.TMP_WORK_OFFSET, 16);
        _.textures.swap();
        _.programs['copier'].render(_.NONCED_HEADER_OFFSET, _.TMP_WORK_OFFSET, 16);
        _.textures.swap();
        _.programs['texture-copy'].render();

        whatToRender(_.TEMP_HASH_OFFSET, 8);
        _.textures.swap();
        _.programs['copier'].render(_.IKEY_HASH1_OFFSET, _.TEMP_HASH_OFFSET, 8);
        _.textures.swap();
        _.programs['texture-copy'].render();
        sha256_round(_.TEMP_HASH_OFFSET);

        /* iKey || Header+i final hash */
        whatToRender(_.TMP_WORK_OFFSET, 16);
        _.textures.swap();
        _.programs['copier'].render(_.NONCED_HEADER_OFFSET + 16, _.TMP_WORK_OFFSET, 5, _.HWORK_MODE, 1184);
        _.textures.swap();
        _.programs['copier'].render(null, _.TMP_WORK_OFFSET + 4, 1, _.VALUE_MODE, [0, i+1]);
        _.textures.swap();
        _.programs['texture-copy'].render();
        sha256_round(_.TEMP_HASH_OFFSET);

        /* oKey || h(iKey || Header+i) final hash */
        whatToRender(_.TMP_WORK_OFFSET, 16);
        _.textures.swap();
        _.programs['copier'].render(_.TEMP_HASH_OFFSET, _.TMP_WORK_OFFSET, 8, _.HWORK_MODE, 768);
        _.textures.swap();
        _.programs['texture-copy'].render();

        whatToRender(_.TEMP_HASH_OFFSET, 8);
        _.textures.swap();
        _.programs['copier'].render(_.OKEY_HASH1_OFFSET, _.TEMP_HASH_OFFSET, 8);
        _.textures.swap();
        _.programs['texture-copy'].render();
        sha256_round(_.TEMP_HASH_OFFSET);

        whatToRender(_.SCRYPT_X_OFFSET + (i*8), 8);
        _.textures.swap();
        _.programs['copier'].render(_.TEMP_HASH_OFFSET, _.SCRYPT_X_OFFSET + (i*8), 8, _.REVERT_MODE);
        _.textures.swap();
        _.programs['texture-copy'].render();
    }
}

function salsa8(di, xi) {
    /* Xor di 16 words with xi ones*/
    whatToRender(_.SCRYPT_X_OFFSET + di, 16);
    _.textures.swap();
    _.programs['copier'].render(_.SCRYPT_X_OFFSET + xi, _.SCRYPT_X_OFFSET + di, 16, _.XOR_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();

    /* Copy di 16 words to TMP */
    whatToRender(_.TMP_SCRYPT_X_OFFSET, 16);
    _.textures.swap();
    _.programs['copier'].render(_.SCRYPT_X_OFFSET + di, _.TMP_SCRYPT_X_OFFSET, 16, _.COPY_MODE);

    /* Generate salsa8 */
    for (var q = 0; q < 4; q++) { // salsa double rounds
        for (var j = 0; j < 2; j++) { // part
            for (var i = 0; i < 4; i++) { // inner round
                _.textures.swap();
                _.programs['salsa'].render(j, i);
            }
        }
    }

//    whatToRender(_.SCRYPT_X_OFFSET + di, 16);
    whatToRender(_.SCRYPT_X_OFFSET);
    _.textures.swap();
    _.programs['copier'].render(_.TMP_SCRYPT_X_OFFSET, _.SCRYPT_X_OFFSET + di, 16, _.SUM_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();
}

function PBKDF2_SHA256_128_32() {
    //iKey || X round 1
    whatToRender(_.TMP_WORK_OFFSET, 16);
    _.textures.swap();
    _.programs['copier'].render(_.SCRYPT_X_OFFSET, _.TMP_WORK_OFFSET, 16, _.REVERT_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();

    whatToRender(_.TEMP_HASH_OFFSET, 8);
    _.textures.swap();
    _.programs['copier'].render(_.IKEY_HASH1_OFFSET, _.TEMP_HASH_OFFSET, 8);
    _.textures.swap();
    _.programs['texture-copy'].render();
    sha256_round(_.TEMP_HASH_OFFSET);

    //iKey || X round 2
    whatToRender(_.TMP_WORK_OFFSET, 16);
    _.textures.swap();
    _.programs['copier'].render(_.SCRYPT_X_OFFSET + 16, _.TMP_WORK_OFFSET, 16, _.REVERT_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();
    sha256_round(_.TEMP_HASH_OFFSET);


    //iKey || X round 3
    whatToRender(_.TMP_WORK_OFFSET, 16);
    _.textures.swap();
    _.programs['copier'].render(_.SCRYPT_X_OFFSET, _.TMP_WORK_OFFSET, 1, _.HWORK_MODE, 1568);
    _.textures.swap();
    _.programs['copier'].render(null, _.TMP_WORK_OFFSET, 1, _.VALUE_MODE, [0, 1]);
    _.textures.swap();
    _.programs['texture-copy'].render();
    sha256_round(_.TEMP_HASH_OFFSET);

    /* oKey || h(iKey || X) final hash */
    whatToRender(_.TMP_WORK_OFFSET, 16);
    _.textures.swap();
    _.programs['copier'].render(_.TEMP_HASH_OFFSET, _.TMP_WORK_OFFSET, 8, _.HWORK_MODE, 768);
    _.textures.swap();
    _.programs['texture-copy'].render();

    whatToRender(_.TEMP_HASH_OFFSET, 8);
    _.textures.swap();
    _.programs['copier'].render(_.OKEY_HASH1_OFFSET, _.TEMP_HASH_OFFSET, 8);
    _.textures.swap();
    _.programs['texture-copy'].render();
    sha256_round(_.TEMP_HASH_OFFSET);

    whatToRender(_.FINAL_SCRYPT_OFFSET, 8);
    _.textures.swap();
    _.programs['copier'].render(_.TEMP_HASH_OFFSET, _.FINAL_SCRYPT_OFFSET, 8, _.REVERT_MODE);
}

$(function() {
    initGL();
    initBuffers();
    initFramebuffers();
    initTextures();
    initPrograms();


    var buf = new Uint8Array(textureSize * 4);

    console.log("Headers is " + header);
    var header_bin = ___.hex_to_uint16_array(header);

    console.log("Nonce is " + nonce);
    var nonce_bin = ___.hex_to_uint16_array(nonce.toString(16));
//    console.log("Nonce bin is " + nonce_bin);

    var startTime = (new Date()).getTime();

    /* Fill both textures with initial values */
    whatToRender(0, 180); //180
    _.textures.swap();
    _.programs['init-sha256'].render(header_bin.slice(0, 38), nonce_bin);

    _.textures.swap();
    _.programs['texture-copy'].render();

    /* initial tests */
    if (debug) {
        gl.readPixels(_.TMP_HASH_OFFSET, 0, 24, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("Initial round", "6a09e667bb67ae853c6ef372a54ff53a510e527f9b05688c1f83d9ab5be0cd190000000215d71fff666281a9738dfd82d809daaf6b2d7225b165f6a500d46ebe657b2f24c023360cfdfe87f0c8d4fcee516a914d5f425115d552afab4996555d", printBuffer(buf, 24));
        gl.readPixels(_.NONCED_HEADER_OFFSET, 0, 20, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("Nonced header", "0000000215d71fff666281a9738dfd82d809daaf6b2d7225b165f6a500d46ebe657b2f24c023360cfdfe87f0c8d4fcee516a914d5f425115d552afab4996555d69f8a58b53d539f11b02e246fc9b0300", printBuffer(buf, 20));
        gl.readPixels(_.PADDED_HEADER_OFFSET, 0, 16, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("Padded header", "69f8a58b53d539f11b02e246fc9b0300800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000280", printBuffer(buf, 16));
        gl.readPixels(_.IKEY_OFFSET, 0, 32, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("iKey and oKey masks", "363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636365c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c", printBuffer(buf, 32));
        gl.readPixels(_.IKEY_HASH1_OFFSET, 0, 16, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("iKey and oKey initial hashes", "6a09e667bb67ae853c6ef372a54ff53a510e527f9b05688c1f83d9ab5be0cd196a09e667bb67ae853c6ef372a54ff53a510e527f9b05688c1f83d9ab5be0cd19", printBuffer(buf, 16));
    }

    /* check what is in memory */

    sha256_round(_.HEADER_HASH1_OFFSET, true);
    if (debug) {
        gl.readPixels(_.TMP_WORK_OFFSET, 0, 64, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("Extend message", "0000000215d71fff666281a9738dfd82d809daaf6b2d7225b165f6a500d46ebe657b2f24c023360cfdfe87f0c8d4fcee516a914d5f425115d552afab4996555dfda7836bf257dd09d7159fc60c2cc047ceb54e3e598fa7d3719c0520b52e212ca6026ececb8f701a8072d3e222a3fde793badef339103a2de5fada58328b83d1fa812d071525fbe16c63428b1a35f178154b89aed5b8aa142193d90b026cccf843b53cbc99cc6cb409eafb2c36c6fee6e040f1f2172916bd94270f437bb27d1bb930fcd15c37ab099433bc32d851cf55efc806532c89919f64960edff673f87dc7c1965b98f28ad85121158e005490cbf29163b2acb8659fcef680b70d2b3177", printBuffer(buf, 64));
        gl.readPixels(_.HEADER_HASH1_OFFSET, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("Header base hash", "d4d61d6f141d364266999d0dcb42d0f3d618577259648817c9b661580b4ca85d", printBuffer(buf, 8));
        gl.readPixels(_.HEADER_HASH1_OFFSET + _.BLOCK_SIZE, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("Header base(2) hash", "d4d61d6f141d364266999d0dcb42d0f3d618577259648817c9b661580b4ca85d", printBuffer(buf, 8));
    }    


    /* Final round for key hash */
    //Copy first round hash to destination position
    whatToRender(_.HMAC_KEY_HASH_OFFSET, 8);
    _.textures.swap();
    _.programs['copier'].render(_.HEADER_HASH1_OFFSET, _.HMAC_KEY_HASH_OFFSET, 8, _.COPY_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();

    //Copy padded header last part to work arrays
    whatToRender(_.TMP_WORK_OFFSET, 16);
    _.programs['copier'].render(_.PADDED_HEADER_OFFSET, _.TMP_WORK_OFFSET, 16, _.COPY_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();

/* check the copy function */
    if (debug) {
        gl.readPixels(_.HMAC_KEY_HASH_OFFSET, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("hmac work", "d4d61d6f141d364266999d0dcb42d0f3d618577259648817c9b661580b4ca85d", printBuffer(buf, 8));
        gl.readPixels(_.TMP_WORK_OFFSET, 0, 16, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("tmp work offset", "69f8a58b53d539f11b02e246fc9b0300800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000280", printBuffer(buf, 16));
        gl.readPixels(244 + _.TMP_WORK_OFFSET, 32, 16, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("tmp work (2) offset", "69f8a58b53d539f11b02e246fc9b0301800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000280", printBuffer(buf, 16));
    }

    sha256_round(_.HMAC_KEY_HASH_OFFSET);

    if (debug) {
        gl.readPixels(_.HMAC_KEY_HASH_OFFSET, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("HMAC hash", "cdcacb050c7882ec305f3f0fe7ed3fef64b94e7e4e5a7de1f10920e3ac432ee7", printBuffer(buf, 8));
        gl.readPixels(244 +_.HMAC_KEY_HASH_OFFSET, 32, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("HMAC (2) hash", "68d17591b3d1772dabfd9bf048ebe43e04c76cfbc6c077b7fa6bb09fa67ad566", printBuffer(buf, 8));
    }


    whatToRender(_.IKEY_OFFSET, 32);
    /* Create iKey */
    _.textures.swap();
    _.programs['copier'].render(_.HMAC_KEY_HASH_OFFSET, _.IKEY_OFFSET, 8, _.XOR_MODE);

    /* Create oKey */
    _.textures.swap();
    _.programs['copier'].render(_.HMAC_KEY_HASH_OFFSET, _.OKEY_OFFSET, 8, _.XOR_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();

    if (debug) {
        gl.readPixels(_.IKEY_OFFSET, 0, 32, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("iKey/oKey", "fbfcfd333a4eb4da06690939d1db09d9528f7848786c4bd7c73f16d59a7518d13636363636363636363636363636363636363636363636363636363636363636919697595024deb06c036353bbb163b338e51222120621bdad557cbff01f72bb5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c", printBuffer(buf, 32));
    }

    /* Create iKey initial hash */
    whatToRender(_.TMP_WORK_OFFSET, 16);
    _.textures.swap();
    _.programs['copier'].render(_.IKEY_OFFSET, _.TMP_WORK_OFFSET, 16, _.COPY_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();
    sha256_round(_.IKEY_HASH1_OFFSET);
    if (debug) {
        gl.readPixels(_.IKEY_HASH1_OFFSET, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("iKey base hash", "5d52d0fb89dddc536211009112824b29bc744de14a3baad36b653e3a69be1a87", printBuffer(buf, 8));
    }

    /* Create oKey initial hash */
    whatToRender(_.TMP_WORK_OFFSET, 16);
    _.textures.swap();
    _.programs['copier'].render(_.OKEY_OFFSET, _.TMP_WORK_OFFSET, 16, _.COPY_MODE);
    _.textures.swap();
    _.programs['texture-copy'].render();
    sha256_round(_.OKEY_HASH1_OFFSET);
    if (debug) {
        gl.readPixels(_.OKEY_HASH1_OFFSET, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("oKey base hash", "69275eab6dfc79a559fda62ecb0c2d568d5f84108b770b699f809fb07164c3d3", printBuffer(buf, 8));
    }

    PBKDF2_SHA256_80_128();

    if (debug) {
        gl.readPixels(_.SCRYPT_X_OFFSET, 0, 32, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("PBKDF2_SHA256_80_128 X", "e0b2ee81237a5ac5437320030e419227dfd94b8a4697d524c42743237edb7d3d01c2cd6d6bc5d75bd96384193eeaf76be7d2684ce79b20db51c79a8c8c702885f50fa032bf96e1213b2f7e4e685215c63c18fff6a41dd125d2e88c79755dc8775712e340be29f0ad66b0679931dcb857f2c9ee9020c1a997f13013f916286784", printBuffer(buf, 32));
    }

    for(var i = 0; i < 1024; i++) {
        whatToRender(_.SCRYPT_V_OFFSET + (i*32), 32);
        _.textures.swap();
        _.programs['copier'].render(_.SCRYPT_X_OFFSET, _.SCRYPT_V_OFFSET + (i*32), 32, _.COPY_MODE);
        /* TODO avoid this copy operation. Fill V only for one texture */
        _.textures.swap();
        _.programs['texture-copy'].render();

        salsa8(0, 16);
        salsa8(16, 0);
    }

    if (debug) {
        gl.readPixels(_.SCRYPT_X_OFFSET, 0, 32, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("1024 salsa fill rounds", "c1d658b2eba280fa036b9ddbd2161cfb777edca3a8eecd04a34f986254c51f6439727e328eaa3d2192f3455289f6bffd8a6d0e0e347922581af5fd143b9b0c10f1eecf8042d2d6ebb94220a80ab006d69732075b155df2bec49fc4916ff27cb778fc0f110a30c4033e2a02c2ddbe9193372c315877c36ade56f8d12d32f2f33b", printBuffer(buf, 32));

        gl.readPixels(_.SCRYPT_V_OFFSET, 0, 64, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("First 64 words of V", "e0b2ee81237a5ac5437320030e419227dfd94b8a4697d524c42743237edb7d3d01c2cd6d6bc5d75bd96384193eeaf76be7d2684ce79b20db51c79a8c8c702885f50fa032bf96e1213b2f7e4e685215c63c18fff6a41dd125d2e88c79755dc8775712e340be29f0ad66b0679931dcb857f2c9ee9020c1a997f13013f916286784af3acf0d3a6f02f56da8a2300ae8b4d3b35b51bab459a82582569657301c4d74aa02889a5dc59197e760e99baa3521cc6f076b1a73eca71303bdb55a420b3d79acc745e663104b61be8bc7ba00486e682e5eb309b61bbb3858293f7ce12a1f526fc21b7526ba60fb0cdbfdeb4fc8e4503c292e92bf67987d2c6c80f82b4f5de8", printBuffer(buf, 64));

        gl.readPixels(244-64, 32, 64, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("Last 64 words of V", "410c18a4584e376321e37485b92ccdded927d61ab188c50ba8495e45b5fa18b841c8be1a11ef67185cfebfa8fd543f9dbfa41b38e19c566c357701c1cc446721a6da86180209fffdb41af10c4852358ed61d3a2456b636287ffcabafdb0eaa0fd61ca07965fbb6b86906b372ba2802e226e4d9b2883df19430c1d51759b20c09897f07a5f027b8227b413e6da02548be63063fb9bc737b43dcea0b274013b0fa8571643ef3260c72867efb6b59158c2c68e1887c0c685015674ddaf324789062c809ec3f04a260bb33aaa8519689180490a0aa043fc32e189e193470386db0de981f5d6ff1bc37e08d967448800a90f8eb4193c725d2305d4264b6e08950a229", printBuffer(buf, 64));
  
    }

    for(var i = 0; i < 1024; i++) {
        whatToRender(_.SCRYPT_X_OFFSET, 32);
        _.textures.swap();
        _.programs['copier'].render(_.SCRYPT_V_OFFSET, _.SCRYPT_X_OFFSET, 32, _.SCRYPT_MODE);
        _.textures.swap();
        _.programs['texture-copy'].render();

        salsa8(0, 16);
        salsa8(16, 0);

    }

    if (debug) {
        gl.readPixels(_.SCRYPT_X_OFFSET, 0, 32, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("1024 salsa mix rounds", "3cffe0c1d99da5920b4509bff9a5f466f9c705f20c87499662f91451f441ed24ee4ed792e3b66ea5107733009d4b2a5e664e3ce334d5d3cdbaa373eccd0a550e6050007105427ff48a00d6b1646cc5f6b3593282f5634ba21f1059e6c12e8bc9039bd30217b0a411514e7123d87566b7be7455a5eaed5ed102d141eda36bdcb6", printBuffer(buf, 32));
    }

    PBKDF2_SHA256_128_32();

    whatToRender("whole");
    _.textures.swap();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    _.programs['texture-copy'].render();

    gl.readPixels(_.FINAL_SCRYPT_OFFSET, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    match("SCRYPT HASH", "aeb94ea4a527ee1c962befe936f880d0372371aa84c6be561b579729600bf550", printBuffer(buf, 8));
    console.log("Scrypt hash is " + printBuffer(buf, 8));

    if (debug) {
		  /* use 32 for y here if the canvas = 1024 */
		  /* for different canvas, second, third etc block x and y need to be calculated */
        gl.readPixels(244 + _.FINAL_SCRYPT_OFFSET, 32, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("SECOND SCRYPT HASH", "ed0b4a8ab112ec8cdc6ff290e561cf4be9a90f49681f6d3f299f91121f31a1f9", printBuffer(buf, 8));

        gl.readPixels(_.NONCED_HEADER_OFFSET, 0, 20, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("FIRST Nonced header", "0000000215d71fff666281a9738dfd82d809daaf6b2d7225b165f6a500d46ebe657b2f24c023360cfdfe87f0c8d4fcee516a914d5f425115d552afab4996555d69f8a58b53d539f11b02e246fc9b0300", printBuffer(buf, 20));

        gl.readPixels(244 + _.NONCED_HEADER_OFFSET, 32, 20, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        match("SECOND Nonced header", "0000000215d71fff666281a9738dfd82d809daaf6b2d7225b165f6a500d46ebe657b2f24c023360cfdfe87f0c8d4fcee516a914d5f425115d552afab4996555d69f8a58b53d539f11b02e246fc9b0301", printBuffer(buf, 20));
    }
 
    var msecTime = (((new Date()).getTime())-startTime);
    console.log("Running time: " + msecTime + "ms");

    console.log(t + " texture swaps and " + r + " renders");

});
