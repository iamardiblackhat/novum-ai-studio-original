"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Plus,
  Film,
  Download,
  Trash2,
  MoreVertical,
  Layout,
  Sparkles,
  User,
  Clapperboard,
  Scissors,
  Save,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatInterface, Model } from "./chat-interface";
import { cn } from "@/lib/utils";

interface Scene {
  id: string;
  description: string;
  duration: number;
  status: "idle" | "rendering" | "completed";
  url?: string;
}

const cartoonModels: Model[] = [
  {
    id: "wan",
    name: "Wan 2.5 (Anime)",
    provider: "pollinations",
    badge: "Elite",
  },
  {
    id: "ltx-3",
    name: "LTX Video (CGI)",
    provider: "pollinations",
    badge: "Fast",
  },
];

export function CartoonEpisodeGenerator() {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: "s1",
      description: "Subject Alpha enters the command hub.",
      duration: 4,
      status: "completed",
      url: "/placeholder.jpg",
    },
    {
      id: "s2",
      description: "The neural crystal begins to resonate.",
      duration: 4,
      status: "idle",
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(
    scenes[0].id,
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeScene = scenes.find((s) => s.id === activeSceneId);

  const togglePlay = () => {
    if (!videoRef.current || !activeScene?.url) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <ChatInterface
      models={cartoonModels}
      defaultModel="wan"
      placeholder="Synthesize the narrative sequence..."
      welcomeTitle="Neural Animation Suite"
      welcomeDescription="Script-to-motion architecture for high-fidelity episodic content generation."
      apiEndpoint="video"
    >
      <div className="flex flex-col h-full gap-4">
        {/* Monitor */}
        <Card className="aspect-video relative rounded border bg-black shadow-sm group">
          {activeScene?.url ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
              src={activeScene.url}
              poster="/placeholder.jpg"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center opacity-20">
              <Clapperboard size={48} strokeWidth={1} />
              <p className="text-[10px] font-bold uppercase mt-4">
                Awaiting Buffer
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full shadow-lg"
                  onClick={togglePlay}
                  disabled={!activeScene?.url}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} className="ml-0.5" />
                  )}
                </Button>
                <div>
                  <h4 className="text-white font-bold uppercase text-xs">
                    Scene {scenes.findIndex((s) => s.id === activeSceneId) + 1}
                  </h4>
                  <p className="text-white/60 text-[10px] uppercase font-medium">
                    {activeScene?.description || "No meta data"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Hubs */}
        <Card className="p-4 border bg-card/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Actor Registry
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[9px] font-bold uppercase"
            title="Import reference"
          >
            <Upload size={12} className="mr-1" /> Import Ref
          </Button>
        </Card>

        {/* Timeline */}
        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden min-h-[250px]">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Storyboard Timeline
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[8px] font-black uppercase tracking-widest"
            >
              {scenes.length} BLOCKS
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => setActiveSceneId(scene.id)}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded border transition-all cursor-pointer group",
                    activeSceneId === scene.id
                      ? "bg-primary/5 border-primary/20"
                      : "bg-background border-transparent hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded flex items-center justify-center font-bold text-[10px]",
                      activeSceneId === scene.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground/40",
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase truncate group-hover:text-primary">
                      {scene.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="h-3.5 px-1 text-[7px] font-bold bg-primary/10 text-primary border-0">
                        {scene.duration}S
                      </Badge>
                      <span className="text-[7px] font-bold text-muted-foreground uppercase">
                        {scene.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="Edit"
                    >
                      <Scissors size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      asChild
                      title="Download"
                    >
                      <a href={scene.url} download>
                        <Download size={12} />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/10">
            <Button
              className="w-full h-10 font-bold uppercase text-[10px] shadow-sm"
              title="Export episode"
            >
              <Save size={14} className="mr-2" /> Master Export
            </Button>
          </div>
        </Card>
      </div>
    </ChatInterface>
  );
}
