"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh, Points } from "three";
import * as THREE from "three";
import { cn } from "@/lib/cn";

type FeaturesThreeAtmosphereProps = {
  className?: string;
};

function SoftOrb({
  position,
  color,
  scale = 1,
  speed = 0.35,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = clock.elapsedTime * speed;
    mesh.position.x = base.x + Math.cos(t * 0.7) * 0.28;
    mesh.position.y = base.y + Math.sin(t) * 0.22;
    mesh.position.z = base.z + Math.sin(t * 0.45) * 0.12;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.18}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function DustField({ count = 90 }: { count?: number }) {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    const p = points.current;
    if (!p) return;
    p.rotation.y = clock.elapsedTime * 0.018;
    p.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a78bfa"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function FloatingRing({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.55}>
      <mesh position={position} scale={scale} rotation={[Math.PI / 2.4, 0.2, 0.1]}>
        <torusGeometry args={[1.1, 0.045, 24, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const group = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.08, 0.04);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.y * 0.05, 0.04);
    g.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <group ref={group}>
      <DustField />
      <SoftOrb position={[-3.2, 3.4, -2]} color="#c4b5fd" scale={2.4} speed={0.42} />
      <SoftOrb position={[3.6, 1.2, -2.5]} color="#bfdbfe" scale={2.1} speed={0.48} />
      <SoftOrb position={[-2.4, -2.8, -1.5]} color="#ddd6fe" scale={2.6} speed={0.38} />
      <SoftOrb position={[2.8, -3.6, -2]} color="#e9d5ff" scale={2.2} speed={0.44} />
      <SoftOrb position={[0.2, 0.4, -3]} color="#f5d0fe" scale={1.7} speed={0.52} />
      <SoftOrb position={[-0.8, 4.8, -2.2]} color="#c7d2fe" scale={1.5} speed={0.4} />
      <FloatingRing position={[-1.6, 1.8, -1]} color="#a78bfa" scale={1.15} />
      <FloatingRing position={[2.1, -1.4, -1.2]} color="#818cf8" scale={0.9} />
      <FloatingRing position={[0.4, 3.2, -1.4]} color="#c4b5fd" scale={0.75} />
    </group>
  );
}

/**
 * Soft Three.js atmosphere behind Features → Export sections.
 * Presence + depth only — keeps the light lavender palette, no heavy glow.
 */
export function FeaturesThreeAtmosphere({ className }: FeaturesThreeAtmosphereProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 40 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
          premultipliedAlpha: true,
        }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
