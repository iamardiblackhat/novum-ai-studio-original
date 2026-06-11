"use client";

import { useState } from "react";
import {
  Plus,
  Play,
  Trash2,
  GitBranch,
  Zap,
  Bot,
  Globe,
  Mail,
  FileText,
  Database,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  Network,
  Activity,
  Terminal,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: "Operations" | "Growth" | "DevOps";
  status: "idle" | "executing";
  totalRuns: number;
}

const PRESET_WORKFLOWS: Workflow[] = [
  {
    id: "w1",
    name: "RAG Lead Enricher",
    description: "IMAP Trigger → Qdrant Search → GPT-5 Scoring → CRM Push",
    category: "Growth",
    status: "idle",
    totalRuns: 1240,
  },
  {
    id: "w2",
    name: "Social Content Bot",
    description: "RSS → Claude 4 Synthesis → Multi-Platform Threading",
    category: "Operations",
    status: "idle",
    totalRuns: 890,
  },
];

export function WorkflowsManager() {
  const [workflows, setWorkflows] = useState<Workflow[]>(PRESET_WORKFLOWS);
  const [selectedId, setSelectedId] = useState<string | null>(
    PRESET_WORKFLOWS[0].id,
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const active = workflows.find((w) => w.id === selectedId);

  const handleExecute = async () => {
    if (isExecuting || !active) return;
    setIsExecuting(true);
    await new Promise((r) => setTimeout(r, 3000));
    setIsExecuting(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 bg-background">
      {/* Registry */}
      <Card className="lg:w-[360px] flex flex-col border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Logic Registry
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Create new logic chain"
            >
              <Plus size={16} />
            </Button>
          </div>
          <Input
            placeholder="Filter signatures..."
            className="h-9 text-xs border-2"
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {workflows.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                className={cn(
                  "p-4 rounded border transition-all cursor-pointer group flex items-start justify-between gap-3",
                  selectedId === w.id
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-transparent hover:bg-muted/50",
                )}
              >
                <div className="flex-1 min-w-0">
                  <Badge
                    variant="outline"
                    className="text-[7px] font-black h-3.5 px-1 uppercase mb-1"
                  >
                    {w.category}
                  </Badge>
                  <h4 className="text-[11px] font-bold uppercase truncate">
                    {w.name}
                  </h4>
                  <p className="text-[9px] font-medium text-muted-foreground mt-0.5 line-clamp-1">
                    {w.description}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecute();
                  }}
                  disabled={isExecuting}
                  title="Execute workflow"
                >
                  <Play size={12} fill="currentColor" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Canvas */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <Card className="flex-1 border bg-muted/5 shadow-inner relative flex flex-col overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {active ? (
            <>
              <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">
                    {active.name}
                  </h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                    Registry Protocol v2.0.4
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[9px] font-bold uppercase"
                  >
                    <Settings2 size={12} className="mr-1.5" /> Configure
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-[9px] font-bold uppercase"
                    onClick={handleExecute}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <Loader2 size={12} className="mr-1.5 animate-spin" />
                    ) : (
                      <Zap size={12} className="mr-1.5" />
                    )}
                    Deploy Logic
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm flex flex-col gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative">
                      <Card className="p-4 border bg-background shadow-sm flex items-center gap-4">
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-[10px] font-bold">
                          {i}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase">
                            Node Operation {i}
                          </p>
                          <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
                            Processing Layer
                          </p>
                        </div>
                        {isExecuting && i === 1 && (
                          <Loader2
                            size={14}
                            className="animate-spin text-primary"
                          />
                        )}
                      </Card>
                      {i < 3 && (
                        <div className="absolute left-8 top-full h-8 w-px bg-border" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10 uppercase font-black text-[10px] tracking-[0.4em]">
              Awaiting Selection
            </div>
          )}
        </Card>

        {/* Console */}
        <Card className="h-[120px] border bg-zinc-950 p-4 font-mono text-[10px] text-emerald-500/60 leading-relaxed overflow-hidden">
          <p>[SYSTEM] Logic orchestrator active.</p>
          {isExecuting && (
            <p className="text-blue-400 animate-pulse">
              [EXEC] Deploying {active?.name} to inference grid...
            </p>
          )}
          <p className="opacity-20">[IDLE] Signal line stable.</p>
        </Card>
      </div>
    </div>
  );
}
