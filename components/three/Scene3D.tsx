"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { CrownChandelier, LinearPendant, CascadeChandelier } from "./fixtures";
import { kelvinToRgb } from "@/lib/kelvin";

export type FixtureKind = "crown" | "linear" | "cascade";

export default function Scene3D({
  fixture,
  kelvin,
  intensity,
}: {
  fixture: FixtureKind;
  kelvin: number;
  intensity: number;
}) {
  const color = useMemo(() => {
    const [r, g, b] = kelvinToRgb(kelvin);
    return new THREE.Color(r / 255, g / 255, b / 255);
  }, [kelvin]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.4, 5.6], fov: 42 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
    >
      {/* deep base ambient — barely there, lets the bulbs do the work */}
      <ambientLight intensity={0.04} />

      {/* a single cool key light from above to define silhouette in the dark */}
      <spotLight
        position={[0, 6, 4]}
        angle={0.55}
        penumbra={1}
        intensity={0.45}
        color="#9ab4d4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* warm rim from behind */}
      <pointLight position={[-3, 1, -3]} intensity={0.18} color={color} distance={8} />

      <Suspense fallback={null}>
        {fixture === "crown" && <CrownChandelier color={color} intensity={intensity} />}
        {fixture === "linear" && <LinearPendant color={color} intensity={intensity} />}
        {fixture === "cascade" && <CascadeChandelier color={color} intensity={intensity} />}

        {/* contact shadow on the floor */}
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.55}
          scale={8}
          blur={2.4}
          far={4}
          color="#000000"
        />

        {/* a faint glowing ring of light pooled on the floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.79, 0]}>
          <ringGeometry args={[0.5, 2.4, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.05 * intensity}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* dark ground plane that catches the contact shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
          <planeGeometry args={[14, 14]} />
          <meshStandardMaterial color="#050306" roughness={0.9} metalness={0.05} />
        </mesh>
      </Suspense>

      {/* User can gently orbit; clamped so it always looks composed */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        rotateSpeed={0.5}
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
