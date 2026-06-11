"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  type: "trigger" | "ai" | "tool";
  name: string;
  status: "idle" | "running" | "success";
  icon: any;
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: "Operations" | "Growth" | "Dev";
  steps: WorkflowStep[];
}

const REAL_TEMPLATES: Template[] = [
  {
    id: "rag-responder",
    title: "RAG Email Agent",
    description:
      "IMAP Trigger → Qdrant Context → GPT-5 Synthesis → Slack Audit",
    category: "Operations",
    steps: [
      {
        id: "s1",
        type: "trigger",
        name: "IMAP Inbound",
        status: "idle",
        icon: Mail,
      },
      {
        id: "s2",
        type: "tool",
        name: "Vector Lookup",
        status: "idle",
        icon: Database,
      },
      {
        id: "s3",
        type: "ai",
        name: "GPT-5 Synthesis",
        status: "idle",
        icon: Brain,
      },
      {
        id: "s4",
        type: "tool",
        name: "Slack Push",
        status: "idle",
        icon: Network,
      },
    ],
  },
  {
    id: "lead-enrich",
    title: "Lead Growth Engine",
    description:
      "Webhook → Apollo Lookup → Claude 4 Scoring → CRM Distribution",
    category: "Growth",
    steps: [
      {
        id: "l1",
        type: "trigger",
        name: "Inbound Webhook",
        status: "idle",
        icon: Zap,
      },
      {
        id: "l2",
        type: "tool",
        name: "Data Enrichment",
        status: "idle",
        icon: Globe,
      },
      {
        id: "l3",
        type: "ai",
        name: "Claude 4 Scoring",
        status: "idle",
        icon: Cpu,
      },
      {
        id: "l4",
        type: "tool",
        name: "CRM Integration",
        status: "idle",
        icon: Layers,
      },
    ],
  },
];

export function AutomationsBuilder() {
  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    REAL_TEMPLATES[0],
  );
  const [isExecuting, setIsExecuting] = useState(false);

  const handleDeploy = async () => {
    if (!selectedTemplate || isExecuting) return;
    setIsExecuting(true);
    await new Promise((r) => setTimeout(r, 4000));
    setIsExecuting(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 bg-background">
      {/* Config Hub */}
      <div className="lg:w-[320px] flex flex-col gap-4 shrink-0">
        <Card className="p-6 border bg-card shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight">
                Automation Hub
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                Logic Architect v2.0
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-[9px] font-bold uppercase opacity-60 ml-1">
                Synthesis Instructions
              </Label>
              <Textarea
                placeholder="Describe agentic pipeline..."
                className="min-h-[80px] text-xs font-medium border-2"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-10 font-bold uppercase text-[10px] shadow-sm"
              disabled={!prompt.trim()}
            >
              Forge Pipeline
            </Button>
          </div>
        </Card>

        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Neural Blueprints
              </span>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {REAL_TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={cn(
                    "p-3 rounded border transition-all cursor-pointer group",
                    selectedTemplate?.id === t.id
                      ? "bg-primary/5 border-primary/20"
                      : "bg-background border-transparent hover:bg-muted/50",
                  )}
                >
                  <Badge
                    variant="outline"
                    className="text-[7px] font-black h-3.5 px-1 uppercase mb-1"
                  >
                    {t.category}
                  </Badge>
                  <h4 className="text-[10px] font-bold uppercase truncate">
                    {t.title}
                  </h4>
                  <p className="text-[8px] font-medium text-muted-foreground line-clamp-1">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <Card className="flex-1 border bg-muted/5 shadow-inner relative flex flex-col overflow-hidden">
          {selectedTemplate ? (
            <>
              <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">
                    {selectedTemplate.title}
                  </h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                    Status: Ready
                  </p>
                </div>
                <Button
                  size="sm"
                  className="h-8 font-bold uppercase text-[9px]"
                  onClick={handleDeploy}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <Loader2 size={12} className="mr-1.5 animate-spin" />
                  ) : (
                    <Play size={12} className="mr-1.5" fill="currentColor" />
                  )}
                  Deploy Logic
                </Button>
              </div>

              <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
                <div className="flex flex-col items-center gap-12 w-full max-w-sm">
                  {selectedTemplate.steps.map((step, idx) => (
                    <div key={step.id} className="relative w-full">
                      <Card className="p-4 border bg-background shadow-sm flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                          <step.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[8px] font-bold uppercase opacity-40 tracking-widest">
                            {step.type}
                          </p>
                          <p className="text-[11px] font-bold uppercase">
                            {step.name}
                          </p>
                        </div>
                      </Card>
                      {idx < selectedTemplate.steps.length - 1 && (
                        <div className="absolute left-9 top-full h-12 w-px bg-border border-dashed" />
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
          <p>[SYSTEM] Orchestrator online.</p>
          {isExecuting && (
            <p className="text-blue-400 animate-pulse">
              [EXEC] Partitioning logic nodes...
            </p>
          )}
          <p className="opacity-20">[IDLE] Connected to global relay.</p>
        </Card>
      </div>
    </div>
  );
}
