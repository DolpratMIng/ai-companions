'use client'

import { Canvas } from '@react-three/fiber'
import { useStore } from '@/stores/useStore'
import { Character } from './Character'

export function ARScene() {
  const characters = useStore((s) => s.characters)

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 1.2, 2.8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} />
        <hemisphereLight args={['#ffffff', '#444444', 0.4]} />

        {characters.map((char, i) => (
          <Character
            key={char.id}
            position={[i * 1.2 - (characters.length - 1) * 0.6, 0, -1.2]}
            colorIndex={i}
          />
        ))}
      </Canvas>
    </div>
  )
}
