"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Play,
  Pause,
  Trash2,
  Bot,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  BarChart3,
  RefreshCw,
  Search,
  Terminal,
  Network,
  Shield,
  Cpu,
  Workflow,
  Database,
  Globe,
  Filter,
  MoreHorizontal,
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
  result?: string;
}

interface AutonomousTask {
  id: string;
  name: string;
  goal: string;
  agent: string;
  status: "running" | "completed" | "paused" | "failed";
  progress: number;
  steps: TaskStep[];
  startedAt: Date;
}

const TASK_TEMPLATES = [
  { id: "scrape", name: "Recursive Web Scraper", icon: Globe, agent: "Newton" },
  { id: "monitor", name: "Market Monitor", icon: BarChart3, agent: "Vanguard" },
  { id: "audit", name: "Security Audit", icon: Shield, agent: "Cipher" },
  { id: "seo", name: "SEO Reporter", icon: Target, agent: "Newton" },
];

export function AutonomousTasks() {
  const [tasks, setTasks] = useState<AutonomousTask[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setPrompt] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  const selected = tasks.find((t) => t.id === selectedId);

  const deployTask = async () => {
    if (!input.trim() || isDeploying) return;
    setIsDeploying(true);

    const newTask: AutonomousTask = {
      id: Math.random().toString(),
      name: input.slice(0, 30) + "...",
      goal: input,
      agent: "Logic Core 4",
      status: "running",
      progress: 0,
      startedAt: new Date(),
      steps: [
        { id: "1", name: "Neural Intent Decomposition", status: "pending" },
        { id: "2", name: "Knowledge Graph Retrieval", status: "pending" },
        { id: "3", name: "Sub-task Orchestration", status: "pending" },
        { id: "4", name: "Signal Synthesis", status: "pending" },
      ],
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedId(newTask.id);
    setPrompt("");

    // Simulation of autonomous step-by-step logic
    for (const step of newTask.steps) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === newTask.id
            ? {
                ...t,
                steps: t.steps.map((s) =>
                  s.id === step.id ? { ...s, status: "running" } : s,
                ),
              }
            : t,
        ),
      );

      await new Promise((r) => setTimeout(r, 1500));

      setTasks((prev) =>
        prev.map((t) =>
          t.id === newTask.id
            ? {
                ...t,
                progress: t.progress + 25,
                steps: t.steps.map((s) =>
                  s.id === step.id
                    ? { ...s, status: "success", result: "Verified" }
                    : s,
                ),
              }
            : t,
        ),
      );
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === newTask.id ? { ...t, status: "completed" } : t,
      ),
    );
    setIsDeploying(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 bg-background">
      {/* Task Matrix */}
      <Card className="lg:w-[380px] flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden">
        <div className="p-6 border-b bg-muted/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
              <Bot size={20} className="text-primary-foreground -rotate-3" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">
                Autonomous Matrix
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                Task Queue Online
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Assign complex goal to the hive..."
              className="min-h-[100px] rounded-2xl border-2 bg-background focus-visible:ring-primary/20 resize-none text-sm font-medium"
              value={input}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/10"
              onClick={deployTask}
              disabled={!input.trim() || isDeploying}
            >
              {isDeploying ? (
                <Loader2 size={18} className="animate-spin mr-2" />
              ) : (
                <Sparkles size={18} className="mr-2" />
              )}
              Deploy Goal
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-2 px-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Telemetry Archive
              </h4>
              <Badge variant="outline" className="text-[8px] font-black">
                {tasks.length} ACTIVE
              </Badge>
            </div>
            {tasks.map((t) => (
              <motion.div
                key={t.id}
                layout
                onClick={() => setSelectedId(t.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                  selectedId === t.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-card border-transparent hover:border-primary/20",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-black text-xs uppercase tracking-tight truncate flex-1 mr-2">
                    {t.name}
                  </h5>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[8px] font-black uppercase h-4 px-1.5",
                      t.status === "running"
                        ? "animate-pulse bg-primary/20 text-primary border-primary/20"
                        : "",
                    )}
                  >
                    {t.status}
                  </Badge>
                </div>
                <Progress
                  value={t.progress}
                  className="h-1 rounded-full bg-muted border-none overflow-hidden"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    {t.progress}% Sync
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-muted-foreground/40" />
                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                      {t.startedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Detail Console */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <Card className="flex-1 border-2 border-primary/5 rounded-[2.5rem] shadow-2xl bg-muted/5 relative overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="px-8 py-6 border-b bg-background/40 backdrop-blur-xl flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase leading-none">
                    {selected.name}
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
                    Agent: {selected.agent}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                  >
                    <Pause />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10 text-rose-500 hover:bg-rose-500/10"
                    onClick={() => {
                      setTasks((prev) =>
                        prev.filter((t) => t.id !== selectedId),
                      );
                      setSelectedId(null);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-8 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      label: "Sync Status",
                      val: `${selected.progress}%`,
                      icon: Target,
                      color: "text-primary",
                    },
                    {
                      label: "Neural Relay",
                      val: selected.agent,
                      icon: Network,
                      color: "text-emerald-500",
                    },
                    {
                      label: "Goal Latency",
                      val: "14ms",
                      icon: Zap,
                      color: "text-amber-500",
                    },
                    {
                      label: "Process Load",
                      val: "4.2%",
                      icon: BarChart3,
                      color: "text-blue-500",
                    },
                  ].map((stat, i) => (
                    <Card
                      key={i}
                      className="p-4 rounded-2xl border-2 border-primary/5 bg-card/50 flex flex-col items-center text-center gap-2"
                    >
                      <stat.icon size={18} className={stat.color} />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-sm font-black tracking-tight">
                          {stat.val}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <Workflow size={16} className="text-primary" />
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Autonomous Execution Path
                    </h4>
                  </div>
                  {selected.steps.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={cn(
                        "p-5 rounded-2xl border-2 flex items-center gap-5 transition-all shadow-sm",
                        step.status === "success"
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : step.status === "running"
                            ? "bg-primary/5 border-primary border-dashed animate-pulse"
                            : "bg-card border-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs",
                          step.status === "success"
                            ? "bg-emerald-500 text-white"
                            : step.status === "running"
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground/40",
                        )}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6
                          className={cn(
                            "text-sm font-black uppercase tracking-tight",
                            step.status === "pending" ? "opacity-30" : "",
                          )}
                        >
                          {step.name}
                        </h6>
                        {step.result && (
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            Output: {step.result}
                          </p>
                        )}
                      </div>
                      {step.status === "success" && (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      )}
                      {step.status === "running" && (
                        <Loader2
                          size={20}
                          className="text-primary animate-spin"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-20 px-10 text-center">
              <Bot size={64} />
              <div className="space-y-1">
                <p className="font-black uppercase tracking-[0.3em] text-xs">
                  Hive Mind Idle
                </p>
                <p className="text-xs font-medium max-w-[240px]">
                  Transmit a high-level goal from the mission control panel to
                  begin orchestration.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Neural Log */}
        <Card className="h-[180px] border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden bg-zinc-950 flex flex-col">
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">
                Execution Telemetry
              </span>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 font-mono text-[10px] leading-relaxed">
            <div className="space-y-1">
              <p className="text-emerald-500/40">
                [BOOT] Autonomous Engine v2.0 stabilised...
              </p>
              {selected?.status === "running" && (
                <div className="text-emerald-500 space-y-1">
                  <p>[INFO] Mounting goal: {selected.name.toUpperCase()}</p>
                  <p>
                    [EXEC] Sub-step verification: Step{" "}
                    {selected.steps.findIndex((s) => s.status === "running") +
                      1}
                  </p>
                </div>
              )}
              {!selected && (
                <p className="text-white/10">
                  [IDLE] Awaiting telemetry signal.
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
