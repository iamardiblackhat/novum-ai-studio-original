"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Download,
  Trash2,
  Film,
  Sparkles,
  Zap,
  History,
  Maximize2,
  Layers,
  Cpu,
  Video,
  Clapperboard,
  MonitorPlay,
  ListVideo,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface, Model } from "./chat-interface";
import { cn } from "@/lib/utils";

interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  model: string;
  duration: number;
  timestamp: Date;
}

const videoModels: Model[] = [
  {
    id: "wan",
    name: "Wan 2.1 (T2V)",
    provider: "pollinations",
    badge: "Next-Gen",
  },
  {
    id: "ltx-2",
    name: "LTX Video 2",
    provider: "pollinations",
    badge: "Speed",
  },
  {
    id: "seedance-pro",
    name: "Seedance Pro",
    provider: "pollinations",
    badge: "High-Fi",
  },
  {
    id: "wan-replicate",
    name: "Wan 2.1 (Ultra)",
    provider: "replicate",
    badge: "PRO",
    requiresKey: true,
  },
];

const durationOptions = [
  { id: 4, label: "4s", desc: "Short Burst" },
  { id: 8, label: "8s", desc: "Detailed Action" },
];

const suggestedPrompts = [
  "Cinematic drone shot of a futuristic neon Tokyo under rain",
  "First-person view flying through a crystalline nebula",
  "Time-lapse of a biological computer growing in a lab",
  "Portrait of a majestic lion made of fluid golden particles",
];

export function VideoGenerator() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [duration, setDuration] = useState(4);
  const [viewMode, setViewMode] = useState<"grid" | "reel">("grid");

  const deleteVideo = (id: string) =>
    setVideos((prev) => prev.filter((v) => v.id !== id));

  return (
    <ChatInterface
      models={videoModels}
      defaultModel="wan"
      placeholder="Describe the cinematic event..."
      welcomeTitle="Neural Cinematographer"
      welcomeDescription="Synthesise full-motion temporal sequences from textual semantic intent."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="video"
    >
      <div className="flex flex-col h-full gap-6">
        {/* Render Console */}
        <Card className="p-6 border-2 border-primary/5 bg-card/30 rounded-[2rem] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Temporal Matrix
              </h3>
            </div>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase bg-primary/5 text-primary border-primary/10"
            >
              Engine Ready
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {durationOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDuration(opt.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group",
                  duration === opt.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-background border-transparent hover:border-primary/20",
                )}
              >
                <div className="relative z-10">
                  <p
                    className={cn(
                      "text-lg font-black uppercase leading-none transition-colors",
                      duration === opt.id
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-1">
                    {opt.desc}
                  </p>
                </div>
                {duration === opt.id && (
                  <Zap
                    size={40}
                    className="absolute -right-4 -bottom-4 text-primary opacity-5 rotate-12"
                  />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Cinematic Archive */}
        <Card className="flex-1 flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-2xl overflow-hidden min-h-[400px] bg-background/50 backdrop-blur-xl">
          <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Clapperboard size={18} />
              </div>
              <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-lg transition-all",
                    viewMode === "grid"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground opacity-50",
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <ListVideo size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 rounded-lg transition-all",
                    viewMode === "reel"
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground opacity-50",
                  )}
                  onClick={() => setViewMode("reel")}
                >
                  <MonitorPlay size={14} />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <History size={14} className="text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {videos.length} RENDERED
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {videos.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
                <div className="h-20 w-20 rounded-[2.5rem] bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center text-primary/20">
                  <Film size={32} />
                </div>
                <div className="text-center space-y-1 px-10">
                  <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                    Archive Empty
                  </p>
                  <p className="text-xs font-medium text-muted-foreground/60 max-w-[220px]">
                    Synthesise motion in the chat to populate the cinematic
                    archive.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "p-6 grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 lg:grid-cols-2"
                    : "grid-cols-1",
                )}
              >
                <AnimatePresence mode="popLayout">
                  {videos.map((video) => (
                    <motion.div
                      key={video.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group"
                    >
                      <Card className="relative overflow-hidden rounded-[2rem] border-2 border-primary/5 shadow-xl bg-black aspect-video group">
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-cover"
                          poster="/placeholder.jpg"
                        />

                        {/* Status Overlay */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none group-hover:opacity-0 transition-opacity">
                          <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[8px] font-black uppercase">
                            {video.duration}S RENDER
                          </Badge>
                          <Badge className="bg-primary/90 text-primary-foreground text-[8px] font-black uppercase">
                            {video.model}
                          </Badge>
                        </div>

                        {/* Action Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                          <p className="text-[10px] font-bold text-white/80 line-clamp-1 flex-1 mr-4 uppercase tracking-wider">
                            {video.prompt}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-9 w-9 rounded-xl shadow-lg"
                              asChild
                            >
                              <a href={video.url} download>
                                <Download size={18} />
                              </a>
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-9 w-9 rounded-xl shadow-lg hover:text-rose-500"
                              onClick={() => deleteVideo(video.id)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  );
}
