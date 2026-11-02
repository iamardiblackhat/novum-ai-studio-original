// Novum AI Studios - Unified Chat & Streaming Runner

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RunChatOptions {
  model?: string;
  provider?: string;
  messages: ChatMessage[];
  apiKeys?: Record<string, string>;
  onToken?: (token: string) => void;
}

export async function runChatStream({
  model = "openai-large",
  messages,
  apiKeys = {},
  onToken,
}: RunChatOptions): Promise<string> {
  // If in browser, merge stored keys
  let effectiveKeys = { ...apiKeys };
  if (typeof window !== "undefined" && Object.keys(effectiveKeys).length === 0) {
    try {
      const stored = localStorage.getItem("novum-api-keys");
      if (stored) {
        effectiveKeys = JSON.parse(stored);
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      model,
      apiKeys: effectiveKeys,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(errorData.error || `Chat inference failed with status ${res.status}`);
  }

  const data = await res.json();
  const content = data.content || "";
  
  if (onToken) {
    onToken(content);
  }

  return content;
}
