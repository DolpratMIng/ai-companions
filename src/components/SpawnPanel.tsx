'use client'

import { useStore } from '@/stores/useStore'
import type { CharacterPreset } from '@/lib/types'

const PRESETS: CharacterPreset[] = [
  { id: 'miko', name: 'Miko', modelUrl: '/models/miko.vrm', description: 'Cheerful shrine maiden' },
  { id: 'samurai', name: 'Samurai', modelUrl: '/models/samurai.vrm', description: 'Honorable warrior' },
  { id: 'neko', name: 'Neko', modelUrl: '/models/neko.vrm', description: 'Playful cat spirit' },
]

export function SpawnPanel() {
  const characters = useStore((s) => s.characters)
  const spawnCharacter = useStore((s) => s.spawnCharacter)
  const dismissCharacter = useStore((s) => s.dismissCharacter)

  const isSpawned = (name: string) => characters.some((c) => c.name === name)

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map((preset) => {
          const spawned = isSpawned(preset.name)
          return (
            <button
              key={preset.id}
              onClick={() => (spawned ? dismissCharacter(characters.find((c) => c.name === preset.name)!.id) : spawnCharacter(preset))}
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
          {characters.length} character{characters.length !== 1 ? 's' : ''} in scene
        </p>
      )}
    </div>
  )
}
