import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  return !key.toLowerCase().includes("your-") && key.trim().length > 15;
}

export async function POST(req: NextRequest) {
  try {
    const {
      text,
      voice = "nova",
      model = "pollinations-tts",
      apiKeys = {},
    } = await req.json();
    if (!text || text.trim().length === 0)
      return Response.json({ error: "Text required" }, { status: 400 });

    // 1. ElevenLabs
    const elevenKey = isValidKey(
      apiKeys.elevenlabs || process.env.ELEVENLABS_API_KEY,
    )
      ? apiKeys.elevenlabs || process.env.ELEVENLABS_API_KEY
      : undefined;
    if (elevenKey && (model.includes("eleven") || model.includes("v3"))) {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": elevenKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            model_id: "eleven_multilingual_v2",
          }),
        },
      );
      if (res.ok)
        return new Response(await res.arrayBuffer(), {
          headers: { "Content-Type": "audio/mpeg" },
        });
    }

    // 2. OpenAI
    const openaiKey = isValidKey(apiKeys.openai || process.env.OPENAI_API_KEY)
      ? apiKeys.openai || process.env.OPENAI_API_KEY
      : undefined;
    if (openaiKey && (model.includes("tts") || model.includes("openai"))) {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "tts-1-hd", input: text.trim(), voice }),
      });
      if (res.ok)
        return new Response(await res.arrayBuffer(), {
          headers: { "Content-Type": "audio/mpeg" },
        });
    }

    // 3. Fallback
    const safeVoice = [
      "alloy",
      "echo",
      "fable",
      "onyx",
      "nova",
      "shimmer",
    ].includes(voice)
      ? voice
      : "nova";
    const res = await fetch(
      `https://audio.pollinations.ai/tts?voice=${safeVoice}&text=${encodeURIComponent(text.trim())}`,
    );
    if (res.ok)
      return new Response(await res.arrayBuffer(), {
        headers: { "Content-Type": "audio/mpeg" },
      });

    throw new Error("Synthesis engines busy");
  } catch (error: unknown) {
    return Response.json({ error: "Audio failure" }, { status: 500 });
  }
}
