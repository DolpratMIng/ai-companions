'use client'

import { Canvas } from '@react-three/fiber'
import { useStore } from '@/stores/useStore'
import { Character } from './Character'

export function ARScene() {
  const characters = useStore((s) => s.characters)
  const setActiveCharacter = useStore((s) => s.setActiveCharacter)

  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 1.5, 3.2], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        onPointerMissed={() => setActiveCharacter(null)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} />
        <hemisphereLight args={['#ffffff', '#444444', 0.4]} />

        {characters.map((char, i) => (
          <Character
            key={char.id}
            charId={char.id}
            modelUrl={char.modelUrl}
            position={[
              i * 1.5 - (characters.length - 1) * 0.75,
              -0.7,
              -1.2,
            ]}
          />
        ))}
      </Canvas>
    </div>
  )
}
