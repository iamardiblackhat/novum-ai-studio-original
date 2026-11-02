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
      model = "wan",
      duration = 4,
      apiKeys = {},
    } = await req.json();

    if (!prompt || prompt.trim().length < 1) {
      return Response.json({ error: "Prompt required" }, { status: 400 });
    }

    // 1. Replicate key (if provided by user)
    const replicateKey = isValidKey(
      apiKeys.replicate || process.env.REPLICATE_API_KEY
    )
      ? apiKeys.replicate || process.env.REPLICATE_API_KEY
      : undefined;

    if (replicateKey && model.includes("replicate")) {
      try {
        const res = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            Authorization: `Token ${replicateKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: "wan-2-1-t2v-14b",
            input: { prompt: prompt.trim() },
          }),
        });
        if (res.ok) {
          let p = await res.json();
          for (let i = 0; i < 20 && p.status !== "succeeded"; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            const s = await fetch(
              `https://api.replicate.com/v1/predictions/${p.id}`,
              { headers: { Authorization: `Token ${replicateKey}` } }
            );
            if (s.ok) p = await s.json();
          }
          if (p.status === "succeeded") {
            return Response.json({
              url: Array.isArray(p.output) ? p.output[0] : p.output,
              prompt: prompt.trim(),
              modelUsed: "Replicate Wan 2.1 14B",
            });
          }
        }
      } catch (err) {
        console.warn("Replicate video error, falling back to open pipeline", err);
      }
    }

    // 2. Free Open-Source Video Models (Wan 2.1 / LTX-Video / Seedance)
    const safeModel = [
      "wan",
      "wan-fast",
      "wan-pro",
      "ltx-2",
      "seedance-pro",
      "seedance-2.0",
      "p-video-720p",
      "p-video-1080p",
    ].includes(model)
      ? model
      : "wan";

    const cleanPrompt = prompt.trim();
    // Return direct video generation URL
    const url = `https://video.pollinations.ai/${encodeURIComponent(cleanPrompt)}?model=${safeModel}&duration=${duration}`;

    return Response.json({
      url,
      prompt: cleanPrompt,
      modelUsed: `Open Source ${safeModel.toUpperCase()}`,
      duration,
    });
  } catch (error: unknown) {
    return Response.json({ error: "Video synthesis failure" }, { status: 500 });
  }
}
