precision mediump float;

attribute vec3 vertPosition;

varying vec3 vs_out_ray;

uniform vec3 eye;
uniform vec3 up;
uniform vec3 fw;
uniform float ratio;

void main()
{
	gl_Position = vec4( vertPosition, 1 );
    
    vec3 right = normalize(cross(fw, up));
    vec3 pos = eye + fw*3.0 + ratio*right*vertPosition.x + up*vertPosition.y;
    
    vs_out_ray = pos - eye;
}