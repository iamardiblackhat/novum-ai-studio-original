"use client";

import { useState } from "react";
import {
  Cpu,
  Shield,
  Sparkles,
  Terminal,
  Activity,
  HardDrive,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { ChatInterface, Model } from "./chat-interface";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const commandModels: Model[] = [
  {
    id: "ollama-local",
    name: "Local Sovereign Ollama (qwen3.5:4b)",
    provider: "ollama",
    badge: "0ms Local",
  },
  {
    id: "openai",
    name: "Omnelia Neural General (Free)",
    provider: "pollinations",
    badge: "Free OSS",
  },
  {
    id: "qwen-coder",
    name: "Qwen 2.5 Coder (Free)",
    provider: "pollinations",
    badge: "Code",
  },
  {
    id: "deepseek",
    name: "DeepSeek R1 Reasoning (Free)",
    provider: "pollinations",
    badge: "Reason",
  },
  {
    id: "mistral",
    name: "Mistral 4 (Free)",
    provider: "pollinations",
    badge: "Fast",
  },
  {
    id: "llama",
    name: "Llama 3.3 70B (Free)",
    provider: "pollinations",
    badge: "70B",
  },
  // Key-backed options
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B Versatile",
    provider: "groq",
    badge: "Groq",
    requiresKey: true,
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1 Pro",
    provider: "openrouter",
    badge: "Pro",
    requiresKey: true,
  },
];

export function CommandChat() {
  const [localOnline, setLocalOnline] = useState<boolean | null>(null);

  // Check Ollama status on mount
  useState(() => {
    if (typeof window !== "undefined") {
      fetch("http://127.0.0.1:11434/api/tags")
        .then((r) => setLocalOnline(r.ok))
        .catch(() => setLocalOnline(false));
    }
  });

  return (
    <ChatInterface
      models={commandModels}
      defaultModel="ollama-local"
      placeholder="Transmit instruction to Omnelia Sovereign Core..."
      welcomeTitle="Omnelia SI Neural Command Console"
      welcomeDescription="Zero-data-exfiltration sovereign communication interface. Powered by local hardware MLX/Ollama and open foundation models."
      systemPrompt="You are Omnelia SI, an advanced sovereign superintelligence and creative studio core. You provide strictly evidence-based, concise, architectural, cybersecurity, and creative directives. Zero fluff, zero generic disclaimers. Prioritize local hardware execution, privacy preservation, and sovereign control."
      suggestedPrompts={[
        "How do sovereign AI agents preserve enterprise data privacy?",
        "Draft an architectural plan for an on-premise local RAG vector pipeline",
        "Generate a cinematic prompt for Alibaba Wan 2.1 video synthesis",
        "Perform a perimeter defensive audit checklist for our API gateway",
      ]}
      apiEndpoint="chat"
    >
      <div className="flex flex-col h-full gap-4">
        {/* Right Info Rail: System Posture & Sovereign Telemetry */}
        <Card className="border border-[rgba(87,241,239,0.2)] bg-[rgba(14,18,29,0.85)] backdrop-blur-xl shadow-lg flex flex-col flex-1 overflow-hidden">
          <CardHeader className="p-4 border-b border-[rgba(87,241,239,0.12)]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-[#57f1ef] flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5" />
                Sovereign Telemetry
              </CardTitle>
              <Badge className="bg-[rgba(87,241,239,0.15)] text-[#57f1ef] border border-[rgba(87,241,239,0.3)] text-[9px] font-mono">
                Mesh v4.8
              </Badge>
            </div>
            <CardDescription className="text-[11px] text-muted-foreground mt-1">
              Active inference nodes and hardware runtime state.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 space-y-4 text-xs font-mono">
            {/* Local Hardware Node Status */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-[#57f1ef]" />
                  Local Apple Silicon Node
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {localOnline ? "ONLINE (11434)" : "STANDBY"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Model: <span className="text-white font-bold">qwen3.5:4b (Apple Silicon MLX)</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Data Boundary: <span className="text-[#57f1ef] font-bold">Local Host Only · Zero Egress</span>
              </div>
            </div>

            {/* Security Isolation Status */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#c7a0ff]" />
                  ARDI Data Containment
                </span>
                <span className="text-emerald-400 font-bold">ENFORCED</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Reverse Proxy: <span className="text-white font-bold">TLS 1.3 Strict</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Agent Memory: <span className="text-white font-bold">Volatile Local Vector Cache</span>
              </div>
            </div>

            {/* Quick Operational Directives */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tactical Capabilities</span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#57f1ef] shrink-0 mt-0.5" />
                  <span>Real-time local LLM inference with zero latency</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#57f1ef] shrink-0 mt-0.5" />
                  <span>Cross-pipeline dispatch to Wan 2.1 &amp; FLUX.2</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#57f1ef] shrink-0 mt-0.5" />
                  <span>ARDI perimeter verification &amp; code analysis</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ChatInterface>
  );
}
