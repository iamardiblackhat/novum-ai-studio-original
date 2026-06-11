export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    chat: [
      {
        id: "openai-large",
        name: "GPT-4o (Hyper)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "openai",
        name: "GPT-4o Mini",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "claude",
        name: "Claude 3.5 Sonnet",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "gemini",
        name: "Gemini 2.0 Flash",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "llama",
        name: "Llama 3.3 70B",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "mistral",
        name: "Mistral Large",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "deepseek-reasoning",
        name: "DeepSeek R1",
        provider: "pollinations",
        badge: "Reasoning",
      },
      {
        id: "qwen-coder",
        name: "Qwen 2.5 Coder",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "gpt-4o",
        name: "GPT-4o (Real)",
        provider: "openai",
        badge: "PRO",
        requiresKey: true,
      },
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        provider: "anthropic",
        badge: "PRO",
        requiresKey: true,
      },
      {
        id: "gemini-2.0-flash-exp",
        name: "Gemini 2.0 Flash",
        provider: "gemini",
        badge: "PRO",
        requiresKey: true,
      },
      {
        id: "llama-3.3-70b-versatile",
        name: "Llama 3.3 70B",
        provider: "groq",
        badge: "PRO",
        requiresKey: true,
      },
    ],
    image: [
      {
        id: "flux",
        name: "FLUX.1 [schnell]",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "flux-realism",
        name: "FLUX Realism",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "flux-anime",
        name: "FLUX Anime",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "flux-3d",
        name: "FLUX 3D",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "turbo",
        name: "SDXL Turbo",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "dall-e-3",
        name: "DALL-E 3",
        provider: "openai",
        badge: "PRO",
        requiresKey: true,
      },
      {
        id: "stable-image-ultra",
        name: "SD Ultra",
        provider: "stability",
        badge: "PRO",
        requiresKey: true,
      },
    ],
    video: [
      {
        id: "wan",
        name: "Wan 2.1 (T2V)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "ltx-2",
        name: "LTX Video 2",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "seedance-pro",
        name: "Seedance Pro",
        provider: "pollinations",
        badge: "Free",
      },
    ],
    audio: [
      {
        id: "nova",
        name: "Nova (Neutral)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "alloy",
        name: "Alloy (Balanced)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "shimmer",
        name: "Shimmer (Soft)",
        provider: "pollinations",
        badge: "Free",
      },
      {
        id: "eleven-multilingual-v2",
        name: "ElevenLabs V2",
        provider: "elevenlabs",
        badge: "PRO",
        requiresKey: true,
      },
    ],
  });
}
