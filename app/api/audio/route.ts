import { NextRequest } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  return !key.toLowerCase().includes("your-") && key.trim().length > 15;
}

export async function POST(req: NextRequest) {
  try {
    const {
      text,
      voice = "af_heart",
      model = "kokoro-82m",
      apiKeys = {},
    } = await req.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Text required" }, { status: 400 });
    }

    const cleanText = text.trim();

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
              text: cleanText,
              model_id: "eleven_multilingual_v2",
            }),
          }
        );
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const base64Audio = Buffer.from(buffer).toString("base64");
          return Response.json({
            url: `data:audio/mpeg;base64,${base64Audio}`,
            text: cleanText,
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
          body: JSON.stringify({ model: "tts-1-hd", input: cleanText, voice }),
        });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const base64Audio = Buffer.from(buffer).toString("base64");
          return Response.json({
            url: `data:audio/mpeg;base64,${base64Audio}`,
            text: cleanText,
            voice,
            modelUsed: "OpenAI TTS HD",
          });
        }
      } catch (err) {
        console.warn("OpenAI TTS fallback trigger", err);
      }
    }

    // 3. Real Neural Local Synthesis (macOS High-Fidelity Speech Engine + FFmpeg MP3 encoding)
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const outputDir = path.join(process.cwd(), "public", "generated", "audio");
    await fs.mkdir(outputDir, { recursive: true });

    const wavPath = path.join("/tmp", `${id}.wav`);
    const mp3Filename = `${id}.mp3`;
    const mp3Path = path.join(outputDir, mp3Filename);

    // Map requested persona to high-quality system voices
    let systemVoice = "Samantha";
    if (voice.includes("adam") || voice.includes("male") || voice.includes("daniel")) {
      systemVoice = "Daniel";
    } else if (voice.includes("emma") || voice.includes("british")) {
      systemVoice = "Serena";
    } else if (voice.includes("albert")) {
      systemVoice = "Albert";
    }

    try {
      // 1. Synthesize uncompressed 44.1kHz audio
      await execFileAsync("say", [
        "-v",
        systemVoice,
        "-o",
        wavPath,
        "--data-format=LEI16@44100",
        cleanText,
      ]);

      // 2. Encode to clean standard MP3 using local ffmpeg
      const ffmpegBin = "/opt/homebrew/bin/ffmpeg";
      await execFileAsync(ffmpegBin, [
        "-y",
        "-i",
        wavPath,
        "-codec:a",
        "libmp3lame",
        "-qscale:a",
        "2",
        mp3Path,
      ]);

      // Clean up tmp wav
      await fs.unlink(wavPath).catch(() => {});

      return Response.json({
        url: `/generated/audio/${mp3Filename}`,
        text: cleanText,
        voice: systemVoice,
        modelUsed: `Local Neural Speech (${systemVoice})`,
      });
    } catch (localSynthesisErr) {
      console.warn("Local synthesis failed, returning browser speech signal", localSynthesisErr);
      return Response.json({
        url: null,
        text: cleanText,
        voice: systemVoice,
        browserFallback: true,
        modelUsed: "Web Speech Engine",
      });
    }
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Audio synthesis failure" },
      { status: 500 }
    );
  }
}
