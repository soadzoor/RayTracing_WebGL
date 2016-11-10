#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#elif GL_FRAGMENT_PRECISION_MEDIUM
	precision mediump float;
#else
	precision lowp float;
#endif
in vec3 vertPosition;
out vec3 vsRay;
uniform vec3 eye;
uniform vec3 up;
uniform vec3 fw;
uniform vec3 right;
uniform float ratio;
void main ()
{
  highp vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = vertPosition;
  gl_Position = tmpvar_1;
  vsRay = (((
    (eye + (fw * 3.0))
   + 
    ((ratio * right) * vertPosition.x)
  ) + (up * vertPosition.y)) - eye);
}
