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

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Text required" }, { status: 400 });
    }

    // 1. ElevenLabs (if user provided valid key)
    const elevenKey = isValidKey(apiKeys.elevenlabs || process.env.ELEVENLABS_API_KEY)
      ? apiKeys.elevenlabs || process.env.ELEVENLABS_API_KEY
      : undefined;
    if (elevenKey && (model.includes("eleven") || model.includes("v3"))) {
      try {
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
          }
        );
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const base64Audio = Buffer.from(buffer).toString("base64");
          return Response.json({
            url: `data:audio/mpeg;base64,${base64Audio}`,
            text: text.trim(),
            voice,
            modelUsed: "ElevenLabs V2",
          });
        }
      } catch (err) {
        console.warn("ElevenLabs fallback trigger", err);
      }
    }

    // 2. OpenAI TTS (if user provided valid key)
    const openaiKey = isValidKey(apiKeys.openai || process.env.OPENAI_API_KEY)
      ? apiKeys.openai || process.env.OPENAI_API_KEY
      : undefined;
    if (openaiKey && (model.includes("tts") || model.includes("openai"))) {
      try {
        const res = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model: "tts-1-hd", input: text.trim(), voice }),
        });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const base64Audio = Buffer.from(buffer).toString("base64");
          return Response.json({
            url: `data:audio/mpeg;base64,${base64Audio}`,
            text: text.trim(),
            voice,
            modelUsed: "OpenAI TTS HD",
          });
        }
      } catch (err) {
        console.warn("OpenAI TTS fallback trigger", err);
      }
    }

    // 3. 100% Free Open-Source & Pollinations Audio Engine
    // Supports Kokoro / Nova / OpenAI Audio / Qwen TTS styles
    const safeVoice = [
      "nova",
      "nova-fast",
      "openai-audio",
      "openai-audio-large",
      "elevenflash",
      "qwen-tts",
      "kokoro-af-heart",
      "kokoro-am-adam",
      "kokoro-bf-emma",
    ].includes(voice)
      ? voice
      : "nova";

    // Direct streamable URL for instant HTML5 Audio playback without buffering delays
    const audioUrl = `https://audio.pollinations.ai/tts?voice=${safeVoice}&text=${encodeURIComponent(
      text.trim()
    )}`;

    return Response.json({
      url: audioUrl,
      text: text.trim(),
      voice: safeVoice,
      modelUsed: `Free Neural TTS (${safeVoice})`,
    });
  } catch (error: unknown) {
    return Response.json({ error: "Audio synthesis failure" }, { status: 500 });
  }
}
