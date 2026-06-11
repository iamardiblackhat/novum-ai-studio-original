"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Zap,
  Brain,
  Target,
  Sliders,
  Layout,
  ImageIcon,
  Video,
  Music,
  Code2,
  MessageSquare,
  ArrowRight,
  Maximize2,
  Save,
  Download,
  Terminal,
  Network,
  PenTool,
  FileText,
  Mic2,
  ListTodo,
  Presentation,
  Languages,
  Quote,
  BookOpen,
  ScrollText,
  History as HistoryIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ContentType =
  | "prompt"
  | "script"
  | "lyrics"
  | "podcast"
  | "plan"
  | "engineering";

interface ContentResult {
  id: string;
  original: string;
  enhanced: string;
  type: ContentType;
  timestamp: Date;
}

const contentModes = [
  {
    id: "prompt",
    name: "Prompt Forge",
    icon: Wand2,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    desc: "Neural expansion for AI models",
  },
  {
    id: "script",
    name: "Screenwriter",
    icon: ScrollText,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    desc: "Narrative scripts & storyboards",
  },
  {
    id: "lyrics",
    name: "Lyricist",
    icon: Music,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    desc: "Songwriting & poetic meter",
  },
  {
    id: "podcast",
    name: "Podcast Planner",
    icon: Mic2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    desc: "Interview flows & show notes",
  },
  {
    id: "plan",
    name: "Project Architect",
    icon: ListTodo,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    desc: "Strategic roadmaps & tasks",
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    desc: "Technical docs & architecture",
  },
];

export function PromptEnhancer() {
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState<ContentType>("prompt");
  const [creativity, setCreativity] = useState([75]);
  const [professionalism, setProfessionalism] = useState([50]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [history, setHistory] = useState<ContentResult[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSynthesize = async () => {
    if (!input.trim() || isSynthesizing) return;
    setIsSynthesizing(true);
    setCurrentResult(null);

    const systemPrompts: Record<ContentType, string> = {
      prompt: `Elite Prompt Engineer. Transform input into high-fidelity AI prompts. Creativity: ${creativity[0]}%, Structural Complexity: ${professionalism[0]}%.`,
      script: `Professional Screenwriter. Transform concept into a standard screenplay format. Include character cues and scene directions. Creativity: ${creativity[0]}%.`,
      lyrics: `Grammy-winning Lyricist. Transform theme into rhyming, rhythmic song lyrics with verse-chorus-bridge structure. Genre-aware. Creativity: ${creativity[0]}%.`,
      podcast: `Podcast Producer. Create a detailed interview flow, intro script, and key talking points. Tone: ${professionalism[0] > 50 ? "Academic" : "Conversational"}.`,
      plan: `Strategic Architect. Break down goal into a multi-phase project plan with actionable tasks and risk assessments.`,
      engineering: `Senior Systems Engineer. Generate technical architecture documentation, UML sequences, or API specifications.`,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompts[activeMode] },
            { role: "user", content: input },
          ],
          model: "qwen-coder",
        }),
      });

      const data = await res.json();
      const enhanced = data.content;

      const newEntry: ContentResult = {
        id: Math.random().toString(),
        original: input,
        enhanced,
        type: activeMode,
        timestamp: new Date(),
      };

      setHistory((prev) => [newEntry, ...prev]);
      setCurrentResult(enhanced);
    } catch (err) {
      console.error("Synthesis failure:", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopy = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 bg-background">
      {/* Input Hub */}
      <div className="lg:w-[420px] flex flex-col gap-6 shrink-0">
        <Card className="p-8 border-2 border-primary/5 bg-card/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                <PenTool
                  size={20}
                  className="text-primary-foreground -rotate-3"
                />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Content Engine
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                  Multi-Modality Content Forge
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Mode Selector */}
              <div className="grid grid-cols-2 gap-2">
                {contentModes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMode(m.id as ContentType)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left group",
                      activeMode === m.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-background border-transparent hover:border-primary/10",
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center transition-all shadow-inner",
                        m.bg,
                      )}
                    >
                      <m.icon
                        size={16}
                        className={cn(
                          "transition-colors",
                          activeMode === m.id
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-primary",
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          "text-[10px] font-black uppercase tracking-tight",
                          activeMode === m.id
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {m.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Concept Matrix
                </Label>
                <Textarea
                  placeholder={`Provide the seed for your ${activeMode}...`}
                  className="min-h-[100px] rounded-2xl border-2 bg-background focus-visible:ring-primary/20 resize-none text-sm font-medium p-4 shadow-inner"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Creativity Variance
                    </span>
                    <span className="text-[10px] font-black text-primary">
                      {creativity}%
                    </span>
                  </div>
                  <Slider
                    value={creativity}
                    onValueChange={setCreativity}
                    max={100}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Professionalism
                    </span>
                    <span className="text-[10px] font-black text-primary">
                      {professionalism}%
                    </span>
                  </div>
                  <Slider
                    value={professionalism}
                    onValueChange={setProfessionalism}
                    max={100}
                  />
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSynthesize}
                disabled={!input.trim() || isSynthesizing}
              >
                {isSynthesizing ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                {isSynthesizing ? "Expanding Dimensions..." : "Forge Content"}
              </Button>
            </div>
          </div>
        </Card>

        {/* History Archive */}
        <Card className="flex-1 flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden bg-background/50 backdrop-blur-xl min-h-[200px]">
          <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HistoryIcon size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Synthetisation Archive
              </h3>
            </div>
            <Badge
              variant="outline"
              className="text-[8px] font-black uppercase tracking-widest"
            >
              {history.length} RECORDS
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-2xl border-2 border-primary/5 bg-card hover:border-primary/20 transition-all cursor-pointer"
                  onClick={() => {
                    setInput(item.original);
                    setCurrentResult(item.enhanced);
                    setActiveMode(item.type);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-[8px] font-black uppercase bg-primary/10 text-primary border-0">
                      {item.type}
                    </Badge>
                    <span className="text-[8px] font-bold text-muted-foreground/40">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-foreground line-clamp-2 italic">
                    &quot;{item.original}&quot;
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Primary Display */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <Card className="flex-1 border-2 border-primary/5 rounded-[2.5rem] shadow-2xl bg-muted/5 relative overflow-hidden flex flex-col">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {currentResult || isSynthesizing ? (
            <>
              <div className="px-8 py-6 border-b bg-background/40 backdrop-blur-xl flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    {(() => {
                      const Icon =
                        contentModes.find((m) => m.id === activeMode)?.icon ||
                        Sparkles;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight uppercase leading-none">
                      Neural Content Output
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">
                      Mode: {activeMode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl h-11 px-6 font-bold border-2"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check size={18} className="text-emerald-500 mr-2" />
                    ) : (
                      <Copy size={18} className="mr-2" />
                    )}
                    {copied ? "Copied" : "Copy Text"}
                  </Button>
                  <Button className="rounded-xl h-11 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    Use in Editor <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-10 flex flex-col relative overflow-auto">
                <AnimatePresence mode="wait">
                  {isSynthesizing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full w-full flex flex-col items-center justify-center space-y-6"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "linear",
                          }}
                          className="w-40 h-40 rounded-[4rem] border-4 border-dashed border-primary/20"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain
                            size={48}
                            className="text-primary animate-pulse"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-black uppercase tracking-[0.4em] text-[10px] text-primary">
                          Neural Expansion Underway
                        </p>
                        <p className="text-xs font-medium text-muted-foreground mt-2 italic">
                          Synthesising high-dimensional semantic layers...
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <Card className="p-10 rounded-[3rem] border-2 border-primary/10 bg-card shadow-2xl relative group/output min-h-[400px]">
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover/output:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl bg-muted/50 backdrop-blur-md border shadow-sm"
                          >
                            <Download size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl bg-muted/50 backdrop-blur-md border shadow-sm"
                          >
                            <Maximize2 size={18} />
                          </Button>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="text-lg font-medium leading-relaxed tracking-tight text-foreground whitespace-pre-wrap selection:bg-primary selection:text-primary-foreground">
                            {currentResult}
                          </p>
                        </div>
                      </Card>

                      <div className="flex items-center gap-6 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Validated Structure
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Industry Optimized
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 opacity-20 px-10 text-center">
              <Sparkles size={80} strokeWidth={1} className="text-primary" />
              <div className="space-y-2">
                <p className="font-black uppercase tracking-[0.4em] text-xs">
                  Neural Forge Awaiting Semantic Seed
                </p>
                <p className="text-xs font-medium max-w-[280px] leading-relaxed mx-auto">
                  Select a modality and provide a conceptual framework to begin
                  expansion.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Telemetry */}
        <Card className="h-[120px] border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden bg-zinc-950 flex flex-col">
          <div className="px-6 py-2 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60">
                Expansion Telemetry
              </span>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 font-mono text-[10px] leading-relaxed opacity-60">
            <div className="space-y-1">
              <p className="text-emerald-500">
                [BOOT] Content Engine v5.1 active.
              </p>
              {isSynthesizing && (
                <p className="text-blue-400 animate-pulse">
                  [EXEC] Partitioning semantic vectors for {activeMode} mode...
                </p>
              )}
              {!isSynthesizing && (
                <p className="text-white/20">
                  [IDLE] Connected to global inference relay.
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
