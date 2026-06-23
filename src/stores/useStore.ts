import { create } from 'zustand'
import type { Character, Message } from '@/lib/types'

interface AppState {
  characters: Character[]
  spawnCharacter: (preset: { id: string; name: string; modelUrl: string }) => void
  dismissCharacter: (id: string) => void
  addMessage: (characterId: string, message: Message) => void
  setExpression: (characterId: string, expression: Character['expression']) => void
  setIsSpeaking: (characterId: string, isSpeaking: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  characters: [],

  spawnCharacter: (preset) =>
    set((state) => ({
      characters: [
        ...state.characters,
        {
          id: crypto.randomUUID(),
          name: preset.name,
          modelUrl: preset.modelUrl,
          position: [0, 0, 0],
          scale: 1,
          chatHistory: [],
          isSpeaking: false,
          expression: 'idle',
        },
      ],
    })),

  dismissCharacter: (id) =>
    set((state) => ({
      characters: state.characters.filter((c) => c.id !== id),
    })),

  addMessage: (characterId, message) =>
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === characterId
          ? { ...c, chatHistory: [...c.chatHistory, message] }
          : c,
      ),
    })),

  setExpression: (characterId, expression) =>
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === characterId ? { ...c, expression } : c,
      ),
    })),

  setIsSpeaking: (characterId, isSpeaking) =>
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === characterId ? { ...c, isSpeaking } : c,
      ),
    })),
}))
