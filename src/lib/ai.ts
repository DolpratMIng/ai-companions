const LLM_API_KEY = process.env.LLM_API_KEY
const LLM_BASE_URL = process.env.LLM_BASE_URL ?? 'https://api.openai.com/v1'
const LLM_MODEL = process.env.LLM_MODEL ?? 'gpt-4o-mini'

export interface ChatOptions {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  signal?: AbortSignal
}

export async function chatCompletion({ messages, signal }: ChatOptions) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${LLM_API_KEY}`,
  }

  // OpenRouter needs these for rate limiting
  if (LLM_BASE_URL.includes('openrouter')) {
    headers['HTTP-Referer'] = 'https://localhost:3000'
    headers['X-Title'] = 'AI Companion'
  }

  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      stream: true,
    }),
    signal,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`LLM API error: ${res.status} — ${body.slice(0, 200)}`)
  }

  return res
}
