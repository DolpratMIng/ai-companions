'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BODY_COLORS = ['#6b4c8a', '#e06b6b', '#4a8c6f', '#4a7c9e', '#c97d3a']

interface CharacterProps {
  position: [number, number, number]
  colorIndex?: number
}

export function Character({ position, colorIndex = 0 }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyColor = BODY_COLORS[colorIndex % BODY_COLORS.length]

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.06
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.14, 0.35, 8, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#f0c8a0" roughness={0.4} />
      </mesh>

      {/* Hair (simple dome) */}
      <mesh position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.185, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={bodyColor} roughness={0.8} />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.06, 0.87, 0.17]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.06, 0.87, 0.17]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Eye shine left */}
      <mesh position={[-0.05, 0.88, 0.175]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Eye shine right */}
      <mesh position={[0.07, 0.88, 0.175]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Mouth (tiny sphere) */}
      <mesh position={[0, 0.82, 0.175]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshStandardMaterial color="#c07870" />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.22, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.25, 6]} />
        <meshStandardMaterial color="#f0c8a0" roughness={0.6} />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.22, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.25, 6]} />
        <meshStandardMaterial color="#f0c8a0" roughness={0.6} />
      </mesh>

      {/* Shadow / ground disc */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0.15} roughness={1} />
      </mesh>
    </group>
  )
}
