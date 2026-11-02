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
  const [quickPrompt, setQuickPrompt] = useState("");
  const [quickMode, setQuickMode] = useState<"image" | "video" | "voice" | "security" | "agent">("image");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    type: "image" | "video" | "voice" | "security" | "agent";
    url?: string;
    text?: string;
  } | null>(null);

  const handleQuickRun = async () => {
    if (!quickPrompt.trim()) {
      toast.error("Please enter a prompt or instruction");
      return;
    }

    setIsGenerating(true);
    setLastResult(null);

    try {
      if (quickMode === "image") {
        toast.info("Synthesizing visual asset via FLUX.2 Diffuser...");
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: quickPrompt, model: "flux" }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "image", url: data.url });
          toast.success("FLUX.2 image generated successfully!");
        } else {
          throw new Error(data.error || "Generation error");
        }
      } else if (quickMode === "video") {
        toast.info("Rendering video via Wan 2.1 Open Engine...");
        const res = await fetch("/api/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: quickPrompt, model: "wan", duration: 4 }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "video", url: data.url });
          toast.success("Wan 2.1 video pipeline launched!");
        } else {
          throw new Error(data.error || "Video error");
        }
      } else if (quickMode === "voice") {
        toast.info("Synthesizing speech via Kokoro-82M neural audio...");
        const res = await fetch("/api/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: quickPrompt, voice: "kokoro-af-heart" }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "voice", url: data.url, text: quickPrompt });
          toast.success("Kokoro-82M studio speech ready!");
        } else {
          throw new Error(data.error || "Speech error");
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
        if (data.content) {
          setLastResult({ type: "security", text: data.content });
          toast.success("ARDI Sec audit report generated!");
        } else {
          throw new Error(data.error || "Audit error");
        }
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
        if (data.content) {
          setLastResult({ type: "agent", text: data.content });
          toast.success("Autonomous task executed!");
        } else {
          throw new Error(data.error || "Agent error");
        }
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
      id: "image-gen",
      title: "FLUX.2 & Diffusion Studio",
      category: "Visual Creation",
      desc: "Black Forest Labs FLUX.2 Ultra, FLUX Realism & Seedream 5 photorealistic diffusers.",
      icon: ImageIcon,
      color: "text-[#57f1ef]",
      badge: "OSS Free",
      action: "Launch Diffuser",
    },
    {
      id: "video-gen",
      title: "Wan 2.1 & LTX Cinema Video",
      category: "Cinematic Video",
      desc: "Alibaba Wan 2.1 open foundation model & Lightricks LTX-Video 2 text-to-video.",
      icon: Video,
      color: "text-[#57f1ef]",
      badge: "Open Video",
      action: "Render Video",
    },
    {
      id: "voice-clone",
      title: "Kokoro-82M Neural Audio",
      category: "Voice & Speech",
      desc: "State-of-the-art Apache 2.0 82M compact TTS pipeline with studio British & US voices.",
      icon: Mic,
      color: "text-[#c7a0ff]",
      badge: "Apache 2.0",
      action: "Synthesize Voice",
    },
    {
      id: "ardi-sec",
      title: "ARDI Cybersecurity & OSINT",
      category: "Asset Defense",
      desc: "Authorized asset security verification, safe OSINT, defensive posture & data boundary audit.",
      icon: Shield,
      color: "text-[#57f1ef]",
      badge: "ARDI Core",
      action: "Run Security Audit",
    },
    {
      id: "documentary-montage",
      title: "75s Rainy Documentary Finisher",
      category: "Cinematic Montage",
      desc: "Automated multi-clip rain & urban documentary montage with elegiac ambient score.",
      icon: CloudRain,
      color: "text-[#c7a0ff]",
      badge: "75s Pipeline",
      action: "Build Montage",
    },
    {
      id: "agents",
      title: "Omnelia Autonomous Fleet",
      category: "Persistent Agents",
      desc: "Mastra, LangGraph & Smolagents role-based agents with long-term AgentMemory recall.",
      icon: Bot,
      color: "text-[#ffadd7]",
      badge: "AgentMemory",
      action: "Manage Fleet",
    },
    {
      id: "music-gen",
      title: "MusicGen & Soundscapes",
      category: "Audio Engineering",
      desc: "Meta MusicGen & AudioCraft ambient compositions, stems, BPM control, and scores.",
      icon: Music,
      color: "text-[#ffadd7]",
      badge: "Free Audio",
      action: "Compose Track",
    },
    {
      id: "web-builder",
      title: "Full-Stack Web Architect",
      category: "Code Generation",
      desc: "Next.js, Tailwind & React interactive site generator with live in-app preview.",
      icon: Code2,
      color: "text-[#57f1ef]",
      badge: "Live Preview",
      action: "Code Application",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Banner / System Status */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(87,241,239,0.25)] bg-gradient-to-br from-[#0e121d] via-[#121826] to-[#0a0d16] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-72 w-72 rounded-full bg-[#57f1ef]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-[#c7a0ff]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#57f1ef] animate-pulse shadow-[0_0_10px_#57f1ef]" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#57f1ef]">
                OMNELIA SI · SUPERINTELLIGENCE &amp; CREATIVE OS
              </span>
              <Badge variant="outline" className="text-[10px] bg-[rgba(87,241,239,0.1)] text-[#57f1ef] border-[rgba(87,241,239,0.3)] font-mono">
                v4.5 Enterprise
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#f3f4f8]">
              Omnelia Superintelligence Studio
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Proprietary internal operating system: Wan 2.1 cinematic video, FLUX.2 diffusers, Kokoro-82M neural audio, ARDI cybersecurity defense, and persistent agent fleet.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 border-[rgba(87,241,239,0.3)] text-[#57f1ef] bg-[rgba(87,241,239,0.08)] hover:bg-[rgba(87,241,239,0.15)]"
              onClick={() => onNavigate("ardi-sec")}
            >
              <Shield className="h-3.5 w-3.5 text-[#57f1ef]" />
              ARDI Cyber
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1.5 bg-[#57f1ef] hover:bg-[#57f1ef]/90 text-[#090b11] font-bold shadow-[0_0_20px_rgba(87,241,239,0.3)]"
              onClick={() => onNavigate("video-gen")}
            >
              <Video className="h-3.5 w-3.5" />
              Launch Video Studio
            </Button>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[rgba(87,241,239,0.15)] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[rgba(87,241,239,0.12)] text-[#57f1ef] flex items-center justify-center border border-[rgba(87,241,239,0.25)] shadow-[0_0_10px_rgba(87,241,239,0.15)]">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Neural Mesh</div>
              <div className="text-xs font-bold text-foreground">14 Free OSS Models</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[rgba(199,160,255,0.12)] text-[#c7a0ff] flex items-center justify-center border border-[rgba(199,160,255,0.25)] shadow-[0_0_10px_rgba(199,160,255,0.15)]">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Memory Recall</div>
              <div className="text-xs font-bold text-foreground">1,420 Vectors (99.4%)</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[rgba(255,173,215,0.12)] text-[#ffadd7] flex items-center justify-center border border-[rgba(255,173,215,0.25)] shadow-[0_0_10px_rgba(255,173,215,0.15)]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Autonomous Fleet</div>
              <div className="text-xs font-bold text-foreground">ARDI + 3 Agents Active</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[rgba(87,241,239,0.12)] text-[#57f1ef] flex items-center justify-center border border-[rgba(87,241,239,0.25)] shadow-[0_0_10px_rgba(87,241,239,0.15)]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Security Posture</div>
              <div className="text-xs font-bold text-emerald-400">Zero-Leakage Enforced</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Run Command Center */}
      <Card className="border border-[rgba(87,241,239,0.2)] shadow-xl bg-[rgba(14,18,29,0.85)] backdrop-blur-xl">
        <CardHeader className="pb-3 border-b border-[rgba(87,241,239,0.12)]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#57f1ef]" />
              <CardTitle className="text-sm font-bold tracking-tight text-foreground">
                Studio Quick Command Console
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 bg-[rgba(10,13,22,0.8)] p-1 rounded-xl border border-[rgba(87,241,239,0.15)]">
              {(
                [
                  { id: "image", label: "FLUX.2 Image", icon: ImageIcon },
                  { id: "video", label: "Wan 2.1 Video", icon: Video },
                  { id: "voice", label: "Kokoro Voice", icon: Mic },
                  { id: "security", label: "ARDI Security", icon: Shield },
                  { id: "agent", label: "Agent Task", icon: Bot },
                ] as const
              ).map((mode) => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.id}
                    variant={quickMode === mode.id ? "secondary" : "ghost"}
                    size="sm"
                    className={`h-7 text-[11px] gap-1 px-2.5 rounded-lg transition-all ${
                      quickMode === mode.id
                        ? "bg-[#57f1ef] text-[#090b11] font-bold shadow-[0_0_10px_rgba(87,241,239,0.3)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setQuickMode(mode.id)}
                  >
                    <Icon className="h-3 w-3" />
                    {mode.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={
                quickMode === "image"
                  ? "e.g. Ultra-realistic cinematic portrait with neon volumetric lighting, 8k raw photo..."
                  : quickMode === "video"
                  ? "e.g. Drone soaring through futuristic skyscraper canyons in dense rain, cinematic motion..."
                  : quickMode === "voice"
                  ? "e.g. Omnelia Superintelligence Studio online. All systems nominal."
                  : quickMode === "security"
                  ? "e.g. omnelia.com (Audits SSL/TLS, defensive headers, and data isolation)"
                  : "e.g. Research latest open-source agent memory benchmarks and compile briefing..."
              }
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleQuickRun();
                }
              }}
              className="text-xs h-10 bg-[rgba(10,13,22,0.7)] border-[rgba(87,241,239,0.2)] focus-visible:ring-[#57f1ef]"
              disabled={isGenerating}
            />
            <Button
              onClick={handleQuickRun}
              disabled={isGenerating || !quickPrompt.trim()}
              className="h-10 px-5 gap-1.5 shrink-0 bg-[#57f1ef] hover:bg-[#57f1ef]/90 text-[#090b11] font-bold shadow-[0_0_15px_rgba(87,241,239,0.3)]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Execute
                </>
              )}
            </Button>
          </div>

          {/* Quick Result Preview */}
          {lastResult && (
            <div className="p-4 rounded-xl border border-[rgba(87,241,239,0.3)] bg-[rgba(10,13,22,0.9)] space-y-3 animate-in fade-in duration-300 shadow-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-[rgba(87,241,239,0.15)] pb-2">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#57f1ef]" />
                  Live Output Generated ({lastResult.type.toUpperCase()})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px]"
                  onClick={() => setLastResult(null)}
                >
                  Dismiss
                </Button>
              </div>

              {lastResult.type === "image" && lastResult.url && (
                <div className="relative rounded-xl overflow-hidden border border-[rgba(87,241,239,0.2)] max-w-md mx-auto aspect-square shadow-2xl">
                  <img
                    src={lastResult.url}
                    alt="Generated Asset"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {lastResult.type === "video" && lastResult.url && (
                <div className="rounded-xl overflow-hidden border border-[rgba(87,241,239,0.2)] max-w-lg mx-auto aspect-video bg-black flex flex-col items-center justify-center p-4 text-center">
                  <video
                    src={lastResult.url}
                    controls
                    autoPlay
                    loop
                    className="max-h-64 rounded-md shadow-2xl"
                  />
                  <div className="text-[11px] text-muted-foreground mt-2 font-mono">
                    Stream: <a href={lastResult.url} target="_blank" rel="noreferrer" className="text-[#57f1ef] underline">{lastResult.url}</a>
                  </div>
                </div>
              )}

              {lastResult.type === "voice" && lastResult.url && (
                <div className="p-3 bg-[rgba(14,18,29,0.9)] rounded-xl border border-[rgba(87,241,239,0.2)] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-[#c7a0ff]" />
                    <span className="text-xs font-mono italic truncate max-w-sm">"{lastResult.text}"</span>
                  </div>
                  <audio controls autoPlay src={lastResult.url} className="h-8 max-w-xs" />
                </div>
              )}

              {(lastResult.type === "agent" || lastResult.type === "security") && lastResult.text && (
                <div className="p-3 bg-[rgba(10,13,22,0.8)] rounded-xl border border-[rgba(87,241,239,0.15)] text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {lastResult.text}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Studio Domains Bento Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Omnelia Studio Production Suites
            </h2>
            <p className="text-xs text-muted-foreground">
              Specialized creation, orchestration, cybersecurity, and finishing workstations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainCards.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card
                key={domain.id}
                className="group relative overflow-hidden border border-[rgba(87,241,239,0.18)] hover:border-[#57f1ef] transition-all duration-300 hover:shadow-[0_0_25px_rgba(87,241,239,0.15)] bg-[rgba(14,18,29,0.85)] backdrop-blur-xl cursor-pointer flex flex-col justify-between"
                onClick={() => onNavigate(domain.id)}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`h-9 w-9 rounded-xl bg-[rgba(87,241,239,0.08)] flex items-center justify-center border border-[rgba(87,241,239,0.2)] ${domain.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5 bg-[rgba(26,32,53,0.8)] border border-[rgba(87,241,239,0.2)] text-foreground">
                      {domain.badge}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                      {domain.category}
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-foreground group-hover:text-[#57f1ef] transition-colors">
                      {domain.title}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>

                <div className="p-3 border-t border-[rgba(87,241,239,0.12)] bg-[rgba(10,13,22,0.5)] flex items-center justify-between text-xs font-semibold text-[#57f1ef]">
                  <span>{domain.action}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Fleet & Local Model Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border border-[rgba(87,241,239,0.2)] shadow-xl bg-[rgba(14,18,29,0.85)] backdrop-blur-xl">
          <CardHeader className="py-3 px-4 border-b border-[rgba(87,241,239,0.12)] flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Bot className="h-4 w-4 text-[#57f1ef]" />
                Omnelia Autonomous Fleet (ARDI Architecture)
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Domain-contained agents with verified long-term memory reflection
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 gap-1 border-[rgba(87,241,239,0.3)] text-[#57f1ef]"
              onClick={() => onNavigate("agents")}
            >
              All Agents
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[
              {
                name: "ARDI Sec",
                role: "Defensive Cyber & OSINT Guardian",
                framework: "ARDI Trust Core",
                status: "Perimeter Active",
                memory: "Zero-exfiltration policy",
                desc: "Autonomous vulnerability verification, safe OSINT, perimeter defensive audit, and transport security.",
              },
              {
                name: "Newton",
                role: "Lead Deep-Research Agent",
                framework: "LangGraph + Mastra",
                status: "Monitoring",
                memory: "384 facts cached",
                desc: "Autonomous continuous web search, scientific paper synthesis, and OSINT evidence validation.",
              },
              {
                name: "Cipher",
                role: "Senior Architecture & Code Agent",
                framework: "Smolagents + Ollama",
                status: "Idle",
                memory: "512 code symbols indexed",
                desc: "Type-safe code refactoring, AST analysis, security boundary verification, and Docker builds.",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-3 rounded-xl border border-[rgba(87,241,239,0.15)] bg-[rgba(10,13,22,0.6)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">{agent.name}</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-[rgba(87,241,239,0.25)] text-[#57f1ef]">
                      {agent.framework}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">· {agent.memory}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="bg-[rgba(87,241,239,0.12)] text-[#57f1ef] border border-[rgba(87,241,239,0.25)] text-[10px]">
                    {agent.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs px-2.5 bg-[rgba(26,32,53,0.8)] border border-[rgba(87,241,239,0.2)] hover:border-[#57f1ef]"
                    onClick={() => onNavigate("agents")}
                  >
                    Open Console
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Local Hardware & Ollama Bridge */}
        <Card className="border border-[rgba(87,241,239,0.2)] shadow-xl bg-gradient-to-br from-[#0e121d] to-[rgba(10,13,22,0.9)] backdrop-blur-xl flex flex-col justify-between">
          <CardHeader className="py-3 px-4 border-b border-[rgba(87,241,239,0.12)]">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <Cpu className="h-4 w-4 text-[#57f1ef]" />
              Local Model Inference Bridge
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Offline privacy with Apple Silicon MLX &amp; Ollama
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs leading-relaxed">
            <p className="text-muted-foreground">
              Omnelia SI prioritizes <strong>local offline execution</strong>. When Ollama is running on your Mac, models execute 100% locally with zero data egress.
            </p>
            <div className="p-3 rounded-xl bg-[rgba(10,13,22,0.8)] border border-[rgba(87,241,239,0.15)] font-mono text-[11px] space-y-1 text-muted-foreground">
              <div className="text-[#57f1ef] font-semibold">Terminal Commands:</div>
              <div>$ ollama run qwen2.5-coder</div>
              <div>$ ollama serve</div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-muted-foreground">Gateway: http://localhost:11434</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 border-[rgba(87,241,239,0.3)] text-[#57f1ef] hover:bg-[rgba(87,241,239,0.1)]"
                onClick={() => {
                  fetch("http://127.0.0.1:11434/api/tags")
                    .then((r) => {
                      if (r.ok) toast.success("Connected to local Ollama engine!");
                      else toast.info("Ollama is not currently running locally.");
                    })
                    .catch(() => toast.info("Ollama offline. Using free cloud OSS mesh."));
                }}
              >
                Ping Local Engine
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
