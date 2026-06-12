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

    // 1. OpenRouter (Primary) - prefer free tiers for anonymous-reliable chat
    const openrouterKey = isValidKey(
      apiKeys.openrouter || process.env.OPENROUTER_API_KEY,
    )
      ? apiKeys.openrouter || process.env.OPENROUTER_API_KEY
      : undefined;
    const wantsOpenRouter =
      model.includes("/") ||
      model.startsWith("gpt") ||
      model.startsWith("claude") ||
      model.startsWith("gemini") ||
      model.includes(":free") ||
      model.includes("gemma-4") ||
      model.includes("nemotron") ||
      model.includes("nex-");
    if (openrouterKey && wantsOpenRouter) {
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

    // 2. Direct Providers (Secondary)

    // OpenAI direct
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

    // Anthropic direct
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

    // Google direct
    const googleKey = isValidKey(apiKeys.google || process.env.GEMINI_API_KEY)
      ? apiKeys.google || process.env.GEMINI_API_KEY
      : undefined;
    if (googleKey && model.startsWith("gemini")) {
      const contents = messages
        .filter((m: any) => m.role !== "system")
        .map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey}`,
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

    // Groq direct
    const groqKey = isValidKey(apiKeys.groq || process.env.GROQ_API_KEY)
      ? apiKeys.groq || process.env.GROQ_API_KEY
      : undefined;
    if (groqKey && (model.includes("llama") || model.includes("mixtral"))) {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model, messages }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        return Response.json({
          content: data.choices[0]?.message?.content || "",
        });
      }
    }

    // 3. Groq direct (free tier with key - very reliable)
    const groqKey2 = isValidKey(apiKeys.groq || process.env.GROQ_API_KEY)
      ? apiKeys.groq || process.env.GROQ_API_KEY
      : undefined;
    if (groqKey2 && (model.includes("llama") || model.includes("mixtral") || model.includes("gemma") || model.includes("qwen"))) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey2}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages }),
      });
      if (res.ok) {
        const data = await res.json();
        return Response.json({
          content: data.choices[0]?.message?.content || "",
        });
      }
    }

    // 4. Google direct (free tier with key)
    const googleKey2 = isValidKey(apiKeys.google || process.env.GEMINI_API_KEY)
      ? apiKeys.google || process.env.GEMINI_API_KEY
      : undefined;
    if (googleKey2 && (model.startsWith("gemini") || model.includes("gemini"))) {
      const contents = messages
        .filter((m: any) => m.role !== "system")
        .map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey2}`,
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

    // 5. Public Fallback (June 2026 current free pollinations text models - may queue/rate limit for anonymous)
    const safeModel = [
      "openai-large",
      "gpt-5.5",
      "gemini",
      "gemini-3.5-flash",
      "qwen-coder",
      "qwen-large",
      "mistral",
      "mistral-4",
      "deepseek",
      "llama",
      "grok-4.3",
    ].includes(model)
      ? model
      : "openai-large";
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: safeModel,
        messages,
        seed: Math.floor(Math.random() * 1000000),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return Response.json({
        content: data.choices?.[0]?.message?.content || "",
      });
    }

    throw new Error(
      "All engines failed. Provide an API key (OpenRouter/Groq/Gemini free tiers recommended for reliable chat; Pollinations as last free fallback).",
    );
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failure" },
      { status: 500 },
    );
  }
}
