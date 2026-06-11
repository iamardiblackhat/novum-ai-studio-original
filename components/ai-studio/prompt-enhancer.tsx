"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Zap,
  Brain,
  Sliders,
  ImageIcon,
  Video,
  Music,
  Code2,
  MessageSquare,
  ArrowRight,
  Save,
  Terminal,
  ScrollText,
  Mic2,
  ListTodo,
  PenTool,
  History,
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
    desc: "Neural expansion for AI models",
  },
  {
    id: "script",
    name: "Screenwriter",
    icon: ScrollText,
    desc: "Narrative scripts & storyboards",
  },
  { id: "lyrics", name: "Lyricist", icon: Music, desc: "Songwriting & meter" },
  {
    id: "podcast",
    name: "Podcast Planner",
    icon: Mic2,
    desc: "Interview flows & notes",
  },
  {
    id: "plan",
    name: "Strategic Architect",
    icon: ListTodo,
    desc: "Roadmaps & task trees",
  },
  {
    id: "engineering",
    name: "Systems Forge",
    icon: Code2,
    desc: "Technical docs & schemas",
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Expert Prompt/Content Engineer. Mode: ${activeMode}. Creativity: ${creativity[0]}%, Professionalism: ${professionalism[0]}%. Return only the refined content.`,
            },
            { role: "user", content: input },
          ],
          model: "qwen/qwen-3.5-72b-chat",
        }),
      });

      const data = await res.json();
      const enhanced = data.content;

      setHistory((prev) => [
        {
          id: Math.random().toString(),
          original: input,
          enhanced,
          type: activeMode,
          timestamp: new Date(),
        },
        ...prev,
      ]);
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
    <div className="h-full flex flex-col lg:flex-row gap-4 bg-background">
      {/* Config Hub */}
      <div className="lg:w-[380px] flex flex-col gap-4 shrink-0">
        <Card className="p-6 border bg-card shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <PenTool size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight">
                Content Engine
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                Synthesis Hub v5.2
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {contentModes.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id as ContentType)}
                className={cn(
                  "p-3 rounded border text-left transition-all",
                  activeMode === m.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-background border-transparent hover:bg-muted/50",
                )}
                title={m.desc}
              >
                <m.icon
                  size={14}
                  className={cn(
                    "mb-2",
                    activeMode === m.id
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <p
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-tighter",
                    activeMode === m.id
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {m.name}
                </p>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase opacity-60 ml-1">
                Seed Input
              </Label>
              <Textarea
                placeholder={`Type raw concept for ${activeMode}...`}
                className="min-h-[100px] text-xs font-medium border-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <span className="text-[9px] font-bold uppercase opacity-60">
                    Creativity
                  </span>
                  <span className="text-[9px] font-bold">{creativity}%</span>
                </div>
                <Slider
                  value={creativity}
                  onValueChange={setCreativity}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <span className="text-[9px] font-bold uppercase opacity-60">
                    Professionalism
                  </span>
                  <span className="text-[9px] font-bold">
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
              className="w-full h-11 font-bold uppercase text-[10px] shadow-sm"
              onClick={handleSynthesize}
              disabled={!input.trim() || isSynthesizing}
            >
              {isSynthesizing ? (
                <RefreshCw className="animate-spin mr-2" size={14} />
              ) : (
                <Zap className="mr-2" size={14} />
              )}
              Synthesize
            </Button>
          </div>
        </Card>

        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={14} className="text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                History ({history.length})
              </span>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded border bg-background hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setInput(item.original);
                    setCurrentResult(item.enhanced);
                    setActiveMode(item.type);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-[7px] font-bold h-3.5 px-1 uppercase"
                    >
                      {item.type}
                    </Badge>
                    <span className="text-[8px] font-bold opacity-40">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium truncate italic opacity-60">
                    &quot;{item.original}&quot;
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Output Display */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <Card className="flex-1 border bg-muted/5 shadow-inner relative flex flex-col overflow-hidden">
          {currentResult || isSynthesizing ? (
            <>
              <div className="px-6 py-3 border-b bg-background flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary border">
                    {(() => {
                      const Icon =
                        contentModes.find((m) => m.id === activeMode)?.icon ||
                        Sparkles;
                      return <Icon size={14} />;
                    })()}
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">
                    Neural Synthesis Output
                  </h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[9px] font-bold uppercase"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check size={14} className="mr-1.5 text-emerald-500" />
                    ) : (
                      <Copy size={14} className="mr-1.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-[9px] font-bold uppercase"
                  >
                    Use in Studio
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-8">
                  {isSynthesizing ? (
                    <div className="h-full w-full flex flex-col items-center justify-center py-20 opacity-20 animate-pulse">
                      <Brain size={40} />
                      <p className="text-[10px] font-bold uppercase mt-4">
                        Expanding Semantic Matrix...
                      </p>
                    </div>
                  ) : (
                    <Card className="p-8 border-2 bg-background shadow-lg rounded-lg">
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap selection:bg-primary selection:text-primary-foreground">
                        {currentResult}
                      </p>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10">
              <Sparkles size={64} strokeWidth={1} />
              <p className="text-[10px] font-bold uppercase mt-4 tracking-[0.3em]">
                Awaiting Input Signal
              </p>
            </div>
          )}
        </Card>

        {/* Console */}
        <Card className="h-[120px] border bg-zinc-950 p-4 font-mono text-[10px] text-emerald-500/60 leading-relaxed overflow-hidden">
          <p>[SYSTEM] Content Engine ready. Mode: {activeMode.toUpperCase()}</p>
          {isSynthesizing && (
            <p className="text-blue-400 animate-pulse">
              [EXEC] Partitioning semantic vectors...
            </p>
          )}
          <p className="opacity-20">[IDLE] Connected to global relay.</p>
        </Card>
      </div>
    </div>
  );
}
