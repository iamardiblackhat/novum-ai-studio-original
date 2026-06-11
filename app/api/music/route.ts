import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { prompt, duration = 30 } = await req.json()
    if (!prompt || prompt.trim().length < 3) return Response.json({ error: 'A valid prompt is required' }, { status: 400 })
    return Response.json({ url: `https://audio.pollinations.ai/music?prompt=${encodeURIComponent(prompt.trim())}&duration=${duration}`, prompt: prompt.trim() })
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : 'Music generation failed' }, { status: 500 })
  }
}
