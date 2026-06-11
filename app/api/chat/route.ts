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
    const { messages, model = "openai-large", apiKeys = {} } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    // 1. Try Premium Providers if Keys exist

    // OpenAI Router
    const openaiKey = isValidKey(apiKeys.openai || process.env.OPENAI_API_KEY)
      ? apiKeys.openai || process.env.OPENAI_API_KEY
      : undefined;
    if (
      openaiKey &&
      (model.startsWith("gpt") ||
        model.startsWith("o1") ||
        model.startsWith("o3"))
    ) {
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

    // Anthropic Router
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

    // Google Gemini Router
    const geminiKey = isValidKey(apiKeys.gemini || process.env.GEMINI_API_KEY)
      ? apiKeys.gemini || process.env.GEMINI_API_KEY
      : undefined;
    if (geminiKey && model.startsWith("gemini")) {
      const contents = messages
        .filter((m: any) => m.role !== "system")
        .map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        return Response.json({
          content: data.candidates[0]?.content?.parts[0]?.text || "",
        });
      }
    }

    // Groq Router
    const groqKey = isValidKey(apiKeys.groq || process.env.GROQ_API_KEY)
      ? apiKeys.groq || process.env.GROQ_API_KEY
      : undefined;
    if (
      groqKey &&
      (model.includes("llama") ||
        model.includes("mixtral") ||
        model.includes("gemma"))
    ) {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, messages, max_tokens: 4096 }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        return Response.json({
          content: data.choices[0]?.message?.content || "",
        });
      }
    }

    // 2. Fallback Logic (Retry-Hardened)
    // We use a robust random seed and jittered retries to bypass typical rate limits.
    const safeModel = [
      "openai-large",
      "openai",
      "claude",
      "gemini",
      "llama",
      "mistral",
      "deepseek",
      "deepseek-reasoning",
      "qwen-coder",
      "grok",
      "phi",
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

        if (!res.ok) throw new Error(`Pollinations error (${res.status})`);
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || "";
        if (content) return Response.json({ content });
      } catch (e) {
        if (i === 2) throw e;
      }
    }

    throw new Error(
      "All neural links failed. Please check your credentials or try again in a moment.",
    );
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Neural synthesis failed",
      },
      { status: 500 },
    );
  }
}
