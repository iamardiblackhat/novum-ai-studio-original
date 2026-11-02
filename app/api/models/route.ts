export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    chat: [
      // 100% Free / Zero-Key Open-Source Engines
      { id: "openai-large", name: "GPT-5 Large (Free)", provider: "pollinations", badge: "Free" },
      { id: "gpt-5.5", name: "GPT-5.5 (Free)", provider: "pollinations", badge: "Free" },
      { id: "qwen-coder", name: "Qwen 2.5 Coder (Free OSS)", provider: "pollinations", badge: "Coding" },
      { id: "qwen-large", name: "Qwen 2.5 72B (Free OSS)", provider: "pollinations", badge: "Reasoning" },
      { id: "deepseek", name: "DeepSeek V3 (Free OSS)", provider: "pollinations", badge: "Flagship" },
      { id: "llama", name: "Llama 3.3 70B (Free OSS)", provider: "pollinations", badge: "Open" },
      { id: "mistral-4", name: "Mistral Large (Free)", provider: "pollinations", badge: "Fast" },
      { id: "gemini-3.5-flash", name: "Gemini 2.5 Flash (Free)", provider: "pollinations", badge: "Speed" },
      { id: "ollama-local", name: "Ollama Local (localhost:11434)", provider: "local", badge: "Local Privacy" },

      // OpenRouter Free Tiers (Optional with free OpenRouter key)
      { id: "google/gemma-4-31b-it:free", name: "Gemma 4 31B", provider: "openrouter", badge: "Free Tier", requiresKey: true },
      { id: "google/gemma-4-26b-a4b-it:free", name: "Gemma 4 26B", provider: "openrouter", badge: "Free Tier", requiresKey: true },
      { id: "qwen/qwen3-next-80b-a3b-instruct:free", name: "Qwen 3 Next", provider: "openrouter", badge: "Free Tier", requiresKey: true },
      { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B", provider: "openrouter", badge: "Free Tier", requiresKey: true },

      // Pro Models (Require Key)
      { id: "openai/gpt-4o", name: "GPT-4o Omnimodel", provider: "openrouter", badge: "Pro", requiresKey: true },
      { id: "anthropic/claude-3-7-sonnet", name: "Claude 3.7 Sonnet", provider: "openrouter", badge: "Pro", requiresKey: true },
      { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "openrouter", badge: "Pro", requiresKey: true },
    ],
    image: [
      // Free Open-Source & Diffusers
      { id: "flux", name: "FLUX.2 Ultra (Black Forest Labs)", provider: "pollinations", badge: "OSS Elite" },
      { id: "flux-realism", name: "FLUX Realism V2", provider: "pollinations", badge: "Photoreal" },
      { id: "flux-anime", name: "FLUX Anime V2", provider: "pollinations", badge: "Stylized" },
      { id: "seedream5", name: "Seedream 5 (ByteDance OSS)", provider: "pollinations", badge: "Fast" },
      { id: "seedream-pro", name: "Seedream Pro Ultra", provider: "pollinations", badge: "Studio" },
      { id: "gptimage", name: "GPT Image Neural Diffuser", provider: "pollinations", badge: "Free" },
      { id: "openai/dall-e-3", name: "DALL-E 3", provider: "openai", badge: "Pro", requiresKey: true },
      { id: "stability/ultra", name: "Stable Diffusion 3.5 Ultra", provider: "stability", badge: "Pro", requiresKey: true },
    ],
    video: [
      // Open-Source Video Models
      { id: "wan", name: "Wan 2.1 (Alibaba Open Video)", provider: "pollinations", badge: "OSS Leader" },
      { id: "wan-fast", name: "Wan 2.1 Turbo (Fast 720p)", provider: "pollinations", badge: "Fast" },
      { id: "wan-pro", name: "Wan 2.1 14B Cinema", provider: "pollinations", badge: "Cinema" },
      { id: "ltx-2", name: "LTX-Video 2 (Lightricks Open)", provider: "pollinations", badge: "Real-time" },
      { id: "seedance-pro", name: "Seedance Pro Video", provider: "pollinations", badge: "Fluid" },
      { id: "replicate/wan2-1", name: "Wan 2.1 Full Precision", provider: "replicate", badge: "Pro", requiresKey: true },
    ],
    audio: [
      // Free Open-Source Voice & TTS
      { id: "kokoro-af-heart", name: "Kokoro-82M Heart (Apache 2.0)", provider: "kokoro", badge: "OSS Best" },
      { id: "kokoro-am-adam", name: "Kokoro-82M Adam (Deep Male)", provider: "kokoro", badge: "OSS Voice" },
      { id: "kokoro-bf-emma", name: "Kokoro-82M Emma (British Studio)", provider: "kokoro", badge: "OSS British" },
      { id: "nova", name: "Nova Neural Audio", provider: "pollinations", badge: "Free" },
      { id: "qwen-tts", name: "Qwen TTS Audio", provider: "pollinations", badge: "Free" },
      { id: "elevenlabs", name: "ElevenLabs V2 Turbo", provider: "elevenlabs", badge: "Pro", requiresKey: true },
    ],
    music: [
      // Free Open-Source Music Generation
      { id: "pollinations-music", name: "Meta MusicGen Open", provider: "pollinations", badge: "OSS Audio" },
      { id: "ambient-score", name: "Cinematic Ambient Engine", provider: "pollinations", badge: "Soundtrack" },
      { id: "lofi-generator", name: "Lo-Fi Beats Synthesizer", provider: "pollinations", badge: "BPM Lock" },
      { id: "replicate/musicgen", name: "MusicGen Large Stereo", provider: "replicate", badge: "Pro", requiresKey: true },
    ],
  });
}
