'use client'

import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/stores/useStore'

export function ChatInput() {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const activeCharacterId = useStore((s) => s.activeCharacterId)
  const isThinking = useStore((s) => s.isThinking)
  const sendMessage = useStore((s) => s.sendMessage)
  const characters = useStore((s) => s.characters)

  const activeChar = characters.find((c) => c.id === activeCharacterId)

  useEffect(() => {
    if (activeCharacterId) {
      inputRef.current?.focus()
    }
  }, [activeCharacterId])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || !activeCharacterId || isThinking) return
    setText('')
    sendMessage(trimmed)
  }

  if (!activeChar) return null

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 px-4 py-2">
        <span className="text-xs text-gray-500 font-medium shrink-0">
          {activeChar.name}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isThinking ? 'Thinking...' : 'Type a message...'}
          disabled={isThinking}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isThinking}
          className="shrink-0 size-8 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm disabled:opacity-30 hover:bg-gray-700 transition"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
