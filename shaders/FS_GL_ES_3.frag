#version 300 es

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#elif GL_FRAGMENT_PRECISION_MEDIUM
	precision mediump float;
#else
	precision lowp float;
#endif

#define EPSILON 0.001
#define PI 3.14159265359
#define skyboxDistance 10000.0
#define STACK_SIZE 8
#define spheresCount 10
#define trianglesCount 2

// attribs from the vertex shader
in vec3 vsRay;

// Frag Color
out vec4 fragColor;

uniform vec3 eye;

uniform sampler2D sunTexture;
uniform sampler2D earthTexture;
uniform sampler2D earthNormalMap;
uniform sampler2D moonTexture;
uniform sampler2D moonNormalMap;
uniform sampler2D groundTexture;

uniform sampler2D skyboxTextureBack;
uniform sampler2D skyboxTextureDown;
uniform sampler2D skyboxTextureFront;
uniform sampler2D skyboxTextureLeft;
uniform sampler2D skyboxTextureRight;
uniform sampler2D skyboxTextureUp;

struct Ray
{
	vec3 origin;
	vec3 dir;
};
struct Material
{
	vec3 amb;
	vec3 dif;
	vec3 spec;
	float pow;
	bool refractive;
	bool reflective;
	vec3 f0;
	float n;
};
struct Light
{
	vec3 col;
	vec3 pos;
};
struct Plane
{
	vec3 n; // the plane's normal
	vec3 q; // a point on the plane
};
struct Disc
{
	vec3  o;
	vec3  n;
	float r;
};
struct Triangle
{
	vec3 A, B, C;
};
struct HitRec
{
	int ind;
	float t;
	vec3 point;
	vec3 normal;
	vec3 origo;
};

uniform vec4 spheres[spheresCount];
//vec2 torus = vec2(1.0, 0.25);
uniform float time;

Light light0 = Light(vec3(1.0), vec3(0.0));
Light light1 = Light(vec3(1.0), vec3(-2.0, 20.0, 0.0));
Light light2 = Light(vec3(1.0), vec3(20.0, 20.0, 0.0));

Disc ground = Disc(vec3(0.0, -10.0, 0.0), vec3(0.0, 1.0, 0.0), 30.0);

Plane skyboxBack  = Plane(vec3(0.0, 0.0, -1.0), vec3(0.0, 0.0, skyboxDistance));
Plane skyboxDown  = Plane(vec3(0.0, 1.0, 0.0),  vec3(0.0, -skyboxDistance, 0.0));
Plane skyboxFront = Plane(vec3(0.0, 0.0, 1.0),  vec3(0.0, 0.0, -skyboxDistance));
Plane skyboxLeft  = Plane(vec3(1.0, 0.0, 0.0),  vec3(-skyboxDistance, 0.0, 0.0));
Plane skyboxRight = Plane(vec3(-1.0, 0.0, 0.0), vec3(skyboxDistance, 0.0, 0.0));
Plane skyboxUp    = Plane(vec3(0.0, -1.0, 0.0), vec3(0.0, skyboxDistance, 0.0));

Triangle triangle0 = Triangle(
	vec3(-14.0, 14.0, -14.0),
	vec3(-14.0, -5.0, -12.0),
	vec3( 14.0, -5.0, -12.0)
);

Triangle triangle1 = Triangle(
	vec3(-14.0, 14.0, -14.0),
	vec3( 14.0, -5.0, -12.0),
	vec3( 14.0, 14.0, -14.0)
);

Material material0  = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0), 30.0, false, false, vec3(0.0), 1.0); // sun
Material material1  = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8), 20.0, false, false, vec3(0.0), 1.0);   // green sphere
Material material2  = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0), 50.0, false, false, vec3(0.0), 1.0);   // blue sphere
Material material3  = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5), 30.0, false, false, vec3(0.0), 1.0);    // earth
Material material4  = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5), 20.0, false, false, vec3(0.0), 1.0);   // moon
Material material5  = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9), 20.0, false, false, vec3(0.0), 1.0);   // sphere of lightsources
Material material7  = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8), 66.0, false, false, vec3(0.0), 1.0);   // red sphere
Material material8  = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, false, true, vec3(0.93806, 0.846365, 0.391481), 1.0); //golden sphere
Material material9  = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0), 70.0, true, true, vec3(0.04), 1.5); // glass sphere
Material material10 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8), 120.0, false, true, vec3(0.9691, 0.90355, 0.952236), 1.0); // triangle 1, 2
Material material12 = Material(vec3(0.25), vec3(0.3, 0.34, 0.36), vec3(0.8), 60.0, false, false, vec3(0.0), 1.0);                        // ground
//Material material13 = Material(vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.4), vec3(0.8), 30.0, false, false, vec3(0.0), 1.0);                          //torus
Material material14 = Material(vec3(0.5), vec3(0.5), vec3(0.5), 20.0, false, false, vec3(0.0), 1.0);

uniform int depth;
uniform bool isShadowOn;
uniform bool useNormalMap;
uniform bool isGlowOn;
//uniform bool showTorus;

uniform int colorModeInTernary[3];

struct Stack
{
	Ray ray;
	vec3 coeff;
	int depth;
};

mat3 rotationMatrix(in vec3 axis, in float angle) //http://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}

mat3 calculateR(in vec3 normal)
{
	normalize(normal);

	float cosAngle = dot(normal, vec3(0.0, 0.0, 1.0));
	float angle = acos(cosAngle);
	vec3 axis = cross(normal, vec3(0.0, 0.0, 1.0));

	if (length(axis) < EPSILON)
	{
		return mat3(1.0, 0.0, 0.0,
					0.0, 1.0, 0.0,
					0.0, 0.0, 1.0);
	}
	
	mat3 R = rotationMatrix(axis, angle);
	return R;
}





bool intersectSphere(in Ray ray, in vec4 sphere, out HitRec hitRec, in int ind)
{
	vec3 dist = ray.origin - sphere.xyz;
	float b = dot(dist, ray.dir)*2.0;
	float a = dot(ray.dir, ray.dir);
	float c = dot(dist, dist) - dot(sphere.w, sphere.w);

	float discr = b*b - 4.0 * a * c;
	if (discr < 0.0) return false;
	float sqrtDiscr = sqrt(discr);
	float t1 = (-b + sqrtDiscr)/2.0/a;
	float t2 = (-b - sqrtDiscr)/2.0/a;
	float t;
	if (t1 < EPSILON) t1 = -EPSILON;
	if (t2 < EPSILON) t2 = -EPSILON;
	if (t1 < 0.0) return false;
	if (t2 > 0.0) t = t2;
	else t = t1;

	hitRec.ind = ind;
	hitRec.t = t;
	hitRec.origo = vec3(sphere.xyz);
	hitRec.point = ray.origin + t*ray.dir;
	hitRec.normal = normalize(hitRec.point - hitRec.origo);

	return true;
}
bool intersectTriangle(in Ray ray, in Triangle t, out HitRec hitRec, in int ind) //Moller-Trumbore
{
  vec3 e1, e2;  //Edge1, Edge2
  vec3 P, Q, T;
  float det, invDet, u, v;
  float t1;

  //Find vectors for two edges sharing V1
  e1 = t.B - t.A;
  e2 = t.C - t.A;
  //Begin calculating determinant - also used to calculate u parameter
  P = cross(ray.dir, e2);
  //if determinant is near zero, ray lies in plane of triangle
  det = dot(e1, P);
  //NOT CULLING
  //if(det < EPSILON ) return false;
  invDet = 1.0 / det;

  //calculate distance from V1 to ray origin
  T = ray.origin - t.A;

  //Calculate u parameter and test bound
  u = dot(T, P) * invDet;
  //The intersection lies outside of the triangle
  if(u < 0.0 || u > 1.0) return false;

  //Prepare to test v parameter
  Q = cross(T, e1);

  //Calculate V parameter and test bound
  v = dot(ray.dir, Q) * invDet;
  //The intersection lies outside of the triangle
  if(v < 0.0 || u + v  > 1.0) return false;

  t1 = dot(e2, Q) * invDet;

  if(t1 > EPSILON) 
  { //ray intersection
		hitRec.t = t1;
		hitRec.ind = ind;
		hitRec.point = ray.origin + ray.dir * t1;
		hitRec.normal = normalize(cross(t.B-t.A, t.C-t.A));
		hitRec.origo = (t.A+t.B+t.C)/3.0;
		return true;
  }

  return false;
}

bool intersectPlane(in Ray ray, in Plane plane, out HitRec hitRec, in int ind)
{
	//if (dot(ray.dir, plane.n) > 0.0) //culling
	//{
	//	return false;
	//}

	float t = dot(plane.n,(plane.q - ray.origin)) / dot(plane.n, ray.dir);

	if (t < EPSILON ) return false;

	hitRec.ind = ind;
	hitRec.t = t;
	hitRec.origo = plane.q;
	hitRec.point = ray.origin + t*ray.dir;
	hitRec.normal = plane.n;
	
	return true;
}

bool intersectDisc(in Ray ray, in Disc disc, out HitRec hitRec, in int ind)
{
	Plane plane;
	plane.n = disc.n;
	plane.q = disc.o;

    if (intersectPlane(ray, plane, hitRec, ind)) 
	{ 
        vec3 p = ray.origin + hitRec.t*ray.dir; 
        vec3 v = p - disc.o; 
        if (!(length(v) <= disc.r))
		{
			return false;
		}
	
		return true;
    }

	return false;
}


/*
bool intersectTorus(in Ray ray, in vec2 torus, out HitRec hitRec, in int ind)
{
	ray.origin.z -= 40.0;
	float Ra2 = torus.x*torus.x;
	float ra2 = torus.y*torus.y;
	
	float m = dot(ray.origin, ray.origin);
	float n = dot(ray.origin, ray.dir);
		
	float k = (m - ra2 - Ra2)/2.0;
	float a = n;
	float b = n*n + Ra2*ray.dir.y*ray.dir.y + k;
	float c = k*n + Ra2*ray.origin.y*ray.dir.y;
	float d = k*k + Ra2*ray.origin.y*ray.origin.y - Ra2*ra2;
	
    //----------------------------------

	float p = -3.0*a*a     + 2.0*b;
	float q =  2.0*a*a*a   - 2.0*a*b   + 2.0*c;
	float r = -3.0*a*a*a*a + 4.0*a*a*b - 8.0*a*c + 4.0*d;
	p /= 3.0;
	r /= 3.0;
	float Q = p*p + r;
	float R = 3.0*r*p - p*p*p - q*q;
	
	float h = R*R - Q*Q*Q;
	float z = 0.0;
	if( h < 0.0 )
	{
		float sQ = sqrt(Q);
		z = 2.0*sQ*cos( acos((R/(sQ*Q))) / 3.0 );
	}
	else
	{
		float sQ = pow( sqrt(h) + abs(R), 1.0/3.0 );
		z = sign(R)*abs( sQ + Q/sQ );

	}
	
	z = p - z;
	
    //----------------------------------
	
	float d1 = z   - 3.0*p;
	float d2 = z*z - 3.0*r;

	if( abs(d1)<EPSILON )
	{
		if( d2<0.0 ) return false;
		d2 = sqrt(d2);
	}
	else
	{
		if( d1<0.0 ) return false;
		d1 = sqrt( d1/2.0 );
		d2 = q/d1;
	}

    //----------------------------------
	
	float result = 1e20;

	h = d1*d1 - z + d2;
	if( h>0.0 )
	{
		h = sqrt(h);
		float t1 = -d1 - h - a;
		float t2 = -d1 + h - a;
		     if( t1>0.0 ) result=t1;
		else if( t2>0.0 ) result=t2;
	}

	h = d1*d1 - z - d2;
	if( h>0.0 )
	{
		h = sqrt(h);
		float t1 = d1 - h - a;
		float t2 = d1 + h - a;
		     if( t1>0.0 ) result=min(result,t1);
		else if( t2>0.0 ) result=min(result,t2);
	}
	
    if (result > 0.0 && result < 100.0) //hit
    {
        hitRec.t = result;
        hitRec.point = ray.origin + hitRec.t*ray.dir;
		hitRec.ind = ind;
        hitRec.normal = normalize( hitRec.point*(dot(hitRec.point,hitRec.point)- torus.y*torus.y - torus.x*torus.x*vec3(1.0,-1.0,1.0)));
        return true;
    }
	return false;
}
*/

vec3 glow(in float d, in vec3 glow)
{
	return glow*clamp((2.0/(0.5 + d*d)), 0.0, 1.0);
}

bool findClosest(in Ray ray, inout HitRec hitRec)
{
	HitRec hitTemp;
	
	float minT = -1.0;
	bool hit = false;
	
	for (int i = 0; i < spheresCount; ++i) 
	{
		if (intersectSphere(ray, spheres[i], hitTemp, i))
		{
			
			if (hitTemp.t < minT || minT < 0.0)
			{
				minT = hitTemp.t;
				hitRec = hitTemp;
			}
			hit = true;
		}
	}
	if (intersectTriangle(ray, triangle0, hitTemp, spheresCount))
    {
        if (hitTemp.t < minT || minT < 0.0)
        {
            minT = hitTemp.t;
            hitRec = hitTemp;
        }
        hit = true;
    }
    if (intersectTriangle(ray, triangle1, hitTemp, spheresCount+1))
    {
        if (hitTemp.t < minT || minT < 0.0)
        {
            minT = hitTemp.t;
            hitRec = hitTemp;
        }
        hit = true;
    }
	if (intersectDisc(ray, ground, hitTemp, spheresCount + trianglesCount))
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}
	/*
	if (showTorus ? intersectTorus(ray, torus, hitTemp, spheresCount + trianglesCount + 1) : false)
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}*/
	if (intersectPlane(ray, skyboxBack, hitTemp, spheresCount + trianglesCount + 2))
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxDown, hitTemp, spheresCount + trianglesCount + 3))
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxFront, hitTemp, spheresCount + trianglesCount + 4))
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxLeft, hitTemp, spheresCount + trianglesCount + 5))
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxRight, hitTemp, spheresCount + trianglesCount + 6))
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxUp, hitTemp, spheresCount + trianglesCount + 7))
	{
		if (hitTemp.t < minT || minT < 0.0)
		{
			minT = hitTemp.t;
			hitRec = hitTemp;
		}
		hit = true;
	}

	return hit;
}


Material getMaterial(in int i)
{
    if (i == 0)  return material0;
    if (i == 1)  return material1;
    if (i == 2)  return material2;
    if (i == 3)  return material3;
    if (i == 4)  return material4;
    if (i == 5)  return material5;
    if (i == 6)  return material5;   // same material
    if (i == 7)  return material7;
    if (i == 8)  return material8;   // gold
    if (i == 9)  return material9;   // glass
	if (i >= 10 && i < spheresCount) return material10;
	if (i == spheresCount || i == spheresCount+1) return material10;
	if (i == spheresCount+trianglesCount) return material12;
	//if (i == spheresCount+trianglesCount+1) return material13;
	if (i > spheresCount+trianglesCount+1) return material14;
	else return material0;
}

vec3 shade(in HitRec closestHit, in Ray ray) //Blinn-Phong
{
	vec3 refDir = normalize(reflect(closestHit.point - ray.origin, closestHit.normal));
	vec3 color = getMaterial(closestHit.ind).amb;
	vec3 diffuse = vec3(0.0);
	vec3 specular = vec3(0.0);

	//
	// with light0
	//
	vec3 toLight = light0.pos - closestHit.point;
	toLight = normalize(toLight);
	float diffintensity = clamp(dot(closestHit.normal, toLight), 0.0, 1.0);
		
	specular = clamp(((getMaterial(closestHit.ind).spec*light0.col)*pow(clamp(dot(toLight, refDir), 0.0, 1.0), getMaterial(closestHit.ind).pow)), 0.0, 1.0);
	diffuse = clamp((getMaterial(closestHit.ind).dif*diffintensity*light0.col), 0.0, 1.0);

		
	if (isShadowOn)
	{
		HitRec shadowHit = closestHit;
		int ind = shadowHit.ind;
		Ray shadowRay;
		shadowRay.origin = shadowHit.point+shadowHit.normal*EPSILON;
		shadowRay.dir = normalize(light0.pos-shadowHit.point);
		findClosest(shadowRay, shadowHit);
		if (shadowHit.ind != 0 && shadowHit.ind != 5 && shadowHit.ind != 6 && shadowHit.ind != spheresCount+trianglesCount && shadowHit.ind != ind && ind <= spheresCount + trianglesCount)
		{
			specular = vec3(0.0); 
			diffuse = vec3(0.0);
		}
	}
	color += diffuse + specular;
	//
	// with light1
	//
	toLight = light1.pos - closestHit.point;
	toLight = normalize(toLight);
	diffintensity = clamp(dot(closestHit.normal, toLight), 0.0, 1.0);
		
	specular = clamp(((getMaterial(closestHit.ind).spec*light1.col)*pow(clamp(dot(toLight, refDir), 0.0, 1.0), getMaterial(closestHit.ind).pow)), 0.0, 1.0);
	diffuse = clamp((getMaterial(closestHit.ind).dif*diffintensity*light1.col), 0.0, 1.0);

		
	if (isShadowOn)
	{
		HitRec shadowHit = closestHit;
		int ind = shadowHit.ind;
		Ray shadowRay;
		shadowRay.origin = shadowHit.point+shadowHit.normal*EPSILON;
		shadowRay.dir = normalize(light1.pos-shadowHit.point);
		findClosest(shadowRay, shadowHit);
		if (shadowHit.ind != 0 && shadowHit.ind != 5 && shadowHit.ind != 6 && shadowHit.ind != spheresCount+trianglesCount && shadowHit.ind != ind && ind <= spheresCount + trianglesCount)
		{
			specular = vec3(0.0); 
			diffuse = vec3(0.0);
		}
	}
	color += diffuse + specular;
	//
	// with light2
	//
	toLight = light2.pos - closestHit.point;
	toLight = normalize(toLight);
	diffintensity = clamp(dot(closestHit.normal, toLight), 0.0, 1.0);
		
	specular = clamp(((getMaterial(closestHit.ind).spec*light2.col)*pow(clamp(dot(toLight, refDir), 0.0, 1.0), getMaterial(closestHit.ind).pow)), 0.0, 1.0);
	diffuse = clamp((getMaterial(closestHit.ind).dif*diffintensity*light2.col), 0.0, 1.0);

		
	if (isShadowOn)
	{
		HitRec shadowHit = closestHit;
		int ind = shadowHit.ind;
		Ray shadowRay;
		shadowRay.origin = shadowHit.point+shadowHit.normal*EPSILON;
		shadowRay.dir = normalize(light2.pos-shadowHit.point);
		findClosest(shadowRay, shadowHit);
		if (shadowHit.ind != 0 && shadowHit.ind != 5 && shadowHit.ind != 6 && shadowHit.ind != spheresCount+trianglesCount && shadowHit.ind != ind && ind <= spheresCount + trianglesCount)
		{
			specular = vec3(0.0); 
			diffuse = vec3(0.0);
		}
	}
	color += diffuse + specular;

	return color;
}

vec3 fresnel(in vec3 dir, in vec3 normal, in vec3 f0)
{
	float cosa = abs(dot(normal, dir));
	vec3 f = f0 + (vec3(1.0)-f0)*pow((1.0-cosa), 5.0);

	return f;
}

vec3 trace(in Ray ray) //https://www.cg.tuwien.ac.at/research/publications/2013/Voglsam_2013_RRT/Voglsam_2013_RRT-Thesis.pdf
{
	vec3 color = vec3(0.0);
	HitRec closestHit;
	float u,v;
	vec2 uv;

	Stack stack[STACK_SIZE]; // max depth
	int stackSize = 0; // current depth
	int bounceCount = 1;
	vec3 coeff = vec3(1.0);
	bool continueLoop = true;

	for (int i = 0; i < 2*STACK_SIZE; ++i)
	{
        if (!continueLoop) break;
        
		if(findClosest(ray, closestHit))
		{
			u = 0.5 - atan(-closestHit.normal.z, -closestHit.normal.x)/(2.0*PI);
			v = 0.5 + asin(-closestHit.normal.y)/PI;

			if (useNormalMap)
			{
				if (closestHit.ind == 3)
				{
					u += time/2.0;
					uv = vec2(u, v);
					vec3 normalFromMap = normalize(2.0*( (texture(earthNormalMap, uv)).rgb ) - 1.0);
			
					mat3 R = calculateR(closestHit.normal);
					closestHit.normal = R*normalFromMap;
				}
				else if (closestHit.ind == 4)
				{
					u += time/7.0;
					uv = vec2(u, v);
					vec3 normalFromMap = normalize(2.0*( (texture(moonNormalMap, uv)).rgb ) - 1.0);
			
					mat3 R = calculateR(closestHit.normal);
					closestHit.normal = R*normalFromMap;
				}
			}
			
			bounceCount++;
			
			Material mat = getMaterial(closestHit.ind);
			vec3 shadeCol = closestHit.ind == 0 ? mat.amb : shade(closestHit, ray);
		
			color += shadeCol*coeff;
			
			if (closestHit.ind == 0) //sun
			{
				u += time/5.0;
				v += time/5.0;
				vec2 uv = vec2(u, v);
				color *= texture(sunTexture, uv).rgb + vec3(0.0, 0.0, 0.5);
			}
			else if (closestHit.ind == 3) //earth
			{
				if (!useNormalMap)
				{
					u += time/2.0;
				}
			
				vec2 uv = vec2(u, v);
				color *= texture(earthTexture, uv).rgb;
			}
			else if (closestHit.ind == 4) //moon
			{
				if (!useNormalMap)
				{
					u += time/7.0;
				}
				vec2 uv = vec2(u, v);
				color *= texture(moonTexture, uv).rgb;
			}
			else if (closestHit.ind == spheresCount+trianglesCount) //ground
			{
				color *= texture(groundTexture, 0.15*closestHit.point.xz).rgb;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 2) //skyboxBack
			{
				color *= texture(skyboxTextureBack, (-closestHit.point.xy + vec2(skyboxDistance, skyboxDistance)) / (2.0*skyboxDistance)).rgb;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 3) //skyboxDown
			{
				color *= texture(skyboxTextureDown, (closestHit.point.xz + vec2(skyboxDistance, skyboxDistance)) / (2.0*skyboxDistance)).rgb;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 4) //skyboxFront
			{
				color *= texture(skyboxTextureFront, (closestHit.point.xy*vec2(1, -1) + vec2(skyboxDistance, skyboxDistance)) / (2.0*skyboxDistance)).rgb;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 5) //skyboxLeft
			{
				color *= texture(skyboxTextureLeft, (closestHit.point.yz + vec2(skyboxDistance, skyboxDistance)) / (2.0*skyboxDistance)).rgb;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 6) //skyboxRight
			{
				color *= texture(skyboxTextureRight, (closestHit.point.zy*vec2(1, -1) + vec2(skyboxDistance, skyboxDistance)) / (2.0*skyboxDistance)).rgb;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 7) //skyboxUp
			{
				color *= texture(skyboxTextureUp, (closestHit.point.xz + vec2(skyboxDistance, skyboxDistance)) / (2.0*skyboxDistance)).rgb;
			}
			bool hitWater = (closestHit.ind == 3 && color.b > color.r && color.b > color.g);
			if ((mat.reflective || mat.refractive || hitWater) && bounceCount <= depth)
			{
				bool totalInternalReflection = false;
				//glass
				if (mat.refractive)
				{
					float eta = 1.0/mat.n;
					Ray refractedRay;

					//                     coming from outside the object  ?                        yes                                       no
					refractedRay.dir = dot(ray.dir, closestHit.normal) <= 0.0 ? refract(ray.dir, closestHit.normal, eta) : refract(ray.dir, -closestHit.normal, 1.0/eta);
					totalInternalReflection = length(refractedRay.dir) < EPSILON;
					if (totalInternalReflection) //total internal reflection ( refract returns with vec3(0.0) if it's a TIR )
					{
						ray.dir = normalize(reflect(ray.dir, -closestHit.normal));
						ray.origin = closestHit.point - closestHit.normal*EPSILON;
					}
					else
					{
						refractedRay.origin = closestHit.point + closestHit.normal*EPSILON*sign(dot(ray.dir, closestHit.normal));
						refractedRay.dir = normalize(refractedRay.dir);
						
						if (!mat.reflective)
						{
							ray = refractedRay;
						}
						else
						{
                            stack[stackSize].coeff = coeff*(vec3(1.0) - fresnel(ray.dir, closestHit.normal, mat.f0));
							stack[stackSize].depth = bounceCount;
							stack[stackSize++].ray = refractedRay;
						}
					}
				}
				//mirror
				if ((mat.reflective && !totalInternalReflection && closestHit.ind != 3) || (hitWater))
				{
					if (dot(ray.dir, closestHit.normal) < 0.0)
					{
						coeff = coeff*fresnel(ray.dir, closestHit.normal, mat.f0);
						ray.dir = normalize(reflect(ray.dir, closestHit.normal));
						ray.origin = closestHit.point + closestHit.normal*EPSILON;
					}
					else
					{
						continueLoop = false;
					}
				}
			}
			else //diffuse material
			{
				continueLoop = false;
			}
		}
		else
		{
			color += vec3(0.6, 0.75, 0.9)*coeff;
			continueLoop = false;
		}
		//
		// glow
		//
		if (isGlowOn)
		{
			vec3 vec = spheres[0].xyz - ray.origin;
			vec3 direction = normalize(ray.dir);
			float t = abs(dot(vec, direction));
			vec3 hitPoint = ray.origin + t*direction;
			float d = length(hitPoint);
			vec3 glowcolor = vec3(1,0.95,0.1);
			vec3 glowness;
			if (length(closestHit.point-eye)+spheres[0].w < length(spheres[0].xyz - eye))
			{
				glowness = vec3(0.0);
			}
			else
			{
				glowness = glow(d, glowcolor);
			}
			color += glowness;
		}

		if (!continueLoop && stackSize > 0)
		{
            ray = stack[--stackSize].ray;
			bounceCount = stack[stackSize].depth;
			coeff = stack[stackSize].coeff;
			continueLoop = true;
		}
	}

	return color;
}

void main()
{
	Ray ray;
	ray.origin = eye;
	ray.dir = normalize(vsRay);
	vec3 color = trace(ray);
	
	fragColor = vec4(color[colorModeInTernary[0]], color[colorModeInTernary[1]], color[colorModeInTernary[2]], 1.0);
}