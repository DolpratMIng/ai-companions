'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import * as THREE from 'three'
import { useStore } from '@/stores/useStore'

interface CharacterProps {
  charId: string
  modelUrl: string
  position: [number, number, number]
}

export function Character({ charId, modelUrl, position }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const vrmRef = useRef<VRM | null>(null)
  const blinkTimer = useRef(0)

  const character = useStore((s) => s.characters.find((c) => c.id === charId))
  const activeCharacterId = useStore((s) => s.activeCharacterId)
  const isThinking = useStore((s) => s.isThinking)
  const setActiveCharacter = useStore((s) => s.setActiveCharacter)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.register((parser) => new VRMLoaderPlugin(parser))

    let disposed = false

    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return
        const vrm = gltf.userData.vrm as VRM
        vrmRef.current = vrm
        VRMUtils.rotateVRM0(vrm)
        if (groupRef.current) {
          groupRef.current.add(vrm.scene)
        }
      },
      undefined,
      (err) => {
        console.error('VRM load error:', err)
      },
    )

    return () => {
      disposed = true
      if (vrmRef.current && groupRef.current) {
        groupRef.current.remove(vrmRef.current.scene)
      }
    }
  }, [modelUrl])

  useFrame((state, delta) => {
    const vrm = vrmRef.current
    if (!vrm) return

    vrm.update(delta)

    if (groupRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.2) * 0.008
      groupRef.current.position.y = position[1] + breathe
    }

    const em = vrm.expressionManager
    if (!em) return

    blinkTimer.current += delta
    const interval = 3.0
    const duration = 0.1

    if (blinkTimer.current >= interval) {
      blinkTimer.current = 0
    }

    if (blinkTimer.current < duration) {
      const t = blinkTimer.current / duration
      const v = t < 0.5 ? t / 0.5 : (1 - t) / 0.5
      em.setValue('blink', v)
    } else if ((em.getValue('blink') ?? 0) > 0) {
      em.setValue('blink', 0)
    }

    em.update()
  })

  const lastMessage = character?.chatHistory?.filter((m) => m.role === 'assistant').at(-1)
  const showBubble = lastMessage || (activeCharacterId === charId && isThinking)

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        setActiveCharacter(charId)
      }}
    >
      {activeCharacterId === charId && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshStandardMaterial
            color="#60a5fa"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {showBubble && (
        <Html position={[0, 1.6, 0]} center distanceFactor={8}>
          <div
            className={`px-3 py-1.5 rounded-2xl text-sm shadow-lg backdrop-blur-sm max-w-[200px] text-center pointer-events-none
              ${lastMessage ? 'bg-white/90 text-gray-800' : 'bg-amber-100/90 text-amber-800'}`}
          >
            {lastMessage ? lastMessage.content : '...'}
          </div>
        </Html>
      )}
    </group>
  )
}
