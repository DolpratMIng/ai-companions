import { create } from 'zustand'
import type { Character, Message } from '@/lib/types'

interface AppState {
  characters: Character[]
  activeCharacterId: string | null
  isThinking: boolean
  spawnCharacter: (preset: { id: string; name: string; modelUrl: string }) => void
  dismissCharacter: (id: string) => void
  addMessage: (characterId: string, message: Message) => void
  setExpression: (characterId: string, expression: Character['expression']) => void
  setIsSpeaking: (characterId: string, isSpeaking: boolean) => void
  setActiveCharacter: (id: string | null) => void
  sendMessage: (text: string) => Promise<void>
}

const SYSTEM_PROMPT = `You are a friendly anime companion standing beside the user in their room via augmented reality. You are visible through their webcam. Be warm, conversational, and keep responses short (1-3 sentences). Speak naturally as if you're physically present. Never mention you are an AI.`

export const useStore = create<AppState>((set, get) => ({
  characters: [],
  activeCharacterId: null,
  isThinking: false,

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
      activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId,
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

  setActiveCharacter: (id) => set({ activeCharacterId: id }),

  sendMessage: async (text) => {
    const { activeCharacterId, characters } = get()
    if (!activeCharacterId) return

    const character = characters.find((c) => c.id === activeCharacterId)
    if (!character) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === activeCharacterId
          ? { ...c, chatHistory: [...c.chatHistory, userMsg] }
          : c,
      ),
      isThinking: true,
    }))

    const history = get().characters.find((c) => c.id === activeCharacterId)?.chatHistory ?? []

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT.replace('{name}', character.name) },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6))
              const content = data.choices?.[0]?.delta?.content ?? ''
              fullContent += content
            } catch {}
          }
        }
      }

      if (fullContent) {
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullContent,
          timestamp: Date.now(),
        }

        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === activeCharacterId
              ? { ...c, chatHistory: [...c.chatHistory, aiMsg] }
              : c,
          ),
          isThinking: false,
        }))
      }
    } catch (err) {
      console.error('Chat error:', err)
      set({ isThinking: false })
    }
  },
}))
