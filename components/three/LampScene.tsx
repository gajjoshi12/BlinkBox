"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useRef, useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";

/* ============================================================
   LampScene — two distinct lamps on opposite horizontal ends.
   LEFT:  Futuristic arc lamp with a glowing white orb
   RIGHT: Classical brass chandelier with warm yellow bulbs
   Each planted in a tiny patch of grass with a couple of stones.
   Both rotate + brighten as you scroll; center of viewport
   stays clear for page content.
============================================================ */

function useScrollProgress() {
  const ref = useRef(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return ref;
}

function smoothstep(a: number, b: number, v: number) {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* ============================================================ */
/* GRASS PATCH — small ground vignette around a lamp's base       */
/* ============================================================ */

function GrassPatch({
  position,
  bladeColor = "#3a6a3a",
  groundColor = "#1a1208",
  radius = 1.4,
}: {
  position: [number, number, number];
  bladeColor?: string;
  groundColor?: string;
  radius?: number;
}) {
  // Deterministic random so the patch doesn't reshuffle every render
  const blades = useMemo(() => {
    const seed = Math.floor(position[0] * 17 + position[2] * 31);
    const rand = (n: number) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 70 }).map((_, i) => {
      const a = rand(i * 2) * Math.PI * 2;
      const r = rand(i * 2 + 1) * radius * 0.95;
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h: 0.08 + rand(i * 3) * 0.22,
        tilt: (rand(i * 4) - 0.5) * 0.45,
        rotY: rand(i * 5) * Math.PI * 2,
        // mix two greens for variety
        bright: rand(i * 6) > 0.55,
      };
    });
  }, [position, radius]);

  const stones = useMemo(() => {
    const seed = Math.floor(position[0] * 7 + position[2] * 13);
    const rand = (n: number) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 4 }).map((_, i) => {
      const a = rand(i * 11) * Math.PI * 2;
      const r = (0.5 + rand(i * 13) * 0.7) * radius;
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        size: 0.08 + rand(i * 17) * 0.1,
        rotY: rand(i * 19) * Math.PI * 2,
        dark: rand(i * 23) > 0.5,
      };
    });
  }, [position, radius]);

  const lightGreen = "#5a8a4a";

  return (
    <group position={position}>
      {/* Soil pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial color={groundColor} roughness={1} />
      </mesh>
      {/* Soft fade ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[radius * 0.85, radius, 32]} />
        <meshStandardMaterial
          color={groundColor}
          roughness={1}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grass blades — small cones */}
      {blades.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.h / 2, b.z]}
          rotation={[b.tilt, b.rotY, b.tilt * 0.5]}
          castShadow
        >
          <coneGeometry args={[0.018, b.h, 4]} />
          <meshStandardMaterial
            color={b.bright ? lightGreen : bladeColor}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* Stones */}
      {stones.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.size * 0.45, s.z]}
          rotation={[0, s.rotY, 0]}
          castShadow
        >
          <dodecahedronGeometry args={[s.size, 0]} />
          <meshStandardMaterial
            color={s.dark ? "#3a3a38" : "#5a5854"}
            roughness={0.92}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* A small mossy patch — sphere flattened a bit */}
      <mesh position={[radius * 0.35, 0.05, -radius * 0.4]} scale={[1.2, 0.4, 1.0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial color="#2a4a2a" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ============================================================ */
/* FUTURISTIC ARC LAMP — left side, glowing cool-white orb        */
/* ============================================================ */

function FuturisticArc({
  intensityRef,
}: {
  intensityRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // 3D revolution — multi-axis tumble so all sides of the lamp are revealed
    groupRef.current.rotation.y += delta * 0.32;
    groupRef.current.rotation.x = Math.sin(t * 0.42) * 0.22;
    groupRef.current.rotation.z = Math.cos(t * 0.36) * 0.16;
    const I = intensityRef.current;
    const pulse = 0.95 + Math.sin(t * 1.3) * 0.05;

    if (sphereRef.current) {
      const m = sphereRef.current.material as THREE.MeshPhysicalMaterial;
      m.emissiveIntensity = I * 8 * pulse;
    }
    if (haloRef.current) {
      const m = haloRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.45 * I * pulse;
    }
    if (lightRef.current) {
      lightRef.current.intensity = I * 6 * pulse;
    }
    if (ringRef.current) {
      const m = ringRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = I * 2.5 * pulse;
    }
    if (ringLightRef.current) {
      ringLightRef.current.intensity = I * 1.5 * pulse;
    }
  });

  // Arc curve — bends INWARD (positive X) so the orb hovers over the page
  // content, not off-screen. Thicker tube, more substantial.
  const arcGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 40;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = Math.pow(t, 1.35) * 1.9;
      const y = 2.6 + Math.sin((t * Math.PI) / 2) * 0.85;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 80, 0.075, 14, false);
  }, []);

  // Coordinates of the orb (end of arc)
  const orbX = 1.9;
  const orbY = 3.45;

  return (
    <group ref={groupRef}>
      {/* HEAVY SCULPTED BASE — three tiers of marble + brass */}
      {/* Lowest stone disc */}
      <mesh position={[0, -1.62, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.78, 0.12, 36]} />
        <meshStandardMaterial color="#2a2826" metalness={0.05} roughness={0.85} />
      </mesh>
      {/* Brass middle ring */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 36]} />
        <meshStandardMaterial color="#a07028" metalness={1} roughness={0.3} />
      </mesh>
      {/* White marble top puck */}
      <mesh position={[0, -1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.6, 0.1, 36]} />
        <meshStandardMaterial
          color="#e8e0d4"
          metalness={0.05}
          roughness={0.35}
        />
      </mesh>
      {/* Tiny brass collar where pole emerges */}
      <mesh position={[0, -1.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 24]} />
        <meshStandardMaterial color="#a07028" metalness={1} roughness={0.3} />
      </mesh>

      {/* Vertical pole — thicker brushed chrome with subtle brass cuff */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 4.0, 20]} />
        <meshStandardMaterial color="#dadada" metalness={1} roughness={0.15} />
      </mesh>
      {/* Mid-pole brass cuff for visual interest */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.16, 20]} />
        <meshStandardMaterial color="#a07028" metalness={1} roughness={0.3} />
      </mesh>

      {/* Pivoting joint at top of pole — sphere + brass ring */}
      <mesh position={[0, 2.55, 0]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial color="#a07028" metalness={1} roughness={0.28} />
      </mesh>
      <mesh position={[0, 2.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.022, 12, 32]} />
        <meshStandardMaterial color="#dadada" metalness={1} roughness={0.18} />
      </mesh>

      {/* The arc — substantial chrome curve */}
      <mesh geometry={arcGeometry} castShadow>
        <meshStandardMaterial color="#dadada" metalness={1} roughness={0.15} />
      </mesh>

      {/* Brass collar wrapping the orb attachment */}
      <mesh position={[orbX, orbY - 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.18, 24]} />
        <meshStandardMaterial color="#a07028" metalness={1} roughness={0.3} />
      </mesh>

      {/* Glowing LED ring detail just below the orb (futuristic accent) */}
      <mesh
        ref={ringRef}
        position={[orbX, orbY - 0.55, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.5, 0.022, 14, 64]} />
        <meshStandardMaterial
          color="#ffe8e2"
          emissive="#ff8a78"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={ringLightRef}
        position={[orbX, orbY - 0.55, 0]}
        color="#ff8a78"
        intensity={0}
        distance={3.5}
        decay={2}
      />

      {/* THE GLOWING ORB — large frosted glass sphere, tinted coral */}
      <mesh ref={sphereRef} position={[orbX, orbY, 0]} castShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#ffe8e2"
          emissive="#ff8a78"
          emissiveIntensity={0}
          roughness={0.06}
          metalness={0}
          transmission={0.45}
          ior={1.5}
          thickness={0.7}
          clearcoat={1}
          clearcoatRoughness={0.03}
          toneMapped={false}
        />
      </mesh>

      {/* Inner bright core inside the orb — coral filament */}
      <mesh position={[orbX, orbY, 0]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff9080"
          emissiveIntensity={6}
          toneMapped={false}
        />
      </mesh>

      {/* Orb halo — additive coral glow shell */}
      <mesh ref={haloRef} position={[orbX, orbY, 0]}>
        <sphereGeometry args={[1.4, 24, 24]} />
        <meshBasicMaterial
          color="#ff8a78"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* The real coral point light */}
      <pointLight
        ref={lightRef}
        position={[orbX, orbY, 0]}
        color="#ff7060"
        intensity={0}
        distance={11}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </group>
  );
}

/* ============================================================ */
/* CLASSICAL CHANDELIER — right side, warm yellow bulbs           */
/* ============================================================ */

function ClassicalChandelier({
  color,
  intensityRef,
}: {
  color: THREE.Color;
  intensityRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bulbRefs = useRef<(THREE.Mesh | null)[]>([]);
  const haloRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const centralLightRef = useRef<THREE.PointLight>(null);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // 3D revolution — opposite direction to the arc lamp + multi-axis tilt
    groupRef.current.rotation.y -= delta * 0.28;
    groupRef.current.rotation.x = Math.sin(t * 0.38) * 0.18;
    groupRef.current.rotation.z = Math.cos(t * 0.45) * 0.15;
    const I = intensityRef.current;
    const pulse = 0.93 + Math.sin(t * 1.5) * 0.07;

    bulbRefs.current.forEach((b, i) => {
      if (!b) return;
      const offset = i * 0.6;
      const pp = 0.9 + Math.sin(t * 1.4 + offset) * 0.1;
      const m = b.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = I * 5 * pp;
      m.emissive.copy(color);
      m.color.copy(color);
    });
    haloRefs.current.forEach((h, i) => {
      if (!h) return;
      const offset = i * 0.6;
      const pp = 0.9 + Math.sin(t * 1.4 + offset) * 0.1;
      const m = h.material as THREE.MeshBasicMaterial;
      m.opacity = 0.22 * I * pp;
      m.color.copy(color);
    });
    lightRefs.current.forEach((l, i) => {
      if (!l) return;
      const offset = i * 0.6;
      const pp = 0.9 + Math.sin(t * 1.4 + offset) * 0.1;
      l.intensity = I * 0.55 * pp;
      l.color.copy(color);
    });
    if (centralLightRef.current) {
      centralLightRef.current.intensity = I * 2.2 * pulse;
      centralLightRef.current.color.copy(color);
    }
    if (crystalRef.current) {
      const m = crystalRef.current.material as THREE.MeshPhysicalMaterial;
      m.emissiveIntensity = I * 1.2 * pulse;
      m.emissive.copy(color);
    }
  });

  const arms = 10;
  const brassColor = "#a07028";

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Cord upward (out of frame) */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 3.5, 8]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.22, 0.14, 32]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.28} />
      </mesh>
      {/* Central column */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.05, 0.85, 18]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* Crystal centerpiece */}
      <mesh ref={crystalRef} position={[0, 0.15, 0]}>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshPhysicalMaterial
          color="#fff4d6"
          emissive="#fff4d6"
          emissiveIntensity={0}
          metalness={0.3}
          roughness={0.05}
          clearcoat={1}
          transmission={0.5}
          ior={1.5}
          thickness={0.5}
          toneMapped={false}
        />
      </mesh>
      {/* Lower finial */}
      <mesh position={[0, -0.55, 0]} castShadow>
        <coneGeometry args={[0.1, 0.36, 16]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>

      {/* Arms ring */}
      {Array.from({ length: arms }).map((_, i) => {
        const angle = (i / arms) * Math.PI * 2;
        const radius = 1.0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} rotation={[0, -angle, 0]}>
            {/* Arm */}
            <mesh position={[radius / 2, 0.18, 0]} rotation={[0, 0, -0.12]} castShadow>
              <cylinderGeometry args={[0.02, 0.028, radius, 12]} />
              <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
            </mesh>
            {/* Ball joint */}
            <mesh position={[0.05, 0.18, 0]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
            </mesh>
            {/* Candle cup */}
            <mesh position={[x, 0.32, z]} castShadow>
              <cylinderGeometry args={[0.055, 0.042, 0.12, 14]} />
              <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
            </mesh>
            {/* Candle */}
            <mesh position={[x, 0.43, z]} castShadow>
              <cylinderGeometry args={[0.026, 0.026, 0.16, 12]} />
              <meshStandardMaterial color="#f5e6c8" />
            </mesh>
            {/* Glowing bulb (flame tip) */}
            <mesh
              ref={(el) => {
                bulbRefs.current[i] = el;
              }}
              position={[x, 0.58, z]}
            >
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial
                color="#fff4d6"
                emissive="#fff4d6"
                emissiveIntensity={0}
                toneMapped={false}
              />
            </mesh>
            {/* Halo */}
            <mesh
              ref={(el) => {
                haloRefs.current[i] = el;
              }}
              position={[x, 0.58, z]}
            >
              <sphereGeometry args={[0.18, 14, 14]} />
              <meshBasicMaterial
                color="#fff4d6"
                transparent
                opacity={0}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight
              ref={(el) => {
                lightRefs.current[i] = el;
              }}
              position={[x, 0.58, z]}
              color="#fff4d6"
              intensity={0}
              distance={3.5}
              decay={2}
            />
            {/* Hanging crystal pendant under arm */}
            <mesh position={[x * 0.85, -0.02, z * 0.85]}>
              <octahedronGeometry args={[0.07, 0]} />
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

      {/* Central downward shadow-casting light */}
      <pointLight
        ref={centralLightRef}
        position={[0, -0.2, 0]}
        color="#fff4d6"
        intensity={0}
        distance={9}
        decay={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </group>
  );
}

/* ============================================================ */
/* SCENE — orchestrates both lamps + their grass patches          */
/* ============================================================ */

function Scene() {
  const scrollRef = useScrollProgress();

  // Brand colours — locked, not Kelvin-driven. Left lamp = coral, right = plum.
  const plumColor = useMemo(() => new THREE.Color("#c895d0"), []);

  const intensityFuturistic = useRef(0);
  const intensityChandelier = useRef(0);
  const target = useRef({ a: 0, b: 0 });

  useFrame((state, delta) => {
    const p = scrollRef.current;

    // Both lamps brighten with scroll, but with a small baseline so the
    // chrome / brass / orb are always visible — never pitch black.
    const baseline = 0.28;
    target.current.a = baseline + smoothstep(0.02, 0.5, p) * 1.1 + smoothstep(0.5, 0.95, p) * 0.6;
    target.current.b = baseline + smoothstep(0.12, 0.6, p) * 1.1 + smoothstep(0.6, 0.95, p) * 0.6;

    const k = Math.min(1, delta * 4);
    intensityFuturistic.current += (target.current.a - intensityFuturistic.current) * k;
    intensityChandelier.current += (target.current.b - intensityChandelier.current) * k;
  });

  return (
    <group>
      {/* LEFT — futuristic arc lamp, HUGE and pushed off-screen left so only the
          arc + glowing orb spill into the visible area */}
      <group position={[-7.2, -0.8, 0]} scale={1.9}>
        <FuturisticArc intensityRef={intensityFuturistic} />
      </group>
      {/* Left grass — in visible centered area, illuminated by the arc lamp */}
      <GrassPatch
        position={[-3.4, -3.0, 0.5]}
        bladeColor="#3a6a3a"
        groundColor="#1a1410"
        radius={1.7}
      />

      {/* RIGHT — classical brass chandelier, HUGE and pushed off-screen right */}
      <group position={[7.2, 0.4, 0]} scale={1.9}>
        <ClassicalChandelier color={plumColor} intensityRef={intensityChandelier} />
      </group>
      {/* Right grass */}
      <GrassPatch
        position={[3.4, -3.0, 0.5]}
        bladeColor="#4a7a4a"
        groundColor="#1a1208"
        radius={1.65}
      />

      {/* Brighter baseline ambient — silhouettes always visible */}
      <ambientLight intensity={0.22} color="#5a78a8" />
      <directionalLight position={[3, 8, 4]} intensity={0.45} color="#c8d4e8" castShadow />
      <directionalLight position={[-3, 8, 4]} intensity={0.35} color="#d4c8a8" />

      {/* Soft fill from below for grass + base detail */}
      <pointLight position={[0, 1, 6]} intensity={0.4} color="#7090c0" distance={16} />

      {/* Contact shadow grounding the whole scene — lowered for the scaled lamps */}
      <ContactShadows
        position={[0, -3.05, 0]}
        opacity={0.5}
        scale={26}
        blur={2.8}
        far={6}
        color="#000"
      />
    </group>
  );
}

/* ============================================================ */
/* TOP-LEVEL EXPORT                                               */
/* ============================================================ */

export default function LampScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.6, 12], fov: 56 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      dpr={[1, 1.6]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
