'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import * as THREE from 'three'

interface CharacterProps {
  modelUrl: string
  position: [number, number, number]
}

export function Character({ modelUrl, position }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const vrmRef = useRef<VRM | null>(null)
  const blinkTimer = useRef(0)

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

  return <group ref={groupRef} position={position} />
}
