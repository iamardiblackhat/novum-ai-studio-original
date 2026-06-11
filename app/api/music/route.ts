import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  return !key.toLowerCase().includes("your-") && key.trim().length > 15;
}

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      duration = 30,
      apiKeys = {},
      model = "musicgen",
    } = await req.json();
    if (!prompt || prompt.trim().length < 3)
      return Response.json(
        { error: "A valid prompt is required" },
        { status: 400 },
      );

    // 1. Replicate (MusicGen)
    const replicateKey = isValidKey(
      apiKeys.replicate || process.env.REPLICATE_API_KEY,
    )
      ? apiKeys.replicate || process.env.REPLICATE_API_KEY
      : undefined;
    if (replicateKey) {
      const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${replicateKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version:
            "b05b1dff1d8c6dc63d14b0cdb42135378dcb87f6373b0d3d341ede46e59e2b38",
          input: { prompt: prompt.trim(), duration },
        }),
      });
      if (res.ok) {
        let p = await res.json();
        for (let i = 0; i < 20 && p.status !== "succeeded"; i++) {
          await new Promise((r) => setTimeout(r, 2000));
          const s = await fetch(
            `https://api.replicate.com/v1/predictions/${p.id}`,
            { headers: { Authorization: `Token ${replicateKey}` } },
          );
          if (s.ok) p = await s.json();
        }
        if (p.status === "succeeded" && p.output)
          return Response.json({
            url: Array.isArray(p.output) ? p.output[0] : p.output,
            prompt: prompt.trim(),
          });
      }
    }

    // 2. Fallback (Pollinations Music - Hardened)
    const url = `https://audio.pollinations.ai/music?prompt=${encodeURIComponent(prompt.trim())}&duration=${duration}&cache=false`;

    return Response.json({ url, prompt: prompt.trim() });
  } catch (error: unknown) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Music generation failed",
      },
      { status: 500 },
    );
  }
}
