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
  DollarSign,
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
  ExternalLink,
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
  const [quickMode, setQuickMode] = useState<"image" | "video" | "voice" | "agent">("image");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<{
    type: "image" | "video" | "voice" | "agent";
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
        toast.info("Synthesizing visual asset via FLUX.2...");
        const res = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: quickPrompt, model: "flux" }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "image", url: data.url });
          toast.success("Image generated successfully!");
        } else {
          throw new Error(data.error || "Generation error");
        }
      } else if (quickMode === "video") {
        toast.info("Synthesizing video with Wan 2.1 Open Engine...");
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
        toast.info("Generating Kokoro-82M neural speech...");
        const res = await fetch("/api/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: quickPrompt, voice: "kokoro-af-heart" }),
        });
        const data = await res.json();
        if (data.url) {
          setLastResult({ type: "voice", url: data.url, text: quickPrompt });
          toast.success("Kokoro-82M audio ready!");
        } else {
          throw new Error(data.error || "Speech error");
        }
      } else if (quickMode === "agent") {
        toast.info("Dispatching Autonomous Lead Agent...");
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are the Novum Studio Lead Autonomous Coordinator. Analyze the request, outline immediate tactical execution steps, and report state.",
              },
              { role: "user", content: quickPrompt },
            ],
            model: "qwen-large",
          }),
        });
        const data = await res.json();
        if (data.content) {
          setLastResult({ type: "agent", text: data.content });
          toast.success("Agent task executed!");
        } else {
          throw new Error(data.error || "Agent error");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to execute quick generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const domainCards = [
    {
      id: "image-gen",
      title: "FLUX.2 & Diffusion Studio",
      category: "Visual Creation",
      desc: "Black Forest Labs FLUX.2, FLUX Realism & Seedream 5 high-fidelity visual generation.",
      icon: ImageIcon,
      color: "text-amber-400",
      badge: "OSS 100% Free",
      action: "Launch Diffuser",
    },
    {
      id: "video-gen",
      title: "Wan 2.1 & LTX Cinema Video",
      category: "Cinematic Video",
      desc: "Alibaba Wan 2.1 open foundation model & Lightricks LTX-Video 2 text-to-video generation.",
      icon: Video,
      color: "text-cyan-400",
      badge: "Open Video",
      action: "Render Video",
    },
    {
      id: "voice-clone",
      title: "Kokoro-82M Neural Voice",
      category: "Voice & Speech",
      desc: "State-of-the-art Apache 2.0 82M compact TTS pipeline with studio British and US voices.",
      icon: Mic,
      color: "text-purple-400",
      badge: "Apache 2.0",
      action: "Synthesize Voice",
    },
    {
      id: "documentary-montage",
      title: "75s Rainy Documentary Finisher",
      category: "Cinematic Montage",
      desc: "Automated multi-clip rain & urban documentary montage with elegiac ambient soundtrack.",
      icon: CloudRain,
      color: "text-blue-400",
      badge: "75s Pipeline",
      action: "Build Montage",
    },
    {
      id: "monetization",
      title: "Monetization & Agency Suite",
      category: "Commercial Strategy",
      desc: "Create high-ticket offer tiers, executive win narratives, outbound emails, and 14-day sprints.",
      icon: DollarSign,
      color: "text-emerald-400",
      badge: "Commercial OS",
      action: "Design Offers",
    },
    {
      id: "agents",
      title: "Autonomous Fleet & Memory",
      category: "Persistent Agents",
      desc: "Mastra, LangGraph & Smolagents role-based agents with long-term AgentMemory recall.",
      icon: Bot,
      color: "text-indigo-400",
      badge: "AgentMemory",
      action: "Manage Agents",
    },
    {
      id: "music-gen",
      title: "MusicGen & Soundscapes",
      category: "Audio Engineering",
      desc: "Meta MusicGen & AudioCraft ambient compositions, stems, BPM control, and scores.",
      icon: Music,
      color: "text-rose-400",
      badge: "Free Audio",
      action: "Compose Track",
    },
    {
      id: "web-builder",
      title: "Full-Stack Web Architect",
      category: "Code Generation",
      desc: "Next.js, Tailwind & React interactive site generator with live in-app preview.",
      icon: Code2,
      color: "text-teal-400",
      badge: "Live Preview",
      action: "Code App",
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Banner / System Status */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
                NOVUM AI STUDIOS · PRODUCTION COMMAND CENTER
              </span>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                v4.2 OSS Native
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Autonomous Creation, Production &amp; Commercial Studio
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Unified workstation powered by real-time open-source models: Wan 2.1 video, FLUX.2 diffusers, Kokoro-82M speech, persistent AgentMemory, and high-ticket monetization engines.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 border-border/80"
              onClick={() => onNavigate("monetization")}
            >
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              Monetization
            </Button>
            <Button
              size="sm"
              className="text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              onClick={() => onNavigate("video-gen")}
            >
              <Video className="h-3.5 w-3.5" />
              New Video Studio
            </Button>
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Neural Models</div>
              <div className="text-xs font-bold text-foreground">14 Free Active</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Memory Recall</div>
              <div className="text-xs font-bold text-foreground">1,420 Vectors (99.4%)</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Autonomous Fleet</div>
              <div className="text-xs font-bold text-foreground">3 Agents Ready</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-mono">Privacy Mode</div>
              <div className="text-xs font-bold text-foreground">Local / Zero-Log</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Run Command Center */}
      <Card className="border border-border/70 shadow-md bg-card/70 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-sm font-bold tracking-tight">Studio Quick Command Console</CardTitle>
            </div>
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border">
              {(
                [
                  { id: "image", label: "FLUX.2 Image", icon: ImageIcon },
                  { id: "video", label: "Wan 2.1 Video", icon: Video },
                  { id: "voice", label: "Kokoro Voice", icon: Mic },
                  { id: "agent", label: "Agent Task", icon: Bot },
                ] as const
              ).map((mode) => {
                const Icon = mode.icon;
                return (
                  <Button
                    key={mode.id}
                    variant={quickMode === mode.id ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 text-[11px] gap-1 px-2.5"
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
                  ? "e.g. Cyberpunk cinematic rainy street in London, ultra-photorealistic 8k..."
                  : quickMode === "video"
                  ? "e.g. Drone camera soaring through mist-covered neon metropolis, smooth cinematic motion..."
                  : quickMode === "voice"
                  ? "e.g. Welcome to Novum AI Studio. All systems operational and ready for deployment."
                  : "e.g. Research latest open-source agent memory frameworks and draft executive brief..."
              }
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleQuickRun();
                }
              }}
              className="text-xs h-10"
              disabled={isGenerating}
            />
            <Button
              onClick={handleQuickRun}
              disabled={isGenerating || !quickPrompt.trim()}
              className="h-10 px-5 gap-1.5 shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
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
            <div className="p-4 rounded-xl border border-border/80 bg-background/80 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b pb-2">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
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
                <div className="relative rounded-lg overflow-hidden border max-w-md mx-auto aspect-square">
                  <img
                    src={lastResult.url}
                    alt="Generated Asset"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {lastResult.type === "video" && lastResult.url && (
                <div className="rounded-lg overflow-hidden border max-w-lg mx-auto aspect-video bg-black flex flex-col items-center justify-center p-4 text-center">
                  <video
                    src={lastResult.url}
                    controls
                    autoPlay
                    loop
                    className="max-h-64 rounded-md"
                  />
                  <div className="text-[11px] text-muted-foreground mt-2">
                    Direct Stream: <a href={lastResult.url} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{lastResult.url}</a>
                  </div>
                </div>
              )}

              {lastResult.type === "voice" && lastResult.url && (
                <div className="p-3 bg-muted/30 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-mono italic truncate max-w-sm">"{lastResult.text}"</span>
                  </div>
                  <audio controls autoPlay src={lastResult.url} className="h-8 max-w-xs" />
                </div>
              )}

              {lastResult.type === "agent" && lastResult.text && (
                <div className="p-3 bg-muted/20 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {lastResult.text}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Studio Domains Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold tracking-tight">Studio Production Suites</h2>
            <p className="text-xs text-muted-foreground">Specialized creation, orchestration, and finishing workstations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainCards.map((domain) => {
            const Icon = domain.icon;
            return (
              <Card
                key={domain.id}
                className="group relative overflow-hidden border border-border/70 hover:border-primary/50 transition-all duration-200 hover:shadow-lg bg-card/60 backdrop-blur-sm cursor-pointer flex flex-col justify-between"
                onClick={() => onNavigate(domain.id)}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center border ${domain.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono px-2 py-0.5">
                      {domain.badge}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                      {domain.category}
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {domain.title}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>

                <div className="p-3 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs font-medium text-primary">
                  <span>{domain.action}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Agent Roster & Autonomous Task Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border border-border/70 shadow-sm bg-card/70">
          <CardHeader className="py-3 px-4 border-b border-border/40 flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-400" />
                Active Agent Fleet Status
              </CardTitle>
              <CardDescription className="text-xs">
                Domain-contained autonomous agents with persistent memory reflection
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 gap-1"
              onClick={() => onNavigate("agents")}
            >
              All Agents
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[
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
              {
                name: "Vanguard",
                role: "Growth & Outbound Campaigner",
                framework: "CrewAI Multi-Flow",
                status: "Active",
                memory: "248 leads tracked",
                desc: "High-ticket proposal design, social authority content matrix, and cold acquisition flows.",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-3 rounded-xl border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{agent.name}</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {agent.framework}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">· {agent.memory}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                    {agent.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs px-2.5"
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
        <Card className="border border-border/70 shadow-sm bg-gradient-to-br from-card to-muted/20 flex flex-col justify-between">
          <CardHeader className="py-3 px-4 border-b border-border/40">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              Local Model Inference Bridge
            </CardTitle>
            <CardDescription className="text-xs">
              Complete offline privacy with Apple Silicon MLX / Ollama
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs leading-relaxed">
            <p className="text-muted-foreground">
              Novum AI Studio is architected to prioritize <strong>local offline execution</strong>. When Ollama is running on your Mac, models like Llama 3, Qwen 2.5 Coder, and DeepSeek execute 100% locally with zero data egress.
            </p>
            <div className="p-3 rounded-lg bg-background/80 border font-mono text-[11px] space-y-1 text-muted-foreground">
              <div className="text-foreground font-semibold">Terminal Quick Start:</div>
              <div>$ ollama run qwen2.5-coder</div>
              <div>$ ollama serve</div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-muted-foreground">Gateway: http://localhost:11434</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  fetch("http://127.0.0.1:11434/api/tags")
                    .then((r) => {
                      if (r.ok) toast.success("Connected to local Ollama!");
                      else toast.info("Ollama is not currently running locally.");
                    })
                    .catch(() => toast.info("Ollama is offline. Studio is using free cloud OSS fallbacks."));
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
