document.getElementById("game-surface").addEventListener('contextmenu', function(evt) { 
  evt.preventDefault();
}, false);


function InitDemo () {
	loadTextResource('shader.vert', function(vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} else {
			loadTextResource('shader.frag', function(fsErr, fsText) {
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
	
	gl.useProgram(program);
	
	var eyeUniformLocation = gl.getUniformLocation(program, 'eye');
	var upUniformLocation  = gl.getUniformLocation(program, 'up');
	var fwUniformLocation  = gl.getUniformLocation(program, 'fw');
	var ratioUniformLocation  = gl.getUniformLocation(program, 'ratio');
    
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
			if (prevX < 1 | prevY < 1) {
				prevX = e.clientX;
				prevY = e.clientY;
			}
			u += (e.clientX-prevX) / 200;
			v += (e.clientY-prevY) / 200;
			v = clamp(v, 0.01, 3.14);
			camFw = getSphereUV(u, v);
			vec3.add(camAt, camPos, camFw);
			vec3.cross(camRight, camFw, [0, 1, 0]);
			vec3.normalize(camRight, camRight);
			prevX = e.clientX;
			prevY = e.clientY;
			document.getElementById('game-surface').style.cursor = "none";
		}
	}
	
	window.onresize = function (e) {
		resize(projMatrix, matProjUniformLocation, canvas);
	}
	
	//
	// Main render loop
	//
	var loop = function () {
		var camSpeed = 1.0;
        
        { //key actions
            if (isDDown) {
                var right = [0, 0, 0];
                vec3.scale(right, camRight, camSpeed);
                vec3.add(camPos, camPos, right);
                vec3.add(camAt, camAt, right);
            }
            if (isADown) {
                var right = [0, 0, 0];
                vec3.scale(right, camRight, camSpeed);
                vec3.sub(camPos, camPos, right);
                vec3.sub(camAt, camAt, right);
            }
            if (isSDown) {
                var fw = [0, 0, 0];
                vec3.scale(fw, camFw, camSpeed);
                vec3.sub(camPos, camPos, fw);
                vec3.sub(camAt, camAt, fw);
            }
            if (isWDown) {
                var fw = [0, 0, 0];
                vec3.scale(fw, camFw, camSpeed);
                vec3.add(camPos, camPos, fw);
                vec3.add(camAt, camAt, fw);
            }
        }
		
		
		mat4.lookAt(viewMatrix, camPos, camAt, camUp);
		gl.uniform3fv(eyeUniformLocation, camPos);
		gl.uniform3fv(fwUniformLocation, camFw);
        vec3.cross(camUp, camRight, camFw)
        gl.uniform3fv(upUniformLocation, camUp);
		
		
		gl.clearColor(0.75, 0.85, 1.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        
		
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	
};





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
	vec3.normalize(uv, vec3.fromValues(Math.cos(u) * Math.sin(v), Math.cos(v), Math.sin(u)*Math.sin(v)));
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

function resize(projMatrix, matProjUniformLocation, canvas) {
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);
	gl.uniformMatrix4fv(matProjUniformLocation,  gl.FALSE, projMatrix);
}