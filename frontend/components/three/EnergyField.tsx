"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 420 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 14;
      arr[i3 + 1] = (Math.random() - 0.5) * 8;
      arr[i3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.04;
    points.current.rotation.x = Math.sin(t * 0.15) * 0.05;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#9b7bff"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

function EnergyOrb({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.35;
    mesh.current.rotation.z = t * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          roughness={0.25}
          metalness={0.55}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 2]} intensity={1.4} color="#8b5cf6" />
      <pointLight position={[-4, -2, 1]} intensity={1.1} color="#3b82f6" />
      <ParticleField />
      <EnergyOrb position={[-3.2, 1.4, -1]} color="#a78bfa" scale={1.1} />
      <EnergyOrb position={[3.4, -1.1, -0.5]} color="#60a5fa" scale={0.85} />
      <EnergyOrb position={[0.2, 2.2, -2]} color="#c084fc" scale={0.55} />
    </>
  );
}

export function EnergyField() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] opacity-70"
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
