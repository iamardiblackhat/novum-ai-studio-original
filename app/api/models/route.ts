export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    chat: [
      // OpenRouter - only list confirmed free tiers as "Free" (zero price). Paid models require key/credits.
      { id: "openai/gpt-5-turbo", name: "GPT-5 Turbo", provider: "openrouter", badge: "Newest" },
      { id: "openai/gpt-5", name: "GPT-5 Pro", provider: "openrouter", badge: "Flagship" },
      { id: "anthropic/claude-4-sonnet", name: "Claude 4 Sonnet", provider: "openrouter", badge: "Reasoning" },
      { id: "anthropic/claude-fable-5", name: "Claude Fable 5", provider: "openrouter", badge: "Mythos" },
      { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "openrouter", badge: "Context" },
      { id: "qwen/qwen-3.5-72b-chat", name: "Qwen 3.5 72B", provider: "openrouter", badge: "Elite" },
      // Confirmed free tier on OpenRouter (zero price, June 2026 live data) - requires free API key for access/rate limits
      { id: "google/gemma-4-31b-it:free", name: "Gemma 4 31B (Free Tier)", provider: "openrouter", badge: "Free", requiresKey: true },
      { id: "google/gemma-4-26b-a4b-it:free", name: "Gemma 4 26B (Free Tier)", provider: "openrouter", badge: "Free", requiresKey: true },
      { id: "qwen/qwen3-next-80b-a3b-instruct:free", name: "Qwen3 Next 80B (Free Tier)", provider: "openrouter", badge: "Free", requiresKey: true },
      { id: "nex-agi/nex-n2-pro:free", name: "Nex N2 Pro (Free Tier)", provider: "openrouter", badge: "Free", requiresKey: true },
      { id: "nvidia/nemotron-3.5-content-safety:free", name: "Nemotron 3.5 (Free Tier)", provider: "openrouter", badge: "Free", requiresKey: true },
      { id: "meta-llama/llama-4-70b-instruct", name: "Llama 4 70B", provider: "openrouter", badge: "Open" },
      { id: "mistralai/mistral-large-2026", name: "Mistral Large 3", provider: "openrouter", badge: "Fast" },
      { id: "deepseek/deepseek-v3", name: "DeepSeek V3", provider: "openrouter", badge: "Reasoning" },

      // Pollinations - free / low-friction models (many work without key or with easy credits). 
      // Paid routed models (e.g. Claude Opus) are NOT listed as Free.
      { id: "openai-large", name: "GPT-5 Large (Free)", provider: "pollinations", badge: "Free" },
      { id: "gpt-5.5", name: "GPT-5.5 (Free)", provider: "pollinations", badge: "Free" },
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Free)", provider: "pollinations", badge: "Free" },
      { id: "gemini", name: "Gemini (Free)", provider: "pollinations", badge: "Free" },
      { id: "gemma", name: "Gemma (Free)", provider: "pollinations", badge: "Free" },
      { id: "qwen-coder", name: "Qwen Coder (Free)", provider: "pollinations", badge: "Free" },
      { id: "qwen-large", name: "Qwen Large (Free)", provider: "pollinations", badge: "Free" },
      { id: "mistral-4", name: "Mistral 4 (Free)", provider: "pollinations", badge: "Free" },
      { id: "deepseek", name: "DeepSeek (Free)", provider: "pollinations", badge: "Free" },
      { id: "llama", name: "Llama (Free)", provider: "pollinations", badge: "Free" },
      { id: "grok-4.3", name: "Grok 4.3 (Free)", provider: "pollinations", badge: "Free" },

      // Free tier providers that require an API key (rate limited / credits). These are genuinely free tiers.
      { id: "llama", name: "Llama (Groq Free Tier)", provider: "groq", badge: "Free Tier", requiresKey: true },
      { id: "qwen-coder", name: "Qwen Coder (Groq Free Tier)", provider: "groq", badge: "Free Tier", requiresKey: true },
      { id: "gemma", name: "Gemma (Groq Free Tier)", provider: "groq", badge: "Free Tier", requiresKey: true },
      { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash (Gemini Free Tier)", provider: "google", badge: "Free Tier", requiresKey: true },
    ],
    image: [
      // Live researched free / low-friction on pollinations (confirmed working endpoints)
      { id: "flux", name: "FLUX.2 [ultra]", provider: "pollinations", badge: "Free" },
      { id: "flux-realism", name: "FLUX Realism V2", provider: "pollinations", badge: "Free" },
      { id: "flux-anime", name: "FLUX Anime V2", provider: "pollinations", badge: "Free" },
      { id: "seedream5", name: "Seedream 5 (Free)", provider: "pollinations", badge: "Free" },
      { id: "seedream-pro", name: "Seedream Pro (Free)", provider: "pollinations", badge: "Free" },
      { id: "gptimage", name: "GPT Image (Free)", provider: "pollinations", badge: "Free" },
      { id: "gptimage-large", name: "GPT Image Large (Free)", provider: "pollinations", badge: "Free" },
      // Paid/pro on OpenRouter (require key/credits)
      { id: "openai/dall-e-4", name: "DALL-E 4", provider: "openrouter", badge: "PRO", requiresKey: true },
      { id: "stability/stable-diffusion-4", name: "SD 4 Ultra", provider: "openrouter", badge: "PRO", requiresKey: true },
    ],
    video: [
      // Live researched real free working video models on pollinations (June 2026)
      { id: "seedance-pro", name: "Seedance Pro (Free)", provider: "pollinations", badge: "Free" },
      { id: "seedance-2.0", name: "Seedance 2.0 (Free)", provider: "pollinations", badge: "Free" },
      { id: "wan", name: "Wan 2.5 (Free)", provider: "pollinations", badge: "Free" },
      { id: "wan-pro", name: "Wan Pro (Free)", provider: "pollinations", badge: "Free" },
      { id: "wan-fast", name: "Wan Fast (Free)", provider: "pollinations", badge: "Fast" },
      { id: "ltx-2", name: "LTX Video 2 (Free)", provider: "pollinations", badge: "Free" },
      // Paid/pro paths (require key or credits). Replicate has free credits on many public models.
      { id: "runway/gen-4", name: "Runway Gen-4", provider: "openrouter", badge: "PRO", requiresKey: true },
      { id: "replicate/wan", name: "Replicate Wan (Key + Credits)", provider: "replicate", badge: "Free Credits", requiresKey: true },
    ],
    audio: [
      // Pollinations audio/tts - genuinely free / no key for basic voices like nova (if not rate limited)
      { id: "nova", name: "Nova (Free)", provider: "pollinations", badge: "Free" },
      { id: "nova-fast", name: "Nova Fast (Free)", provider: "pollinations", badge: "Free" },
      { id: "openai-audio", name: "OpenAI Audio (Free)", provider: "pollinations", badge: "Free" },
      { id: "qwen-tts", name: "Qwen TTS (Free)", provider: "pollinations", badge: "Free" },
      // ElevenLabs free tier (key required for the free credits)
      { id: "elevenlabs", name: "ElevenLabs (Free Tier)", provider: "pollinations", badge: "Free Tier", requiresKey: true },
      { id: "elevenflash", name: "Eleven Flash (Free Tier)", provider: "pollinations", badge: "Free Tier", requiresKey: true },
      { id: "elevenlabs/v3-pro", name: "ElevenLabs V3", provider: "openrouter", badge: "Ultra-Real", requiresKey: true },
      // OpenAI TTS paid on OpenRouter
      { id: "openai/tts-2", name: "OpenAI TTS 2", provider: "openrouter", badge: "PRO", requiresKey: true },
    ],
    music: [
      // Pollinations music - free no-key generation (best effort)
      { id: "pollinations-music", name: "Pollinations Music (Free)", provider: "pollinations", badge: "Free" },
      // Paid creative music models via OpenRouter (require key/credits)
      { id: "suno/chirp-v3", name: "Suno Chirp v3", provider: "openrouter", badge: "PRO", requiresKey: true },
      { id: "udio/v1", name: "Udio Ultra", provider: "openrouter", badge: "PRO", requiresKey: true },
    ],
  });
}

// Notes from live research (June 12 2026):
// - Pollinations: best for no-key free on image/video/audio/music when not queued. Text/chat legacy endpoint is throttled/deprecated for anonymous (429 queue).
// - For reliable free chat: use OpenRouter :free models or Groq/Gemini free tiers (require a free API key for rate limits).
// - API keys are always supported as backup / for paid or higher limits. Key dialog and localStorage persistence is intentional and required.
// - No mocks, no fake responses, no demo scripts. All routes attempt real live endpoints only.
// - Paid/tokenised models (Claude Opus variants, Runway, certain Suno/Udio, DALL-E pro, SD pro, Eleven pro) are marked requiresKey or PRO.
