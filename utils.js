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
		gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,
		gl.UNSIGNED_BYTE,
		document.getElementById(textureID)
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

	return texture;
}

function setTexture(Location, _sampler, _textureID) {
	gl.activeTexture(gl.TEXTURE0 + _sampler);
	gl.bindTexture(gl.TEXTURE_2D, _textureID);
	gl.uniform1i(Location, _sampler);
}

function setIntegerUniform(Location, number) {
	gl.uniform1i(Location, number);
}
function setBoolUniform(Location, variable) {
	gl.uniform1i(Location, variable);
}
function setFloatUniform(Location, number) {
	gl.uniform1f(Location, number);
}
function setVec2Uniform(Location, numbers) {
	gl.uniform2fv(Location, numbers);
}
function setVec3Uniform(Location, numbers) {
	gl.uniform3fv(Location, numbers);
}
function setVec4Uniform(Location, numbers) {
	gl.uniform4fv(Location, numbers);
}

/*function getF0(n, k) { // toresmutato, kioltasi tenyezo
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
}*/

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

function setResolution(canvas) {
	var width  = document.getElementById("canvasWidth").valueAsNumber;
	var height = document.getElementById("canvasHeight").valueAsNumber;
	ratio = width / height;
	canvas.width = width;
	canvas.height = height;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	
	return ratio;
}
function setFullScreen(canvas) {
	var width  = screen.width;
	var height = screen.height;
	ratio = width / height;
	canvas.width = width;
	canvas.height = height;
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	if (canvas.requestFullscreen) {
		canvas.requestFullscreen();
	} else if (canvas.msRequestFullscreen) {
		canvas.msRequestFullscreen();
	} else if (canvas.mozRequestFullScreen) {
		canvas.mozRequestFullScreen();
	} else if (canvas.webkitRequestFullscreen) {
		canvas.webkitRequestFullscreen();
	}
	
	return ratio;
}

function getUnmaskedInfo(gl) {
	var unMaskedInfo = {
		renderer: '',
		vendor: ''
	};

	var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
	if (dbgRenderInfo != null) {
		unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
		unMaskedInfo.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
	}

	return unMaskedInfo;
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