"use client";

import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  RefreshCw,
  Zap,
  Brain,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

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

const MODES: { id: ContentType; label: string; icon: any }[] = [
  { id: "prompt", label: "Visual Prompt", icon: Sparkles },
  { id: "engineering", label: "Web Forge", icon: Brain },
  { id: "script", label: "Video Script", icon: Wand2 },
  { id: "podcast", label: "Podcast Script", icon: Wand2 },
  { id: "plan", label: "Logic Chain", icon: Brain },
];

export function PromptEnhancer() {
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState<ContentType>("prompt");
  const [results, setResults] = useState<ContentResult[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!input.trim() || isEnhancing) return;
    setIsEnhancing(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an expert prompt engineer and content optimizer. Enhance the following input for the category: ${activeMode}. Return ONLY the enhanced version.`,
            },
            { role: "user", content: input },
          ],
        }),
      });

      if (!res.ok) throw new Error("Sync failed");
      const data = await res.json();

      const newResult: ContentResult = {
        id: Date.now().toString(),
        original: input,
        enhanced: data.content,
        type: activeMode,
        timestamp: new Date(),
      };

      setResults((prev) => [newResult, ...prev]);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 bg-background">
      <Card className="lg:w-[400px] flex flex-col border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/30 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Semantic Enhancer
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {MODES.map((mode) => (
              <Button
                key={mode.id}
                variant={activeMode === mode.id ? "default" : "outline"}
                size="sm"
                className="h-9 justify-start px-3 text-[10px] font-bold uppercase"
                onClick={() => setActiveMode(mode.id)}
              >
                <mode.icon size={14} className="mr-2" />
                {mode.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder={`Type raw concept for ${activeMode}...`}
              className="min-h-[120px] text-xs font-medium border-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              className="w-full h-11 font-bold uppercase text-[10px] shadow-sm"
              onClick={handleEnhance}
              disabled={!input.trim() || isEnhancing}
            >
              {isEnhancing ? (
                <RefreshCw size={14} className="animate-spin mr-2" />
              ) : (
                <Zap size={14} className="mr-2" />
              )}
              Synthesize Enhancement
            </Button>
          </div>
        </div>

        <Card className="m-4 flex-1 border bg-zinc-950 p-4 font-mono text-[10px] text-emerald-500/60 leading-relaxed overflow-hidden">
          <p>[SYSTEM] Neural optimizer online.</p>
          {isEnhancing && (
            <p className="text-blue-400 animate-pulse">
              [EXEC] Partitioning semantic vectors...
            </p>
          )}
          <p className="opacity-20">[IDLE] Connected to global relay.</p>
        </Card>
      </Card>

      <Card className="flex-1 border bg-muted/5 shadow-inner relative flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Enhancement Archive
            </span>
          </div>
          <Badge variant="outline" className="text-[8px] font-black">
            {results.length} VECTORS
          </Badge>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-2xl mx-auto">
            {results.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center opacity-20">
                <Brain size={48} strokeWidth={1} />
                <p className="text-[10px] font-black uppercase mt-4 tracking-[0.3em]">
                  Awaiting Input
                </p>
              </div>
            ) : (
              results.map((res) => (
                <Card
                  key={res.id}
                  className="p-4 border bg-background shadow-sm space-y-4 group"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <Badge
                      variant="secondary"
                      className="text-[7px] font-bold uppercase"
                    >
                      {res.type}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard.writeText(res.enhanced);
                        }}
                        title="Copy"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[7px] font-bold uppercase opacity-40">
                        Original
                      </p>
                      <p className="text-[10px] font-medium italic opacity-60">
                        {res.original}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[7px] font-bold uppercase text-primary">
                        Enhanced
                      </p>
                      <p className="text-xs font-bold leading-relaxed">
                        {res.enhanced}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
