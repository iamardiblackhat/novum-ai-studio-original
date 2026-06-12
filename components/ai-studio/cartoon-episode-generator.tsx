"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Clapperboard,
  Scissors,
  Save,
  User,
  Layout,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface } from "./chat-interface";
import { cn } from "@/lib/utils";

interface Scene {
  id: string;
  description: string;
  duration: number;
  status: "completed" | "running" | "idle";
  url?: string;
}

const cartoonModels = [
  // Real free Pollinations video models (no key) for animation/cartoon use
  { id: "seedance-pro", name: "Seedance Pro (Free)", provider: "pollinations", badge: "Free" },
  { id: "seedance-2.0", name: "Seedance 2.0 (Free)", provider: "pollinations", badge: "Free" },
  { id: "wan", name: "Wan 2.5 (Free)", provider: "pollinations", badge: "Free" },
  { id: "wan-pro", name: "Wan Pro (Free)", provider: "pollinations", badge: "Free" },
  { id: "wan-fast", name: "Wan Fast (Free)", provider: "pollinations", badge: "Fast" },
  { id: "ltx-2", name: "LTX Video 2 (Free)", provider: "pollinations", badge: "Fast" },
];

export function CartoonEpisodeGenerator() {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: "s1",
      description: "Subject Alpha enters the command hub.",
      duration: 4,
      status: "completed",
      url: "",
    },
    {
      id: "s2",
      description: "The neural crystal begins to resonate.",
      duration: 4,
      status: "idle",
    },
  ]);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(
    scenes[0].id,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeScene = scenes.find((s) => s.id === activeSceneId);

  const togglePlay = () => {
    if (!videoRef.current) return;
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
      defaultModel="seedance-pro"
      placeholder="Synthesize the narrative sequence..."
      welcomeTitle="Neural Animation Suite"
      welcomeDescription="Script-to-motion architecture for high-fidelity episodic content generation."
      apiEndpoint="video"
      onResponse={(data) => {
        if (data.url) {
          const newScene: Scene = {
            id: Date.now().toString(),
            description: data.prompt || "Generated scene",
            duration: 4,
            status: "completed",
            url: data.url,
          };
          setScenes((prev) => [...prev, newScene]);
          setActiveSceneId(newScene.id);
          setIsPlaying(true);
          if (videoRef.current) {
            videoRef.current.src = data.url;
            videoRef.current.play();
          }
        }
      }}
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
            >
              <track kind="captions" src="" label="English" default />
            </video>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center opacity-20">
              <Clapperboard size={48} strokeWidth={1} />
              <p className="text-[10px] font-bold uppercase mt-4">
                Awaiting Buffer
              </p>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                onClick={togglePlay}
                className="h-9 w-9 rounded-full"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} className="ml-0.5" />
                )}
              </Button>
              <Badge className="bg-black/60 text-white border-white/10 text-[8px] font-bold uppercase">
                00:0{scenes.indexOf(activeScene!) * 4}:00
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                title="Scissors"
              >
                <Scissors size={14} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full"
                title="Download"
              >
                <Download size={14} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Storyboard */}
        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden min-h-[250px]">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Storyboard
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[8px] font-black uppercase tracking-widest"
            >
              {scenes.length} SCENES
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveSceneId(scene.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-3 rounded border transition-all cursor-pointer group text-left",
                    activeSceneId === scene.id
                      ? "bg-primary/5 border-primary/20"
                      : "bg-background border-transparent hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded flex items-center justify-center font-bold text-[10px] shrink-0",
                      activeSceneId === scene.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground/40",
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase truncate">
                      {scene.description}
                    </p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase mt-0.5">
                      Duration: {scene.duration}s • Status: {scene.status}
                    </p>
                  </div>
                  {scene.status === "completed" && (
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/10 flex justify-between gap-2">
            <Button
              variant="outline"
              className="flex-1 h-9 text-[10px] font-bold uppercase"
              title="Add scene"
            >
              <Layout size={14} className="mr-2" /> Add Scene
            </Button>
            <Button
              className="flex-1 h-9 text-[10px] font-bold uppercase shadow-sm"
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

function CheckCircle2({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <title>Success</title>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
