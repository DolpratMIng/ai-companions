'use client'

import type { Message } from '@/lib/types'

interface ChatBubbleProps {
  message: Message
  isVisible: boolean
}

export function ChatBubble({ message, isVisible }: ChatBubbleProps) {
  if (!isVisible) return null

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 max-w-[200px]">
      <div
        className={`px-3 py-1.5 rounded-2xl text-sm shadow-lg backdrop-blur-sm
          ${message.role === 'user' ? 'bg-blue-500/80 text-white' : 'bg-white/90 text-gray-800'}
        `}
      >
        {message.content}
      </div>
    </div>
  )
}
