import { NextRequest } from 'next/server'
import { chatCompletion } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.LLM_API_KEY) {
      return Response.json({ error: 'LLM_API_KEY not set in .env.local' }, { status: 500 })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'messages array required' }, { status: 400 })
    }

    const stream = await chatCompletion({ messages })

    return new Response(stream.body, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Chat API error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
