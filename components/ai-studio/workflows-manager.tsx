"use client";

import { useState } from "react";
import { Plus, Play, GitBranch, Zap, Loader2, Settings2 } from "lucide-react";
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

interface LogEntry {
  id: string;
  content: string;
  type: "system" | "exec" | "ok" | "error";
}

const PRESET_WORKFLOWS: Workflow[] = [
  {
    id: "w1",
    name: "RAG Lead Enricher",
    description: "IMAP Trigger → Qdrant Search → AI Scoring → CRM Push",
    category: "Growth",
    status: "idle",
    totalRuns: 1240,
  },
  {
    id: "w2",
    name: "Social Content Bot",
    description: "RSS → AI Synthesis → Multi-Platform Threading",
    category: "Operations",
    status: "idle",
    totalRuns: 890,
  },
];

const CANVAS_NODES = [{ id: "n1" }, { id: "n2" }, { id: "n3" }];

export function WorkflowsManager() {
  const [workflows, setWorkflows] = useState<Workflow[]>(PRESET_WORKFLOWS);
  const [selectedId, setSelectedId] = useState<string | null>(
    PRESET_WORKFLOWS[0].id,
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "log-0",
      content: `[SYSTEM] Logic orchestrator v${(Math.random() * 3 + 2).toFixed(2)} active.`,
      type: "system",
    },
  ]);
  const [protocolVersion] = useState(
    `v2.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
  );

  const active = workflows.find((w) => w.id === selectedId);

  const addLog = (content: string, type: LogEntry["type"]) => {
    setLogs((prev) => [
      { id: Math.random().toString(36).substring(7), content, type },
      ...prev,
    ]);
  };

  const handleExecute = async () => {
    if (isExecuting || !active) return;
    setIsExecuting(true);
    addLog(`[EXEC] Deploying ${active.name} to inference grid...`, "exec");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a workflow execution engine. Simulate the output of this logic chain.",
            },
            {
              role: "user",
              content: `Execute workflow: ${active.name}. Description: ${active.description}`,
            },
          ],
          model: "openai-large",
        }),
      });

      if (!res.ok) throw new Error("Execution failed");
      const data = await res.json();

      addLog(
        `[OK] ${active.name} logic finalized: ${data.content.substring(0, 50)}...`,
        "ok",
      );
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === active.id ? { ...w, totalRuns: w.totalRuns + 1 } : w,
        ),
      );
    } catch (err) {
      addLog(
        `[ERROR] ${active.name} failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        "error",
      );
    } finally {
      setIsExecuting(false);
    }
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
              aria-label="Create new logic chain"
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
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedId(w.id)}
                className={cn(
                  "w-full p-4 rounded border transition-all cursor-pointer group flex items-start justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selectedId === w.id
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-transparent hover:bg-muted/50",
                )}
                aria-label={`Select workflow ${w.name}`}
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
                  aria-label="Run workflow"
                >
                  <Play size={12} fill="currentColor" />
                </Button>
              </button>
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
                    Registry Protocol {protocolVersion}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[9px] font-bold uppercase"
                    aria-label="Configure node"
                  >
                    <Settings2 size={12} className="mr-1.5" /> Configure
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-[9px] font-bold uppercase"
                    onClick={handleExecute}
                    disabled={isExecuting}
                    aria-label="Deploy logic"
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
                  {CANVAS_NODES.map((node, i) => (
                    <div key={node.id} className="relative">
                      <Card className="p-4 border bg-background shadow-sm flex items-center gap-4">
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold uppercase">
                            Node Operation {i + 1}
                          </p>
                          <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
                            Processing Layer
                          </p>
                        </div>
                        {isExecuting && i === 0 && (
                          <Loader2
                            size={14}
                            className="animate-spin text-primary"
                          />
                        )}
                      </Card>
                      {i < CANVAS_NODES.length - 1 && (
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
          <ScrollArea className="h-full">
            {logs.map((log) => (
              <p
                key={log.id}
                className={cn(
                  log.type === "error" && "text-rose-500",
                  log.type === "ok" && "text-emerald-400",
                  log.type === "exec" && "text-blue-400",
                )}
              >
                {log.content}
              </p>
            ))}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
