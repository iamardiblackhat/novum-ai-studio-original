import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt || prompt.trim().length < 3) return Response.json({ error: 'A valid prompt is required' }, { status: 400 })
    return Response.json({ message: 'Video generation requires a local ComfyUI setup.', prompt: prompt.trim() })
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : 'Video generation failed' }, { status: 500 })
  }
}
