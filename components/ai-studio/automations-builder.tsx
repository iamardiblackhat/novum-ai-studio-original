"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Play,
  Plus,
  Search,
  ChevronRight,
  Zap,
  Brain,
  GitBranch,
  Clock,
  Filter,
  Network,
  Database,
  Mail,
  MessageSquare,
  Globe,
  Shield,
  Cpu,
  Activity,
  Terminal,
  Save,
  Settings2,
  MoreHorizontal,
  Layers,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepType = "trigger" | "ai" | "tool" | "condition";

interface WorkflowStep {
  id: string;
  type: StepType;
  name: string;
  description: string;
  status: "idle" | "running" | "success" | "error";
  icon: any;
}

interface AutomationTemplate {
  id: string;
  title: string;
  description: string;
  category: "Operations" | "Growth" | "Security" | "Dev";
  steps: WorkflowStep[];
}

// ─── Real 2026 High-Value Workflows ──────────────────────────────────────────

const REAL_TEMPLATES: AutomationTemplate[] = [
  {
    id: "rag-responder",
    title: "RAG-Powered Email Responder",
    description:
      "IMAP Trigger → Qdrant Vector Search → DeepSeek Draft → Human Audit",
    category: "Operations",
    steps: [
      {
        id: "s1",
        type: "trigger",
        name: "IMAP Inbound",
        description: "Monitor high-priority inbox",
        status: "idle",
        icon: Mail,
      },
      {
        id: "s2",
        type: "tool",
        name: "Vector Context",
        description: "Query RAG knowledge base",
        status: "idle",
        icon: Database,
      },
      {
        id: "s3",
        type: "ai",
        name: "Synthesis Agent",
        description: "Generate contextual response",
        status: "idle",
        icon: Brain,
      },
      {
        id: "s4",
        type: "tool",
        name: "Draft Notification",
        description: "Push to Slack for approval",
        status: "idle",
        icon: Network,
      },
    ],
  },
  {
    id: "lead-enrich",
    title: "AI Lead Enrichment Engine",
    description: "Webhook → Apollo Enrich → ICP Scoring → CRM Distribution",
    category: "Growth",
    steps: [
      {
        id: "l1",
        type: "trigger",
        name: "Form Submission",
        description: "Inbound lead webhook",
        status: "idle",
        icon: Zap,
      },
      {
        id: "l2",
        type: "tool",
        name: "Data Enrichment",
        description: "Apollo/Clearbit lookup",
        status: "idle",
        icon: Globe,
      },
      {
        id: "l3",
        type: "ai",
        name: "ICP Scoring",
        description: "Evaluate lead potential",
        status: "idle",
        icon: Cpu,
      },
      {
        id: "l4",
        type: "tool",
        name: "CRM Pipeline",
        description: "Auto-assign & Push to CRM",
        status: "idle",
        icon: Layers,
      },
    ],
  },
  {
    id: "content-agent",
    title: "Multi-Agent Content Repurposer",
    description: "YouTube Link → Transcript Synthesis → Thread/Post Generation",
    category: "Operations",
    steps: [
      {
        id: "c1",
        type: "trigger",
        name: "Media Trigger",
        description: "Inbound video/audio URL",
        status: "idle",
        icon: Globe,
      },
      {
        id: "c2",
        type: "ai",
        name: "Logic Partitioning",
        description: "Break down core arguments",
        status: "idle",
        icon: Database,
      },
      {
        id: "c3",
        type: "ai",
        name: "Social Formatting",
        description: "Multi-platform rewrite",
        status: "idle",
        icon: Bot,
      },
      {
        id: "c4",
        type: "tool",
        name: "Publishing Queue",
        description: "Schedule to buffer/Hypefury",
        status: "idle",
        icon: Save,
      },
    ],
  },
];

export function AutomationsBuilder() {
  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<AutomationTemplate | null>(REAL_TEMPLATES[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const handleDeploy = async () => {
    if (!selectedTemplate || isExecuting) return;
    setIsExecuting(true);

    // Step-by-step orchestration animation
    for (const step of selectedTemplate.steps) {
      setActiveStep(step.id);
      setSelectedTemplate((prev) =>
        prev
          ? {
              ...prev,
              steps: prev.steps.map((s) =>
                s.id === step.id ? { ...s, status: "running" } : s,
              ),
            }
          : null,
      );

      await new Promise((r) => setTimeout(r, 1000));

      setSelectedTemplate((prev) =>
        prev
          ? {
              ...prev,
              steps: prev.steps.map((s) =>
                s.id === step.id ? { ...s, status: "success" } : s,
              ),
            }
          : null,
      );
    }

    setIsExecuting(false);
    setActiveStep(null);
  };

  const resetWorkflow = (template: AutomationTemplate) => {
    setSelectedTemplate({
      ...template,
      steps: template.steps.map((s) => ({ ...s, status: "idle" })),
    });
    setIsExecuting(false);
    setActiveStep(null);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 bg-background">
      {/* Configuration Hub */}
      <Card className="lg:w-[360px] flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden">
        <div className="p-6 border-b bg-muted/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
              <Zap size={20} className="text-primary-foreground -rotate-3" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">
                Automation Hub
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  Logic Architect
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Synthesis Instructions
              </Label>
              <Textarea
                placeholder="Describe a new agentic pipeline..."
                className="min-h-[100px] rounded-2xl border-2 bg-background focus-visible:ring-primary/20 resize-none text-sm font-medium"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/10"
              disabled={!prompt.trim()}
            >
              Forge Automation
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2 ml-2">
              Neural Templates
            </h4>
            {REAL_TEMPLATES.map((t) => (
              <motion.div
                key={t.id}
                layout
                onClick={() => resetWorkflow(t)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                  selectedTemplate?.id === t.id
                    ? "bg-primary/5 border-primary"
                    : "bg-card border-transparent hover:border-primary/20",
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <Badge
                    variant="outline"
                    className="text-[8px] font-black uppercase h-4 px-1.5"
                  >
                    {t.category}
                  </Badge>
                </div>
                <h5 className="font-black text-xs uppercase tracking-tight truncate">
                  {t.title}
                </h5>
                <p className="text-[10px] font-medium text-muted-foreground line-clamp-1 mt-1">
                  {t.description}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Logic Canvas */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <Card className="flex-1 border-2 border-primary/5 rounded-[2.5rem] shadow-2xl bg-muted/5 relative overflow-hidden flex flex-col">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {selectedTemplate ? (
            <>
              <div className="px-8 py-6 border-b bg-background/40 backdrop-blur-xl flex items-center justify-between z-20">
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase leading-none">
                    {selectedTemplate.title}
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
                    Active Architecture v2.0.4
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-11 w-11"
                  >
                    <Settings2 />
                  </Button>
                  <Button
                    className="rounded-xl h-11 px-8 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                    onClick={handleDeploy}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    ) : (
                      <Play size={18} className="mr-2" fill="currentColor" />
                    )}
                    Deploy Logic
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-10 flex flex-col items-center justify-center relative overflow-auto">
                <div className="flex flex-col items-center gap-12 relative z-10 w-full max-w-md">
                  {selectedTemplate.steps.map((step, idx) => (
                    <motion.div
                      key={step.id}
                      className="relative w-full"
                      animate={
                        activeStep === step.id ? { scale: 1.02 } : { scale: 1 }
                      }
                    >
                      <Card
                        className={cn(
                          "p-5 rounded-[1.75rem] border-2 transition-all flex items-center gap-4 relative z-10",
                          step.status === "running"
                            ? "border-primary bg-primary/5 shadow-2xl"
                            : step.status === "success"
                              ? "border-emerald-500/50 bg-emerald-500/5"
                              : "bg-card border-primary/5 shadow-xl",
                        )}
                      >
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center shadow-inner transition-colors",
                            step.status === "running"
                              ? "bg-primary text-primary-foreground"
                              : step.status === "success"
                                ? "bg-emerald-500 text-white"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          <step.icon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                            {step.type}
                          </p>
                          <h6 className="text-sm font-black uppercase tracking-tight truncate">
                            {step.name}
                          </h6>
                        </div>
                        {step.status === "success" && (
                          <CheckCircle2
                            size={20}
                            className="text-emerald-500"
                          />
                        )}
                        {step.status === "running" && (
                          <Loader2
                            size={20}
                            className="text-primary animate-spin"
                          />
                        )}
                      </Card>

                      {idx < selectedTemplate.steps.length - 1 && (
                        <div className="absolute left-1/2 top-full h-12 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/20 to-transparent">
                          <motion.div
                            initial={{ top: 0 }}
                            animate={isExecuting ? { top: "100%" } : { top: 0 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary blur-[2px]"
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
              <Zap size={64} />
              <p className="font-black uppercase tracking-[0.3em] text-xs">
                Architectural Voids Detected
              </p>
            </div>
          )}
        </Card>

        {/* Console */}
        <Card className="h-[180px] border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden bg-zinc-950 flex flex-col">
          <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                Dispatcher Console
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[8px] font-black uppercase text-primary border-primary/20"
            >
              Live Stream
            </Badge>
          </div>
          <ScrollArea className="flex-1 p-4 font-mono text-[10px] leading-relaxed">
            <div className="space-y-1">
              <p className="text-primary/40">
                [BOOT] Novum Orchestrator initialised...
              </p>
              {isExecuting && (
                <div className="space-y-1 text-emerald-500">
                  <p>[EXEC] Mounting logic signature: {selectedTemplate?.id}</p>
                  <p>
                    [INFO] Establishing neural link with relay {activeStep}...
                  </p>
                  <p>[WARN] Handling token pressure in synthesis agent...</p>
                </div>
              )}
              {!isExecuting && (
                <p className="text-white/20">
                  [IDLE] Awaiting deployment signal.
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
