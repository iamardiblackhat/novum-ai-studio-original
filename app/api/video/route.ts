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
      return Response.json({ error: "Valid prompt required" }, { status: 400 });

    // 1. Replicate
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
            "a16223258525b6c201a488d3f6073e9c99f97a1a2b2e2e2e2e2e2e2e2e2e2e2e",
          input: { prompt: prompt.trim() },
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
        if (p.status === "succeeded")
          return Response.json({
            url: Array.isArray(p.output) ? p.output[0] : p.output,
            prompt: prompt.trim(),
          });
      }
    }

    // 2. Fallback
    const safeModel = ["wan", "wan-fast", "ltx-2", "seedance-pro"].includes(
      model,
    )
      ? model
      : "wan";
    const url = `https://video.pollinations.ai/${encodeURIComponent(prompt.trim())}?model=${safeModel}&duration=${duration}`;
    return Response.json({ url, prompt: prompt.trim() });
  } catch (error: unknown) {
    return Response.json({ error: "Video failure" }, { status: 500 });
  }
}
