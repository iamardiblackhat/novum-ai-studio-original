import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  return !key.toLowerCase().includes("your-") && key.trim().length > 15;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration = 30, model = "pollinations-music", apiKeys = {} } = await req.json();
    if (!prompt || prompt.trim().length < 3)
      return Response.json(
        { error: "A valid prompt is required" },
        { status: 400 },
      );

    const replicateKey = isValidKey(
      apiKeys.replicate || process.env.REPLICATE_API_KEY,
    )
      ? apiKeys.replicate || process.env.REPLICATE_API_KEY
      : undefined;
    const openrouterKey = isValidKey(
      apiKeys.openrouter || process.env.OPENROUTER_API_KEY,
    )
      ? apiKeys.openrouter || process.env.OPENROUTER_API_KEY
      : undefined;

    // 1. Replicate paid/free-credits path (if key and model indicates replicate/musicgen)
    if (replicateKey && (model.includes("replicate") || model.includes("musicgen"))) {
      const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${replicateKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Get current exact version ID from https://replicate.com/explore for the desired music model (e.g. musicgen or open music variants)
          version: "musicgen",
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

    // 2. PRO models via OpenRouter (suno, udio etc.) - requires key; attempt real call
    if ((model.includes("suno") || model.includes("udio")) && openrouterKey) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt.trim() }],
            max_tokens: 256,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || "";
          // Some providers return audio URLs in the response content
          const urlMatch = content.match(/https?:\/\/[^\s"']+\.(?:mp3|wav|ogg|m4a|audio)[^\s"']*/i);
          if (urlMatch) {
            return Response.json({ url: urlMatch[0], prompt: prompt.trim() });
          }
        }
      } catch {}
      // If no usable URL from provider, fall through to real free audio below
    }

    // 3. Real free Pollinations music (primary for all free selections and fallback)
    const url = `https://audio.pollinations.ai/music?prompt=${encodeURIComponent(prompt.trim())}&duration=${duration}&cache=false`;
    return Response.json({ url, prompt: prompt.trim(), modelUsed: model });
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
