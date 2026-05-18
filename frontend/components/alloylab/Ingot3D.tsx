"use client";

import { Suspense } from "react";
import type { SimulationResult } from "@/lib/types";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

interface IngotProps {
  isFeasible: boolean;
  errorVsTarget: number;
}

/**
 * IngotGeometry: Componente 3D del lingote metálico
 * - Material brillante si es exitoso
 * - Material rugoso/rojo si hay error o es infactible
 */
function IngotGeometry({ isFeasible, errorVsTarget }: IngotProps) {
  const geometry = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);

  // Determinar propiedades del material según viabilidad
  const isSuccessful = isFeasible && errorVsTarget < 2;

  // Material exitoso: pulido, brillante
  const successMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0a080, // Bronce dorado
    metalness: 0.95,
    roughness: 0.1,
    emissive: 0x2a2a2a,
  });

  // Material con error: rugoso
  const warningMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a, // Gris oscuro
    metalness: 0.6,
    roughness: 0.7,
    emissive: 0x1a0000,
  });

  // Material infactible: rojo oscuro, muy rugoso
  const errorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b0000, // Rojo oscuro
    metalness: 0.3,
    roughness: 0.95,
    emissive: 0x4a0000,
  });

  const materialToUse = !isFeasible
    ? errorMaterial
    : errorVsTarget > 10
      ? warningMaterial
      : successMaterial;

  return (
    <mesh geometry={geometry} material={materialToUse} position={[0, 0, 0]}>
      <meshStandardMaterial
        attach="material"
        color={
          !isFeasible ? 0x8b0000 : errorVsTarget > 10 ? 0x4a4a4a : 0xc0a080
        }
        metalness={!isFeasible ? 0.3 : errorVsTarget > 10 ? 0.6 : 0.95}
        roughness={!isFeasible ? 0.95 : errorVsTarget > 10 ? 0.7 : 0.1}
        emissive={
          !isFeasible
            ? 0x4a0000
            : errorVsTarget > 10
              ? 0x1a0000
              : 0x2a2a2a
        }
      />
    </mesh>
  );
}

/**
 * Ingot3D: Contenedor principal del lingote 3D
 */
function Ingot3DScene({ resultados }: { resultados: SimulationResult | null }) {
  const isFeasible = resultados?.es_factible ?? false;
  const errorVsTarget = resultados?.error_vs_objetivo ?? 100;

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color={0xffffff} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color={0xff6600} />

      {/* Ingot */}
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        zoom={1.5}
        polar={[0, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <IngotGeometry isFeasible={isFeasible} errorVsTarget={errorVsTarget} />
      </PresentationControls>

      {/* Orbit Controls */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom
        enablePan
        dampingFactor={0.05}
      />
    </>
  );
}

interface Ingot3DProps {
  resultados: SimulationResult | null;
}

export default function Ingot3D({ resultados }: Ingot3DProps) {
  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-lg h-full min-h-96">
      <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
        Visualización 3D: Lingote Metálico
      </h2>

      <div className="w-full h-80 rounded-lg overflow-hidden bg-linear-to-b from-slate-900 to-slate-800">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-400">
          Cargando visualización 3D...
        </div>}>
          <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
            <Ingot3DScene resultados={resultados} />
          </Canvas>
        </Suspense>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{backgroundColor: "#c0a080"}}></div>
          <span>✅ Exitoso (Error &lt; 2%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{backgroundColor: "#4a4a4a"}}></div>
          <span>⚠️ Advertencia (Error 2-10%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{backgroundColor: "#8b0000"}}></div>
          <span>❌ Infactible o Error Alto (&gt; 10%)</span>
        </div>
      </div>
    </div>
  );
}
