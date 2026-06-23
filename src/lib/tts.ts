const TTS_API_KEY = process.env.TTS_API_KEY
const TTS_BASE_URL = process.env.TTS_BASE_URL ?? 'https://api.openai.com/v1'

export interface TtsOptions {
  text: string
  voice?: string
  model?: string
}

export async function generateSpeech({ text, voice = 'alloy', model = 'tts-1' }: TtsOptions) {
  const res = await fetch(`${TTS_BASE_URL}/audio/speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TTS_API_KEY}`,
    },
    body: JSON.stringify({ model, input: text, voice, response_format: 'mp3' }),
  })

  if (!res.ok) {
    throw new Error(`TTS API error: ${res.status} ${res.statusText}`)
  }

  return res
}
