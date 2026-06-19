"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createWaterMaterial } from "./water-material";
import { RiverFallback } from "./river-fallback";

export interface RiverHeroProps {
  fallbackSrc?: string;
  colors?: { water?: string; highlight?: string };
  bandFraction?: number;
  className?: string;
}

/** True if the user prefers reduced motion. */
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

/** True if WebGL2 context can be created. */
function useWebGLAvailable(): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      setAvailable(!!gl);
    } catch {
      setAvailable(false);
    }
  }, []);
  return available;
}

/** Scene content: a plane with the flowing-water shader. */
function WaterPlane({
  pointerRef,
  visibleRef,
}: {
  pointerRef: React.RefObject<THREE.Vector2>;
  visibleRef: React.RefObject<boolean>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { size } = useThree();

  const material = useMemo(() => createWaterMaterial(), []);

  useFrame((_, delta) => {
    if (!visibleRef.current) return;
    const mat = materialRef.current ?? material;
    const uTime = mat.uniforms.uTime!;
    uTime.value += delta;

    // Smoothly track pointer
    const target = pointerRef.current;
    const uPointer = mat.uniforms.uPointer!;
    (uPointer.value as THREE.Vector2).lerp(target, 0.1);

    // Ripple strength decays then reactivates on move
    const strength = mat.uniforms.uRippleStrength!;
    strength.value *= 0.95;
    if (strength.value < 0.01) strength.value = 0;
  });

  return (
    <mesh ref={meshRef} scale={[size.width, size.height, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
}

export function RiverHero(props: RiverHeroProps) {
  const { fallbackSrc, className } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef(new THREE.Vector2(0.5, 0.5));
  const visibleRef = useRef(true);

  const reduced = usePrefersReducedMotion();
  const webglOk = useWebGLAvailable();

  // Pause when offscreen or tab hidden
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

  // Pointer / touch ripple
  useEffect(() => {
    if (reduced || !webglOk) return;
    const el = containerRef.current;
    if (!el) return;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      pointerRef.current.set(
        THREE.MathUtils.clamp(x, 0, 1),
        THREE.MathUtils.clamp(y, 0, 1),
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        updatePointer(touch.clientX, touch.clientY);
      }
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [reduced, webglOk]);

  // Fallback during initial load check, reduced motion, or no WebGL
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
        camera={{ position: [0, 0, 1], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#005fa8");
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <WaterPlane pointerRef={pointerRef} visibleRef={visibleRef} />
      </Canvas>
    </div>
  );
}
