import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.toLowerCase();
  if (k.includes("your-") || k.includes("placeholder")) return false;
  return key.trim().length > 15;
}

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      model = "flux",
      width = 1024,
      height = 1024,
      apiKeys = {},
    } = await req.json();
    if (!prompt || prompt.trim().length < 3)
      return Response.json(
        { error: "A valid prompt is required" },
        { status: 400 },
      );

    // 1. OpenAI (DALL-E 3)
    const openaiKey = isValidKey(apiKeys.openai || process.env.OPENAI_API_KEY)
      ? apiKeys.openai || process.env.OPENAI_API_KEY
      : undefined;
    if (openaiKey && (model === "dall-e-3" || model === "dall-e-2")) {
      const size =
        width === height
          ? "1024x1024"
          : width > height
            ? "1792x1024"
            : "1024x1792";
      const res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: prompt.trim(),
          n: 1,
          size,
          response_format: "url",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json({ url: data.data[0]?.url, prompt: prompt.trim() });
      }
    }

    // 2. Stability AI
    const stabilityKey = isValidKey(
      apiKeys.stability || process.env.STABILITY_API_KEY,
    )
      ? apiKeys.stability || process.env.STABILITY_API_KEY
      : undefined;
    if (
      stabilityKey &&
      (model.startsWith("stable-") || model.startsWith("sd"))
    ) {
      const formData = new FormData();
      formData.append("prompt", prompt.trim());
      formData.append("output_format", "webp");
      formData.append(
        "aspect_ratio",
        width === height ? "1:1" : width > height ? "16:9" : "9:16",
      );

      const res = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/ultra",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stabilityKey}`,
            Accept: "image/*",
          },
          body: formData,
        },
      );
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        return Response.json({
          url: `data:image/webp;base64,${Buffer.from(buffer).toString("base64")}`,
          prompt: prompt.trim(),
        });
      }
    }

    // 3. Fallback (Pollinations - Hardened)
    const safeModel = [
      "flux",
      "flux-realism",
      "flux-anime",
      "flux-3d",
      "any-dark",
      "turbo",
      "kontext",
    ].includes(model)
      ? model
      : "flux";
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.trim())}?model=${safeModel}&width=${width}&height=${height}&seed=${Math.floor(Math.random() * 1000000)}&nologo=true&enhance=true&cache=false`;

    // Verify fallback is alive
    const check = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    }).catch(() => null);
    if (check && check.ok) {
      return Response.json({ url, prompt: prompt.trim() });
    }

    throw new Error("Image engines are currently offline.");
  } catch (error: unknown) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Image generation failed",
      },
      { status: 500 },
    );
  }
}
