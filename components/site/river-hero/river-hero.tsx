"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { createCloudsMaterial } from "./clouds-material";
import { RiverFallback } from "./river-fallback";

export interface RiverHeroProps {
  fallbackSrc?: string;
  className?: string;
}

interface InteractionState {
  hover: THREE.Vector2;
  hoverActive: boolean;
  click: THREE.Vector2;
  clickStrength: number;
  clickAge: number;
}

// Low, warm dusk sun.
const SUN_DIRECTION = new THREE.Vector3(0.25, 0.16, -0.72).normalize();
const WATER_DISTORTION_BASE = 2.0;
// Warm dusk haze the sea fades into at the horizon (matched to the sky).
const HORIZON_HAZE = new THREE.Color("#d3c3bc");

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useWebGLAvailable(): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setAvailable(!!canvas.getContext("webgl2"));
    } catch {
      setAvailable(false);
    }
  }, []);
  return available;
}

/** Warm dusk HDRI sky; calls onReady once loaded. */
function SkyEnvironment({ onReady }: { onReady: () => void }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    let active = true;
    let loaded: THREE.Texture | null = null;
    new RGBELoader().load(
      "/textures/sky-dusk.hdr",
      (tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        if (!active) {
          tex.dispose();
          return;
        }
        loaded = tex;
        scene.background = tex;
        scene.environment = tex;
        // Soft atmospheric dusk haze (also smooths the sea's reflection).
        scene.backgroundBlurriness = 0.18;
        // Distance haze so the sea melts into the dusk skyline (no hard horizon).
        scene.fog = new THREE.Fog(HORIZON_HAZE, 120, 1400);
        // Aim the warm glow toward the horizon the camera faces.
        scene.backgroundRotation.set(0, 0.9, 0);
        scene.environmentRotation.set(0, 0.9, 0);
        onReady();
      },
      undefined,
      () => onReady(),
    );
    return () => {
      active = false;
      if (scene.background === loaded) scene.background = null;
      if (scene.environment === loaded) scene.environment = null;
      scene.fog = null;
      loaded?.dispose();
    };
  }, [scene, onReady]);
  return null;
}

/** Vague, drifting dusk clouds on a transparent dome over the HDRI sky.
 *  Also reflected by the Ocean's mirror pass. */
function CloudDome({ visibleRef }: { visibleRef: React.RefObject<boolean> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createCloudsMaterial(), []);
  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      material.dispose();
      mesh?.geometry.dispose();
    };
  }, [material]);
  useFrame((_, dt) => {
    if (!visibleRef.current) return;
    material.uniforms.uTime!.value += dt;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2200, 48, 24]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/** Reflective dusk sea (three.js Ocean Water): cursor ripples plus breaking
 *  wave crests that roll toward the camera. */
function Ocean({
  interactionRef,
  visibleRef,
}: {
  interactionRef: React.RefObject<InteractionState>;
  visibleRef: React.RefObject<boolean>;
}) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4000, 4000);
    const waterNormals = new THREE.TextureLoader().load(
      "/textures/waternormals.jpg",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      },
    );
    // Anisotropy keeps the ripples crisp at the low, grazing dusk angle
    // (a normal map stays linear — never set sRGB on it).
    waterNormals.anisotropy = gl.capabilities.getMaxAnisotropy();
    const w = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: SUN_DIRECTION.clone(),
      sunColor: 0xffd2a0,
      waterColor: 0x18242e, // deep, slightly desaturated dusk sea
      distortionScale: WATER_DISTORTION_BASE,
      fog: true, // fade into scene.fog at the horizon for a seamless skyline
    });
    w.rotation.x = -Math.PI / 2;
    w.position.y = 0;

    const mat = w.material as THREE.ShaderMaterial;
    mat.uniforms.size!.value = 6.0; // finer ripple tiling (kept sharp by anisotropy)
    mat.uniforms.uHoverPoint = { value: new THREE.Vector3() };
    mat.uniforms.uHoverStrength = { value: 0 };
    mat.uniforms.uClickPoint = { value: new THREE.Vector3() };
    mat.uniforms.uClickStrength = { value: 0 };
    mat.uniforms.uClickAge = { value: 999 };

    mat.fragmentShader = mat.fragmentShader
      .replace(
        "uniform float distortionScale;",
        `uniform float distortionScale;
         uniform vec3 uHoverPoint; uniform float uHoverStrength;
         uniform vec3 uClickPoint; uniform float uClickStrength; uniform float uClickAge;`,
      )
      .replace(
        "vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );",
        `vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );
         float _hpd = distance( worldPosition.xz, uHoverPoint.xz );
         vec2  _hrd = normalize( worldPosition.xz - uHoverPoint.xz + 1e-4 );
         float _hw  = sin( _hpd*0.5 - time*4.0 ) * exp( -_hpd*0.07 ) * uHoverStrength;
         float _cpd = distance( worldPosition.xz, uClickPoint.xz );
         float _front = uClickAge*18.0;
         float _cband = exp( -pow((_cpd-_front)/11.0,2.0) ) / (1.0+_front*0.05);
         vec2  _crd = normalize( worldPosition.xz - uClickPoint.xz + 1e-4 );
         float _cw = sin( _cpd*0.7 - time*5.5 ) * _cband * uClickStrength * exp(-_cpd*0.012);
         surfaceNormal.xz += _hrd*_hw*0.8 + _crd*_cw*1.7;
         surfaceNormal = normalize( surfaceNormal );`,
      )
      .replace(
        "vec3 outgoingLight = albedo;",
        `vec3 outgoingLight = albedo;
         outgoingLight *= 1.0 + _hw*0.35 + _cw*0.45; // subtle cursor ripple only`,
      );
    mat.needsUpdate = true;
    return w;
  }, [gl]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const seaPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const mat = water.material as THREE.ShaderMaterial;
    return () => {
      water.geometry.dispose();
      mat.uniforms.normalSampler?.value?.dispose?.();
      mat.dispose();
    };
  }, [water]);

  useFrame((_, dt) => {
    if (!visibleRef.current) return;
    const it = interactionRef.current;
    const u = (water.material as THREE.ShaderMaterial).uniforms;
    u.time!.value += dt * 0.6;

    raycaster.setFromCamera(it.hover, camera);
    if (raycaster.ray.intersectPlane(seaPlane, hit)) {
      (u.uHoverPoint!.value as THREE.Vector3).copy(hit);
    }
    u.uHoverStrength!.value = THREE.MathUtils.lerp(
      u.uHoverStrength!.value,
      it.hoverActive ? 0.16 : 0,
      0.08,
    );
    raycaster.setFromCamera(it.click, camera);
    if (raycaster.ray.intersectPlane(seaPlane, hit)) {
      (u.uClickPoint!.value as THREE.Vector3).copy(hit);
    }
    it.clickAge += dt;
    it.clickStrength *= 0.985;
    if (it.clickStrength < 0.001) it.clickStrength = 0;
    u.uClickAge!.value = it.clickAge;
    u.uClickStrength!.value = it.clickStrength;
    u.distortionScale!.value = THREE.MathUtils.lerp(
      u.distortionScale!.value,
      WATER_DISTORTION_BASE + it.clickStrength * 1.5,
      0.1,
    );
  });

  return <primitive object={water} />;
}

/** Gentle bob/sway as if drifting on a calm swell. */
function CameraRig({ visibleRef }: { visibleRef: React.RefObject<boolean> }) {
  const cam = useThree((s) => s.camera);
  const t = useRef(0);
  useFrame((_, dt) => {
    if (!visibleRef.current) return;
    t.current += dt;
    const tt = t.current;
    const bob = Math.sin(tt * 0.5);
    cam.position.set(
      Math.sin(tt * 0.25) * 0.35,
      5.2 + bob * 0.35,
      10.5 + Math.sin(tt * 0.4) * 0.5,
    );
    cam.lookAt(0, 11.5 + bob * 0.25, -90);
  });
  return null;
}

export function RiverHero(props: RiverHeroProps) {
  const { fallbackSrc, className } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<InteractionState>({
    hover: new THREE.Vector2(0, 0),
    hoverActive: false,
    click: new THREE.Vector2(0, 0),
    clickStrength: 0,
    clickAge: 999,
  });
  const visibleRef = useRef(true);

  const reduced = usePrefersReducedMotion();
  const webglOk = useWebGLAvailable();

  const handleReady = useCallback(() => {
    window.dispatchEvent(new Event("hero-ready"));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(el);
    const onVis = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (reduced || !webglOk) window.dispatchEvent(new Event("hero-ready"));
  }, [reduced, webglOk]);

  useEffect(() => {
    if (reduced || !webglOk) return;
    const el = containerRef.current;
    if (!el) return;
    const it = interactionRef.current;

    const within = (cx: number, cy: number, r: DOMRect) =>
      cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    const toNdc = (cx: number, cy: number, r: DOMRect, out: THREE.Vector2) =>
      out.set(((cx - r.left) / r.width) * 2 - 1, -(((cy - r.top) / r.height) * 2 - 1));

    const setHover = (cx: number, cy: number) => {
      const rect = el.getBoundingClientRect();
      if (!within(cx, cy, rect)) {
        it.hoverActive = false;
        return;
      }
      toNdc(cx, cy, rect, it.hover);
      it.hoverActive = true;
    };
    const setClick = (cx: number, cy: number) => {
      const rect = el.getBoundingClientRect();
      if (!within(cx, cy, rect)) return;
      toNdc(cx, cy, rect, it.click);
      it.clickStrength = 1.0;
      it.clickAge = 0;
    };

    const onPointerMove = (e: PointerEvent) => setHover(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => setClick(e.clientX, e.clientY);
    const onPointerLeave = () => {
      it.hoverActive = false;
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setClick(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setHover(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      it.hoverActive = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [reduced, webglOk]);

  if (reduced || !webglOk) {
    return (
      <div ref={containerRef} className={className} aria-hidden>
        <RiverFallback src={fallbackSrc} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className ?? ""}`}
      aria-hidden
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 4.5, 10], fov: 55, near: 0.1, far: 6000 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#caa789");
          gl.toneMappingExposure = 1.06; // a touch more dusk glow
          // (camera framing is owned by <CameraRig />)
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <SkyEnvironment onReady={handleReady} />
        <CloudDome visibleRef={visibleRef} />
        <CameraRig visibleRef={visibleRef} />
        <Ocean interactionRef={interactionRef} visibleRef={visibleRef} />
      </Canvas>
    </div>
  );
}
