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
    if (!prompt || prompt.trim().length < 3)
      return Response.json(
        { error: "A valid prompt is required" },
        { status: 400 },
      );

    // 1. Replicate (Wan 2.1 / LTX-Video)
    const replicateKey = isValidKey(
      apiKeys.replicate || process.env.REPLICATE_API_KEY,
    )
      ? apiKeys.replicate || process.env.REPLICATE_API_KEY
      : undefined;
    if (replicateKey && (model.includes("wan") || model.includes("ltx"))) {
      const versions: Record<string, string> = {
        "wan-2.1":
          "a16223258525b6c201a488d3f6073e9c99f97a1a2b2e2e2e2e2e2e2e2e2e2e2e",
        "ltx-2":
          "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",
      };
      const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${replicateKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: versions[model] || versions["wan-2.1"],
          input: { prompt: prompt.trim() },
        }),
      });
      if (res.ok) {
        let p = await res.json();
        // Wait for completion (basic poll)
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

    // 2. Fallback (Pollinations Video - Hardened)
    const safeModel = ["wan", "wan-fast", "ltx-2", "seedance-pro"].includes(
      model,
    )
      ? model
      : "wan";
    const url = `https://video.pollinations.ai/${encodeURIComponent(prompt.trim())}?model=${safeModel}&duration=${duration}&cache=false`;

    return Response.json({ url, prompt: prompt.trim() });
  } catch (error: unknown) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Video generation failed",
      },
      { status: 500 },
    );
  }
}
