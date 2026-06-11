"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  Settings,
  ChevronDown,
  Plus,
  Sparkles,
  Bot,
  User,
  Key,
  Loader2,
  X,
  Command,
  Cpu,
  Zap,
  FileText,
  RefreshCw,
  Maximize2,
  Mic,
  MicOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface Model {
  id: string;
  name: string;
  provider: string;
  badge?: string;
  requiresKey?: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: { type: string; url: string; name: string }[];
  generatedContent?: {
    type: "image" | "video" | "audio" | "code";
    url?: string;
    code?: string;
  };
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  models: Model[];
  defaultModel?: string;
  placeholder?: string;
  systemPrompt?: string;
  showAttachments?: boolean;
  apiEndpoint?: "chat" | "image" | "audio" | "music" | "video";
  welcomeTitle?: string;
  welcomeDescription?: string;
  suggestedPrompts?: string[];
  children?: React.ReactNode;
}

export function ChatInterface({
  models,
  defaultModel,
  placeholder = "Type your command...",
  showAttachments = true,
  apiEndpoint = "chat",
  welcomeTitle = "AI Command Console",
  welcomeDescription = "Production interface for high-performance neural model orchestration.",
  suggestedPrompts = [],
  children,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    defaultModel || models[0]?.id || "openai/gpt-5-turbo",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load keys from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("novum-api-keys");
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored keys");
      }
    }
  }, []);

  // Save keys to local storage when they change
  useEffect(() => {
    localStorage.setItem("novum-api-keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  const currentModel = models.find((m) => m.id === selectedModel);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Speech to Text Logic
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput((prev) => prev + transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("STT failure:", err);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() && pendingAttachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      attachments: pendingAttachments.map((f) => ({
        type: f.type,
        url: URL.createObjectURL(f),
        name: f.name,
      })),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setPendingAttachments([]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:
            apiEndpoint === "chat"
              ? [
                  ...messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                  })),
                  { role: "user", content: currentInput },
                ]
              : undefined,
          prompt:
            apiEndpoint !== "chat" && apiEndpoint !== "audio"
              ? currentInput
              : undefined,
          text: apiEndpoint === "audio" ? currentInput : undefined,
          model: selectedModel,
          apiKeys,
        }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            apiEndpoint === "chat"
              ? data.content
              : `Task completed: ${currentInput}`,
          generatedContent:
            apiEndpoint !== "chat"
              ? { type: apiEndpoint as any, url: data.url }
              : undefined,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Error: ${err.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-4">
      <div className="flex flex-[1.5] flex-col min-w-0 bg-background border rounded-lg overflow-hidden relative shadow-sm">
        {/* Header */}
        <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-primary" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 font-bold text-xs uppercase"
                >
                  {currentModel?.name || "Select Model"}{" "}
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground">
                  Neural Engines
                </DropdownMenuLabel>
                {models.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className="text-xs"
                  >
                    {m.name}{" "}
                    {m.badge && (
                      <Badge variant="outline" className="ml-auto text-[8px]">
                        {m.badge}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowApiKeyDialog(true)}
                  className="text-xs"
                >
                  <Key size={14} className="mr-2" /> API Keys
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages([])}
            className="h-8 w-8"
            title="Clear Chat"
          >
            <RefreshCw size={14} />
          </Button>
        </div>

        {/* Chat Feed */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-bold">{welcomeTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {welcomeDescription}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-md mx-auto px-4">
                  {suggestedPrompts.map((p, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-[10px] font-medium justify-start h-auto py-2 px-3"
                      onClick={() => setInput(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3",
                  m.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <Avatar className="h-8 w-8 border shrink-0">
                  <AvatarFallback className="text-[10px] font-bold">
                    {m.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm font-medium",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card",
                    )}
                  >
                    {m.attachments?.map((att, i) => (
                      <div
                        key={i}
                        className="mb-2 rounded border overflow-hidden"
                      >
                        {att.type.startsWith("image") ? (
                          <img
                            src={att.url}
                            alt={att.name}
                            className="max-w-full h-auto"
                          />
                        ) : (
                          <div className="p-2 text-[10px] bg-muted">
                            {att.name}
                          </div>
                        )}
                      </div>
                    ))}
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.generatedContent && (
                      <div className="mt-2 rounded border bg-black overflow-hidden">
                        {m.generatedContent.type === "image" ? (
                          <img
                            src={m.generatedContent.url}
                            alt="Generated asset"
                            className="max-w-full h-auto"
                          />
                        ) : (
                          <audio
                            controls
                            src={m.generatedContent.url}
                            className="w-full h-8 scale-90"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">
                    {m.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-[10px] font-bold uppercase animate-pulse text-primary px-10">
                Processing signal...
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t bg-muted/20">
          <div className="relative border rounded-lg bg-background shadow-inner">
            <textarea
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full min-h-[60px] p-3 text-xs font-medium outline-none resize-none bg-transparent pr-32"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={cn(
                  "h-8 w-8",
                  isListening && "text-rose-500 bg-rose-500/10",
                )}
                title="Voice Input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </Button>
              {showAttachments && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8"
                  title="Attach Files"
                >
                  <Paperclip size={16} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) =>
                      e.target.files &&
                      setPendingAttachments((prev) => [
                        ...prev,
                        ...Array.from(e.target.files!),
                      ])
                    }
                  />
                </Button>
              )}
              <Button
                size="icon"
                onClick={handleSend}
                disabled={
                  isLoading ||
                  (!input.trim() && pendingAttachments.length === 0)
                }
                className="h-8 w-8 shadow-sm"
                title="Send Command"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {children && (
        <div className="flex-1 lg:max-w-sm flex flex-col gap-4">{children}</div>
      )}

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="uppercase font-bold tracking-tight">
              API Configuration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {[
              "openrouter",
              "openai",
              "anthropic",
              "google",
              "groq",
              "replicate",
              "elevenlabs",
              "stability",
              "runway",
            ].map((p) => (
              <div key={p} className="space-y-1">
                <Label className="text-[10px] font-bold uppercase">
                  {p} Key
                </Label>
                <Input
                  type="password"
                  value={apiKeys[p] || ""}
                  onChange={(e) =>
                    setApiKeys((prev) => ({ ...prev, [p]: e.target.value }))
                  }
                  className="h-9 text-xs"
                />
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-6 uppercase font-bold"
            onClick={() => setShowApiKeyDialog(false)}
          >
            Synchronize
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
