import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 512, height = 512 } = await req.json()
    if (!prompt || prompt.trim().length < 3) return Response.json({ error: 'A valid prompt is required' }, { status: 400 })
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llava', prompt: prompt.trim(), stream: false })
    })
    if (!res.ok) throw new Error(`Ollama image error (${res.status})`)
    const data = await res.json()
    return Response.json({ content: data.response || '', prompt: prompt.trim() })
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : 'Image generation failed' }, { status: 500 })
  }
}
