"use client";

import { useState } from "react";
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Music,
  Code2,
  Bot,
  Workflow,
  Compass,
  Shield,
  CloudRain,
  Play,
  ArrowRight,
  Cpu,
  Activity,
  HardDrive,
  Zap,
  ShieldCheck,
  Send,
  Loader2,
  Volume2,
  CheckCircle2,
  Terminal,
  Layers,
  Radio,
  ExternalLink,
  RefreshCw,
  Film,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface DashboardProps {
  onNavigate: (sectionId: string) => void;
}

export function StudioDashboard({ onNavigate }: DashboardProps) {
  const [quickPrompt, setQuickPrompt] = useState(
    "Cinematic drone rotating around cybernetic obsidian glass sculpture in neon Skopje rain, 4k ultra-realistic reflections"
  );
  const [quickMode, setQuickMode] = useState<"video" | "image" | "voice" | "security" | "agent">("video");
  const [videoModel, setVideoModel] = useState("wan-2.1-14b");
  const [imageModel, setImageModel] = useState("flux");
  const [voicePersona, setVoicePersona] = useState("af_heart");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    type: "video" | "image" | "voice" | "security" | "agent";
    url?: string;
    text?: string;
    model?: string;
  }>({
    type: "video",
    url: "/omnelia-assets/assets/showcase/omnelia-studio-film.mp4",
    model: "Alibaba Wan 2.1 (14B High Fidelity)",
  });

  const handleQuickRun = async () => {
    if (!quickPrompt.trim()) {
      toast.error("Please enter a prompt or instruction");
      return;
    }

    setIsGenerating(true);

    try {
      if (quickMode === "video") {
        toast.info("Synthesizing cinematic video via Wan 2.1 Open Engine...");
        const res = await fetch("/api/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: quickPrompt, model: videoModel }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "video", url: data.url, model: data.model || videoModel });
          toast.success("Wan 2.1 video synthesized successfully!");
        } else {
          throw new Error(data.error || "Video generation error");
        }
      } else if (quickMode === "image") {
        toast.info("Synthesizing visual asset via FLUX.2 Diffusers...");
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: quickPrompt, model: imageModel }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "image", url: data.url, model: data.model || imageModel });
          toast.success("FLUX.2 diffusion complete!");
        } else {
          throw new Error(data.error || "Image generation error");
        }
      } else if (quickMode === "voice") {
        toast.info("Synthesizing neural speech via Kokoro-82M...");
        const res = await fetch("/api/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: quickPrompt, voice: voicePersona }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "voice", url: data.url, text: quickPrompt, model: data.voice || voicePersona });
          toast.success("Kokoro-82M neural speech ready!");
        } else {
          throw new Error(data.error || "Speech generation error");
        }
      } else if (quickMode === "security") {
        toast.info("Executing ARDI Sec perimeter verification...");
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are ARDI Sec, Omnelia SI's senior defensive cybersecurity intelligence agent. Provide a fast, concise defensive perimeter assessment of the target asset.",
              },
              { role: "user", content: `Audit defensive security posture for: ${quickPrompt}` },
            ],
            model: "qwen-large",
          }),
        });
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || data.reply || JSON.stringify(data);
        setLastResult({ type: "security", text: content, model: "ARDI Sec Boundary Gate" });
        toast.success("ARDI Sec perimeter audit complete!");
      } else if (quickMode === "agent") {
        toast.info("Dispatching Omnelia Autonomous Lead Agent...");
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are the Omnelia SI Lead Autonomous Coordinator. Analyze the request, outline immediate tactical execution steps, and report state.",
              },
              { role: "user", content: quickPrompt },
            ],
            model: "qwen-large",
          }),
        });
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || data.reply || JSON.stringify(data);
        setLastResult({ type: "agent", text: content, model: "Omnelia Coordinator" });
        toast.success("Autonomous task coordinated!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to execute command");
    } finally {
      setIsGenerating(false);
    }
  };

  const domainCards = [
    {
      id: "video-gen",
      title: "Alibaba Wan 2.1 Video Studio",
      category: "Cinematic Text-to-Video",
      desc: "14B High-Fidelity & 1.3B Fast open foundation models with camera direction and 4k upscaling.",
      icon: Video,
      badge: "14B OSS",
      poster: "/omnelia-assets/assets/showcase/desk-adventure-poster.webp",
      action: "Launch Video Studio",
    },
    {
      id: "image-gen",
      title: "FLUX.2 & Diffusion Studio",
      category: "Neural Photorealism",
      desc: "Black Forest Labs FLUX.2 Ultra, FLUX Realism & Seedream 5 photorealistic open diffusers.",
      icon: ImageIcon,
      badge: "FLUX.2",
      poster: "/omnelia-assets/assets/generated/intelligence-1280.webp",
      action: "Launch Diffuser",
    },
    {
      id: "voice-clone",
      title: "Kokoro-82M Neural Audio",
      category: "Speech Synthesis",
      desc: "Apache 2.0 82M compact TTS pipeline with studio British & US voices with zero cloud lock-in.",
      icon: Mic,
      badge: "Apache 2.0",
      action: "Synthesize Voice",
    },
    {
      id: "ardi-sec",
      title: "ARDI Cybersecurity & OSINT",
      category: "Asset Defense",
      desc: "Perimeter boundary verification, token leakage audits, safe OSINT, and strict data egress controls.",
      icon: Shield,
      badge: "Defense Gate",
      action: "Run Security Audit",
    },
    {
      id: "documentary-montage",
      title: "75s Rainy Documentary Finisher",
      category: "Cinematic Montage",
      desc: "Automated multi-clip rain & urban documentary montage with elegiac ambient score and pacing.",
      icon: CloudRain,
      badge: "Cinematic",
      action: "Build Montage",
    },
    {
      id: "agents",
      title: "Omnelia Autonomous Fleet",
      category: "Multi-Agent System",
      desc: "Persistent agent workflows with AgentMemory recall, tool dispatch, and local mesh orchestration.",
      icon: Bot,
      badge: "AgentMemory",
      action: "Manage Fleet",
    },
    {
      id: "music-gen",
      title: "MusicGen & Soundscapes",
      category: "Audio Engineering",
      desc: "Meta MusicGen & AudioCraft ambient compositions, stems, BPM control, and cinematic scores.",
      icon: Music,
      badge: "AudioCraft",
      action: "Compose Track",
    },
    {
      id: "web-builder",
      title: "Full-Stack Web Architect",
      category: "Code Generation",
      desc: "Next.js, Tailwind & React interactive site generator with live in-app preview.",
      icon: Code2,
      badge: "Live Preview",
      action: "Code Application",
    },
    {
      id: "video-edit",
      title: "Timeline Video Editor",
      category: "Post-Production",
      desc: "Multi-track timeline, audio syncing, color grading, and subtitle burning.",
      icon: Scissors,
      badge: "Studio Editor",
      action: "Open Editor",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 md:p-8 space-y-8 bg-[#090b11] text-[#f1f5f9]">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(87,241,239,0.2)] bg-gradient-to-br from-[#0e121d] via-[#111624] to-[#0a0d16] p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-[#57f1ef]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 h-80 w-80 rounded-full bg-[#c7a0ff]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgba(87,241,239,0.1)] border border-[rgba(87,241,239,0.3)] shadow-[0_0_25px_rgba(87,241,239,0.25)] overflow-hidden">
              <img
                src="/branding/omnelia-icon-180.png"
                alt="Omnelia SI"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  Omnelia SI: Autonomous Superintelligence &amp; Creative Studio
                </h1>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(87,241,239,0.1)] border border-[rgba(87,241,239,0.3)] text-[#57f1ef] text-[11px] font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#57f1ef] animate-pulse" />
                  <span>Local Mesh · 100% Free &amp; Open Source</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Internal superintelligence workstation: Alibaba Wan 2.1 video synthesis, FLUX.2 neural diffusers, Kokoro-82M speech studio, and ARDI Sec defensive fleet audit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-[rgba(87,241,239,0.25)] text-[#57f1ef] hover:bg-[rgba(87,241,239,0.1)] text-xs h-9 font-semibold gap-1.5"
              onClick={() => {
                fetch("http://127.0.0.1:11434/api/tags")
                  .then((r) => {
                    if (r.ok) toast.success("Connected to local Ollama engine (0 ms)!");
                    else toast.info("Ollama is not running locally. Using cloud OSS cascade.");
                  })
                  .catch(() => toast.info("Ollama offline. Fallback cascade active."));
              }}
            >
              <Cpu className="h-3.5 w-3.5" />
              Ping Local Ollama
            </Button>
            <Button
              size="sm"
              className="bg-[#57f1ef] hover:bg-[#57f1ef]/90 text-[#090b11] text-xs h-9 font-bold gap-1.5 shadow-[0_0_20px_rgba(87,241,239,0.3)]"
              onClick={() => onNavigate("video-gen")}
            >
              <Video className="h-3.5 w-3.5" />
              Launch Wan 2.1
            </Button>
          </div>
        </div>
      </div>

      {/* Bento Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[rgba(14,18,29,0.85)] border border-[rgba(87,241,239,0.18)] backdrop-blur-xl shadow-lg">
          <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Tokens Streamed</span>
            <Activity className="h-3.5 w-3.5 text-[#57f1ef]" />
          </div>
          <div className="text-2xl font-black text-white mt-1">5.4M</div>
          <div className="text-[11px] text-[#57f1ef] mt-0.5 font-mono">100% Free · Zero Monetization</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgba(14,18,29,0.85)] border border-[rgba(87,241,239,0.18)] backdrop-blur-xl shadow-lg">
          <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Local Latency</span>
            <Zap className="h-3.5 w-3.5 text-[#57f1ef]" />
          </div>
          <div className="text-2xl font-black text-white mt-1">0 ms</div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">Apple Silicon MLX / Ollama</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgba(14,18,29,0.85)] border border-[rgba(87,241,239,0.18)] backdrop-blur-xl shadow-lg">
          <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Wan 2.1 Video Foundation</span>
            <Film className="h-3.5 w-3.5 text-[#57f1ef]" />
          </div>
          <div className="text-2xl font-black text-white mt-1">14B / 1.3B</div>
          <div className="text-[11px] text-[#57f1ef] mt-0.5 font-mono">Alibaba Open Weights</div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgba(14,18,29,0.85)] border border-[rgba(87,241,239,0.18)] backdrop-blur-xl shadow-lg">
          <div className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>ARDI Defense Gate</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">0 Leaks</div>
          <div className="text-[11px] text-emerald-400 mt-0.5 font-mono">Perimeter Guarded</div>
        </div>
      </div>

      {/* Primary Workstation Stage */}
      <div className="rounded-3xl border border-[rgba(87,241,239,0.25)] bg-[rgba(12,16,26,0.92)] shadow-2xl backdrop-blur-2xl overflow-hidden">
        <div className="p-4 md:p-6 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#57f1ef]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Interactive Studio Workstation · Live Synthesis
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 flex-wrap">
            <button
              onClick={() => setQuickMode("video")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                quickMode === "video"
                  ? "bg-[rgba(87,241,239,0.18)] text-[#57f1ef] border border-[rgba(87,241,239,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Wan 2.1 Video</span>
            </button>
            <button
              onClick={() => setQuickMode("image")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                quickMode === "image"
                  ? "bg-[rgba(87,241,239,0.18)] text-[#57f1ef] border border-[rgba(87,241,239,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>FLUX.2 Image</span>
            </button>
            <button
              onClick={() => setQuickMode("voice")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                quickMode === "voice"
                  ? "bg-[rgba(199,160,255,0.18)] text-[#c7a0ff] border border-[rgba(199,160,255,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Kokoro Voice</span>
            </button>
            <button
              onClick={() => setQuickMode("security")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                quickMode === "security"
                  ? "bg-[rgba(87,241,239,0.18)] text-[#57f1ef] border border-[rgba(87,241,239,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ARDI Defense</span>
            </button>
            <button
              onClick={() => setQuickMode("agent")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                quickMode === "agent"
                  ? "bg-[rgba(255,173,215,0.18)] text-[#ffadd7] border border-[rgba(255,173,215,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Autonomous Fleet</span>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  {quickMode === "voice" ? "Neural Speech Script" : "Cinematic / Tactical Prompt"}
                </label>
                <textarea
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 rounded-2xl bg-black/50 border border-white/10 text-slate-100 text-sm focus:border-[#57f1ef] focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                  placeholder={
                    quickMode === "voice"
                      ? "Enter text for Kokoro-82M neural TTS synthesis..."
                      : "Enter creative prompt for Wan 2.1 Video, FLUX.2 Diffusers, or ARDI Sec..."
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickMode === "video" && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Video Architecture
                    </label>
                    <select
                      value={videoModel}
                      onChange={(e) => setVideoModel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:border-[#57f1ef] focus:outline-none"
                    >
                      <option value="wan-2.1-14b">Alibaba Wan 2.1 (14B High Fidelity Free)</option>
                      <option value="wan-2.1-1.3b">Alibaba Wan 2.1 (1.3B Fast Video Free)</option>
                      <option value="ltx-video-2">LTX-Video 2 (Lightricks Open Foundation)</option>
                    </select>
                  </div>
                )}

                {quickMode === "image" && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Diffusion Architecture
                    </label>
                    <select
                      value={imageModel}
                      onChange={(e) => setImageModel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:border-[#57f1ef] focus:outline-none"
                    >
                      <option value="flux">FLUX.2 Ultra (Black Forest Labs Free)</option>
                      <option value="flux-realism">FLUX Realism Engine</option>
                      <option value="seedream-5">Seedream 5 Ultra Photoreal</option>
                    </select>
                  </div>
                )}

                {quickMode === "voice" && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Voice Persona (Kokoro-82M)
                    </label>
                    <select
                      value={voicePersona}
                      onChange={(e) => setVoicePersona(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:border-[#c7a0ff] focus:outline-none"
                    >
                      <option value="af_heart">af_heart (Warm Neural Female · Apache 2.0)</option>
                      <option value="am_adam">am_adam (Authoritative US Male)</option>
                      <option value="bf_emma">bf_emma (British Neural Female)</option>
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <Button
                    onClick={handleQuickRun}
                    disabled={isGenerating}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-[#57f1ef] to-[#2bd0ce] text-[#090b11] font-bold text-xs shadow-[0_0_20px_rgba(87,241,239,0.3)] hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>
                          {quickMode === "video" && "Synthesize Wan 2.1 Video"}
                          {quickMode === "image" && "Diffuse FLUX.2 Image"}
                          {quickMode === "voice" && "Synthesize Neural Speech"}
                          {quickMode === "security" && "Execute ARDI Defense Audit"}
                          {quickMode === "agent" && "Dispatch Autonomous Task"}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Output Stage */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-black/60 border border-white/10 p-3 h-full min-h-[220px] flex flex-col justify-center items-center relative overflow-hidden">
                {lastResult?.type === "video" && lastResult.url && (
                  <div className="w-full flex flex-col items-center">
                    <video
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={lastResult.url}
                      className="w-full max-h-[220px] rounded-xl object-contain shadow-2xl"
                    />
                    <div className="mt-2 text-[11px] text-[#57f1ef] font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lastResult.model || "Wan 2.1 Video Pipeline"}</span>
                    </div>
                  </div>
                )}

                {lastResult?.type === "image" && lastResult.url && (
                  <div className="w-full flex flex-col items-center">
                    <img
                      src={lastResult.url}
                      alt="FLUX.2 generation"
                      className="w-full max-h-[220px] rounded-xl object-contain shadow-2xl"
                    />
                    <div className="mt-2 text-[11px] text-[#57f1ef] font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lastResult.model || "FLUX.2 Diffuser"}</span>
                    </div>
                  </div>
                )}

                {lastResult?.type === "voice" && lastResult.url && (
                  <div className="w-full p-4 flex flex-col items-center space-y-3">
                    <Volume2 className="w-8 h-8 text-[#c7a0ff]" />
                    <audio controls autoPlay src={lastResult.url} className="w-full" />
                    <div className="text-[11px] text-[#c7a0ff] font-mono">
                      Kokoro-82M Voice: {lastResult.model}
                    </div>
                  </div>
                )}

                {(lastResult?.type === "security" || lastResult?.type === "agent") && lastResult.text && (
                  <div className="w-full h-full p-2">
                    <pre className="w-full h-full max-h-[210px] overflow-y-auto text-[11px] font-mono text-emerald-400 bg-black/80 p-3 rounded-xl border border-emerald-500/20 whitespace-pre-wrap">
                      {lastResult.text}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Pipelines Bento Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Production Studio Pipelines
            </h3>
            <p className="text-xs text-slate-400">
              Direct access to all 9 specialized creative and security workspaces
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {domainCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[rgba(87,241,239,0.15)] bg-[rgba(14,18,29,0.85)] p-5 transition-all hover:border-[#57f1ef] hover:shadow-[0_12px_30px_rgba(87,241,239,0.15)] flex flex-col justify-between"
              >
                <div>
                  {card.poster && (
                    <div className="w-full h-36 rounded-xl overflow-hidden mb-4 border border-white/10 relative">
                      <img
                        src={card.poster}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <Badge className="bg-black/70 border border-white/20 text-[10px] font-mono text-white">
                          {card.badge}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[rgba(87,241,239,0.1)] border border-[rgba(87,241,239,0.25)] text-[#57f1ef]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          {card.category}
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#57f1ef] transition-colors">
                          {card.title}
                        </h4>
                      </div>
                    </div>
                    {!card.poster && (
                      <Badge className="bg-[rgba(87,241,239,0.1)] border border-[rgba(87,241,239,0.3)] text-[10px] font-mono text-[#57f1ef]">
                        {card.badge}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-2">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#57f1ef] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {card.action} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Free OSS</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
