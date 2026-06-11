"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  attachmentTypes?: string[];
  apiEndpoint?: "chat" | "image" | "audio" | "music" | "video";
  welcomeTitle?: string;
  welcomeDescription?: string;
  suggestedPrompts?: string[];
  children?: React.ReactNode;
}

export function ChatInterface({
  models,
  defaultModel,
  placeholder = "Message Novum AI...",
  showAttachments = true,
  attachmentTypes = ["image", "file"],
  apiEndpoint = "chat",
  welcomeTitle = "Digital Alchemist",
  welcomeDescription = "Harness the collective intelligence of the worlds most powerful neural networks.",
  suggestedPrompts = [],
  children,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    defaultModel || models[0]?.id || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentModel = models.find((m) => m.id === selectedModel);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        });
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

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
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
        console.error("Failed to start speech recognition:", err);
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
      let responseContent = "";
      let generatedContent: Message["generatedContent"] | undefined;

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
        }),
      });

      if (!res.ok) throw new Error(`Engine Error (${res.status})`);

      if (
        apiEndpoint === "chat" ||
        apiEndpoint === "image" ||
        apiEndpoint === "music" ||
        apiEndpoint === "video"
      ) {
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        if (apiEndpoint === "chat") {
          responseContent = data.content;
        } else {
          responseContent = `Generation complete for: "${currentInput}"`;
          generatedContent = {
            type: apiEndpoint === "music" ? "audio" : (apiEndpoint as any),
            url: data.url,
          };
        }
      } else if (apiEndpoint === "audio") {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        responseContent = `Synthesized audio for: "${currentInput}"`;
        generatedContent = { type: "audio", url };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseContent,
          generatedContent,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Synthesis Failure: ${err instanceof Error ? err.message : "Unknown neural anomaly"}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6">
      <div className="flex flex-[1.5] flex-col min-w-0 bg-background/50 rounded-[2rem] border-2 border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden relative">
        <div className="px-6 py-4 border-b bg-background/80 backdrop-blur-xl flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
              <Cpu className="h-5 w-5 text-primary-foreground -rotate-3" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                      <span className="font-black tracking-tight text-sm uppercase">
                        {currentModel?.name || "Select Core"}
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-muted-foreground"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-64 rounded-2xl border-2 p-2"
                  >
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">
                      Neural Cores
                    </DropdownMenuLabel>
                    {models.map((m) => (
                      <DropdownMenuItem
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className="rounded-xl px-3 py-2 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Zap
                            size={14}
                            className={cn(
                              "transition-colors",
                              selectedModel === m.id
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-primary",
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm",
                              selectedModel === m.id
                                ? "font-bold"
                                : "font-medium",
                            )}
                          >
                            {m.name}
                          </span>
                        </div>
                        {m.badge && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-black uppercase"
                          >
                            {m.badge}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowApiKeyDialog(true)}
                      className="rounded-xl px-3 py-2"
                    >
                      <Key size={14} className="mr-2" />
                      <span className="text-sm font-medium">
                        Link API Credentials
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Core Synchronised
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMessages([])}
            className="h-10 w-10 rounded-xl hover:bg-primary/5"
          >
            <RefreshCw size={18} className="text-muted-foreground" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-6" ref={scrollRef}>
          <div className="max-w-3xl mx-auto py-10 space-y-8">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                >
                  <div className="relative">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center">
                      <Zap size={14} className="text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight">
                      {welcomeTitle}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-sm font-medium">
                      {welcomeDescription}
                    </p>
                  </div>
                  {suggestedPrompts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl px-4">
                      {suggestedPrompts.map((prompt, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="h-auto py-3 px-4 justify-start text-left text-xs font-bold rounded-2xl border-2 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                          onClick={() => setInput(prompt)}
                        >
                          <Command
                            size={14}
                            className="mr-2 text-muted-foreground group-hover:text-primary transition-colors"
                          />
                          <span className="line-clamp-1">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-4",
                      message.role === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm shrink-0 mt-1">
                      {message.role === "assistant" ? (
                        <div className="h-full w-full bg-primary flex items-center justify-center">
                          <Bot size={20} className="text-primary-foreground" />
                        </div>
                      ) : (
                        <AvatarImage src="/placeholder-user.jpg" />
                      )}
                      <AvatarFallback className="font-black text-xs">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "space-y-2 max-w-[85%]",
                        message.role === "user" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-[1.5rem] px-5 py-4 shadow-sm border-2",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground border-primary rounded-tr-none"
                            : "bg-card text-card-foreground border-primary/5 rounded-tl-none",
                        )}
                      >
                        {message.attachments?.map((att, i) => (
                          <div
                            key={i}
                            className="mb-3 rounded-xl overflow-hidden border shadow-sm"
                          >
                            {att.type.startsWith("image") ? (
                              <img
                                src={att.url}
                                className="h-32 w-32 object-cover"
                              />
                            ) : (
                              <div className="h-20 w-32 bg-muted flex flex-col items-center justify-center">
                                <FileText size={20} className="text-primary" />
                              </div>
                            )}
                          </div>
                        ))}
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.generatedContent && (
                          <div className="mt-4 rounded-2xl overflow-hidden border-2 border-primary/10 bg-black shadow-2xl relative group/media">
                            {message.generatedContent.type === "image" && (
                              <img
                                src={message.generatedContent.url}
                                className="w-full h-auto"
                              />
                            )}
                            {(message.generatedContent.type === "audio" ||
                              message.generatedContent.type === "video") && (
                              <div className="p-4">
                                <audio
                                  controls
                                  src={message.generatedContent.url}
                                  className="w-full"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase text-muted-foreground/60 px-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-[1.25rem] bg-primary flex items-center justify-center shadow-lg shadow-primary/10">
                  <Bot size={20} className="text-primary-foreground" />
                </div>
                <div className="bg-primary/5 border-2 border-primary/10 rounded-[1.5rem] rounded-tl-none px-6 py-4 flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Synthesising...
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 bg-background/50 backdrop-blur-xl border-t-2 border-primary/5 z-20">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative group">
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
                className="w-full min-h-[60px] max-h-[200px] bg-muted/30 hover:bg-muted/50 focus:bg-background border-2 border-transparent focus:border-primary/20 rounded-[1.5rem] px-5 py-4 text-sm font-medium transition-all outline-none resize-none pr-40 shadow-inner"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleListening}
                  className={cn(
                    "h-10 w-10 rounded-xl transition-all",
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "hover:bg-primary/10 text-muted-foreground",
                  )}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </Button>
                {showAttachments && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-primary/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip size={18} />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) =>
                        e.target.files &&
                        setPendingAttachments((prev) => [
                          ...prev,
                          ...Array.from(e.target.files!),
                        ])
                      }
                      className="hidden"
                      multiple
                    />
                  </Button>
                )}
                <Button
                  size="icon"
                  disabled={
                    isLoading ||
                    (!input.trim() && pendingAttachments.length === 0)
                  }
                  onClick={handleSend}
                  className="h-10 w-10 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children && (
        <div className="flex-1 lg:max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
          {children}
        </div>
      )}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="rounded-[2.5rem] border-2 shadow-2xl p-8 max-w-lg">
          <DialogHeader className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Key size={24} />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight uppercase">
              Neural Keyring
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] mt-6 pr-4">
            <div className="space-y-5">
              {[
                "openai",
                "anthropic",
                "groq",
                "openrouter",
                "replicate",
                "elevenlabs",
                "stability",
              ].map((provider) => (
                <div key={provider} className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {provider} Access Key
                  </Label>
                  <Input
                    type="password"
                    placeholder="sk-••••••••••••••••"
                    value={apiKeys[provider] || ""}
                    onChange={(e) =>
                      setApiKeys((prev) => ({
                        ...prev,
                        [provider]: e.target.value,
                      }))
                    }
                    className="h-12 rounded-xl border-2 focus-visible:ring-primary/20 bg-muted/20"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button
            className="w-full h-12 rounded-2xl font-black uppercase mt-6"
            onClick={() => setShowApiKeyDialog(false)}
          >
            Synchronise
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
