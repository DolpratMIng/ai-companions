import { NextRequest } from 'next/server'
import { generateSpeech } from '@/lib/tts'

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json()

    if (!text) {
      return Response.json({ error: 'text required' }, { status: 400 })
    }

    const audioRes = await generateSpeech({ text, voice })

    const audioBuffer = await audioRes.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (err) {
    console.error('TTS API error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
