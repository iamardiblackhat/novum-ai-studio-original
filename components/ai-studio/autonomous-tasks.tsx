"use client";

import { useState } from "react";
import {
  Bot,
  Zap,
  CheckCircle2,
  Loader2,
  Target,
  BarChart3,
  Network,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TaskStep {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "error";
}

interface AutonomousTask {
  id: string;
  name: string;
  agent: string;
  status: "running" | "completed" | "paused" | "failed";
  progress: number;
  steps: TaskStep[];
  startedAt: Date;
}

export function AutonomousTasks() {
  const [tasks, setTasks] = useState<AutonomousTask[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [stats] = useState({
    lag: Math.floor(Math.random() * 20 + 5),
    load: (Math.random() * 8).toFixed(1),
  });

  const selected = tasks.find((t) => t.id === selectedId);

  const deployTask = async () => {
    if (!input.trim() || isDeploying) return;
    setIsDeploying(true);

    const taskId = Math.random().toString();
    const newTask: AutonomousTask = {
      id: taskId,
      name: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
      agent: "Logic Core 5.1",
      status: "running",
      progress: 0,
      startedAt: new Date(),
      steps: [{ id: "1", name: "Decomposing Objective", status: "running" }],
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedId(taskId);
    const currentInput = input;
    setInput("");

    try {
      // 1. Decompose the task using AI
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a task decomposition engine. Breakdown the user goal into 4 logical, sequential sub-tasks. Return ONLY a JSON array of strings.",
            },
            { role: "user", content: currentInput },
          ],
          model: "openai-large",
        }),
      });

      if (!res.ok) throw new Error("Decomposition failed");
      const data = await res.json();
      let stepNames: string[] = [];
      try {
        stepNames = JSON.parse(data.content.match(/\[[\s\S]*\]/)?.[0] || "[]");
      } catch (e) {
        stepNames = [
          "Analysis",
          "Implementation",
          "Verification",
          "Finalization",
        ];
      }

      if (stepNames.length === 0)
        stepNames = ["Step 1", "Step 2", "Step 3", "Step 4"];

      const steps: TaskStep[] = stepNames.map((name: string, i: number) => ({
        id: (i + 1).toString(),
        name,
        status: "pending" as const,
      }));

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, steps } : t)),
      );

      // 2. Execute each step
      for (let i = 0; i < steps.length; i++) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  steps: t.steps.map((s, idx) =>
                    idx === i ? { ...s, status: "running" } : s,
                  ),
                }
              : t,
          ),
        );

        // Simulate real work with a shorter delay but real AI call
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are an autonomous agent executing a sub-task. Confirm completion briefly.",
              },
              {
                role: "user",
                content: `Execute sub-task: ${steps[i].name} for goal: ${currentInput}`,
              },
            ],
            model: "openai-large",
          }),
        });

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  progress: Math.round(((i + 1) / steps.length) * 100),
                  steps: t.steps.map((s, idx) =>
                    idx === i ? { ...s, status: "success" } : s,
                  ),
                }
              : t,
          ),
        );
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)),
      );
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "failed" } : t)),
      );
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 bg-background">
      {/* Sidebar */}
      <Card className="lg:w-[320px] flex flex-col border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30 space-y-4">
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Task Matrix
            </span>
          </div>
          <Textarea
            placeholder="Define autonomous goal..."
            className="min-h-[80px] text-xs font-medium border-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            className="w-full h-10 font-bold uppercase text-[10px] shadow-sm"
            onClick={deployTask}
            disabled={!input.trim() || isDeploying}
            aria-label="Deploy task"
          >
            {isDeploying ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : (
              <Zap size={14} className="mr-2" />
            )}
            Deploy Task
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[9px] font-bold uppercase opacity-40 tracking-widest">
                Active Jobs
              </span>
              <Badge variant="outline" className="text-[7px] font-black">
                {tasks.length}
              </Badge>
            </div>
            {tasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={cn(
                  "w-full p-3 rounded border transition-all cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selectedId === t.id
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-transparent hover:bg-muted/50",
                )}
                aria-label={`Select task ${t.name}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-[10px] font-bold uppercase truncate flex-1 mr-2">
                    {t.name}
                  </h4>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[7px] font-bold uppercase h-3.5 px-1",
                      t.status === "running" && "animate-pulse",
                    )}
                  >
                    {t.status}
                  </Badge>
                </div>
                <Progress value={t.progress} className="h-0.5" />
                <div className="flex justify-between mt-2">
                  <span className="text-[7px] font-bold opacity-40 uppercase tracking-widest">
                    {t.progress}% Sync
                  </span>
                  <span className="text-[7px] font-bold opacity-40">
                    {t.startedAt.toLocaleTimeString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Console */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <Card className="flex-1 border bg-muted/5 shadow-inner relative flex flex-col overflow-hidden">
          {selected ? (
            <>
              <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">
                    {selected.name}
                  </h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                    Core: {selected.agent}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500"
                    onClick={() => {
                      setTasks((prev) =>
                        prev.filter((t) => t.id !== selectedId),
                      );
                      setSelectedId(null);
                    }}
                    aria-label="Terminate task"
                  >
                    <Trash2 size={14} /> Terminate
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-auto">
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {[
                    {
                      label: "Sync",
                      val: `${selected.progress}%`,
                      icon: Target,
                    },
                    { label: "Core", val: selected.agent, icon: Network },
                    { label: "Lag", val: `${stats.lag}ms`, icon: Zap },
                    { label: "Load", val: `${stats.load}%`, icon: BarChart3 },
                  ].map((s) => (
                    <Card
                      key={s.label}
                      className="p-3 border bg-background shadow-sm flex flex-col items-center gap-1"
                    >
                      <s.icon size={12} className="text-primary" />
                      <p className="text-[7px] font-bold uppercase opacity-40">
                        {s.label}
                      </p>
                      <p className="text-[10px] font-bold uppercase">{s.val}</p>
                    </Card>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 ml-1">
                    Execution Pipeline
                  </span>
                  {selected.steps.map((s, idx) => (
                    <div
                      key={s.id}
                      className={cn(
                        "p-4 rounded border flex items-center gap-4 bg-background transition-all",
                        s.status === "running" && "border-primary/50 shadow-sm",
                      )}
                    >
                      <div
                        className={cn(
                          "h-6 w-6 rounded flex items-center justify-center font-bold text-[10px]",
                          s.status === "success"
                            ? "bg-emerald-500 text-white"
                            : s.status === "running"
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground/40",
                        )}
                      >
                        {idx + 1}
                      </div>
                      <p
                        className={cn(
                          "text-[11px] font-bold uppercase flex-1",
                          s.status === "pending" && "opacity-20",
                        )}
                      >
                        {s.name}
                      </p>
                      {s.status === "success" && (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      )}
                      {s.status === "running" && (
                        <Loader2
                          size={14}
                          className="animate-spin text-primary"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10 uppercase font-black text-[10px] tracking-[0.4em]">
              Awaiting Mission Data
            </div>
          )}
        </Card>

        {/* Telemetry */}
        <Card className="h-[120px] border bg-zinc-950 p-4 font-mono text-[10px] text-emerald-500/60 leading-relaxed overflow-hidden">
          <p>
            [SYSTEM] Autonomous hive v{(Math.random() * 2 + 2).toFixed(1)}{" "}
            online.
          </p>
          {selected?.status === "running" && (
            <p className="text-blue-400 animate-pulse">
              [EXEC] Partitioning objective: {selected.name.toUpperCase()}
            </p>
          )}
          <p className="opacity-20">[IDLE] Connected to global relay.</p>
        </Card>
      </div>
    </div>
  );
}
