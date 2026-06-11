import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.toLowerCase();
  if (k.includes("your-") || k.includes("placeholder") || k.includes("mock"))
    return false;
  return key.trim().length > 15;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model = "gpt-5-turbo", apiKeys = {} } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    // 1. OpenRouter (Primary for 2026)
    const openrouterKey = isValidKey(
      apiKeys.openrouter || process.env.OPENROUTER_API_KEY,
    )
      ? apiKeys.openrouter || process.env.OPENROUTER_API_KEY
      : undefined;
    if (openrouterKey) {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://novum-ai-studio.vercel.app",
          "X-Title": "Novum AI Studio",
        },
        body: JSON.stringify({
          model: model.includes("/") ? model : `openai/${model}`,
          messages,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json({
          content: data.choices[0]?.message?.content || "",
        });
      }
    }

    // 2. Direct Providers if OpenRouter fails or is skipped

    // OpenAI Router (GPT-5 Series)
    const openaiKey = isValidKey(apiKeys.openai || process.env.OPENAI_API_KEY)
      ? apiKeys.openai || process.env.OPENAI_API_KEY
      : undefined;
    if (openaiKey && model.startsWith("gpt")) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages, max_tokens: 4096 }),
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json({
          content: data.choices[0]?.message?.content || "",
        });
      }
    }

    // Anthropic Router (Claude 4 Series)
    const anthropicKey = isValidKey(
      apiKeys.anthropic || process.env.ANTHROPIC_API_KEY,
    )
      ? apiKeys.anthropic || process.env.ANTHROPIC_API_KEY
      : undefined;
    if (anthropicKey && model.startsWith("claude")) {
      const system =
        messages.find((m: any) => m.role === "system")?.content || "";
      const userMessages = messages.filter((m: any) => m.role !== "system");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: userMessages,
          max_tokens: 4096,
          ...(system ? { system } : {}),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json({ content: data.content[0]?.text || "" });
      }
    }

    // 3. Fallback Logic (June 2026 Public API)
    const safeModel = [
      "openai-large",
      "claude",
      "gemini",
      "llama",
      "mistral",
      "deepseek",
      "qwen-coder",
    ].includes(model)
      ? model
      : "openai-large";

    for (let i = 0; i < 3; i++) {
      try {
        const res = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: safeModel,
            messages,
            seed: Math.floor(Math.random() * 1000000),
            cache: false,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (res.status === 429) {
          await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
          continue;
        }

        if (!res.ok) throw new Error(`Engine error (${res.status})`);
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        if (content) return Response.json({ content });
      } catch (e) {
        if (i === 2) throw e;
      }
    }

    throw new Error(
      "All neural links failed. Check OpenRouter key or provider status.",
    );
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Processing failure",
      },
      { status: 500 },
    );
  }
}
