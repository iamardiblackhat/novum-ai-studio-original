import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function isValidKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.toLowerCase();
  if (k.includes("your-") || k.includes("placeholder") || k.includes("mock"))
    return false;
  return key.trim().length > 15;
}

async function tryOllamaChat(messages: any[], requestedModel?: string): Promise<{ content: string; model: string } | null> {
  try {
    const tagsRes = await fetch("http://127.0.0.1:11434/api/tags", {
      signal: AbortSignal.timeout(1500),
    }).catch(() => null);

    if (!tagsRes || !tagsRes.ok) return null;
    const tagsData = await tagsRes.json();
    if (!tagsData.models || tagsData.models.length === 0) return null;

    let targetModel = tagsData.models[0].name;
    if (requestedModel) {
      const clean = requestedModel.replace("ollama/", "").replace("ollama-local", "");
      const match = tagsData.models.find((m: any) => m.name.includes(clean) || clean.includes(m.name));
      if (match) targetModel = match.name;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // Allow local Mac inference up to 90s

    const ollamaRes = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: targetModel,
        messages,
        stream: false,
      }),
    });
    clearTimeout(timeoutId);

    if (ollamaRes.ok) {
      const data = await ollamaRes.json();
      let rawContent = data.message?.content || "";
      if (rawContent.includes("</think>")) {
        rawContent = rawContent.split("</think>").pop()?.trim() || rawContent;
      }
      if (rawContent.trim().length > 0) {
        return {
          content: rawContent.trim(),
          model: `Sovereign Local Hardware (${targetModel})`,
        };
      }
    }
  } catch (e) {
    // Ollama not reachable or timed out
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model = "openai", apiKeys = {} } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages array is required" }, { status: 400 });
    }

    const isLocalOllamaRequested = model === "ollama-local" || model.startsWith("ollama/");

    // 1. Explicit Local Ollama Request
    if (isLocalOllamaRequested) {
      const localResult = await tryOllamaChat(messages, model);
      if (localResult) {
        return Response.json({
          content: localResult.content,
          modelUsed: localResult.model,
        });
      }
      return Response.json(
        { error: "Local Ollama is offline. Please launch Ollama or select a cloud engine." },
        { status: 502 }
      );
    }

    // 2. OpenRouter with User Key
    const openrouterKey = isValidKey(apiKeys.openrouter || process.env.OPENROUTER_API_KEY)
      ? apiKeys.openrouter || process.env.OPENROUTER_API_KEY
      : undefined;

    if (openrouterKey && (model.includes("/") || model.startsWith("gpt-") || model.startsWith("claude-"))) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://omnelia.com",
            "X-Title": "Omnelia SI Sovereign Studio",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: model.includes("/") ? model : `openai/${model}`,
            messages,
          }),
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return Response.json({
              content,
              modelUsed: `OpenRouter (${model})`,
            });
          }
        }
      } catch (err: any) {
        console.warn("OpenRouter fetch error:", err.message);
      }
    }

    // 3. Groq with User Key
    const groqKey = isValidKey(apiKeys.groq || process.env.GROQ_API_KEY)
      ? apiKeys.groq || process.env.GROQ_API_KEY
      : undefined;

    if (groqKey && (model.includes("llama") || model.includes("mixtral") || model.includes("qwen") || model.includes("groq"))) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const groqModel = model.includes("/") ? model.split("/")[1] : "llama-3.3-70b-versatile";
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: groqModel,
            messages,
          }),
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return Response.json({
              content,
              modelUsed: `Groq LPU (${groqModel})`,
            });
          }
        }
      } catch (err: any) {
        console.warn("Groq fetch error:", err.message);
      }
    }

    // 4. Free Open-Source Text Gateway (Pollinations with Rate-Limit Detection)
    try {
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
      const systemPrompt = messages.find((m: any) => m.role === "system")?.content || "";
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nTask: ${lastUserMsg}` : lastUserMsg;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        const isRateLimited = text.includes("Free limit reached") || text.includes("pollinations.ai/?ref=classic");
        if (text && text.trim().length > 0 && !isRateLimited) {
          return Response.json({
            content: text.trim(),
            modelUsed: "Free Sovereign Neural Engine",
          });
        }
      }
    } catch (err: any) {
      console.warn("Pollinations GET text error:", err.message);
    }

    // 5. Automatic Fallback to Local Hardware (Ollama) if Cloud Endpoint is Rate-Limited
    const localFallback = await tryOllamaChat(messages, "qwen3.5:4b");
    if (localFallback) {
      return Response.json({
        content: localFallback.content,
        modelUsed: `${localFallback.model} (Sovereign Fallback)`,
      });
    }

    // 6. Honest Error Status — Zero Fake Mocks
    return Response.json(
      {
        error: "Neural gateways are currently busy. Please connect an OpenRouter/Groq key in Settings or ensure local Ollama is active on port 11434.",
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Inference pipeline error" },
      { status: 500 }
    );
  }
}
