"use client";

import { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Globe,
  Eye,
  Braces,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatInterface, Model } from "./chat-interface";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const webModels: Model[] = [
  // Real OpenRouter models (require key for access; free tiers available on some via :free suffix)
  { id: "qwen/qwen-3.5-72b-chat", name: "Qwen 3.5 72B", provider: "openrouter", badge: "Elite", requiresKey: true },
  { id: "openai/gpt-5-turbo", name: "GPT-5 Turbo", provider: "openrouter", badge: "Fast", requiresKey: true },
  { id: "anthropic/claude-4-sonnet", name: "Claude 4 Sonnet", provider: "openrouter", badge: "Pro", requiresKey: true },
  // Prefer free tiers when key present
  { id: "google/gemma-4-26b-a4b-it:free", name: "Gemma 4 26B (Free Tier)", provider: "openrouter", badge: "Free", requiresKey: true },
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
      defaultModel="qwen/qwen-3.5-72b-chat"
      placeholder="Describe the web architecture to forge..."
      welcomeTitle="Web Engineering Forge"
      welcomeDescription="Production-grade semantic codebase generation for modern web architectures."
      showAttachments={false}
      apiEndpoint="chat"
      systemPrompt="You are a senior web engineer. When asked to create a website or component, provide ONLY the complete, self-contained HTML/CSS/JS code. Use modern, responsive design and Vanilla CSS/JS. Do not include explanations, just the code inside a single HTML file."
      onResponse={(data) => {
        if (data.content) {
          // Extract code from markdown if present
          let code = data.content;
          const match =
            code.match(/```html\s*([\s\S]*?)```/) ||
            code.match(/```([\s\S]*?)```/);
          if (match) code = match[1];
          setGeneratedCode(code.trim());
          setActiveTab("preview");
        }
      }}
    >
      <Card className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary border">
              <Globe size={14} />
            </div>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "preview" | "code")}
              className="h-8"
            >
              <TabsList className="h-8 p-1">
                <TabsTrigger
                  value="preview"
                  className="text-[10px] font-bold uppercase px-3"
                >
                  <Eye size={12} className="mr-1.5" /> Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="text-[10px] font-bold uppercase px-3"
                >
                  <Braces size={12} className="mr-1.5" /> Source
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-background border rounded p-0.5">
              {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
                <Button
                  key={`vp-${v}`}
                  variant={viewport === v ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewport(v)}
                  aria-label={`${v} view`}
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 disabled:opacity-30"
              disabled={!generatedCode}
              onClick={() => {
                const blob = new Blob([generatedCode], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "forge-export.html";
                a.click();
              }}
              aria-label="Download Source"
            >
              <Download size={14} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-muted/5">
          {activeTab === "preview" ? (
            <div className="h-full p-4 flex justify-center overflow-auto">
              {generatedCode ? (
                <div
                  className="h-full bg-white rounded border shadow-sm transition-all"
                  style={{ width: viewportWidths[viewport] }}
                >
                  <iframe
                    srcDoc={generatedCode}
                    className="h-full w-full border-0"
                    sandbox="allow-scripts"
                    title="Output preview"
                  />
                </div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground/40">
                  <Layout size={40} strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase mt-4">
                    Awaiting Signal
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-zinc-950 p-4 font-mono text-[11px] overflow-auto text-emerald-400">
              {generatedCode ? (
                <code>{generatedCode}</code>
              ) : (
                <span className="opacity-20 uppercase font-bold text-[10px]">
                  No source generated
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </ChatInterface>
  );
}
