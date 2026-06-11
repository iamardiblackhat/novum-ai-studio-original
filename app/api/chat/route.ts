import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'llama3.1' } = await req.json()
    if (!messages || !Array.isArray(messages)) return Response.json({ error: 'Messages are required' }, { status: 400 })
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false })
    })
    if (!res.ok) throw new Error(`Ollama error (${res.status}): ${await res.text()}`)
    const data = await res.json()
    return Response.json({ content: data.message?.content || '' })
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : 'Chat failed' }, { status: 500 })
  }
}
