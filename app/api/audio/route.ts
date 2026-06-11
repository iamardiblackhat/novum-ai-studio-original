import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'nova' } = await req.json()
    if (!text || text.trim().length === 0) return Response.json({ error: 'Text is required' }, { status: 400 })
    const safeVoice = ['alloy','echo','fable','onyx','nova','shimmer'].includes(voice) ? voice : 'nova'
    const res = await fetch(`https://audio.pollinations.ai/tts?voice=${safeVoice}&text=${encodeURIComponent(text.trim())}`)
    if (!res.ok) throw new Error(`TTS failed (${res.status})`)
    return new Response(await res.arrayBuffer(), { headers: { 'Content-Type': 'audio/mpeg' } })
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : 'Audio synthesis failed' }, { status: 500 })
  }
}
