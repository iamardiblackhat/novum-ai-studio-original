"use client";

import { useState } from "react";
import {
  Bot,
  Plus,
  Play,
  Settings,
  Trash2,
  Copy,
  MoreHorizontal,
  Globe,
  Code2,
  Mail,
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Cpu,
  Terminal,
  Share2,
  Filter,
  Activity,
  Blocks,
  Sparkles,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  role: string;
  framework: "Mastra" | "LangGraph" | "CrewAI" | "AutoGen";
  status: "active" | "idle" | "executing";
  tasks: number;
  tools: string[];
  avatar: string;
}

const PRESETS: Agent[] = [
  {
    id: "a1",
    name: "Newton",
    role: "Lead Researcher",
    framework: "LangGraph",
    status: "idle",
    tasks: 124,
    tools: ["web", "docs"],
    avatar: "N",
  },
  {
    id: "a2",
    name: "Cipher",
    role: "Senior Architect",
    framework: "Mastra",
    status: "idle",
    tasks: 89,
    tools: ["code", "db"],
    avatar: "C",
  },
  {
    id: "a3",
    name: "Vanguard",
    role: "Growth Specialist",
    framework: "CrewAI",
    status: "idle",
    tasks: 215,
    tools: ["email", "web"],
    avatar: "V",
  },
];

const TOOLS = [
  { id: "web", name: "Web Search", icon: Globe },
  { id: "code", name: "Code Exec", icon: Code2 },
  { id: "email", name: "Email SMTP", icon: Mail },
  { id: "db", name: "DB Vector", icon: Database },
];

export function AgentsManager() {
  const [agents, setAgents] = useState<Agent[]>(PRESETS);
  const [selectedId, setSelectedId] = useState<string | null>(PRESETS[0].id);
  const [isExecuting, setIsExecuting] = useState(false);
  const [prompt, setPrompt] = useState("");

  const activeAgent = agents.find((a) => a.id === selectedId);

  const handleExecute = async () => {
    if (!prompt.trim() || !activeAgent) return;
    setIsExecuting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPrompt("");
    setIsExecuting(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 bg-background">
      {/* Sidebar */}
      <Card className="lg:w-[320px] flex flex-col border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Fleet Registry
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Provision new agent"
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search neural sigs..."
              className="pl-7 h-9 text-xs border-2"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {agents.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={cn(
                  "p-3 rounded border transition-all cursor-pointer group flex items-start gap-3",
                  selectedId === a.id
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-transparent hover:bg-muted/50",
                )}
              >
                <Avatar className="h-8 w-8 border shrink-0">
                  <AvatarFallback className="text-[10px] font-bold bg-muted">
                    {a.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[11px] font-bold uppercase truncate">
                      {a.name}
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-[7px] font-black h-3.5 px-1"
                    >
                      {a.framework}
                    </Badge>
                  </div>
                  <p className="text-[9px] font-medium text-muted-foreground uppercase mt-0.5">
                    {a.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Control Console */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 border bg-card shadow-sm space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback className="text-lg font-bold">
                    {activeAgent?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">
                    {activeAgent?.name}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {activeAgent?.role}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  activeAgent?.status === "active" ? "default" : "secondary"
                }
                className="text-[8px] font-bold uppercase"
              >
                {activeAgent?.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded border bg-muted/20 text-center">
                <p className="text-[7px] font-bold uppercase opacity-40">
                  Latency
                </p>
                <p className="text-[10px] font-bold">142ms</p>
              </div>
              <div className="p-2 rounded border bg-muted/20 text-center">
                <p className="text-[7px] font-bold uppercase opacity-40">
                  Reliability
                </p>
                <p className="text-[10px] font-bold text-emerald-500">98%</p>
              </div>
              <div className="p-2 rounded border bg-muted/20 text-center">
                <p className="text-[7px] font-bold uppercase opacity-40">
                  Load
                </p>
                <p className="text-[10px] font-bold">4.2%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Blocks size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Tool Matrix
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {TOOLS.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "p-2 rounded border flex flex-col items-center gap-1 opacity-40",
                    activeAgent?.tools.includes(t.id) &&
                      "opacity-100 bg-primary/5 border-primary/20",
                  )}
                >
                  <t.icon
                    size={14}
                    className={cn(
                      activeAgent?.tools.includes(t.id) && "text-primary",
                    )}
                  />
                  <span className="text-[7px] font-bold uppercase">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="flex-1 border bg-muted/5 shadow-inner relative flex flex-col">
          <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Command Interface
              </span>
            </div>
          </div>

          <div className="flex-1 p-4 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Transmit goal to ${activeAgent?.name.toUpperCase()}...`}
              className="w-full h-full bg-transparent outline-none resize-none text-xs font-medium placeholder:opacity-20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleExecute();
                }
              }}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <Button
                size="sm"
                className="h-9 px-6 font-bold uppercase text-[9px] shadow-sm"
                onClick={handleExecute}
                disabled={!prompt.trim() || isExecuting}
              >
                {isExecuting ? (
                  <RefreshCw size={12} className="animate-spin mr-2" />
                ) : (
                  <Zap size={12} className="mr-2" />
                )}
                Execute Task
              </Button>
            </div>
          </div>
        </Card>

        <Card className="h-[120px] border bg-zinc-950 p-4 font-mono text-[10px] text-emerald-500/60 leading-relaxed overflow-hidden">
          <p>[SYSTEM] Neural fleet v4.2 online.</p>
          {isExecuting && (
            <p className="text-blue-400 animate-pulse">
              [INFO] {activeAgent?.name} executing instruction set...
            </p>
          )}
          <p className="opacity-20">[IDLE] Connected to global orchestrator.</p>
        </Card>
      </div>
    </div>
  );
}
