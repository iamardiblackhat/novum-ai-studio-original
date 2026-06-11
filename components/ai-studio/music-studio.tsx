"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Music4,
  Volume2,
  Clock,
  SkipBack,
  SkipForward,
  Trash2,
  History,
  ListMusic,
  Save,
  Upload,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface, Model } from "./chat-interface";
import { cn } from "@/lib/utils";

interface GeneratedTrack {
  id: string;
  title: string;
  prompt: string;
  url: string;
  model: string;
  duration: number;
  timestamp: Date;
  type: "ai-generated" | "uploaded";
}

const musicModels: Model[] = [
  {
    id: "musicgen",
    name: "MusicGen Large V2",
    provider: "replicate",
    badge: "Elite",
  },
  {
    id: "riffusion",
    name: "Riffusion V3",
    provider: "pollinations",
    badge: "Fast",
  },
  {
    id: "suno/v4-pro",
    name: "Suno V4 Pro",
    provider: "openrouter",
    badge: "Pro",
    requiresKey: true,
  },
];

const durationOptions = [
  { id: 30, label: "30S" },
  { id: 60, label: "60S" },
  { id: 120, label: "120S" },
];

export function MusicStudio() {
  const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [duration, setDuration] = useState(30);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const newTrack: GeneratedTrack = {
        id: Math.random().toString(),
        title: file.name,
        prompt: "User Uploaded Reference",
        url: URL.createObjectURL(file),
        model: "Local Sync",
        duration: 0,
        timestamp: new Date(),
        type: "uploaded",
      };
      setTracks((prev) => [newTrack, ...prev]);
    });
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <ChatInterface
      models={musicModels}
      defaultModel="musicgen"
      placeholder="Describe the sonic architecture..."
      welcomeTitle="Sonic Production Suite"
      welcomeDescription="Advanced audio synthesis and mastering interface for high-fidelity spectral output."
      apiEndpoint="music"
    >
      <div className="flex flex-col h-full gap-4">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

        {/* Main Monitor */}
        <Card className="p-6 border bg-card shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-8">
            <Badge
              variant="outline"
              className="font-bold uppercase text-[8px] border-primary/20 text-primary"
            >
              Engine Online
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[9px] font-bold uppercase"
                onClick={() => fileInputRef.current?.click()}
                title="Import audio"
              >
                <Upload size={12} className="mr-1" /> Import
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileUpload}
                />
              </Button>
            </div>
          </div>

          <div className="w-40 h-40 rounded-full border-4 border-muted bg-muted/20 flex items-center justify-center mb-6 relative">
            <Music4
              size={48}
              className={cn(
                "text-primary transition-all",
                isPlaying ? "animate-pulse scale-110" : "opacity-20",
              )}
            />
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
            )}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-sm font-bold uppercase truncate max-w-[240px]">
              {currentTrack?.title || "No Track Loaded"}
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {currentTrack
                ? `${currentTrack.model} • ${currentTrack.type}`
                : "Awaiting Data"}
            </p>
          </div>

          <div className="w-full space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                title="Previous"
              >
                <SkipBack size={18} />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                disabled={!currentTrack}
                className="h-12 w-12 rounded-full shadow-md"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                title="Next"
              >
                <SkipForward size={18} />
              </Button>
            </div>
            <div className="flex items-center gap-4 px-4 py-2 bg-muted/30 rounded border">
              <Volume2 size={14} className="text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={(v) => {
                  setVolume(v);
                  if (audioRef.current) audioRef.current.volume = v[0] / 100;
                }}
                max={100}
                className="flex-1"
              />
              <span className="text-[9px] font-bold w-6">{volume}%</span>
            </div>
          </div>
        </Card>

        {/* Config */}
        <Card className="p-4 border bg-card/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Synthesis Parameters
            </span>
          </div>
          <div className="flex gap-1">
            {durationOptions.map((opt) => (
              <Button
                key={opt.id}
                variant={duration === opt.id ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-[9px] font-bold px-3"
                onClick={() => setDuration(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Archive */}
        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden min-h-[250px]">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={14} className="text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Archive ({tracks.length})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[8px] font-bold uppercase"
              disabled={!currentTrack}
              title="Export Track"
            >
              <Save size={12} className="mr-1" /> Export
            </Button>
          </div>
          <ScrollArea className="flex-1">
            {tracks.length === 0 ? (
              <div className="py-10 text-center opacity-20">
                <ListMusic size={32} className="mx-auto" />
                <p className="text-[10px] font-bold uppercase mt-2">
                  No signals indexed
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {tracks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setCurrentTrack(t);
                      setIsPlaying(true);
                      if (audioRef.current) {
                        audioRef.current.src = t.url;
                        audioRef.current.play();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded border transition-all cursor-pointer group",
                      currentTrack?.id === t.id
                        ? "bg-primary/5 border-primary/20"
                        : "bg-background border-transparent hover:bg-muted/50",
                    )}
                  >
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <Music4
                        size={14}
                        className={cn(
                          currentTrack?.id === t.id
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold uppercase truncate">
                        {t.title}
                      </h4>
                      <p className="text-[8px] font-bold text-muted-foreground truncate uppercase tracking-tighter opacity-60">
                        {t.prompt}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        title="Download"
                      >
                        <a href={t.url} download>
                          <Download size={12} />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTracks((prev) =>
                            prev.filter((tr) => tr.id !== t.id),
                          );
                        }}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  );
}
