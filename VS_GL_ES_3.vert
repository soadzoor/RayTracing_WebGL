#version 300 es
precision lowp float;

in vec3 vertPosition;

out vec3 vsRay;

uniform vec3 eye;
uniform vec3 up;
uniform vec3 fw;
uniform vec3 right;
uniform float ratio;

void main()
{
	gl_Position = vec4( vertPosition, 1.0 );

	vec3 pos = eye + fw*3.0 + ratio*right*vertPosition.x + up*vertPosition.y;

	vsRay = pos - eye;
}