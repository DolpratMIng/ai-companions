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
  const activeCharacterId = useStore((s) => s.activeCharacterId)
  const spawnCharacter = useStore((s) => s.spawnCharacter)
  const dismissCharacter = useStore((s) => s.dismissCharacter)
  const setActiveCharacter = useStore((s) => s.setActiveCharacter)

  const isSpawned = (preset: CharacterPreset) =>
    characters.some((c) => c.name === preset.name)

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map((preset) => {
          const spawned = isSpawned(preset)
          const char = characters.find((c) => c.name === preset.name)
          const isActive = char?.id === activeCharacterId

          if (!spawned) {
            return (
              <button
                key={preset.id}
                onClick={() => spawnCharacter(preset)}
                className="px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border transition text-sm font-medium bg-white/80 text-gray-800 border-white/60 hover:bg-white"
              >
                + {preset.name}
              </button>
            )
          }

          return (
            <div key={preset.id} className="flex gap-1">
              <button
                onClick={() => setActiveCharacter(char!.id)}
                className={`px-3 py-2 rounded-l-xl shadow-lg backdrop-blur-sm border transition text-sm font-medium
                  ${isActive
                    ? 'bg-blue-500/80 text-white border-blue-400'
                    : 'bg-white/80 text-gray-800 border-white/60 hover:bg-white'
                  }`}
              >
                {preset.name}
              </button>
              <button
                onClick={() => dismissCharacter(char!.id)}
                className="px-2 py-2 rounded-r-xl shadow-lg backdrop-blur-sm border border-l-0 transition text-sm font-medium bg-red-500/80 text-white border-red-400 hover:bg-red-500"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      {activeCharacterId && (
        <p className="text-xs text-white bg-blue-500/60 px-3 py-1 rounded-full backdrop-blur">
          Type below to talk
        </p>
      )}
    </div>
  )
}
