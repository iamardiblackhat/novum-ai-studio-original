"use client";

import { useState } from "react";
import {
  Plus,
  Globe,
  Code2,
  Mail,
  Database,
  Search,
  Cpu,
  Terminal,
  Blocks,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  history?: {
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }[];
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
  const [logs] = useState<string[]>([
    `[SYSTEM] Neural fleet v${(Math.random() * 5 + 4).toFixed(1)} online.`,
  ]);
  const [stats] = useState({
    latency: Math.floor(Math.random() * 100 + 100),
    reliability: Math.floor(Math.random() * 5 + 95),
    load: (Math.random() * 10).toFixed(1),
  });

  const activeAgent = agents.find((a) => a.id === selectedId);

  const handleExecute = async () => {
    if (!prompt.trim() || !activeAgent) return;

    setIsExecuting(true);
    const timestamp = Date.now();
    const userMessage = { role: "user" as const, content: prompt, timestamp };
    const updatedHistory = [...(activeAgent.history || []), userMessage];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are ${activeAgent.name}, a ${activeAgent.role} agent using the ${activeAgent.framework} framework. Your available tools are ${activeAgent.tools.join(", ")}. Respond professionally and helpfully as this agent.`,
            },
            ...updatedHistory.map((h) => ({
              role: h.role,
              content: h.content,
            })),
          ],
          model: "openai-large",
        }),
      });

      if (!res.ok) throw new Error("Connection failed");
      const data = await res.json();

      const assistantMessage = {
        role: "assistant" as const,
        content: data.content,
        timestamp: Date.now(),
      };

      setAgents((prev) =>
        prev.map((a) =>
          a.id === activeAgent.id
            ? {
                ...a,
                history: [...updatedHistory, assistantMessage],
                tasks: a.tasks + 1,
              }
            : a,
        ),
      );
      setPrompt("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
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
              aria-label="Provision new agent"
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
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={cn(
                  "w-full p-3 rounded border transition-all cursor-pointer group flex items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selectedId === a.id
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-transparent hover:bg-muted/50",
                )}
                aria-label={`Select agent ${a.name}`}
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
              </button>
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
                <p className="text-[10px] font-bold">{stats.latency}ms</p>
              </div>
              <div className="p-2 rounded border bg-muted/20 text-center">
                <p className="text-[7px] font-bold uppercase opacity-40">
                  Reliability
                </p>
                <p className="text-[10px] font-bold text-emerald-500">
                  {stats.reliability}%
                </p>
              </div>
              <div className="p-2 rounded border bg-muted/20 text-center">
                <p className="text-[7px] font-bold uppercase opacity-40">
                  Load
                </p>
                <p className="text-[10px] font-bold">{stats.load}%</p>
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
                  key={`tool-${t.id}`}
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
          "p-3 rounded border transition-all cursor-pointer group flex
          items-start gap-3",{" "}
          <div className="flex-1 p-4 relative flex flex-col gap-4">
            <ScrollArea className="flex-1 border-b pb-4">
              <div className="space-y-4">
                {activeAgent?.history?.map((msg, i) => (
                  <div
                    key={`${msg.role}-${msg.timestamp}-${i}`}
                    className={cn(
                      "p-3 rounded-lg text-xs font-medium",
                      msg.role === "user"
                        ? "bg-primary/10 border ml-8"
                        : "bg-muted border mr-8",
                    )}
                  >
                    <p className="font-bold uppercase text-[8px] opacity-40 mb-1">
                      {msg.role === "user" ? "Command" : activeAgent.name}
                    </p>
                    {msg.content}
                  </div>
                ))}
                {activeAgent?.history?.length === 0 && (
                  <div className="h-full flex items-center justify-center opacity-20 uppercase font-black text-[10px] tracking-widest pt-10">
                    Awaiting Instruction
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="h-24 relative">
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
                aria-label="Agent command input"
              />
              <div className="absolute bottom-0 right-0 flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 px-4 font-bold uppercase text-[8px] shadow-sm"
                  onClick={handleExecute}
                  disabled={!prompt.trim() || isExecuting}
                  aria-label="Execute command"
                >
                  {isExecuting ? (
                    <RefreshCw size={10} className="animate-spin mr-2" />
                  ) : (
                    <Zap size={10} className="mr-2" />
                  )}
                  Execute
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-30 border bg-zinc-950 p-4 font-mono text-[10px] text-emerald-500/60 leading-relaxed overflow-hidden">
          <ScrollArea className="h-full">
            {logs.map((log, i) => (
              <p
                key={log}
                className={cn(
                  log.includes("[ERROR]") && "text-rose-500",
                  log.includes("[SUCCESS]") && "text-emerald-400",
                  log.includes("[EXEC]") && "text-blue-400",
                )}
              >
                {log}
              </p>
            ))}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
