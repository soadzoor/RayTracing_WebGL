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
    lights[0] = {col: vec3.fromValues(1.0, 1.0, 1.0), pos: vec3.fromValues(0.0, 0.0, 0.0),
				 colLocation: gl.getUniformLocation(program, "lights[0].col"), posLocation: gl.getUniformLocation(program, "lights[0].pos")};
    lights[1] = {col: vec3.fromValues(1.0, 1.0, 1.0), pos: vec3.fromValues(-2.0, 20.0, 0.0),
				 colLocation: gl.getUniformLocation(program, "lights[1].col"), posLocation: gl.getUniformLocation(program, "lights[1].pos")};
    lights[2] = {col: vec3.fromValues(1.0, 1.0, 1.0), pos: vec3.fromValues(20.0, 20.0, 0.0),
				 colLocation: gl.getUniformLocation(program, "lights[2].col"), posLocation: gl.getUniformLocation(program, "lights[2].pos")};

    //
	// Defining spheres
	//
	var spheres = [];
	spheres[0] = { vec: vec4.fromValues(0.0, 0.0, 0.0, 1.4), Location: gl.getUniformLocation(program, "spheres[0]") }; // Sun
	spheres[1] = { vec: vec4.fromValues(0.0, 0.0, 0.0, 0.0), Location: gl.getUniformLocation(program, "spheres[1]") }; // Green sphere
	spheres[2] = { vec: vec4.fromValues(0.0, 0.0, 0.0, 0.0), Location: gl.getUniformLocation(program, "spheres[2]") }; // Blue sphere
	spheres[3] = { vec: vec4.fromValues(0.0, 0.0, 0.0, 0.0), Location: gl.getUniformLocation(program, "spheres[3]") }; // Earth
	spheres[4] = { vec: vec4.fromValues(0.0, 0.0, 0.0, 0.0), Location: gl.getUniformLocation(program, "spheres[4]") }; // Moon
    
	spheres[5] = { vec: vec4.fromValues(-2.0, 20.0, 0.0, 0.05), Location: gl.getUniformLocation(program, "spheres[5]") };
	spheres[6] = { vec: vec4.fromValues(20.0, 20.0, 0.0, 0.05), Location: gl.getUniformLocation(program, "spheres[6]") };
	spheres[7] = { vec: vec4.fromValues(-2.0 + 0.3, 20.0 - 0.6, 0.0 - 0.3, 0.3), Location: gl.getUniformLocation(program, "spheres[7]") }; // Red sphere
	spheres[8] = { vec: vec4.fromValues(6.0, 0.0, -10.0, 1.4), Location: gl.getUniformLocation(program, "spheres[8]") }; // Golden sphere
	spheres[9] = { vec: vec4.fromValues(-7.0, 0.0, 0.0, 1.4), Location: gl.getUniformLocation(program, "spheres[9]") }; // Glass sphere

	// 10x10 mirror spheres
	for (var i = 10; i < 20; ++i)
	{
		for (var j = 0; j < 10; ++j)
		{
			var a = (i-10)*10+j+10;
			spheres[a] = { vec: vec4.fromValues(i*2-30, -7, 5+j*2, 0.8), Location: gl.getUniformLocation(program, "spheres["+a+"]")};
		}
	}
    //
    // Defining triangles
    //
    var triangles = [];
    triangles[0] = {
        A: vec3.fromValues(-14.0, 14.0, -14.0), ALocation: gl.getUniformLocation(program, "triangles[0].A"),
        B: vec3.fromValues(-14.0, -5.0, -12.0), BLocation: gl.getUniformLocation(program, "triangles[0].B"),
        C: vec3.fromValues( 14.0, -5.0, -12.0), CLocation: gl.getUniformLocation(program, "triangles[0].C")
    };
    
    triangles[1] = {
        A: vec3.fromValues(-14.0, 14.0, -14.0), ALocation: gl.getUniformLocation(program, "triangles[1].A"),
        B: vec3.fromValues( 14.0, -5.0, -12.0), BLocation: gl.getUniformLocation(program, "triangles[1].B"),
        C: vec3.fromValues( 14.0, 14.0, -14.0), CLocation: gl.getUniformLocation(program, "triangles[1].C")
    };

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
	triangles[2]  = {A: cube1, B: cube3, C: cube2,
					 ALocation: gl.getUniformLocation(program, "triangles[2].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[2].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[2].C") };
	triangles[3]  = {A: cube1, B: cube4, C: cube3,
					 ALocation: gl.getUniformLocation(program, "triangles[3].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[3].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[3].C") };
	// Front                                     
	triangles[4]  = {A: cube2, B: cube3, C: cube6,
					 ALocation: gl.getUniformLocation(program, "triangles[4].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[4].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[4].C") };
	triangles[5]  = {A: cube6, B: cube3, C: cube7,
					 ALocation: gl.getUniformLocation(program, "triangles[5].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[5].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[5].C") };
	// Left                                      
	triangles[6]  = {A: cube1, B: cube2, C: cube5,
					 ALocation: gl.getUniformLocation(program, "triangles[6].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[6].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[6].C") };
	triangles[7]  = {A: cube5, B: cube2, C: cube6,
					 ALocation: gl.getUniformLocation(program, "triangles[7].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[7].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[7].C") };
	// Right                                     
	triangles[8]  = {A: cube3, B: cube4, C: cube7,
					 ALocation: gl.getUniformLocation(program, "triangles[8].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[8].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[8].C") };
	triangles[9]  = {A: cube7, B: cube4, C: cube8,
					 ALocation: gl.getUniformLocation(program, "triangles[9].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[9].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[9].C") };
	// Up                                        
	triangles[10] = {A: cube5, B: cube6, C: cube7,
					 ALocation: gl.getUniformLocation(program, "triangles[10].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[10].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[10].C") };
	triangles[11] = {A: cube5, B: cube7, C: cube8,
					 ALocation: gl.getUniformLocation(program, "triangles[11].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[11].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[11].C") };
	// Back                                      
	triangles[12] = {A: cube1, B: cube8, C: cube4,
					 ALocation: gl.getUniformLocation(program, "triangles[12].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[12].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[12].C") };
	triangles[13] = {A: cube1, B: cube5, C: cube8,
					 ALocation: gl.getUniformLocation(program, "triangles[13].A"),
					 BLocation: gl.getUniformLocation(program, "triangles[13].B"),
					 CLocation: gl.getUniformLocation(program, "triangles[13].C") };
	
    //
	// Ground
	//
    var ground = {
        o: vec3.fromValues(0.0, -10.0, 0.0),
        n: vec3.fromValues(0.0, 1.0, 0.0),
        r: 30.0,
		oLocation: gl.getUniformLocation(program, "ground.o"),
		nLocation: gl.getUniformLocation(program, "ground.n"),
		rLocation: gl.getUniformLocation(program, "ground.r")
    };
    //
    // Torus
    //
    var torus = { vec: vec2.fromValues(1.0, 0.25), Location: gl.getUniformLocation(program, "torus") };
	
    //
	// Skybox (planes)
	//
    var skyboxDistance = 10000.0;
	var skyboxDistanceLocation = gl.getUniformLocation(program, "skyboxRatio");
    var skyboxBack = {
        n: vec3.fromValues(0, 0, -1),
        q: vec3.fromValues(0, 0, skyboxDistance),
		nLocation: gl.getUniformLocation(program, "skyboxBack.n"),
		qLocation: gl.getUniformLocation(program, "skyboxBack.q")
    };
    var skyboxDown = {
        n: vec3.fromValues(0, 1, 0),
        q: vec3.fromValues(0, -skyboxDistance, 0),
		nLocation: gl.getUniformLocation(program, "skyboxDown.n"),
		qLocation: gl.getUniformLocation(program, "skyboxDown.q")
    };
	var skyboxFront = {
        n: vec3.fromValues(0, 0, 1),
        q: vec3.fromValues(0, 0, -skyboxDistance),
		nLocation: gl.getUniformLocation(program, "skyboxFront.n"),
		qLocation: gl.getUniformLocation(program, "skyboxFront.q")
    };
    var skyboxLeft = {
        n: vec3.fromValues(1, 0, 0),
        q: vec3.fromValues(-skyboxDistance, 0, 0),
		nLocation: gl.getUniformLocation(program, "skyboxLeft.n"),
		qLocation: gl.getUniformLocation(program, "skyboxLeft.q")
    };
    var skyboxRight = {
        n: vec3.fromValues(-1, 0, 0),
        q: vec3.fromValues(skyboxDistance, 0, 0),
		nLocation: gl.getUniformLocation(program, "skyboxRight.n"),
		qLocation: gl.getUniformLocation(program, "skyboxRight.q")
    };
	var skyboxUp = {
        n: vec3.fromValues(0, -1, 0),
        q: vec3.fromValues(0, skyboxDistance, 0),
		nLocation: gl.getUniformLocation(program, "skyboxUp.n"),
		qLocation: gl.getUniformLocation(program, "skyboxUp.q")
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
	
	var sunTextureLocation         = gl.getUniformLocation(program, "sunTexture");
	var earthTextureLocation       = gl.getUniformLocation(program, "earthTexture");    
	var earthNormalMapLocation     = gl.getUniformLocation(program, "earthNormalMap");   
	var moonTextureLocation        = gl.getUniformLocation(program, "moonTexture");      
	var moonNormalMapLocation      = gl.getUniformLocation(program, "moonNormalMap");    
	var groundTextureLocation      = gl.getUniformLocation(program, "groundTexture");    
	var skyboxTextureBackLocation  = gl.getUniformLocation(program, "skyboxTextureBack");
	var skyboxTextureDownLocation  = gl.getUniformLocation(program, "skyboxTextureDown");
	var skyboxTextureFrontLocation = gl.getUniformLocation(program, "skyboxTextureFront");
	var skyboxTextureLeftLocation  = gl.getUniformLocation(program, "skyboxTextureLeft");
	var skyboxTextureRightLocation = gl.getUniformLocation(program, "skyboxTextureRight");
	var skyboxTextureUpLocation    = gl.getUniformLocation(program, "skyboxTextureUp");  
    
    loadingLabel.innerHTML = "Loading textures...DONE!";
	console.log("Loading textures...DONE!");
    
	gl.useProgram(program);
	
	loadingLabel.innerHTML = "Loading necessary uniforms...";
	console.log("Loading necessary uniforms...");
	
	var eyeLocation   = gl.getUniformLocation(program, 'eye');
	var upLocation    = gl.getUniformLocation(program, 'up');
	var fwLocation    = gl.getUniformLocation(program, 'fw');
	var rightLocation = gl.getUniformLocation(program, "right");
	var ratioLocation = gl.getUniformLocation(program, 'ratio');
    
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
	
	var depthLocation = gl.getUniformLocation(program, "depth");
	var isShadowOnLocation = gl.getUniformLocation(program, "isShadowOn");
	var isGlowOnLocation = gl.getUniformLocation(program, "isGlowOn");
	var useNormalMapLocation = gl.getUniformLocation(program, "useNormalMap");

	var colorModeInTernary0Location = gl.getUniformLocation(program, "colorModeInTernary[0]");
	var colorModeInTernary1Location = gl.getUniformLocation(program, "colorModeInTernary[1]");
	var colorModeInTernary2Location = gl.getUniformLocation(program, "colorModeInTernary[2]");
	
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
	var timeLocation = gl.getUniformLocation(program, "time");
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
		
		gl.clear(gl.COLOR_BUFFER_BIT);

		if (pause) {
			time = pausedTime - sumElapsedTime;
			curElapsedTime = performance.now() / 1000.0 - pausedTime;
		} else {
			time = performance.now() / 1000.0 - sumElapsedTime;
		}

		//
		// Moving specific spheres on a circle shape
		//
		spheres[1].vec = vec4.fromValues(2 * Math.sin(time / 2.0), 0.0, 2.0 * Math.cos(time / 2.0), 0.26);
		spheres[2].vec = vec4.fromValues(2.5 * Math.cos(time / 3.0), 0.0, 2.5 * Math.sin(time / 3.0), 0.18);
		spheres[3].vec = vec4.fromValues(5.0 * Math.cos(time / 5.0), 0.0, 5.0 * Math.sin(time / 5.0), 0.366);
		spheres[4].vec = vec4.fromValues(5 * Math.cos(time / 5.0) + 1.0*Math.cos(2.0 * time), 0.0, 5.0 * Math.sin(time / 5.0) + 1.0*Math.sin(2.0 * time), 0.1);

		//
		// Pass variables to the GPU
		//
		setVec3Uniform(eyeLocation, camPos);
		setVec3Uniform(fwLocation, camFw);
		camUp = vec3.cross(camRight, camFw);
		setVec3Uniform(upLocation, camUp);
		setVec3Uniform(rightLocation, camRight);
		setFloatUniform(ratioLocation, ratio);
		setIntegerUniform(depthLocation, depth);
		setFloatUniform(timeLocation, time);
		setFloatUniform(skyboxDistanceLocation, 2*skyboxDistance);
		setBoolUniform(isShadowOnLocation, isShadowOn);
		setBoolUniform(isGlowOnLocation, isGlowOn);
		setBoolUniform(useNormalMapLocation, useNormalMap);
		
        //
        // Pass lights to GPU
        //
        for (var i = 0; i < lights.length; ++i) {
            setVec3Uniform(lights[i].colLocation, lights[i].col);
            setVec3Uniform(lights[i].posLocation, lights[i].pos);
        }
        
        //
        // Pass spheres to GPU
        //
        for (var i = 0; i < spheres.length; ++i) {
            setVec4Uniform(spheres[i].Location, spheres[i].vec);
        }
        //
        // Pass triangles to GPU
        //
        for (var i = 0; i < triangles.length; ++i) {
            setVec3Uniform(triangles[i].ALocation, triangles[i].A);
            setVec3Uniform(triangles[i].BLocation, triangles[i].B);
            setVec3Uniform(triangles[i].CLocation, triangles[i].C);
        }
        //
        // Pass ground to GPU (disc)
        //
        setVec3Uniform(ground.oLocation, ground.o);
        setVec3Uniform(ground.nLocation, ground.n);
        setFloatUniform(ground.rLocation, ground.r);
        //
        // Pass torus to GPU
        //
        setVec2Uniform(torus.Location, torus.vec);
        //
        // Pass skybox to GPU
        //
        setVec3Uniform(skyboxBack.nLocation,  skyboxBack.n);
        setVec3Uniform(skyboxBack.qLocation,  skyboxBack.q);

        setVec3Uniform(skyboxDown.nLocation,  skyboxDown.n);
        setVec3Uniform(skyboxDown.qLocation,  skyboxDown.q);

        setVec3Uniform(skyboxFront.nLocation, skyboxFront.n);
        setVec3Uniform(skyboxFront.qLocation, skyboxFront.q);

        setVec3Uniform(skyboxLeft.nLocation,  skyboxLeft.n);
        setVec3Uniform(skyboxLeft.qLocation,  skyboxLeft.q);

        setVec3Uniform(skyboxRight.nLocation, skyboxRight.n);
        setVec3Uniform(skyboxRight.qLocation, skyboxRight.q);

        setVec3Uniform(skyboxUp.nLocation,    skyboxUp.n);
        setVec3Uniform(skyboxUp.qLocation,    skyboxUp.q);
        //
        // Pass textures to GPU
        //
        setTexture(sunTextureLocation,          0, sunTexture);
		setTexture(earthTextureLocation,        1, earthTexture);
		setTexture(earthNormalMapLocation,      2, earthNormalMap);
		setTexture(moonTextureLocation,         3, moonTexture);
		setTexture(moonNormalMapLocation,       4, moonNormalMap);
		setTexture(groundTextureLocation,       5, groundTexture);
		setTexture(skyboxTextureBackLocation,   6, skyboxTextureBack);
		setTexture(skyboxTextureDownLocation,   7, skyboxTextureDown);
		setTexture(skyboxTextureFrontLocation,  8, skyboxTextureFront);
		setTexture(skyboxTextureLeftLocation,   9, skyboxTextureLeft);
		setTexture(skyboxTextureRightLocation, 10, skyboxTextureRight);
		setTexture(skyboxTextureUpLocation,    11, skyboxTextureUp);
        //
        // Pass colorMode to GPU
        //
        setIntegerUniform(colorModeInTernary0Location, colorModeInTernary[0]);
        setIntegerUniform(colorModeInTernary1Location, colorModeInTernary[1]);
        setIntegerUniform(colorModeInTernary2Location, colorModeInTernary[2]);
  
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

function saveVertexText() {
	//console.log(this.responseText);
	vertexShaderText = this.responseText;
}
function saveFragmentText() {
	//console.log(this.responseText);
	fragmentShaderText = this.responseText;
}
function loadVertexTextResource(url) {
	var request = new XMLHttpRequest();
	request.addEventListener("load", saveVertexText);
	request.open('GET', url + '?please-dont-cache=' + Math.random(), false);
	request.send();
};
function loadFragmentTextResource(url) {
	var request = new XMLHttpRequest();
	request.addEventListener("load", saveFragmentText);
	request.open('GET', url + '?please-dont-cache=' + Math.random(), false);
	request.send();
};