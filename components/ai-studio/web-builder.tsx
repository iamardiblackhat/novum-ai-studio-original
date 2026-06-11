"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  ExternalLink,
  Globe,
  Zap,
  Sparkles,
  Layout,
  Eye,
  Braces,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatInterface, Model } from "./chat-interface";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const webModels: Model[] = [
  {
    id: "qwen-coder",
    name: "Qwen 2.5 Coder",
    provider: "pollinations",
    badge: "Free",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    badge: "PRO",
    requiresKey: true,
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    badge: "PRO",
    requiresKey: true,
  },
];

const suggestedPrompts = [
  "Build a neo-brutalist SaaS landing page with bold borders",
  "Create a minimal glassmorphic dark-mode portfolio",
  "Build a responsive bento-grid dashboard for an AI startup",
  "Generate a modern product detail page with an image gallery",
];

type Viewport = "desktop" | "tablet" | "mobile";

const viewportWidths: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function WebBuilder() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<Viewport>("desktop");

  return (
    <ChatInterface
      models={webModels}
      defaultModel="qwen-coder"
      placeholder="Describe the interface architecture you wish to forge..."
      welcomeTitle="Architectural Forge"
      welcomeDescription="Translate abstract conceptual designs into production-grade semantic codebases."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="chat"
    >
      <Card className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-2 border-primary/5 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-background/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Globe size={18} />
            </div>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "preview" | "code")}
            >
              <TabsList className="bg-muted/50 border h-9 p-1 rounded-lg">
                <TabsTrigger
                  value="preview"
                  className="text-[10px] font-black uppercase px-3 rounded-md"
                >
                  <Eye size={12} className="mr-1.5" /> Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="text-[10px] font-black uppercase px-3 rounded-md"
                >
                  <Braces size={12} className="mr-1.5" /> Source
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-muted/30 p-1 rounded-xl border">
              {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
                <Button
                  key={v}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-lg transition-all",
                    viewport === v
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground opacity-50 hover:opacity-100",
                  )}
                  onClick={() => setViewport(v)}
                >
                  {v === "desktop" ? (
                    <Monitor size={14} />
                  ) : v === "tablet" ? (
                    <Tablet size={14} />
                  ) : (
                    <Smartphone size={14} />
                  )}
                </Button>
              ))}
            </div>
            <div className="w-px h-4 bg-border mx-1" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-2 hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-30"
              disabled={!generatedCode}
              onClick={() => {
                const blob = new Blob([generatedCode], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "novum-forge-export.html";
                a.click();
              }}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === "preview" ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-muted/10 p-6 flex justify-center overflow-auto"
              >
                {generatedCode ? (
                  <div
                    className="h-full bg-background rounded-2xl shadow-2xl border-2 border-primary/5 transition-all duration-500 overflow-hidden"
                    style={{ width: viewportWidths[viewport] }}
                  >
                    <iframe
                      srcDoc={generatedCode}
                      className="h-full w-full border-0"
                      sandbox="allow-scripts"
                      title="Architectural Preview"
                    />
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center text-primary/20">
                      <Layout size={32} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                        Neural Visualisation Engine
                      </p>
                      <p className="text-xs font-medium text-muted-foreground/60 max-w-[180px]">
                        Synthesise designs in the chat to render visual
                        architecture.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-zinc-950 p-6 font-mono text-[11px] overflow-auto"
              >
                {generatedCode ? (
                  <pre className="text-emerald-400 leading-relaxed">
                    <code>{generatedCode}</code>
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="font-black uppercase tracking-[0.3em] text-zinc-800 text-[10px]">
                      Awaiting Core Output
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
            <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-primary/5 flex items-center gap-2 shadow-lg">
              <Zap size={10} className="text-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                Forge Online
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/10 font-black text-[9px] uppercase"
            >
              {viewport.toUpperCase()} MODE
            </Badge>
          </div>
        </div>
      </Card>
    </ChatInterface>
  );
}
