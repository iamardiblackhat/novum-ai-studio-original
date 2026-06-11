export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    chat: [
      {
        id: "openai/gpt-5-turbo",
        name: "GPT-5 Turbo",
        provider: "openrouter",
        badge: "Newest",
      },
      {
        id: "openai/gpt-5",
        name: "GPT-5 Pro",
        provider: "openrouter",
        badge: "Flagship",
      },
      {
        id: "anthropic/claude-4-sonnet",
        name: "Claude 4 Sonnet",
        provider: "openrouter",
        badge: "Reasoning",
      },
      {
        id: "google/gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        provider: "openrouter",
        badge: "Context",
      },
      {
        id: "qwen/qwen-3.5-72b-chat",
        name: "Qwen 3.5 72B",
        provider: "openrouter",
        badge: "Elite",
      },
      {
        id: "meta-llama/llama-4-70b-instruct",
        name: "Llama 4 70B",
        provider: "openrouter",
        badge: "Open",
      },
      {
        id: "mistralai/mistral-large-2026",
        name: "Mistral Large 3",
        provider: "openrouter",
        badge: "Fast",
      },
      {
        id: "deepseek/deepseek-v3",
        name: "DeepSeek V3",
        provider: "openrouter",
        badge: "Reasoning",
      },
      {
        id: "openai-large",
        name: "GPT-5 (Free)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "claude",
        name: "Claude 4 (Free)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "qwen-coder",
        name: "Qwen 3.5 Coder (Free)",
        provider: "pollinations",
        badge: "Free",
      },
    ],
    image: [
      {
        id: "flux",
        name: "FLUX.2 [ultra]",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "flux-realism",
        name: "FLUX Realism V2",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "flux-anime",
        name: "FLUX Anime V2",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "openai/dall-e-4",
        name: "DALL-E 4",
        provider: "openrouter",
        badge: "PRO",
        requiresKey: true,
      },
      {
        id: "stability/stable-diffusion-4",
        name: "SD 4 Ultra",
        provider: "openrouter",
        badge: "PRO",
        requiresKey: true,
      },
    ],
    video: [
      {
        id: "wan",
        name: "Wan 2.5 (High-Fi)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "ltx-3",
        name: "LTX Video 3",
        provider: "pollinations",
        badge: "Fast",
      },
      {
        id: "runway/gen-4",
        name: "Runway Gen-4",
        provider: "openrouter",
        badge: "PRO",
        requiresKey: true,
      },
    ],
    audio: [
      {
        id: "elevenlabs/v3-pro",
        name: "ElevenLabs V3",
        provider: "openrouter",
        badge: "Ultra-Real",
        requiresKey: true,
      },
      {
        id: "nova",
        name: "Nova (V2)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "openai/tts-2",
        name: "OpenAI TTS 2",
        provider: "openrouter",
        badge: "PRO",
        requiresKey: true,
      },
    ],
  });
}
