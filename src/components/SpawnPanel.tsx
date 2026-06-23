'use client'

import { useStore } from '@/stores/useStore'
import type { CharacterPreset } from '@/lib/types'

const PRESETS: CharacterPreset[] = [
  { id: 'alicia', name: 'Alicia', modelUrl: '/models/AliciaSolid.vrm', description: 'Friendly companion' },
  { id: 'alicia-2', name: 'Alicia 2', modelUrl: '/models/AliciaSolid.vrm', description: 'Second companion' },
  { id: 'alicia-3', name: 'Alicia 3', modelUrl: '/models/AliciaSolid.vrm', description: 'Third companion' },
]

export function SpawnPanel() {
  const characters = useStore((s) => s.characters)
  const spawnCharacter = useStore((s) => s.spawnCharacter)
  const dismissCharacter = useStore((s) => s.dismissCharacter)

  const isSpawned = (preset: CharacterPreset) =>
    characters.some(
      (c) => c.name === preset.name || c.modelUrl === preset.modelUrl,
    )

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map((preset) => {
          const spawned = isSpawned(preset)
          return (
            <button
              key={preset.id}
              onClick={() =>
                spawned
                  ? dismissCharacter(
                      characters.find(
                        (c) => c.name === preset.name,
                      )!.id,
                    )
                  : spawnCharacter(preset)
              }
              className={`px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border transition text-sm font-medium
                ${spawned
                  ? 'bg-red-500/80 text-white border-red-400 hover:bg-red-500'
                  : 'bg-white/80 text-gray-800 border-white/60 hover:bg-white'
                }`}
            >
              {spawned ? `✕ ${preset.name}` : `+ ${preset.name}`}
            </button>
          )
        })}
      </div>

      {characters.length > 0 && (
        <p className="text-xs text-white/60 bg-black/30 px-3 py-1 rounded-full backdrop-blur">
          {characters.length} character{characters.length !== 1 ? 's' : ''} • click name to dismiss
        </p>
      )}
    </div>
  )
}
