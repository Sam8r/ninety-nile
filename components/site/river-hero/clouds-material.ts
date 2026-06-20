import * as THREE from "three";

/**
 * A transparent sky dome of soft, vague dusk clouds drifting over the HDRI sky.
 * Low coverage + high threshold keeps them wispy ("not big ones"); they fade
 * out at the horizon and overhead. Because it's scene geometry, the Ocean's
 * mirror pass also reflects these clouds in the water.
 */
const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uCloudColor;
  uniform vec3 uCloudShadow;
  uniform float uCoverage;

  varying vec3 vWorldPos;

  float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p, p+34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){
    vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v=0.0, a=0.5; mat2 m=mat2(0.8,-0.6,0.6,0.8);
    for(int i=0;i<5;i++){ v+=a*vnoise(p); p=m*p*2.0; a*=0.5; }
    return v;
  }

  void main() {
    vec3 dir = normalize(vWorldPos - cameraPosition);
    float el = dir.y;                 // elevation, 0 at horizon
    if (el <= 0.0) discard;

    float az = atan(dir.x, -dir.z);
    vec2 uv = vec2(az * 1.8, el * 3.2);
    uv += vec2(uTime * 0.008, uTime * 0.002); // slow drift

    vec2 warp = vec2(fbm(uv + 1.7), fbm(uv * 1.1 - 4.2));
    float n = fbm(uv * 1.3 + warp * 0.7);

    // sparse, soft wisps
    float cov = smoothstep(0.56, 0.82, n);
    // fade just above the horizon and high overhead
    float band = smoothstep(0.015, 0.16, el) * (1.0 - smoothstep(0.55, 0.95, el));
    float alpha = cov * band * uCoverage;

    float lit = smoothstep(0.5, 0.88, n);
    vec3 col = mix(uCloudShadow, uCloudColor, lit);

    gl_FragColor = vec4(col, alpha);
  }
`;

export function createCloudsMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime:        { value: 0 },
      uCloudColor:  { value: new THREE.Color("#f3ddc8") }, // warm dusk-lit
      uCloudShadow: { value: new THREE.Color("#b9aeb4") }, // cool shadow
      uCoverage:    { value: 0.55 },                        // vague
    },
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    fog: false,
  });
}
