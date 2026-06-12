"use client";

import { useState } from "react";
import {
  Download,
  Sparkles,
  Trash2,
  History,
  ImageIcon,
  MonitorPlay,
  ListVideo,
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
  // Pollinations free video (no key, real endpoints when available)
  { id: "seedance-pro", name: "Seedance Pro (Free)", provider: "pollinations", badge: "Free" },
  { id: "seedance-2.0", name: "Seedance 2.0 (Free)", provider: "pollinations", badge: "Free" },
  { id: "wan", name: "Wan 2.5 (Free)", provider: "pollinations", badge: "Free" },
  { id: "wan-pro", name: "Wan Pro (Free)", provider: "pollinations", badge: "Free" },
  { id: "wan-fast", name: "Wan Fast (Free)", provider: "pollinations", badge: "Fast" },
  { id: "ltx-2", name: "LTX Video 2 (Free)", provider: "pollinations", badge: "Free" },
  // Paid via key
  { id: "runway/gen-4", name: "Runway Gen-4", provider: "openrouter", badge: "PRO", requiresKey: true },
  { id: "replicate/wan", name: "Replicate Wan (Free Credits)", provider: "replicate", badge: "Key", requiresKey: true },
];

export function VideoGenerator() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "reel">("grid");

  const deleteVideo = (id: string) =>
    setVideos((prev) => prev.filter((v) => v.id !== id));

  return (
    <ChatInterface
      models={videoModels}
      defaultModel="seedance-pro"
      placeholder="Describe the cinematic sequence..."
      welcomeTitle="Temporal Motion Engine"
      welcomeDescription="Production-grade video synthesis using next-gen temporal diffusers."
      showAttachments={false}
      apiEndpoint="video"
      onResponse={(data) => {
        if (data.url) {
          const validUrl: string = data.url;
          setVideos((prev) => [
            {
              id: Date.now().toString(),
              url: validUrl,
              prompt: data.prompt || "Generated sequence",
              model: data.modelUsed || "pollinations-video",
              duration: typeof data.duration === "number" ? data.duration : 4,
              timestamp: new Date(),
            },
            ...prev,
          ]);
        }
      }}
    >
      <Card className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary border">
              <ImageIcon size={14} />
            </div>
            <div className="flex items-center gap-1 bg-background border rounded p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <ListVideo size={14} />
              </Button>
              <Button
                variant={viewMode === "reel" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("reel")}
                aria-label="Reel view"
              >
                <MonitorPlay size={14} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <History size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {videos.length} ARCHIVED
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {videos.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center py-20 opacity-30">
              <Sparkles size={40} strokeWidth={1} />
              <p className="text-[10px] font-bold uppercase mt-4">
                Registry Empty
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "p-4 grid gap-4",
                viewMode === "grid"
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1",
              )}
            >
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="relative overflow-hidden rounded border bg-black aspect-video group shadow-sm"
                >
                  <video
                    src={video.url}
                    controls
                    className="w-full h-full object-cover"
                  >
                    <track kind="captions" src="" label="English" default />
                  </video>
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none transition-opacity group-hover:opacity-0">
                    <Badge className="bg-black/60 text-white border-white/10 text-[8px] font-bold uppercase">
                      {video.duration}S RENDER
                    </Badge>
                    <Badge className="bg-primary text-primary-foreground text-[8px] font-black uppercase">
                      {video.model}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                    <p className="text-[10px] font-bold text-white line-clamp-1 uppercase flex-1 mr-4">
                      {video.prompt}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        asChild
                        aria-label="Download video"
                      >
                        <a href={video.url} download>
                          <Download size={14} />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 text-rose-500"
                        onClick={() => deleteVideo(video.id)}
                        aria-label="Delete video"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </ChatInterface>
  );
}
