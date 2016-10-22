document.getElementById("game-surface").addEventListener('contextmenu', function(evt) { 
  evt.preventDefault();
}, false);


function InitDemo () {
	loadTextResource('VS.vert', function(vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('FS.frag', function(fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting vertex shader (see console)');
					console.error(fsErr);
				} else {
					RunDemo(vsText, fsText);
				}
			});
		}
	});
};
var gl;
function RunDemo(vertexShaderText, fragmentShaderText) {
	
	var canvas = document.getElementById('game-surface');
	gl = canvas.getContext('webgl');
	
	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl...');
		gl = canvas.getContext('experimental-webgl');
	}
	
	if (!gl) {
		alert('Your browser does not support WegGL!');
	}
	
	/*canvas.width = windows.innerWidth;
	canvas.height = windows.innerHeight;
	gl.viewport(0, 0, window.innerWidth, windows.innerHeight);*/
	
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	
	//
	// Create shaders
	//
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	
	//
	// buffer
	//
	var squareVertices =
	[ // X, Y, Z
         -1, -1, 0,
          1, -1, 0,
         -1,  1, 0,
          1,  1, 0
	];

	var squareIndices =
	[
        0, 1, 2,
        3, 2, 1
	];
	
	var canvasVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, canvasVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);
	
	var canvasIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, canvasIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareIndices), gl.STATIC_DRAW);
	
	
	
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	initAttribPointer(positionAttribLocation);
	gl.enableVertexAttribArray(positionAttribLocation);
    
    //
    // Defining lights
    //
    var lights = [];
    lights[0] = {col: vec3.fromValues(1.0, 1.0, 1.0), pos: vec3.fromValues(0.0, 0.0, 0.0)};
    lights[1] = {col: vec3.fromValues(1.0, 1.0, 1.0), pos: vec3.fromValues(-2.0, 20.0, 0.0)};
    lights[2] = {col: vec3.fromValues(1.0, 1.0, 1.0), pos: vec3.fromValues(20.0, 20.0, 0.0)};

    //
    // Defining spheres
    //
    var spheres = [];
    spheres[0] = vec4.fromValues(0.0, 0.0, 0.0, 1.4); // Sun
    spheres[1] = vec4.fromValues(0.0, 0.0, 0.0, 0.0); // Green sphere
    spheres[2] = vec4.fromValues(0.0, 0.0, 0.0, 0.0); // Blue sphere
    spheres[3] = vec4.fromValues(0.0, 0.0, 0.0, 0.0); // Earth
    spheres[4] = vec4.fromValues(0.0, 0.0, 0.0, 0.0); // Moon
    
    spheres[5] = vec4.fromValues(lights[1].pos[0], lights[1].pos[1], lights[1].pos[2], 0.05);
    spheres[6] = vec4.fromValues(lights[2].pos[0], lights[2].pos[1], lights[2].pos[2], 0.05);
    spheres[7] = vec4.fromValues(lights[1].pos[0] + 0.6, lights[1].pos[1] - 0.6, lights[1].pos[2] - 0.6, 0.3); // Red sphere with static position
    spheres[8] = vec4.fromValues(6.0, 0.0, -10.0, 1.4); // Golden sphere
    spheres[9] = vec4.fromValues(-7.0, 0.0, 0.0, 1.4); // Glass sphere

    //
    // Defining triangles
    //
    var triangles = [];
    triangles[0] = {
        A: vec3.fromValues(-14.0, 14.0, -14.0),
        B: vec3.fromValues(-14.0, -5.0, -12.0),
        C: vec3.fromValues( 14.0, -5.0, -12.0)
    };
    
    triangles[1] = {
        A: vec3.fromValues(-14.0, 14.0, -14.0),
        B: vec3.fromValues( 14.0, -5.0, -12.0),
        C: vec3.fromValues( 14.0, 14.0, -14.0)
    };
    //
	// Ground
	//
    var ground = {
        o: vec3.fromValues(0.0, -10.0, 0.0),
        n: vec3.fromValues(0.0, 1.0, 0.0),
        r: 30.0
    };
    //
    // Torus
    //
    torus = vec2.fromValues(1.0, 0.25);
    //
	// Skybox (planes)
	//
    var skyboxDistance = 10000.0;
    skyboxBack = {
        n: vec3.fromValues(0, 0, -1),
        q: vec3.fromValues(0, 0, skyboxDistance)
    };
    skyboxDown = {
        n: vec3.fromValues(0, 1, 0),
        q: vec3.fromValues(0, -skyboxDistance, 0)
    };
	skyboxFront = {
        n: vec3.fromValues(0, 0, 1),
        q: vec3.fromValues(0, 0, -skyboxDistance)
    };
    skyboxLeft = {
        n: vec3.fromValues(1, 0, 0),
        q: vec3.fromValues(-skyboxDistance, 0, 0)
    };
    skyboxRight = {
        n: vec3.fromValues(-1, 0, 0),
        q: vec3.fromValues(skyboxDistance, 0, 0)
    };
	skyboxUp = {
        n: vec3.fromValues(0, -1, 0),
        q: vec3.fromValues(0, skyboxDistance, 0)
    };
    //
    // Defining materials
    //
    var materials = [];
    //
    // Sun
    //
    materials[0] = {
        amb: vec3.fromValues(1.0, 0.95, 0.85),
        dif: vec3.fromValues(0.0, 0.0, 0.0),
        spec: vec3.fromValues(0.0, 0.0, 0.0),
        pow: 30.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    //
    // Green sphere
    //
    materials[1] = {
        amb: vec3.fromValues(0, 0.2, 0),
        dif: vec3.fromValues(0, 0.4, 0),
        spec: vec3.fromValues(1.0, 0.6, 0.8),
        pow: 20.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    //
    // Blue sphere
    //
    materials[2] = {
        amb: vec3.fromValues(0.0, 0.0, 0.2),
        dif: vec3.fromValues(0.0, 0.0, 0.4),
        spec: vec3.fromValues(0.0),
        pow: 20.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    //
    // Earth
    //
    materials[3] = {
        amb: vec3.fromValues(0.5, 0.5, 0.5),
        dif: vec3.fromValues(0.5, 0.5, 0.5),
        spec: vec3.fromValues(0.5, 0.5, 0.5),
        pow: 30.0,
        refractive: false,
        reflective: true,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    //
    // Moon
    //
    materials[4] = {
        amb: vec3.fromValues(0.5, 0.5, 0.5),
        dif: vec3.fromValues(0.5, 0.5, 0.5),
        spec: vec3.fromValues(0.5, 0.5, 0.5),
        pow: 20.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    //
    // Spheres of lightsources
    //
    materials[5] = {
        amb: vec3.fromValues(0.5, 0.5, 0.5),
        dif: vec3.fromValues(0.8, 0.5, 0.8),
        spec: vec3.fromValues(0.9, 0.9, 0.9),
        pow: 20.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    materials[6] = {
        amb: vec3.fromValues(0.5, 0.5, 0.5),
        dif: vec3.fromValues(0.8, 0.8, 0.8),
        spec: vec3.fromValues(0.5, 0.5, 0.9),
        pow: 20.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    //
    // Red sphere
    //

    materials[7] = {
        amb: vec3.fromValues(0.2, 0.0, 0.0),
        dif: vec3.fromValues(0.5, 0.0, 0.0),
        spec: vec3.fromValues(0.8, 0.8, 0.8),
        pow: 66.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };

    //
    // Golden sphere
    //
    materials[8] = {
        amb: vec3.fromValues(0.0, 0.0, 0.0),
        dif: vec3.fromValues(0.0, 0.0, 0.0),
        spec: vec3.fromValues(0.628281, 0.555802, 0.366065),
        pow: 51.2,
        refractive: false,
        reflective: true,
        f0: getF0(vec3.fromValues(0.17, 0.35, 1.5), vec3.fromValues(3.1, 2.7, 1.9)), //arany kioltasi tenyezo
        n: 1.0
    };
    //
    // Glass sphere
    //
    materials[9] = {
        amb: vec3.fromValues(0.0, 0.0, 0.0),
        dif: vec3.fromValues(0.0, 0.0, 0.0),
        spec: vec3.fromValues(0.0, 0.0, 0.0),
        pow: 70.0,
        refractive: true,
        reflective: true,
        f0: getF0(vec3.fromValues(1.5, 1.5, 1.5), vec3.fromValues(0.0, 0.0, 0.0)),
        n: 1.5
    };
    //
    // Triangle 1
    //
    materials[spheres.length] = {
        amb: vec3.fromValues(0.0, 0.0, 0.0), //glm::vec3(240/255, 240/255, 250/255);
        dif: vec3.fromValues(0.01, 0.01, 0.01),
        spec: vec3.fromValues(0.8, 0.8, 0.8),
        pow: 120.0,
        refractive: false,
        reflective: true,
        f0: getF0(vec3.fromValues(0.14, 0.16, 0.13), vec3.fromValues(4.1, 2.3, 3.1)),
        n: 1.0
    };
    //
    // Triangle 2
    //
    materials[spheres.length+1] = materials[spheres.length];
    //
    // Ground (disc)
    //
    materials[spheres.length+triangles.length] = {
        amb: vec3.fromValues(0.0, 0.0, 0.0),
        dif: vec3.fromValues(0.3, 0.34, 0.36),
        spec: vec3.fromValues(0.8, 0.8, 0.8),
        pow: 60.0,
        refractive: false,
        reflective: false,
        f0: getF0(vec3.fromValues(0.6, 0.6, 0.6), vec3.fromValues(2.6, 2.6, 2.6)),
        n: 1.0
    };
    //
    // Torus
    //
    materials[spheres.length + triangles.length + 1] = {
        amb: vec3.fromValues(0.0, 0.0, 0.4),
        dif: vec3.fromValues(0.0, 0.0, 0.4),
        spec: vec3.fromValues(0.8, 0.8, 0.8),
        pow: 30.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0
    };
    //
    // Skybox
    //
    var skyboxMaterial = {
        amb: vec3.fromValues(0.5, 0.5, 0.5),
        dif: vec3.fromValues(0.5, 0.5, 0.5),
        spec: vec3.fromValues(0.5, 0.5, 0.5),
        pow: 20.0,
        refractive: false,
        reflective: false,
        f0: vec3.fromValues(0.0, 0.0, 0.0),
        n: 1.0 
    };
    for (var i = spheres.length + triangles.length + 2; i < spheres.length + triangles.length + 8; ++i) {
        materials[i] = skyboxMaterial;
    }







	
    //
    // Load textures
    //
    var sunTexture         = loadTexture("sunTexture");
    var earthTexture       = loadTexture("earthTexture");
    var earthNormalMap     = loadTexture("earthNormalMap");
    var moonTexture        = loadTexture("moonTexture");
    var moonNormalMap      = loadTexture("moonNormalMap");
    var groundTexture      = loadTexture("groundTexture");
    var skyboxTextureBack  = loadClampTexture("skyboxTextureBack");
    var skyboxTextureDown  = loadClampTexture("skyboxTextureDown");
    var skyboxTextureFront = loadClampTexture("skyboxTextureFront");
    var skyboxTextureLeft  = loadClampTexture("skyboxTextureLeft");
    var skyboxTextureRight = loadClampTexture("skyboxTextureRight");
    var skyboxTextureUp    = loadClampTexture("skyboxTextureUp");
    
    
    
	gl.useProgram(program);
	
	var eyeUniformLocation   = gl.getUniformLocation(program, 'eye');
	var upUniformLocation    = gl.getUniformLocation(program, 'up');
	var fwUniformLocation    = gl.getUniformLocation(program, 'fw');
    var rightUniformLocation = gl.getUniformLocation(program, "right");
	var ratioUniformLocation = gl.getUniformLocation(program, 'ratio');
    
    var ratio = canvas.clientWidth / canvas.clientHeight;
    gl.uniform1f(ratioUniformLocation, ratio);
    
	var viewMatrix  = new Float32Array(16);
	var projMatrix  = new Float32Array(16);
    
	var u = -Math.PI/2;
	var v =  Math.PI/2;
	
	var camRight = [1, 0, 0];
	var camUp    = [0, 1, 0];
	var camAt    = [0, 0, 0];
	var camPos   = [0, 0, 35];
	var camFw    = getSphereUV(u, v);
	var camDist  = vec3.dist(camAt, camPos);
    gl.uniform3fv(upUniformLocation, camUp);


	
	
	mat4.lookAt(viewMatrix, camPos, camAt, camUp);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
	
	
	
	
	var depth = 1;
    var isShadowOn = false;
    var isGlowOn = false;
    var useNormalMap = true;
    var showTorus = false;
    var pause = false;
    var sumElapsedTime = 0;
    var curElapsedTime = 0;
    var pausedTime = 0;
    var currentColorMode = 5;
    var colorModeInTernary = [];
    colorModeToTernary(colorModeInTernary, currentColorMode);
    var colorModes = ["RRR", "RRG", "RRB",
                      "RGR", "RGG", "RGB",
                      "RBR", "RBG", "RBB",
                      "GRR", "GRG", "GRB",
                      "GGR", "GGG", "GGB",
                      "GBR", "GBG", "GBB",
                      "BRR", "BRG", "BRB",
                      "BGR", "BGG", "BGB",
                      "BBR", "BBG", "BBB"];

	var isDDown = false;
	var isADown = false;
	var isSDown = false;
	var isWDown = false;
	var isMouseActive = false;
	
	window.onkeydown = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
        
		switch(key) {
			case 68:
				isDDown = true;
				break;
			case 65:
				isADown = true;
				break;
			case 83:
				isSDown = true;
				break;
			case 87:
				isWDown = true;
				break;
            case 37:
                if (depth > 1) {
                    console.log("Depth: " + (--depth));
                }
                break;
            case 39:
                if (depth < 8) {
				    console.log("Depth: " + (++depth));
                }
                break;
            case 38:
                if (currentColorMode < 26)
                {
                    console.log("Current color mode: " + colorModes[++currentColorMode]);
                    colorModeToTernary(colorModeInTernary, currentColorMode);
                }
                break;
            case 40:
                if (currentColorMode > 0)
                {
                    console.log("Current color mode: " + colorModes[--currentColorMode]);
                    colorModeToTernary(colorModeInTernary, currentColorMode);
                }
                break;
            case 49:
                isShadowOn = !isShadowOn;
                isShadowOn ? console.log("Shadows ON") : console.log("Shadows OFF");
                break;
            case 71:
                isGlowOn = !isGlowOn;
                isGlowOn ? console.log("Glow effect ON") : console.log("Glow effect OFF");
                break;
            case 78:
                useNormalMap = !useNormalMap;
                useNormalMap ? console.log("Normalmaps ON") : console.log("Normalmaps OFF");
                break;
            case 80:
                pause = !pause;
                if (pause)
                {
                    curElapsedTime = 0;
                    console.log("Time paused");
                    pausedTime = performance.now() / 1000.0;
                }
                else
                {
                    sumElapsedTime += curElapsedTime;
                    console.log("Returned");
                }
                break;
            case 84:
                showTorus = !showTorus;
                showTorus ? console.log("Torus ON") : console.log("Torus OFF");
                break;
		}
	}
	
	window.onkeyup = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
	    switch(key) {
			case 68:
				isDDown = false;
				break;
			case 65:
				isADown = false;
				break;
			case 83:
				isSDown = false;
				break;
			case 87:
				isWDown = false;
				break;
		}
	}
	
	canvas.onmousedown = function (e) {
		isMouseActive = true;
	}
	
	window.onmouseup = function (e) {
		isMouseActive = false;
		prevX = 0;
		prevY = 0;
		document.getElementById('game-surface').style.cursor = "default";
	}
	
	var prevX = 0;
	var prevY = 0;
	window.onmousemove = function (e) {
		if (isMouseActive) {
			if (prevX < 1 || prevY < 1) {
				prevX = e.clientX;
				prevY = e.clientY;
			}
			u += (e.clientX-prevX) / 200;
			v += (e.clientY-prevY) / 200;
			v = clamp(v, 0.01, 3.14);
			camFw = getSphereUV(u, v);
			camAt = vec3.add(camPos, camFw);
			camRight = vec3.cross(camFw, [0, 1, 0]);
			camRight = vec3.normalize(camRight);
			prevX = e.clientX;
			prevY = e.clientY;
			document.getElementById('game-surface').style.cursor = "none";
		}
	}
	var time;
    var frameCount = 0;
    var currentTime;
    var lastFPSUpdate = performance.now();
	//
	// Main render loop
	//
	var loop = function () {
		var camSpeed = 1.0;
        
        { //key actions
            if (isDDown) {
                var right = vec3.scale(camRight, camSpeed);
                camPos = vec3.add(camPos, right);
                camAt = vec3.add(camAt, right);
            }
            if (isADown) {
                var right = vec3.scale(camRight, camSpeed);
                camPos = vec3.sub(camPos, right);
                camAt = vec3.sub(camAt, right);
            }
            if (isSDown) {
                var fw = vec3.scale(camFw, camSpeed);
                camPos = vec3.sub(camPos, fw);
                camAt = vec3.sub(camAt, fw);
            }
            if (isWDown) {
                var fw = vec3.scale(camFw, camSpeed);
                camPos = vec3.add(camPos, fw);
                camAt = vec3.add(camAt, fw);
            }
        }
        { // vertex shader uniforms
            mat4.lookAt(viewMatrix, camPos, camAt, camUp);
            gl.uniform3fv(eyeUniformLocation, camPos);
            gl.uniform3fv(fwUniformLocation, camFw);
            camUp = vec3.cross(camRight, camFw);
            gl.uniform3fv(upUniformLocation, camUp);
            gl.uniform3fv(rightUniformLocation, camRight);
        }
        
        
		
		gl.clearColor(0.75, 0.85, 1.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        
	
        if (pause)
        {
            time = pausedTime - sumElapsedTime;
            curElapsedTime = performance.now() / 1000.0 - pausedTime;
        }
        else
        {
            time = performance.now() / 1000.0 - sumElapsedTime;
        }
        //
        // Moving specific spheres on a circle shape
        //
        spheres[1] = vec4.fromValues(2 * Math.sin(time / 2.0), 0.0, 2.0 * Math.cos(time / 2.0), 0.26);
        spheres[2] = vec4.fromValues(2.5 * Math.cos(time / 3.0), 0.0, 2.5 * Math.sin(time / 3.0), 0.18);
        spheres[3] = vec4.fromValues(5.0 * Math.cos(time / 5.0), 0.0, 5.0 * Math.sin(time / 5.0), 0.366);
        spheres[4] = vec4.fromValues(5 * Math.cos(time / 5.0) + 1.0*Math.cos(2.0 * time), 0.0, 5.0 * Math.sin(time / 5.0) + 1.0*Math.sin(2.0 * time), 0.1);
        
        //
        // Pass variables to the GPU
        //
        setIntegerUniform(program, "depth", depth);
        setFloatUniform(program, "time", time);
        setFloatUniform(program, "skyboxRatio", skyboxDistance * 2);
        setBoolUniform(program, "isShadowOn", isShadowOn);
        setBoolUniform(program, "isGlowOn", isGlowOn);
        setBoolUniform(program, "useNormalMap", useNormalMap);
        setBoolUniform(program, "showTorus", showTorus);
        //
        // Pass lights to GPU
        //
        for (var i = 0; i < lights.length; ++i) {
            setVec3Uniform(program, "lights[" + i + "].col", lights[i].col);
            setVec3Uniform(program, "lights[" + i + "].pos", lights[i].pos);
        }
        
        //
        // Pass spheres to GPU
        //
        for (var i = 0; i < spheres.length; ++i) {
            setVec4Uniform(program, "spheres[" + i + "]", spheres[i]);
        }
        //
        // Pass triangles to GPU
        //
        for (var i = 0; i < triangles.length; ++i) {
            setVec3Uniform(program, "triangles[" + i + "].A", triangles[i].A);
            setVec3Uniform(program, "triangles[" + i + "].B", triangles[i].B);
            setVec3Uniform(program, "triangles[" + i + "].C", triangles[i].C);
        }
        //
        // Pass ground to GPU (disc)
        //
        setVec3Uniform(program, "ground.o", ground.o);
        setVec3Uniform(program, "ground.n", ground.n);
        setFloatUniform(program, "ground.r", ground.r);
        //
        // Pass torus to GPU
        //
        setVec2Uniform(program, "torus", torus);
        //
        // Pass skybox to GPU
        //
        setVec3Uniform(program, "skyboxBack.n",  skyboxBack.n);
        setVec3Uniform(program, "skyboxBack.q",  skyboxBack.q);

        setVec3Uniform(program, "skyboxDown.n",  skyboxDown.n);
        setVec3Uniform(program, "skyboxDown.q",  skyboxDown.q);

        setVec3Uniform(program, "skyboxFront.n", skyboxFront.n);
        setVec3Uniform(program, "skyboxFront.q", skyboxFront.q);

        setVec3Uniform(program, "skyboxLeft.n",  skyboxLeft.n);
        setVec3Uniform(program, "skyboxLeft.q",  skyboxLeft.q);

        setVec3Uniform(program, "skyboxRight.n", skyboxRight.n);
        setVec3Uniform(program, "skyboxRight.q", skyboxRight.q);

        setVec3Uniform(program, "skyboxUp.n",    skyboxUp.n);
        setVec3Uniform(program, "skyboxUp.q",    skyboxUp.q);
        //
        // Pass textures to GPU
        //
        setTexture(program, "sunTexture",          0, sunTexture);
        setTexture(program, "earthTexture",        1, earthTexture);
        setTexture(program, "earthNormalMap",      2, earthNormalMap);
        setTexture(program, "moonTexture",         3, moonTexture);
        setTexture(program, "moonNormalMap",       4, moonNormalMap);
        setTexture(program, "groundTexture",       5, groundTexture);
        setTexture(program, "skyboxTextureBack",   6, skyboxTextureBack);
        setTexture(program, "skyboxTextureDown",   7, skyboxTextureDown);
        setTexture(program, "skyboxTextureFront",  8, skyboxTextureFront);
        setTexture(program, "skyboxTextureLeft",   9, skyboxTextureLeft);
        setTexture(program, "skyboxTextureRight", 10, skyboxTextureRight);
        setTexture(program, "skyboxTextureUp",    11, skyboxTextureUp);
        //
        // Pass materials to GPU
        //
        for (var i = 0; i < materials.length; ++i) {
            setVec3Uniform(program,    "materials[" + i + "].amb",        materials[i].amb);
            setVec3Uniform(program,    "materials[" + i + "].dif",        materials[i].dif);
            setVec3Uniform(program,    "materials[" + i + "].spec",       materials[i].spec);
            setFloatUniform(program,   "materials[" + i + "].pow",        materials[i].pow);
            setIntegerUniform(program, "materials[" + i + "].refractive", materials[i].refractive);
            setIntegerUniform(program, "materials[" + i + "].reflective", materials[i].reflective);
            setVec3Uniform(program,    "materials[" + i + "].f0",         materials[i].f0);
            setFloatUniform(program,   "materials[" + i + "].n",          materials[i].n);
        }
        //
        // Pass colorMode to GPU
        //
        setIntegerUniform(program, "colorModeInTernary[0]", colorModeInTernary[0]);
        setIntegerUniform(program, "colorModeInTernary[1]", colorModeInTernary[1]);
        setIntegerUniform(program, "colorModeInTernary[2]", colorModeInTernary[2]);

        
        
        
        
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        
        frameCount++;
        currentTime = performance.now();
		if (currentTime - lastFPSUpdate >= 1000)
		{

			console.log("avg. FPS: " + frameCount);
			

			lastFPSUpdate = performance.now();
			frameCount = 0;
		}
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	
};


function loadTexture(textureID) {
    var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById(textureID)
	);
	gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

function loadClampTexture(textureID) {
    var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById(textureID)
	);
	gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

function setTexture(program, _uniform, _sampler, _textureID) {
	gl.activeTexture(gl.TEXTURE0 + _sampler);
	gl.bindTexture(gl.TEXTURE_2D, _textureID);
    gl.uniform1i(gl.getUniformLocation(program, _uniform), _sampler);
}

function setIntegerUniform(program, uniform, number) {
    gl.uniform1i(gl.getUniformLocation(program, uniform), number);
}
function setBoolUniform(program, uniform, variable) {
    gl.uniform1i(gl.getUniformLocation(program, uniform), variable);
}
function setFloatUniform(program, uniform, number) {
    gl.uniform1f(gl.getUniformLocation(program, uniform), number);
}
function setVec2Uniform(program, uniform, numbers) {
    gl.uniform2fv(gl.getUniformLocation(program, uniform), numbers);
}
function setVec3Uniform(program, uniform, numbers) {
    gl.uniform3fv(gl.getUniformLocation(program, uniform), numbers);
}
function setVec4Uniform(program, uniform, numbers) {
    gl.uniform4fv(gl.getUniformLocation(program, uniform), numbers);
}

function getF0(n, k) { // toresmutato, kioltasi tenyezo
    //            
    //                (                        A                     )    (                         B                    )
    //                (                   atimesa             )           (                ctimesc                )
    //                (          a       ) (          a       )   (b )    (          c       ) (       c          )   (b )
    //glm::vec3 f0 = ((n - glm::vec3(1.0))*(n - glm::vec3(1.0)) + k*k) / ((n + glm::vec3(1.0))*(n + glm::vec3(1.0)) + k*k);
    
    var a = vec3.sub(n, vec3.fromValues(1.0, 1.0, 1.0));
    var b = vec3.mul(k, k);
    var c = vec3.add(n, vec3.fromValues(1.0, 1.0, 1.0));
    var atimesa = vec3.mul(a, a);
    var ctimesc = vec3.mul(c, c);
    var A = vec3.add(atimesa, b);
    var B = vec3.add(ctimesc, b);

    var f0 = vec3.divide(A, B);

	return f0;
}

function colorModeToTernary(colorModeInTernary, currentColorMode) {
    colorModeInTernary[2] = currentColorMode % 3;
	currentColorMode = Math.floor(currentColorMode/3);
	colorModeInTernary[1] = currentColorMode % 3;
	currentColorMode = Math.floor(currentColorMode/3);
	colorModeInTernary[0] = currentColorMode % 3;
}

function clamp(num, min, max) {
	if (num < min) {
		return min;
	}
	if (num > max) {
		return max;
	}
	return num;
}


function getSphereUV(u, v) {
	var uv = [0, 0, 0];
	uv = vec3.normalize(vec3.fromValues(Math.cos(u) * Math.sin(v), Math.cos(v), Math.sin(u)*Math.sin(v)));
	return uv;
}


function initAttribPointer(positionAttribLocation) {
	//Vertices of triangles
	gl.vertexAttribPointer(
		positionAttribLocation, //Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE, // is it normalized
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0// Offset from the beginning of a single vertex to this attribute
	);
}
function loadTextResource(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
	request.onload = function () {
		if (request.status < 200 || request.status > 299) {
			callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
		} else {
			callback(null, request.responseText);
		}
	};
	request.send();
};