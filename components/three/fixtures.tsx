"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A single bulb: emissive sphere + glow halo + real point light
 * Color & intensity drive directly off props (Kelvin-bound).
 */
function Bulb({
  color,
  intensity,
  glowSize = 0.18,
  bulbSize = 0.07,
  lightDist = 4,
}: {
  color: THREE.Color;
  intensity: number;
  glowSize?: number;
  bulbSize?: number;
  lightDist?: number;
}) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[bulbSize, 18, 18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 4}
          toneMapped={false}
        />
      </mesh>
      {/* outer glow shell */}
      <mesh>
        <sphereGeometry args={[glowSize, 18, 18]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18 * intensity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[glowSize * 1.8, 18, 18]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.06 * intensity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color={color} intensity={intensity * 1.4} distance={lightDist} decay={2} />
    </group>
  );
}

const brassColor = new THREE.Color("#5a4020");
const brassMaterial = (
  <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
);

/* ---------------- CROWN — twelve-arm classical chandelier ---------------- */
export function CrownChandelier({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.025;
    ref.current.rotation.x = Math.cos(t * 0.35) * 0.012;
  });

  const arms = 12;

  return (
    <group ref={ref}>
      {/* cord */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 3.2, 8]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* canopy */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.28, 0.18, 0.14, 24]} />
        {brassMaterial}
      </mesh>
      <mesh position={[0, 3.27, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 24]} />
        {brassMaterial}
      </mesh>

      {/* central column */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.6, 16]} />
        {brassMaterial}
      </mesh>
      {/* central crystal sphere */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transmission={0.5}
          ior={1.5}
          thickness={0.4}
          emissive={color}
          emissiveIntensity={intensity * 0.6}
          toneMapped={false}
        />
      </mesh>
      {/* lower finial */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.08, 0.32, 16]} />
        {brassMaterial}
      </mesh>

      {/* arms ring */}
      {Array.from({ length: arms }).map((_, i) => {
        const angle = (i / arms) * Math.PI * 2;
        const radius = 0.95;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[0, 0, 0]} rotation={[0, -angle, 0]}>
            {/* arm — curved out and up */}
            <mesh position={[radius / 2, 0.05, 0]} rotation={[0, 0, -0.08]}>
              <cylinderGeometry args={[0.018, 0.025, radius, 12]} />
              <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
            </mesh>
            {/* small ball joint where arm leaves the column */}
            <mesh position={[0.05, 0.08, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              {brassMaterial}
            </mesh>
            {/* candle-cup at end of arm */}
            <mesh position={[x, 0.18, z]}>
              <cylinderGeometry args={[0.05, 0.04, 0.12, 14]} />
              {brassMaterial}
            </mesh>
            {/* candle stick */}
            <mesh position={[x, 0.3, z]}>
              <cylinderGeometry args={[0.025, 0.025, 0.16, 12]} />
              <meshStandardMaterial color="#f5e6c8" />
            </mesh>
            {/* bulb */}
            <group position={[x, 0.45, z]}>
              <Bulb color={color} intensity={intensity} bulbSize={0.06} glowSize={0.16} />
            </group>
            {/* hanging crystal beneath arm */}
            <mesh position={[x * 0.85, -0.1, z * 0.85]}>
              <octahedronGeometry args={[0.06, 0]} />
              <meshPhysicalMaterial
                color="#ffffff"
                metalness={0.1}
                roughness={0.05}
                transmission={0.7}
                ior={1.5}
                thickness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* central downward light */}
      <pointLight
        color={color}
        intensity={intensity * 1.2}
        distance={6}
        decay={2}
        position={[0, -0.2, 0]}
      />
    </group>
  );
}

/* ---------------- LINEAR — horizontal modern bar ---------------- */
export function LinearPendant({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += delta * 0.12;
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.015;
  });

  const bulbs = 7;
  const span = 2.4;

  return (
    <group ref={ref}>
      {/* two suspension cables */}
      <mesh position={[-span / 3, 1.4, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.8, 6]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      <mesh position={[span / 3, 1.4, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.8, 6]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* canopies */}
      <mesh position={[-span / 3, 2.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        {brassMaterial}
      </mesh>
      <mesh position={[span / 3, 2.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        {brassMaterial}
      </mesh>

      {/* horizontal bar */}
      <mesh>
        <boxGeometry args={[span, 0.06, 0.12]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[span + 0.02, 0.02, 0.14]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.18} />
      </mesh>

      {/* bulbs hanging beneath */}
      {Array.from({ length: bulbs }).map((_, i) => {
        const x = -span / 2 + (span / (bulbs - 1)) * i;
        return (
          <group key={i} position={[x, -0.3, 0]}>
            {/* bulb stem */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
              <meshStandardMaterial color="#1a1208" />
            </mesh>
            {/* bulb cap */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.05, 0.04, 0.05, 12]} />
              {brassMaterial}
            </mesh>
            {/* edison-style bulb */}
            <mesh position={[0, -0.05, 0]}>
              <sphereGeometry args={[0.08, 18, 18]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={intensity * 4}
                toneMapped={false}
              />
            </mesh>
            <Bulb color={color} intensity={intensity} bulbSize={0.001} glowSize={0.18} />
          </group>
        );
      })}
    </group>
  );
}

/* ---------------- CASCADE — three-tier waterfall of crystals ---------------- */
export function CascadeChandelier({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += delta * 0.22;
    ref.current.rotation.z = Math.sin(t * 0.45) * 0.02;
  });

  // Pre-compute crystal positions for performance
  const crystals = useMemo(() => {
    const list: { x: number; y: number; z: number; size: number }[] = [];
    const tiers = [
      { y: 0.6, count: 8, radius: 0.45 },
      { y: 0.2, count: 12, radius: 0.7 },
      { y: -0.2, count: 16, radius: 0.95 },
      { y: -0.6, count: 12, radius: 0.7 },
      { y: -1.0, count: 8, radius: 0.4 },
    ];
    for (const tier of tiers) {
      for (let i = 0; i < tier.count; i++) {
        const a = (i / tier.count) * Math.PI * 2 + tier.y * 0.3;
        list.push({
          x: Math.cos(a) * tier.radius,
          y: tier.y,
          z: Math.sin(a) * tier.radius,
          size: 0.05 + Math.random() * 0.05,
        });
      }
    }
    return list;
  }, []);

  return (
    <group ref={ref}>
      {/* cord */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 3, 8]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* canopy */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.15, 24]} />
        {brassMaterial}
      </mesh>

      {/* central glow column - several stacked bulbs */}
      {[-0.6, -0.2, 0.2, 0.6].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={intensity * 4}
              toneMapped={false}
            />
          </mesh>
          <pointLight color={color} intensity={intensity * 0.8} distance={3.5} decay={2} />
        </group>
      ))}

      {/* curtain of crystals */}
      {crystals.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} rotation={[0, i * 0.3, 0]}>
          <octahedronGeometry args={[c.size, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.1}
            roughness={0.04}
            transmission={0.85}
            ior={1.7}
            thickness={0.2}
            emissive={color}
            emissiveIntensity={0.3 * intensity}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* lower finial */}
      <mesh position={[0, -1.4, 0]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.4}
          roughness={0.05}
          transmission={0.6}
          ior={1.6}
          thickness={0.3}
          emissive={color}
          emissiveIntensity={intensity * 0.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
