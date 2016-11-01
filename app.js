document.getElementById("game-surface").addEventListener('contextmenu', function(evt) { 
	evt.preventDefault();
}, false);

var vertexShaderText, fragmentShaderText;

function loadShaders(vsFileName, fsFileName) {
	loadVertexTextResource(vsFileName);
	loadFragmentTextResource(fsFileName);
};

var gl;
function RunDemo() {
	var loadingLabel = document.getElementById('loading');
	var FPSLabel = document.getElementById('FPS');
	var depthLabel = document.getElementById('depth');
	var colorModeLabel = document.getElementById('colormode');
	var glowEffectLabel = document.getElementById('gloweffect');
	var shadowsLabel = document.getElementById('shadows');
	var normalMapsLabel = document.getElementById('normalmaps');
	var vendorID = document.getElementById("vendorID");

	var canvas = document.getElementById('game-surface');
	
	glVersion = 'webgl2';
	gl = canvas.getContext(glVersion);
	if (!gl) {
		console.log('WebGL 2.0 not supported, falling back on experimental-webgl 2.0..');
        glVersion = 'experimental-webgl2';
		gl = canvas.getContext(glVersion);
	}
	if (!gl) {
        console.log('Experimental WebGL 2.0 not supported, falling back on webgl 1.0...');
        glVersion = 'webgl';
		gl = canvas.getContext(glVersion);
	}
	if (!gl) {
		console.log('WebGL not supported, falling back on experimental webgl...');
		glVersion = 'experimental-webgl';
		gl = canvas.getContext(glVersion);
	}
	if (!gl) {
		alert('Your browser does not support WegGL!');
		return;
	}
	
	if (glVersion == 'webgl2' || glVersion == 'experimental-webgl2') {
		loadShaders('VS_GL_ES_3.vert', 'FS_GL_ES_3.frag');
	} else {
		loadShaders('VS.vert', 'FS.frag');
	}
	var vendor = "" + gl.getParameter(gl.VERSION) + " " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION) + "<br>" + 
				getUnmaskedInfo(gl).vendor + getUnmaskedInfo(gl).renderer;
	vendorID.innerHTML = vendor;
	
	
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	
	gl.clearColor(0.125, 0.25, 0.5, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	
	//
	// Create shaders
	//
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	loadingLabel.innerHTML = "Compiling Vertex Shader...";
	console.log("Compiling Vertex Shader...");
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	loadingLabel.innerHTML = "Compiling Vertex Shader...DONE!";
	console.log("Compiling Vertex Shader...DONE!");
	loadingLabel.innerHTML = "Compiling Fragment Shader...";
	console.log("Compiling Fragment Shader...");
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
	loadingLabel.innerHTML = "Compiling Fragment Shader...DONE!";
	console.log("Compiling Fragment Shader...DONE!");
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	loadingLabel.innerHTML = "Linking program...";
	console.log("Linking program...");
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
		loadingLabel.innerHTML = "ERROR Linking program! Try again.";
		console.error('ERROR linking program! Error code: '+ gl.getError() + ": " + gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return;
	}
	loadingLabel.innerHTML = "Linking program...DONE!";
	console.log("Linking program...DONE!");
	loadingLabel.innerHTML = "Validating program...";
	console.log("Validating program...");
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	loadingLabel.innerHTML = "Validating program...DONE!";
	console.log("Validating program...DONE!");
	loadingLabel.innerHTML = "Defining vertices, geometries, etc...";
	console.log("Defining vertices, geometries, etc...");
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
    spheres[7] = vec4.fromValues(lights[1].pos[0] + 0.3, lights[1].pos[1] - 0.6, lights[1].pos[2] - 0.3, 0.3); // Red sphere with static position
    spheres[8] = vec4.fromValues(6.0, 0.0, -10.0, 1.4); // Golden sphere
    spheres[9] = vec4.fromValues(-7.0, 0.0, 0.0, 1.4); // Glass sphere

	// 10x10 mirror spheres
	for (var i = 10; i < 20; ++i)
	{
		for (var j = 0; j < 10; ++j)
		{
			spheres[(i-10)*10+j+10] = vec4.fromValues(i*2-30, -7, 5+j*2, 0.8);
		}
	}
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
	//triangles[2] = {A: vec3.fromValues(0.0, 0.0, 0.0), B: vec3.fromValues(0.0, 10.0, 0.0), C: vec3.fromValues(0.0, 0.0, 10.0) };
	var hCubeSide = 2.0; //half the cube's side
	var cubeCenter = vec3.fromValues(10.0, 0.0, 0.0);
	var cube1 = vec3.fromValues(cubeCenter[0] - hCubeSide, cubeCenter[1] - hCubeSide, cubeCenter[2] - hCubeSide);
	var cube2 = vec3.fromValues(cubeCenter[0] - hCubeSide, cubeCenter[1] - hCubeSide, cubeCenter[2] + hCubeSide);
	var cube3 = vec3.fromValues(cubeCenter[0] + hCubeSide, cubeCenter[1] - hCubeSide, cubeCenter[2] + hCubeSide);
	var cube4 = vec3.fromValues(cubeCenter[0] + hCubeSide, cubeCenter[1] - hCubeSide, cubeCenter[2] - hCubeSide);
	var cube5 = vec3.fromValues(cubeCenter[0] - hCubeSide, cubeCenter[1] + hCubeSide, cubeCenter[2] - hCubeSide);
	var cube6 = vec3.fromValues(cubeCenter[0] - hCubeSide, cubeCenter[1] + hCubeSide, cubeCenter[2] + hCubeSide);
	var cube7 = vec3.fromValues(cubeCenter[0] + hCubeSide, cubeCenter[1] + hCubeSide, cubeCenter[2] + hCubeSide);
	var cube8 = vec3.fromValues(cubeCenter[0] + hCubeSide, cubeCenter[1] + hCubeSide, cubeCenter[2] - hCubeSide);
	
	// Down
	triangles[2]  = {A: cube1, B: cube3, C: cube2};
	triangles[3]  = {A: cube1, B: cube4, C: cube3};
	// Front                                     
	triangles[4]  = {A: cube2, B: cube3, C: cube6};
	triangles[5]  = {A: cube6, B: cube3, C: cube7};
	// Left                                      
	triangles[6]  = {A: cube1, B: cube2, C: cube5};
	triangles[7]  = {A: cube5, B: cube2, C: cube6};
	// Right                                     
	triangles[8]  = {A: cube3, B: cube4, C: cube7};
	triangles[9]  = {A: cube7, B: cube4, C: cube8};
	// Up                                        
	triangles[10] = {A: cube5, B: cube6, C: cube7};
	triangles[11] = {A: cube5, B: cube7, C: cube8};
	// Back                                      
	triangles[12] = {A: cube1, B: cube8, C: cube4};
	triangles[13] = {A: cube1, B: cube5, C: cube8};
	
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
    var torus = vec2.fromValues(1.0, 0.25);
    //
	// Skybox (planes)
	//
    var skyboxDistance = 10000.0;
    var skyboxBack = {
        n: vec3.fromValues(0, 0, -1),
        q: vec3.fromValues(0, 0, skyboxDistance)
    };
    var skyboxDown = {
        n: vec3.fromValues(0, 1, 0),
        q: vec3.fromValues(0, -skyboxDistance, 0)
    };
	var skyboxFront = {
        n: vec3.fromValues(0, 0, 1),
        q: vec3.fromValues(0, 0, -skyboxDistance)
    };
    var skyboxLeft = {
        n: vec3.fromValues(1, 0, 0),
        q: vec3.fromValues(-skyboxDistance, 0, 0)
    };
    var skyboxRight = {
        n: vec3.fromValues(-1, 0, 0),
        q: vec3.fromValues(skyboxDistance, 0, 0)
    };
	var skyboxUp = {
        n: vec3.fromValues(0, -1, 0),
        q: vec3.fromValues(0, skyboxDistance, 0)
    };

	loadingLabel.innerHTML = "Defining vertices, geometries, etc...DONE!";
	console.log("Defining vertices, geometries, etc...DONE!");
	loadingLabel.innerHTML = "Loading textures...";
	console.log("Loading textures...");
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
    
    loadingLabel.innerHTML = "Loading textures...DONE!";
	console.log("Loading textures...DONE!");
    
	gl.useProgram(program);
	
	loadingLabel.innerHTML = "Loading...";
	console.log("Loading...DONE!");
    
    var ratio = canvas.clientWidth / canvas.clientHeight;
	
	document.getElementById("setResolutionButton").addEventListener("click", function(){
		ratio = setResolution(canvas);
	});
	document.getElementById("setFullScreenButton").addEventListener("click", function(){
		ratio = setFullScreen(canvas);
	});
    
	var u = -Math.PI/2;
	var v =  Math.PI/2;
	
	var camRight = [1, 0, 0];
	var camUp    = [0, 1, 0];
	var camAt    = [0, 0, 0];
	var camPos   = [0, 0, 35];
	var camFw    = getSphereUV(u, v);
	var camDist  = vec3.dist(camAt, camPos);
	
	var depth = 8;
    var isShadowOn = false;
    var isGlowOn = true;
    var useNormalMap = true;
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
					  
	var isShiftDown = false;
	var isDDown = false;
	var isADown = false;
	var isSDown = false;
	var isWDown = false;
	var isMouseActive = false;
	
	
	window.onkeydown = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
        
		switch(key) {
			case 16:
				isShiftDown = true;
				break;
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
					depthLabel.innerHTML = "Depth: " + --depth;
                }
                break;
            case 39:
                if (depth < 8) {
					depthLabel.innerHTML = "Depth: " + ++depth;
                }
                break;
            case 38:
                if (currentColorMode < 26) {
					colorModeLabel.innerHTML = "ColorMode: " + colorModes[++currentColorMode];
                    colorModeToTernary(colorModeInTernary, currentColorMode);
                }
                break;
            case 40:
                if (currentColorMode > 0) {
					colorModeLabel.innerHTML = "ColorMode: " + colorModes[--currentColorMode];
                    colorModeToTernary(colorModeInTernary, currentColorMode);
                }
                break;
            case 49:
                isShadowOn = !isShadowOn;
                //isShadowOn ? console.log("Shadows ON") : console.log("Shadows OFF");
				isShadowOn ? shadowsLabel.innerHTML = "Shadows: ON" : shadowsLabel.innerHTML = "Shadows: OFF";
                break;
            case 71:
                isGlowOn = !isGlowOn;
                isGlowOn ? glowEffectLabel.innerHTML = "Glow effect: ON" : glowEffectLabel.innerHTML = "Glow effect: OFF";
                break;
            case 78:
                useNormalMap = !useNormalMap;
                useNormalMap ? normalMapsLabel.innerHTML = "Normalmaps: ON" : normalMapsLabel.innerHTML = "Normalmaps: OFF";
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
			case 27:
				ratio = setResolution(canvas);
				break;
		}
	}
	
	window.onkeyup = function(e) {
	    var key = e.keyCode ? e.keyCode : e.which;
	    switch(key) {
			case 16:
				isShiftDown = false;
				break;
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
	var camSpeed = 0.2667;
	loadingLabel.innerHTML = "Loading: done!";
	//
	// Main render loop
	//
	var loop = function () {
        
        { //key actions
			if (isShiftDown) {
				camSpeed = 0.2667/4.0;
			} else {
				camSpeed = 0.2667;
			}
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
		//
		// Pass variables to GPU
		//
		setVec3Uniform(program, "eye", camPos);
		setVec3Uniform(program, "fw", camFw);
		camUp = vec3.cross(camRight, camFw);
		setVec3Uniform(program, "up", camUp);
		setVec3Uniform(program, "right", camRight);
		setFloatUniform(program, "ratio", ratio);
		setFloatUniform(program, "time", time);
		setFloatUniform(program, "skyboxRatio", skyboxDistance * 2);
		setBoolUniform(program, "isShadowOn", isShadowOn);
		setBoolUniform(program, "useNormalMap", useNormalMap);
		setBoolUniform(program, "isGlowOn", isGlowOn);
		setIntegerUniform(program, "depth", depth); // --> bounces count
		
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
			FPSLabel.innerHTML = "FPS: " + --frameCount;

			lastFPSUpdate = performance.now();
			frameCount = 0;
		}
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	
};