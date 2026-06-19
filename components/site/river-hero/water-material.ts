import * as THREE from "three";

/**
 * Flowing-water shader material: scrolling flow-noise gives a continuous
 * downstream current, while a `uPointer` uniform adds ripple displacement
 * at the contact point (mouse / touch).
 *
 * The material reads Bauhaus brand colors from CSS variables at init time
 * and exposes `uTime`, `uPointer`, and `uRippleStrength` uniforms for
 * per-frame updates.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uRippleStrength;

  varying vec2 vUv;
  varying float vWave;

  // Simple hash-based noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vUv = uv;

    // Continuous downstream flow
    float flow = noise(uv * 4.0 + vec2(uTime * 0.3, uTime * 0.15)) * 0.5;

    // Ripple displacement at pointer position
    float dist = distance(uv, uPointer);
    float ripple = sin(dist * 40.0 - uTime * 6.0) * exp(-dist * 6.0) * uRippleStrength;

    vWave = flow + ripple;

    vec3 newPosition = position;
    newPosition.z += vWave * 0.15;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3  uWaterColor;
  uniform vec3  uHighlightColor;
  uniform float uTime;

  varying vec2  vUv;
  varying float vWave;

  void main() {
    // Base water color with wave-based brightness modulation
    float brightness = smoothstep(-0.3, 0.5, vWave);
    vec3 color = mix(uWaterColor * 0.6, uWaterColor, brightness);

    // Highlight crests
    float crest = smoothstep(0.25, 0.5, vWave);
    color = mix(color, uHighlightColor, crest * 0.5);

    // Subtle horizontal flow lines for a river feel
    float lines = sin(vUv.y * 80.0 + uTime * 2.0) * 0.5 + 0.5;
    color += vec3(lines * 0.03);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function readCssVar(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return val || fallback;
}

export function createWaterMaterial(): THREE.ShaderMaterial {
  const waterHex = readCssVar("--brand-secondary", "#005fa8");
  const highlightHex = readCssVar("--brand-accent", "#e10600");

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uRippleStrength: { value: 0 },
      uWaterColor: { value: new THREE.Color(waterHex) },
      uHighlightColor: { value: new THREE.Color(highlightHex) },
    },
    side: THREE.DoubleSide,
  });
}
