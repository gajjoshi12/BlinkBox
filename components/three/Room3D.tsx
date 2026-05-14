"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo, Suspense, useState } from "react";
import * as THREE from "three";
import { useTemperature } from "../TemperatureProvider";
import { kelvinToRgb } from "@/lib/kelvin";

/* ----------------------------------------------------------------
   Procedural luxury living room.
   - Scroll progress (window.scrollY / scrollMax) drives lamp intensities.
   - Kelvin context drives bulb / emissive colours live.
   - Subtle camera parallax follows the cursor.
   - Renders as a fixed full-bleed background canvas.
---------------------------------------------------------------- */

function smoothstep(a: number, b: number, v: number) {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* --- shared materials --- */
const brassColor = "#8a6028";
const darkWoodColor = "#3a2818";
const wallColor = "#3a2c20";
const sofaColor = "#2e2218";
const cushionColor = "#4a3826";
const plantPotColor = "#3a2818";
const leafColor = "#2a4a28";
const leafColorLight = "#3a6038";

/* ============================================================ */
/* HOOKS                                                         */
/* ============================================================ */

function useScrollProgress() {
  const ref = useRef(0);
  useEffect(() => {
    let rafId = 0;
    let scheduled = false;
    const compute = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      ref.current =
        max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      scheduled = false;
    };
    const update = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return ref;
}

function useCursorOffset() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    let rafId = 0;
    let nextX = 0;
    let nextY = 0;
    let scheduled = false;
    const apply = () => {
      ref.current.x = nextX;
      ref.current.y = nextY;
      scheduled = false;
    };
    const move = (e: MouseEvent) => {
      nextX = (e.clientX / window.innerWidth) * 2 - 1;
      nextY = -((e.clientY / window.innerHeight) * 2 - 1);
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", move);
    };
  }, []);
  return ref;
}

/* ============================================================ */
/* SHELL — floor, walls, ceiling                                 */
/* ============================================================ */

function Shell() {
  return (
    <group>
      {/* Floor — dark wood (was MeshReflectorMaterial; that was the single biggest cost) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color={darkWoodColor} roughness={0.7} metalness={0.25} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 4, -5]}>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-9, 4, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[9, 4, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#0a0806" roughness={0.95} />
      </mesh>

      {/* Floor rug — layered for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -1]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#4a3220" roughness={1} />
      </mesh>
      {/* rug border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -1]}>
        <ringGeometry args={[2.6, 2.85, 32]} />
        <meshStandardMaterial color="#3a2418" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* central rug medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, -1]}>
        <ringGeometry args={[0.6, 0.9, 24]} />
        <meshStandardMaterial color="#6a4828" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Skirting board hint — thin strip at floor */}
      <mesh position={[0, 0.08, -4.97]}>
        <boxGeometry args={[18, 0.16, 0.04]} />
        <meshStandardMaterial color="#0a0604" />
      </mesh>
    </group>
  );
}

/* ============================================================ */
/* WINDOW (left wall) — always-on moonlight                       */
/* ============================================================ */

function Window() {
  return (
    <group position={[-8.94, 3.8, -1.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[2.4, 3.2, 0.06]} />
        <meshStandardMaterial color="#0a0604" />
      </mesh>
      {/* Glass panes - 4 lit panels */}
      {[
        [-0.55, 0.7],
        [0.55, 0.7],
        [-0.55, -0.7],
        [0.55, -0.7],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.04]}>
          <planeGeometry args={[1.0, 1.4]} />
          <meshStandardMaterial
            color="#1a3060"
            emissive="#5278b8"
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Mullions */}
      <mesh>
        <boxGeometry args={[0.06, 3.2, 0.1]} />
        <meshStandardMaterial color="#0a0604" />
      </mesh>
      <mesh>
        <boxGeometry args={[2.4, 0.06, 0.1]} />
        <meshStandardMaterial color="#0a0604" />
      </mesh>
      {/* Cool moonlight cast into the room */}
      <pointLight
        position={[0, 0, 0.2]}
        color="#b8c8e8"
        intensity={0.6}
        distance={8}
        decay={2}
      />
    </group>
  );
}

/* ============================================================ */
/* FURNITURE                                                     */
/* ============================================================ */

function Sofa() {
  return (
    <group position={[0, 0, -1.5]}>
      {/* base */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[4.2, 0.6, 1.5]} />
        <meshStandardMaterial color={sofaColor} roughness={0.95} />
      </mesh>
      {/* back rest */}
      <mesh position={[0, 1.05, -0.55]} castShadow>
        <boxGeometry args={[4.2, 0.9, 0.35]} />
        <meshStandardMaterial color={sofaColor} roughness={0.95} />
      </mesh>
      {/* left arm */}
      <mesh position={[-2.0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.3, 0.9, 1.5]} />
        <meshStandardMaterial color={sofaColor} roughness={0.95} />
      </mesh>
      {/* right arm */}
      <mesh position={[2.0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.3, 0.9, 1.5]} />
        <meshStandardMaterial color={sofaColor} roughness={0.95} />
      </mesh>
      {/* seat cushions */}
      {[-1.3, 0, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0.78, 0.08]} castShadow>
          <boxGeometry args={[1.18, 0.18, 1.28]} />
          <meshStandardMaterial color={cushionColor} roughness={0.92} />
        </mesh>
      ))}
      {/* back cushions */}
      {[-1.3, 0, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 1.15, -0.36]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.18, 0.55, 0.18]} />
          <meshStandardMaterial color={cushionColor} roughness={0.92} />
        </mesh>
      ))}
      {/* throw pillows — varied warm tones */}
      <mesh position={[-1.5, 1.0, 0.0]} rotation={[-0.2, 0.1, 0.3]} castShadow>
        <boxGeometry args={[0.45, 0.45, 0.2]} />
        <meshStandardMaterial color="#a8703a" roughness={0.85} />
      </mesh>
      <mesh position={[1.6, 1.0, 0.0]} rotation={[-0.2, -0.2, -0.2]} castShadow>
        <boxGeometry args={[0.45, 0.45, 0.2]} />
        <meshStandardMaterial color="#7a4a28" roughness={0.85} />
      </mesh>
      {/* a small folded throw blanket draped over one arm */}
      <mesh position={[-1.7, 0.95, 0.4]} rotation={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.7]} />
        <meshStandardMaterial color="#d4a878" roughness={0.95} />
      </mesh>
      {/* small brass feet */}
      {[-1.9, 1.9].map((x) =>
        [-0.6, 0.6].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.06, z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
            <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
          </mesh>
        ))
      )}
    </group>
  );
}

function CoffeeTable() {
  return (
    <group position={[0, 0, 0.5]}>
      {/* glass top — plain material, transmission was expensive */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[1.6, 0.04, 1.0]} />
        <meshStandardMaterial color="#1a1410" metalness={0.5} roughness={0.15} />
      </mesh>
      {/* legs */}
      {[
        [-0.7, -0.4],
        [0.7, -0.4],
        [-0.7, 0.4],
        [0.7, 0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.21, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 12]} />
          <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {/* a stack of books */}
      <mesh position={[-0.35, 0.5, 0]} castShadow>
        <boxGeometry args={[0.35, 0.12, 0.24]} />
        <meshStandardMaterial color="#3a2418" roughness={0.7} />
      </mesh>
      <mesh position={[-0.35, 0.59, 0.04]} castShadow>
        <boxGeometry args={[0.32, 0.06, 0.22]} />
        <meshStandardMaterial color="#6a4828" roughness={0.7} />
      </mesh>
      {/* small decorative bowl */}
      <mesh position={[0.4, 0.48, -0.1]} castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.06, 24]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Console({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  return (
    <group position={[-3.5, 0, -4.65]}>
      {/* top */}
      <mesh position={[0, 0.86, 0]} castShadow>
        <boxGeometry args={[2.4, 0.06, 0.45]} />
        <meshStandardMaterial color="#2a1810" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* legs - 4 brass posts */}
      {[
        [-1.1, 0.15],
        [1.1, 0.15],
        [-1.1, -0.15],
        [1.1, -0.15],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.43, z]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.86, 12]} />
          <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
        </mesh>
      ))}
      {/* lower shelf */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.03, 0.35]} />
        <meshStandardMaterial color="#2a1810" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* TABLE LAMP on console */}
      <group position={[0.6, 0.89, 0]}>
        <TableLamp color={color} intensity={intensity} />
      </group>

      {/* tall vase on the other end */}
      <mesh position={[-0.7, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.55, 16]} />
        <meshStandardMaterial color="#1a1208" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* a stem of pampas */}
      <mesh position={[-0.7, 1.55, 0]}>
        <coneGeometry args={[0.08, 0.4, 8]} />
        <meshStandardMaterial color="#6a5a45" roughness={1} />
      </mesh>
    </group>
  );
}

function ArtPiece() {
  return (
    <group position={[1.2, 4.2, -4.96]}>
      {/* frame */}
      <mesh castShadow>
        <boxGeometry args={[1.6, 2.2, 0.06]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.4} />
      </mesh>
      {/* canvas */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.4, 2.0]} />
        <meshStandardMaterial color="#251a14" roughness={0.7} />
      </mesh>
      {/* abstract gestures */}
      <mesh position={[-0.2, 0.1, 0.04]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[1.0, 0.04]} />
        <meshStandardMaterial color="#8a3018" emissive="#8a3018" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0.1, -0.3, 0.04]} rotation={[0, 0, -0.2]}>
        <planeGeometry args={[0.8, 0.03]} />
        <meshStandardMaterial color={brassColor} emissive="#d4a24a" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

/* ============================================================ */
/* PLANTS                                                         */
/* ============================================================ */

/** Tall fiddle-leaf fig — multiple oval leaves spiraling up a slim trunk */
function FiddleLeafFig({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.012;
  });

  // Pre-compute leaf placements up the trunk
  const leaves = useMemo(() => {
    const list: { y: number; angle: number; size: number; tilt: number }[] = [];
    for (let i = 0; i < 14; i++) {
      list.push({
        y: 0.7 + i * 0.18,
        angle: (i * 137.5 * Math.PI) / 180, // golden angle spiral
        size: 0.35 + Math.random() * 0.18,
        tilt: 0.5 + Math.random() * 0.4,
      });
    }
    return list;
  }, []);

  return (
    <group ref={ref} position={position}>
      {/* terracotta pot */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.32, 0.5, 24]} />
        <meshStandardMaterial color="#5a3020" roughness={0.85} />
      </mesh>
      {/* pot rim */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <torusGeometry args={[0.38, 0.04, 8, 24]} />
        <meshStandardMaterial color="#3a1a0e" roughness={0.7} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.49, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.02, 24]} />
        <meshStandardMaterial color="#1a0e08" roughness={1} />
      </mesh>
      {/* trunk */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 2.4, 10]} />
        <meshStandardMaterial color="#3a2818" roughness={0.85} />
      </mesh>
      {/* leaves — large oval shapes around the trunk */}
      {leaves.map((l, i) => {
        const r = 0.05;
        const x = Math.cos(l.angle) * r;
        const z = Math.sin(l.angle) * r;
        return (
          <group
            key={i}
            position={[x, l.y, z]}
            rotation={[l.tilt, l.angle, 0.2]}
          >
            <mesh castShadow>
              <sphereGeometry args={[l.size, 12, 8]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? leafColor : leafColorLight}
                roughness={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* squash the leaf flat */}
          </group>
        );
      })}
      {/* top crown of denser leaves */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={`crown-${i}`}
            position={[Math.cos(a) * 0.15, 3.1, Math.sin(a) * 0.15]}
            rotation={[0.3, a, 0.4]}
                     >
            <sphereGeometry args={[0.45, 12, 8]} />
            <meshStandardMaterial color={leafColorLight} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

/** Monstera-style plant in a low planter */
function Monstera({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* low ceramic planter */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.36, 0.36, 24]} />
        <meshStandardMaterial color="#1a1208" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* planter rim */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <torusGeometry args={[0.42, 0.04, 8, 24]} />
        <meshStandardMaterial color="#0a0604" roughness={0.4} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 24]} />
        <meshStandardMaterial color="#1a0e08" roughness={1} />
      </mesh>
      {/* large monstera-style leaves — broad ellipses on stems */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const tilt = 0.4 + Math.random() * 0.3;
        const reach = 0.5 + Math.random() * 0.3;
        return (
          <group
            key={i}
            position={[
              Math.cos(angle) * 0.2,
              0.4 + Math.random() * 0.4,
              Math.sin(angle) * 0.2,
            ]}
            rotation={[tilt, angle, 0]}
          >
            {/* stem */}
            <mesh position={[0, reach / 2, 0]}>
              <cylinderGeometry args={[0.015, 0.015, reach, 6]} />
              <meshStandardMaterial color="#2a4a28" roughness={0.7} />
            </mesh>
            {/* big leaf */}
            <mesh position={[0, reach, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <circleGeometry args={[0.35, 16]} />
              <meshStandardMaterial
                color={leafColorLight}
                roughness={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Tall snake plant — vertical sword-like leaves */
function SnakePlant({ position }: { position: [number, number, number] }) {
  const blades = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      angle: (i / 12) * Math.PI * 2 + Math.random() * 0.3,
      h: 0.9 + Math.random() * 0.5,
      tilt: (Math.random() - 0.5) * 0.3,
    }));
  }, []);
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.36, 16]} />
        <meshStandardMaterial color="#0a0604" roughness={0.4} metalness={0.2} />
      </mesh>
      {blades.map((b, i) => (
        <mesh
          key={i}
          position={[Math.cos(b.angle) * 0.05, 0.4 + b.h / 2, Math.sin(b.angle) * 0.05]}
          rotation={[b.tilt, b.angle, b.tilt * 0.5]}
                 >
          <coneGeometry args={[0.03, b.h, 4]} />
          <meshStandardMaterial color={leafColor} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================ */
/* BOOKSHELF — tall shelving with rows of books                   */
/* ============================================================ */

function Bookshelf({ position }: { position: [number, number, number] }) {
  const bookColors = ["#6a3a1a", "#3a2418", "#4a2018", "#7a4a28", "#3a2a18", "#5a3018", "#2a1a10", "#6a4a30"];

  const shelves = [1.0, 2.2, 3.4, 4.6, 5.8];

  return (
    <group position={position}>
      {/* outer frame — vertical sides */}
      <mesh position={[-1, 3, 0]} castShadow>
        <boxGeometry args={[0.06, 6, 0.5]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>
      <mesh position={[1, 3, 0]} castShadow>
        <boxGeometry args={[0.06, 6, 0.5]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>
      {/* top */}
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[2.06, 0.08, 0.5]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>
      {/* bottom */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.06, 0.08, 0.5]} />
        <meshStandardMaterial color="#2a1810" roughness={0.7} />
      </mesh>
      {/* back panel */}
      <mesh position={[0, 3, -0.22]}>
        <boxGeometry args={[2, 6, 0.03]} />
        <meshStandardMaterial color="#150f0a" roughness={0.9} />
      </mesh>

      {/* shelves + books on each */}
      {shelves.map((y, si) => (
        <group key={si} position={[0, y, 0]}>
          {/* the shelf board */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.95, 0.04, 0.46]} />
            <meshStandardMaterial color="#2a1810" roughness={0.7} />
          </mesh>
          {/* rows of books — pack tightly with varied heights */}
          {(() => {
            const books = [];
            let x = -0.9;
            let i = 0;
            while (x < 0.9) {
              const w = 0.08 + Math.random() * 0.05;
              const h = 0.7 + Math.random() * 0.35;
              const tiltLast = i > 3 && Math.random() < 0.15;
              const color = bookColors[(si * 7 + i) % bookColors.length];
              books.push(
                <mesh
                  key={i}
                  position={[x + w / 2, 0.04 + h / 2, 0]}
                  rotation={[0, 0, tiltLast ? 0.15 : 0]}
                                 >
                  <boxGeometry args={[w, h, 0.3]} />
                  <meshStandardMaterial color={color} roughness={0.7} />
                </mesh>
              );
              x += w + 0.005;
              i++;
              if (i > 18) break;
            }
            // Add a horizontal stack at the right edge sometimes
            if (si === 1 || si === 3) {
              books.push(
                <group key="hstack" position={[0.7, 0.06, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.25, 0.08, 0.3]} />
                    <meshStandardMaterial color={bookColors[si]} roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.085, 0]} castShadow>
                    <boxGeometry args={[0.24, 0.07, 0.28]} />
                    <meshStandardMaterial color={bookColors[si + 1]} roughness={0.7} />
                  </mesh>
                </group>
              );
            }
            // A decorative object on shelf 3
            if (si === 2) {
              books.push(
                <mesh key="vase" position={[-0.7, 0.18, 0]} castShadow>
                  <cylinderGeometry args={[0.07, 0.05, 0.3, 16]} />
                  <meshStandardMaterial color={brassColor} metalness={1} roughness={0.35} />
                </mesh>
              );
            }
            return books;
          })()}
        </group>
      ))}
    </group>
  );
}

/* ============================================================ */
/* SIDE TABLE — small round table next to the sofa                */
/* ============================================================ */

function SideTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* round marble top */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 28]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.4} metalness={0.05} />
      </mesh>
      {/* brass pedestal */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* brass tripod base */}
      <mesh position={[0.12, 0.04, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.018, 0.018, 0.3, 8]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-0.06, 0.04, 0.1]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.3, 8]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-0.06, 0.04, -0.1]} rotation={[-0.5, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.3, 8]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* a candle on top */}
      <mesh position={[0.1, 0.7, 0.05]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
        <meshStandardMaterial color="#e8d8b0" roughness={0.8} />
      </mesh>
      {/* a small book */}
      <mesh position={[-0.12, 0.66, -0.05]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.04, 0.15]} />
        <meshStandardMaterial color="#6a3a1a" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ============================================================ */
/* FIREPLACE — right side of back wall, with flickering           */
/* ============================================================ */

function Fireplace({ intensity }: { intensity: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const fireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.85 + Math.sin(t * 14) * 0.1 + Math.sin(t * 23.1) * 0.06;
    if (lightRef.current) lightRef.current.intensity = intensity * 3.5 * flicker;
    if (fireRef.current) {
      const mat = fireRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensity * 5 * flicker;
    }
  });

  return (
    <group position={[5.5, 0.8, -4.65]}>
      {/* mantle */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.6, 0.12, 0.5]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      {/* outer surround */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 2.6, 0.2]} />
        <meshStandardMaterial color="#0d0806" roughness={0.9} />
      </mesh>
      {/* inner opening */}
      <mesh position={[0, -0.1, 0.11]}>
        <boxGeometry args={[1.6, 1.6, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* logs */}
      <mesh position={[-0.25, -0.7, 0.15]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.95} />
      </mesh>
      <mesh position={[0.2, -0.65, 0.15]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.95} />
      </mesh>
      {/* the fire itself - emissive sphere */}
      <mesh ref={fireRef} position={[0, -0.35, 0.2]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#ff5a1f"
          emissive="#ff9040"
          emissiveIntensity={intensity * 5}
          toneMapped={false}
        />
      </mesh>
      {/* secondary embers glow */}
      <mesh position={[0, -0.55, 0.25]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial
          color="#ff7030"
          transparent
          opacity={0.25 * intensity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* flickering point light */}
      <pointLight
        ref={lightRef}
        position={[0, -0.2, 0.5]}
        color="#ff7030"
        intensity={intensity * 3.5}
        distance={6}
        decay={2}
      />
    </group>
  );
}

/* ============================================================ */
/* LAMPS — chandelier, floor lamp, table lamp, sconces            */
/* ============================================================ */

function Chandelier({
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
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.02;
  });

  const arms = 10;

  return (
    <group ref={ref} position={[0, 4.5, -1.2]}>
      {/* cord */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 3.2, 8]} />
        <meshStandardMaterial color="#0a0604" />
      </mesh>
      {/* canopy at ceiling */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.22, 0.15, 0.12, 24]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
      </mesh>
      {/* central column */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.04, 0.55, 16]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
      </mesh>
      {/* central crystal sphere — plain emissive, no transmission */}
      <mesh>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={intensity * 1.5}
          toneMapped={false}
        />
      </mesh>
      {/* lower finial */}
      <mesh position={[0, -0.42, 0]}>
        <coneGeometry args={[0.07, 0.28, 16]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
      </mesh>

      {/* arms */}
      {Array.from({ length: arms }).map((_, i) => {
        const angle = (i / arms) * Math.PI * 2;
        const radius = 0.85;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} rotation={[0, -angle, 0]}>
            {/* arm */}
            <mesh position={[radius / 2, 0.05, 0]} rotation={[0, 0, -0.1]}>
              <cylinderGeometry args={[0.016, 0.022, radius, 10]} />
              <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
            </mesh>
            {/* ball joint */}
            <mesh position={[0.04, 0.06, 0]}>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
            </mesh>
            {/* candle cup */}
            <mesh position={[x, 0.17, z]}>
              <cylinderGeometry args={[0.045, 0.035, 0.1, 12]} />
              <meshStandardMaterial color={brassColor} metalness={1} roughness={0.32} />
            </mesh>
            {/* candle stick */}
            <mesh position={[x, 0.27, z]}>
              <cylinderGeometry args={[0.022, 0.022, 0.14, 10]} />
              <meshStandardMaterial color="#f5e6c8" />
            </mesh>
            {/* bulb */}
            <mesh position={[x, 0.4, z]}>
              <sphereGeometry args={[0.055, 14, 14]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={intensity * 5}
                toneMapped={false}
              />
            </mesh>
            {/* glow shell */}
            <mesh position={[x, 0.4, z]}>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.18 * intensity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}

      {/* central downward light — single light, no shadow (all 10 per-bulb lights removed) */}
      <pointLight
        position={[0, -0.2, 0]}
        color={color}
        intensity={intensity * 4}
        distance={9}
        decay={2}
      />
    </group>
  );
}

function TableLamp({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  return (
    <group>
      {/* base */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.08, 24]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* slim brass stem */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.34, 12]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* shade — wide cone */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <coneGeometry args={[0.24, 0.32, 32, 1, true]} />
        <meshStandardMaterial
          color="#3a2818"
          emissive={color}
          emissiveIntensity={intensity * 1.8}
          side={THREE.DoubleSide}
          roughness={0.6}
          toneMapped={false}
        />
      </mesh>
      {/* under-shade glow */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 4}
          toneMapped={false}
        />
      </mesh>
      {/* point light */}
      <pointLight
        position={[0, 0.4, 0]}
        color={color}
        intensity={intensity * 2}
        distance={4}
        decay={2}
      />
    </group>
  );
}

function FloorLamp({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  return (
    <group position={[3.5, 0, -2.5]}>
      {/* tripod legs */}
      <mesh position={[-0.25, 0.4, -0.1]} rotation={[0.1, 0, 0.18]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.85, 10]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0.25, 0.4, -0.1]} rotation={[0.1, 0, -0.18]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.85, 10]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0.28]} rotation={[-0.18, 0, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.85, 10]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* central pole */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 1.9, 12]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* tassel knob */}
      <mesh position={[0, 2.32, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.3} />
      </mesh>
      {/* shade — drum */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.28, 0.5, 32, 1, true]} />
        <meshStandardMaterial
          color="#3a2818"
          emissive={color}
          emissiveIntensity={intensity * 1.8}
          side={THREE.DoubleSide}
          roughness={0.6}
          toneMapped={false}
        />
      </mesh>
      {/* shade top ring */}
      <mesh position={[0, 2.95, 0]}>
        <ringGeometry args={[0.0, 0.34, 32]} />
        <meshStandardMaterial color="#1a1208" side={THREE.DoubleSide} />
      </mesh>
      {/* inner bulb */}
      <mesh position={[0, 2.7, 0]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 4}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 2.7, 0]}
        color={color}
        intensity={intensity * 3}
        distance={5}
        decay={2}
      />
    </group>
  );
}

function Sconce({
  color,
  intensity,
  position,
}: {
  color: THREE.Color;
  intensity: number;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* back plate against wall */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.18, 0.22, 0.04]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.35} />
      </mesh>
      {/* small arm */}
      <mesh position={[0, 0.02, 0.13]}>
        <cylinderGeometry args={[0.018, 0.018, 0.22, 10]} />
        <meshStandardMaterial color={brassColor} metalness={1} roughness={0.35} />
      </mesh>
      {/* shade - small cone */}
      <mesh position={[0, 0.05, 0.25]}>
        <coneGeometry args={[0.12, 0.2, 20, 1, true]} />
        <meshStandardMaterial
          color="#3a2818"
          emissive={color}
          emissiveIntensity={intensity * 1.6}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* bulb */}
      <mesh position={[0, 0.0, 0.28]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 4}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0.4]}
        color={color}
        intensity={intensity * 1.4}
        distance={3.5}
        decay={2}
      />
    </group>
  );
}

/* ============================================================ */
/* COVE LIGHTING — perimeter strip along ceiling                  */
/* ============================================================ */

function Cove({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  return (
    <group>
      {/* glowing strip along the back wall top */}
      <mesh position={[0, 7.7, -4.95]}>
        <boxGeometry args={[16, 0.08, 0.04]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 3}
          toneMapped={false}
        />
      </mesh>
      {/* ambient wash light from cove */}
      <pointLight
        position={[0, 7.5, -4]}
        color={color}
        intensity={intensity * 1.2}
        distance={10}
        decay={2}
      />
      <pointLight
        position={[-4, 7.5, -2]}
        color={color}
        intensity={intensity * 0.6}
        distance={8}
        decay={2}
      />
      <pointLight
        position={[4, 7.5, -2]}
        color={color}
        intensity={intensity * 0.6}
        distance={8}
        decay={2}
      />
    </group>
  );
}

/* ============================================================ */
/* SCENE — orchestrates everything                                */
/* ============================================================ */

function Scene() {
  const scrollRef = useScrollProgress();
  const cursorRef = useCursorOffset();
  const { kelvin } = useTemperature();

  const color = useMemo(() => {
    const [r, g, b] = kelvinToRgb(kelvin);
    return new THREE.Color(r / 255, g / 255, b / 255);
  }, [kelvin]);

  // intensities tweened in useFrame
  const intensities = useRef({
    chandelier: 0,
    floorLamp: 0,
    tableLamp: 0,
    sconceL: 0,
    sconceR: 0,
    cove: 0,
    fireplace: 0,
  });

  // group refs so we can update each fixture's intensity without re-rendering
  const chandelierGroup = useRef<THREE.Group>(null!);
  const floorLampGroup = useRef<THREE.Group>(null!);
  const tableLampGroup = useRef<THREE.Group>(null!);
  const sconceLGroup = useRef<THREE.Group>(null!);
  const sconceRGroup = useRef<THREE.Group>(null!);
  const coveGroup = useRef<THREE.Group>(null!);
  const fireplaceGroup = useRef<THREE.Group>(null!);

  const camera = useThree((s) => s.camera);

  useFrame((_, delta) => {
    const p = scrollRef.current;
    const t = {
      tableLamp: smoothstep(0.04, 0.12, p),
      fireplace: smoothstep(0.06, 0.2, p),
      floorLamp: smoothstep(0.14, 0.24, p),
      sconceL: smoothstep(0.26, 0.34, p),
      sconceR: smoothstep(0.28, 0.36, p),
      chandelier: smoothstep(0.4, 0.52, p),
      cove: smoothstep(0.55, 0.65, p),
    };

    // smooth lerp
    const k = Math.min(1, delta * 5);
    const obj = intensities.current;
    obj.tableLamp += (t.tableLamp - obj.tableLamp) * k;
    obj.fireplace += (t.fireplace - obj.fireplace) * k;
    obj.floorLamp += (t.floorLamp - obj.floorLamp) * k;
    obj.sconceL += (t.sconceL - obj.sconceL) * k;
    obj.sconceR += (t.sconceR - obj.sconceR) * k;
    obj.chandelier += (t.chandelier - obj.chandelier) * k;
    obj.cove += (t.cove - obj.cove) * k;

    // camera parallax & slight zoom on scroll
    const tx = cursorRef.current.x * 0.4;
    const ty = 2 + cursorRef.current.y * 0.15;
    const tz = 7 - p * 0.6;
    camera.position.x += (tx - camera.position.x) * delta * 1.5;
    camera.position.y += (ty - camera.position.y) * delta * 1.5;
    camera.position.z += (tz - camera.position.z) * delta * 1.5;
    camera.lookAt(0, 1.6, -2);
  });

  // We can't re-render every frame; instead, drive props through children that
  // are themselves React components that re-render on parent changes.
  // To avoid jank, we sample the smoothed intensities on each frame inside
  // a child component that ALSO uses useFrame to update its own emissives.

  return (
    <group>
      <Shell />
      <Window />
      <ArtPiece />
      <Sofa />
      <CoffeeTable />

      {/* Plants — fill the corners, add life */}
      <FiddleLeafFig position={[-3.0, 0, 0.5]} />
      <Monstera position={[3.2, 0, 1.8]} />
      <SnakePlant position={[-7.2, 0, -4]} />

      {/* Bookshelf against the right wall, rotated to face inward */}
      <group position={[8.75, 0, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <Bookshelf position={[0, 0, 0]} />
      </group>

      {/* Side table on the sofa's right side */}
      <SideTable position={[2.6, 0, -1.5]} />

      {/* Each fixture is wrapped in a component that lerps its OWN intensity
          to avoid re-rendering at 60fps. We pass refs in. */}
      <ConsoleAnimated intensitiesRef={intensities} color={color} />
      <FireplaceAnimated intensitiesRef={intensities} />
      <ChandelierAnimated intensitiesRef={intensities} color={color} />
      <FloorLampAnimated intensitiesRef={intensities} color={color} />
      <SconceAnimated intensitiesRef={intensities} color={color} which="left" />
      <SconceAnimated intensitiesRef={intensities} color={color} which="right" />
      <CoveAnimated intensitiesRef={intensities} color={color} />

      {/* base ambient — room is visible at baseline even with all lamps off */}
      <ambientLight intensity={0.45} color="#8a9ab8" />

      {/* moonlight-style key from above-front — no shadow (was 1024x1024, very expensive) */}
      <directionalLight
        position={[3, 9, 5]}
        intensity={0.65}
        color="#c8d4e8"
      />

      {/* warm fill from camera side */}
      <pointLight position={[0, 3, 6]} intensity={0.3} color="#d4a878" distance={12} />

      {/* recessed cans — 2 instead of 4 */}
      <pointLight position={[-4, 7.6, -1]} intensity={0.18} color="#f0e0c8" distance={7} decay={2} />
      <pointLight position={[4, 7.6, -1]} intensity={0.18} color="#f0e0c8" distance={7} decay={2} />
    </group>
  );
}

/* ============================================================ */
/* Animated wrappers — read intensity from ref and update children */
/* ============================================================ */

function ChandelierAnimated({
  intensitiesRef,
  color,
}: {
  intensitiesRef: React.MutableRefObject<any>;
  color: THREE.Color;
}) {
  const wrapper = useRef<THREE.Group>(null);
  const intensityState = useRef(0);
  useFrame(() => {
    intensityState.current = intensitiesRef.current.chandelier;
    intensityDriver(wrapper, intensityState, color);
  });
  return (
    <group ref={wrapper}>
      <Chandelier color={color} intensity={1} />
    </group>
  );
}

/* Generic intensity driver — caches lights/emissives once, then writes
   intensities directly each frame. Avoids the full Group.traverse() per tick. */
type DriverCache = {
  lights: { light: THREE.PointLight; base: number }[];
  emissives: { mat: any; base: number }[];
};

function ensureCache(g: THREE.Group): DriverCache {
  const ud = g.userData as { __cache?: DriverCache };
  if (ud.__cache) return ud.__cache;
  const lights: DriverCache["lights"] = [];
  const emissives: DriverCache["emissives"] = [];
  g.traverse((obj: any) => {
    if (obj.isPointLight) {
      lights.push({ light: obj, base: obj.intensity || 1 });
    }
    if (obj.isMesh && obj.material && "emissiveIntensity" in obj.material) {
      emissives.push({ mat: obj.material, base: obj.material.emissiveIntensity ?? 0 });
    }
  });
  ud.__cache = { lights, emissives };
  return ud.__cache;
}

function intensityDriver(
  groupRef: React.RefObject<THREE.Group | null>,
  intensityRef: React.MutableRefObject<number>,
  color?: THREE.Color
) {
  const g = groupRef.current;
  if (!g) return;
  const I = intensityRef.current;
  const cache = ensureCache(g);
  for (let i = 0; i < cache.lights.length; i++) {
    const l = cache.lights[i];
    l.light.intensity = l.base * I;
    if (color) l.light.color.copy(color);
  }
  for (let i = 0; i < cache.emissives.length; i++) {
    const e = cache.emissives[i];
    e.mat.emissiveIntensity = e.base * I;
    if (color && e.mat.emissive) e.mat.emissive.copy(color);
  }
}

function FloorLampAnimated({
  intensitiesRef,
  color,
}: {
  intensitiesRef: React.MutableRefObject<any>;
  color: THREE.Color;
}) {
  const wrapper = useRef<THREE.Group>(null);
  const intensityState = useRef(0);
  useFrame(() => {
    intensityState.current = intensitiesRef.current.floorLamp;
    intensityDriver(wrapper, intensityState, color);
  });
  return (
    <group ref={wrapper}>
      <FloorLamp color={color} intensity={1} />
    </group>
  );
}

function ConsoleAnimated({
  intensitiesRef,
  color,
}: {
  intensitiesRef: React.MutableRefObject<any>;
  color: THREE.Color;
}) {
  // We render the full Console (which includes the table lamp), but only the
  // table-lamp parts should dim with tableLamp. Drive the whole sub-tree by
  // tableLamp intensity — the brass/wood console doesn't have emissives so
  // it's unaffected; only the lamp parts respond.
  const wrapper = useRef<THREE.Group>(null);
  const intensityState = useRef(0);
  useFrame(() => {
    intensityState.current = intensitiesRef.current.tableLamp;
    intensityDriver(wrapper, intensityState, color);
  });
  return (
    <group ref={wrapper}>
      <Console color={color} intensity={1} />
    </group>
  );
}

function SconceAnimated({
  intensitiesRef,
  color,
  which,
}: {
  intensitiesRef: React.MutableRefObject<any>;
  color: THREE.Color;
  which: "left" | "right";
}) {
  const wrapper = useRef<THREE.Group>(null);
  const intensityState = useRef(0);
  useFrame(() => {
    intensityState.current =
      which === "left"
        ? intensitiesRef.current.sconceL
        : intensitiesRef.current.sconceR;
    intensityDriver(wrapper, intensityState, color);
  });
  const position: [number, number, number] =
    which === "left" ? [-0.5, 4.2, -4.93] : [2.9, 4.2, -4.93];
  return (
    <group ref={wrapper}>
      <Sconce color={color} intensity={1} position={position} />
    </group>
  );
}

function FireplaceAnimated({
  intensitiesRef,
}: {
  intensitiesRef: React.MutableRefObject<any>;
}) {
  const wrapper = useRef<THREE.Group>(null);
  const intensityState = useRef(0);
  // Fireplace handles its own flicker inside; we just pass intensity through.
  useFrame(() => {
    intensityState.current = intensitiesRef.current.fireplace;
  });
  return (
    <group ref={wrapper}>
      <FireplaceWithIntensityRef intensityRef={intensityState} />
    </group>
  );
}

function FireplaceWithIntensityRef({
  intensityRef,
}: {
  intensityRef: React.MutableRefObject<number>;
}) {
  // Fireplace as before, but reads intensity from the ref each frame
  const lightRef = useRef<THREE.PointLight>(null);
  const fireRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.85 + Math.sin(t * 14) * 0.1 + Math.sin(t * 23.1) * 0.06;
    const I = intensityRef.current;
    if (lightRef.current) lightRef.current.intensity = I * 3.5 * flicker;
    if (fireRef.current) {
      const mat = fireRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = I * 5 * flicker;
    }
  });

  return (
    <group position={[5.5, 0.8, -4.65]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.6, 0.12, 0.5]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[2.4, 2.6, 0.2]} />
        <meshStandardMaterial color="#0d0806" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.1, 0.11]}>
        <boxGeometry args={[1.6, 1.6, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.25, -0.7, 0.15]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.95} />
      </mesh>
      <mesh position={[0.2, -0.65, 0.15]} rotation={[0, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.95} />
      </mesh>
      <mesh ref={fireRef} position={[0, -0.35, 0.2]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color="#ff5a1f"
          emissive="#ff9040"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, -0.2, 0.5]}
        color="#ff7030"
        intensity={0}
        distance={6}
        decay={2}
      />
    </group>
  );
}

function CoveAnimated({
  intensitiesRef,
  color,
}: {
  intensitiesRef: React.MutableRefObject<any>;
  color: THREE.Color;
}) {
  const wrapper = useRef<THREE.Group>(null);
  const intensityState = useRef(0);
  useFrame(() => {
    intensityState.current = intensitiesRef.current.cove;
    intensityDriver(wrapper, intensityState, color);
  });
  return (
    <group ref={wrapper}>
      <Cove color={color} intensity={1} />
    </group>
  );
}

/* ============================================================ */
/* Top-level export                                              */
/* ============================================================ */

export default function Room3D() {
  // Pause rendering when tab is hidden — saves GPU when user switches away.
  const [active, setActive] = useState(true);
  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 2, 7], fov: 50 }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      dpr={[1, 1]}
    >
      <fog attach="fog" args={["#0a0810", 20, 40]} />
      <color attach="background" args={["#0a0810"]} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
