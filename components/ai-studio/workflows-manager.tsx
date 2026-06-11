"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Shield,
  Network,
  Workflow,
  Activity,
  Terminal,
  Share2,
  Save,
  Settings2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  type: "trigger" | "ai" | "tool" | "condition";
  name: string;
  status: "idle" | "running" | "success" | "error";
  icon: any;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: "Operations" | "Marketing" | "DevOps" | "Sales";
  steps: WorkflowStep[];
  status: "idle" | "active" | "executing";
  lastRun?: string;
  totalRuns: number;
}

const PRESET_WORKFLOWS: Workflow[] = [
  {
    id: "w1",
    name: "AI Lead Enricher",
    description: "IMAP Trigger → Apollo Enrichment → GPT Scoring → CRM Push",
    category: "Sales",
    status: "idle",
    totalRuns: 1240,
    steps: [
      {
        id: "s1",
        type: "trigger",
        name: "Email Inbound",
        status: "idle",
        icon: Mail,
      },
      {
        id: "s2",
        type: "tool",
        name: "Apollo.io Lookup",
        status: "idle",
        icon: Globe,
      },
      { id: "s3", type: "ai", name: "Lead Scoring", status: "idle", icon: Bot },
      {
        id: "s4",
        type: "tool",
        name: "HubSpot Push",
        status: "idle",
        icon: Database,
      },
    ],
  },
  {
    id: "w2",
    name: "Content Repurposer",
    description: "RSS Feed → AI Synthesis → Multi-Channel Formatting → Slack",
    category: "Marketing",
    status: "idle",
    totalRuns: 890,
    steps: [
      {
        id: "s1",
        type: "trigger",
        name: "RSS Trigger",
        status: "idle",
        icon: Zap,
      },
      {
        id: "s2",
        type: "ai",
        name: "Summarisation",
        status: "idle",
        icon: FileText,
      },
      {
        id: "s3",
        type: "ai",
        name: "Social Rewrite",
        status: "idle",
        icon: Bot,
      },
      {
        id: "s4",
        type: "tool",
        name: "Slack Alert",
        status: "idle",
        icon: Network,
      },
    ],
  },
];

export function WorkflowsManager() {
  const [workflows, setWorkflows] = useState<Workflow[]>(PRESET_WORKFLOWS);
  const [selectedId, setSelectedId] = useState<string | null>(
    PRESET_WORKFLOWS[0].id,
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const selected = workflows.find((w) => w.id === selectedId);

  const executeWorkflow = async (id: string) => {
    if (isExecuting) return;
    setIsExecuting(true);

    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) return;

    // Simulate Step-by-Step Orchestration
    for (const step of workflow.steps) {
      setActiveStep(step.id);
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                status: "executing",
                steps: w.steps.map((s) =>
                  s.id === step.id ? { ...s, status: "running" } : s,
                ),
              }
            : w,
        ),
      );

      await new Promise((r) => setTimeout(r, 1200)); // Simulation of neural latency

      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                steps: w.steps.map((s) =>
                  s.id === step.id ? { ...s, status: "success" } : s,
                ),
              }
            : w,
        ),
      );
    }

    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: "idle",
              totalRuns: w.totalRuns + 1,
              lastRun: new Date().toLocaleTimeString(),
            }
          : w,
      ),
    );
    setIsExecuting(false);
    setActiveStep(null);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 bg-background">
      {/* Registry Sidebar */}
      <Card className="lg:w-[400px] flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden">
        <div className="p-6 border-b bg-muted/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                <Workflow
                  size={20}
                  className="text-primary-foreground -rotate-3"
                />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight">
                  Logic Registry
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                    Dispatcher Active
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-xl hover:bg-primary/5"
            >
              <Plus size={20} />
            </Button>
          </div>
          <div className="relative">
            <Network className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            <Input
              placeholder="Search logic signatures..."
              className="pl-10 h-12 bg-background border-2 focus-visible:ring-primary/20 rounded-xl"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {workflows.map((wf) => (
              <motion.div
                key={wf.id}
                layout
                onClick={() => !isExecuting && setSelectedId(wf.id)}
                className={cn(
                  "p-5 rounded-[1.75rem] border-2 transition-all cursor-pointer group relative",
                  selectedId === wf.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-card border-transparent hover:border-primary/20",
                  isExecuting && selectedId !== wf.id
                    ? "opacity-40 grayscale"
                    : "",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                        {wf.category}
                      </span>
                      {wf.status === "executing" && (
                        <Badge className="h-4 px-1.5 text-[8px] font-black bg-primary animate-pulse">
                          EXECUTING
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-tight truncate">
                      {wf.name}
                    </h4>
                    <p className="text-[11px] font-medium text-muted-foreground mt-1 line-clamp-1">
                      {wf.description}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5">
                        <Activity
                          size={12}
                          className="text-muted-foreground/40"
                        />
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                          {wf.totalRuns.toLocaleString()} RUNS
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap size={12} className="text-primary/40" />
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                          {wf.steps.length} NODES
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-xl h-10 w-10 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      executeWorkflow(wf.id);
                    }}
                    disabled={isExecuting}
                  >
                    <Play size={16} fill="currentColor" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <Card className="flex-1 border-2 border-primary/5 rounded-[2.5rem] shadow-2xl bg-muted/5 relative overflow-hidden flex flex-col">
          {/* Canvas Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {selected ? (
            <>
              {/* Toolbar */}
              <div className="px-8 py-6 border-b bg-background/40 backdrop-blur-xl flex items-center justify-between z-20">
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase leading-none">
                    {selected.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[9px] font-black">
                      {selected.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Modified {selected.lastRun || "Just Now"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl h-11 px-6 font-bold border-2"
                  >
                    <Settings2 size={18} className="mr-2" /> Configure
                  </Button>
                  <Button
                    className="rounded-xl h-11 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    onClick={() => executeWorkflow(selected.id)}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    ) : (
                      <Play size={18} className="mr-2" fill="currentColor" />
                    )}
                    {isExecuting ? "Processing" : "Deploy Logic"}
                  </Button>
                </div>
              </div>

              {/* Node Graph */}
              <div className="flex-1 p-10 flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center gap-16 relative z-10 w-full max-w-md">
                  {selected.steps.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      className="relative w-full"
                      animate={
                        activeStep === step.id ? { scale: 1.05 } : { scale: 1 }
                      }
                    >
                      <Card
                        className={cn(
                          "p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 relative z-10",
                          step.status === "running"
                            ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10"
                            : step.status === "success"
                              ? "border-emerald-500/50 bg-emerald-500/5"
                              : "bg-card border-primary/5 shadow-xl",
                        )}
                      >
                        <div
                          className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors",
                            step.status === "running"
                              ? "bg-primary text-primary-foreground"
                              : step.status === "success"
                                ? "bg-emerald-500 text-white"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          <step.icon size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
                            {step.type}
                          </p>
                          <h5 className="text-lg font-black uppercase tracking-tight truncate">
                            {step.name}
                          </h5>
                        </div>
                        {step.status === "success" && (
                          <CheckCircle2
                            size={24}
                            className="text-emerald-500 mr-2"
                          />
                        )}
                        {step.status === "running" && (
                          <Loader2
                            size={24}
                            className="text-primary animate-spin mr-2"
                          />
                        )}
                      </Card>

                      {/* Connection Line */}
                      {idx < selected.steps.length - 1 && (
                        <div className="absolute left-1/2 top-full h-16 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent">
                          <motion.div
                            initial={{ top: 0 }}
                            animate={isExecuting ? { top: "100%" } : { top: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary blur-sm"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-20">
              <GitBranch size={64} />
              <div className="text-center space-y-1">
                <p className="font-black uppercase tracking-[0.3em] text-xs">
                  Neural Dispatcher Idle
                </p>
                <p className="text-sm font-medium">
                  Select a logic signature from the registry to mount.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Real-time Telemetry */}
        <Card className="h-[200px] border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden bg-zinc-950 flex flex-col">
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">
                Logic Telemetry
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-white/40 uppercase">
                  Sys.OK
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[8px] font-black text-white/40 uppercase">
                  Net.Link
                </span>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 font-mono p-4 text-[10px] leading-relaxed">
            <div className="space-y-1">
              <p className="text-emerald-500/40">
                [SYSTEM] Novum Logic Core v4.2 initialising...
              </p>
              <p className="text-emerald-500/40">
                [NETWORK] Established link with global inference relay.
              </p>
              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1"
                >
                  <p className="text-emerald-500">
                    [{new Date().toLocaleTimeString()}] Mounting instruction set
                    for {selected?.name.toUpperCase()}...
                  </p>
                  <p className="text-emerald-500">
                    [{new Date().toLocaleTimeString()}] Executing step:{" "}
                    {activeStep}...
                  </p>
                  <p className="text-blue-400">
                    [{new Date().toLocaleTimeString()}] API_CALL: routing to
                    /api/chat...
                  </p>
                </motion.div>
              )}
              <p className="text-white/20">
                [{new Date().toLocaleTimeString()}] Awaiting signal...
              </p>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
