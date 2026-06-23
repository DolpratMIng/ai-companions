import { NextRequest } from 'next/server'
import { chatCompletion } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'messages array required' }, { status: 400 })
    }

    const stream = await chatCompletion({ messages })

    return new Response(stream.body, {
      headers: { 'Content-Type': 'text/event-stream' },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
