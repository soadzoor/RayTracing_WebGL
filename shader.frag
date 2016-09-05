precision mediump float;

varying vec3 vs_out_ray;

uniform vec3 eye;

const float EPSILON = 0.001;

struct Ray
{
	vec3 origin;
	vec3 dir;
};

bool intersectSphere(in Ray ray, in vec4 sphere)
{
	vec3 dist = ray.origin - sphere.xyz;
	float b = dot(dist, ray.dir)*2.0; //skalaris szorzat
	float a = dot(ray.dir, ray.dir);
	float c = dot(dist, dist) - dot(sphere.w, sphere.w);

	float discr = b*b - 4.0 * a * c;
	if (discr < 0.0)
	{
		return false;
	}
	float sqrt_discr = sqrt(discr);
	float t1 = (-b + sqrt_discr)/2.0/a;
	float t2 = (-b - sqrt_discr)/2.0/a;
	float t;
	if (t1 < EPSILON)
	{
		t1 = -EPSILON;
	}
	if (t2 < EPSILON)
	{
		t2 = -EPSILON;
	}
	if (t1 < 0.0 && t2 < 0.0)
	{
		return false;
	}
	if (t1 < 0.0)
	{
		return false;
	}
	if (t2 > 0.0)
	{
		t = t2;
	}
	else
	{
		t = t1;
	}

	return true;
}

void main()
{
    Ray ray;
    ray.origin = eye;
    ray.dir = normalize(vs_out_ray);
    if (intersectSphere(ray, vec4(0, 0, 0, 1)))
    {
        discard;
    }
	gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}