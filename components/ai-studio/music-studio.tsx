"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Music4,
  Volume2,
  SkipBack,
  SkipForward,
  Trash2,
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
  // Primary real free (no key) via Pollinations music endpoint
  { id: "pollinations-music", name: "Pollinations Music (Free)", provider: "pollinations", badge: "Free" },
  // Paid / pro music models (require OpenRouter key + credits)
  { id: "suno/chirp-v3", name: "Suno Chirp v3", provider: "openrouter", badge: "PRO", requiresKey: true },
  { id: "udio/v1", name: "Udio Ultra", provider: "openrouter", badge: "PRO", requiresKey: true },
];

const WAVEFORM_BARS = Array.from({ length: 24 }, (_, i) => ({
  id: `bar-${i}`,
}));

export function MusicStudio() {
  const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [duration, setDuration] = useState("30");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      defaultModel="pollinations-music"
      placeholder="Describe the sonic architecture..."
      welcomeTitle="Sonic Production Suite"
      welcomeDescription="Advanced audio synthesis and mastering interface for high-fidelity spectral output."
      apiEndpoint="music"
      onResponse={(data) => {
        if (data.url) {
          const newTrack: GeneratedTrack = {
            id: Math.random().toString(36).substring(7),
            title: `AI Composition ${tracks.length + 1}`,
            prompt: data.prompt || "Generated audio",
            url: data.url,
            model: data.modelUsed || "pollinations-music",
            duration: typeof data.duration === "number" ? data.duration : 30,
            timestamp: new Date(),
            type: "ai-generated",
          };
          setTracks((prev) => [newTrack, ...prev]);
          setCurrentTrack(newTrack);
          setIsPlaying(true);
          if (audioRef.current) {
            audioRef.current.src = data.url;
            audioRef.current.play();
          }
        }
      }}
    >
      <div className="flex flex-col h-full gap-4">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)}>
          
        </audio>

        {/* Main Monitor */}
        <Card className="p-8 border bg-card shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="w-full flex items-center justify-between mb-8 z-10">
            <Badge
              variant="outline"
              className="font-bold uppercase text-[8px] border-primary/20 text-primary"
            >
              Signal Active
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[9px] font-bold uppercase"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload sample"
            >
              <Upload size={12} className="mr-1" /> Import
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    const url = URL.createObjectURL(file);
                    const newTrack: GeneratedTrack = {
                      id: Math.random().toString(36).substring(7),
                      title: file.name,
                      prompt: "Uploaded sample",
                      url,
                      model: "Custom",
                      duration: 0,
                      timestamp: new Date(),
                      type: "uploaded",
                    };
                    setTracks((prev) => [newTrack, ...prev]);
                    setCurrentTrack(newTrack);
                  }
                }}
              />
            </Button>
          </div>

          <div className="h-24 w-full flex items-center justify-center gap-1 mb-10 px-4">
            {WAVEFORM_BARS.map((bar, i) => (
              <div
                key={bar.id}
                className={cn(
                  "w-1.5 bg-primary/20 rounded-full transition-all duration-300",
                  isPlaying ? "animate-pulse" : "h-2",
                )}
                style={{
                  height: isPlaying
                    ? `${Math.floor(Math.random() * 80 + 20)}%`
                    : "10%",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
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
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground"
                aria-label="Skip back"
              >
                <SkipBack size={20} />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                disabled={!currentTrack}
                className="h-14 w-14 rounded-full shadow-lg"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="ml-1" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground"
                aria-label="Skip forward"
              >
                <SkipForward size={20} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] font-black uppercase opacity-40">
                    Master Volume
                  </span>
                  <Volume2 size={10} className="opacity-40" />
                </div>
                <Slider
                  value={volume}
                  onValueChange={(v) => {
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v[0] / 100;
                  }}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[8px] font-black uppercase opacity-40">
                    Gen Duration
                  </span>
                  <Sliders size={10} className="opacity-40" />
                </div>
                <div className="flex gap-1">
                  {["15", "30", "60"].map((opt) => (
                    <Button
                      key={`dur-${opt}`}
                      variant={duration === opt ? "secondary" : "outline"}
                      className="flex-1 h-7 text-[9px] font-bold"
                      onClick={() => setDuration(opt)}
                    >
                      {opt}S
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Archive */}
        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden min-h-[250px]">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListMusic size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Spectral Archive
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[8px] font-bold uppercase"
              disabled={!currentTrack}
              aria-label="Save project"
            >
              <Save size={12} className="mr-1" /> Save Project
            </Button>
          </div>
          <ScrollArea className="flex-1">
            {tracks.length === 0 ? (
              <div className="py-10 text-center opacity-20">
                <Music4 size={32} className="mx-auto" />
                <p className="text-[10px] font-bold uppercase mt-2">
                  No stems indexed
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setCurrentTrack(t);
                      setIsPlaying(true);
                      if (audioRef.current) {
                        audioRef.current.src = t.url;
                        audioRef.current.play();
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded border transition-all cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      currentTrack?.id === t.id
                        ? "bg-primary/5 border-primary/20"
                        : "bg-background border-transparent hover:bg-muted/50",
                    )}
                    aria-label={`Select track ${t.title}`}
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
                        {t.model} • {t.duration}S • {t.type}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        aria-label="Download track"
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
                            prev.filter((tk) => tk.id !== t.id),
                          );
                        }}
                        aria-label="Delete track"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  );
}
