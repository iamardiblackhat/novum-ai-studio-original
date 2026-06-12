"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Mic2,
  Volume2,
  Trash2,
  Zap,
  History,
  Ear,
  Upload,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface, Model } from "./chat-interface";
import { cn } from "@/lib/utils";

interface GeneratedAudio {
  id: string;
  url: string;
  text: string;
  voice: string;
  provider: string;
  timestamp: Date;
}

const voiceModels: Model[] = [
  // Free no-key Pollinations voices
  { id: "nova", name: "Nova (Free)", provider: "pollinations", badge: "Free" },
  { id: "nova-fast", name: "Nova Fast (Free)", provider: "pollinations", badge: "Free" },
  { id: "openai-audio", name: "OpenAI Audio (Free)", provider: "pollinations", badge: "Free" },
  { id: "qwen-tts", name: "Qwen TTS (Free)", provider: "pollinations", badge: "Free" },
  // Eleven free tier (key) + pro
  { id: "elevenlabs", name: "ElevenLabs (Free Tier)", provider: "pollinations", badge: "Free Tier", requiresKey: true },
  { id: "elevenflash", name: "Eleven Flash (Free Tier)", provider: "pollinations", badge: "Free Tier", requiresKey: true },
  { id: "elevenlabs/v3-pro", name: "ElevenLabs V3", provider: "openrouter", badge: "Elite", requiresKey: true },
  { id: "openai/tts-2", name: "OpenAI TTS 2", provider: "openrouter", badge: "PRO", requiresKey: true },
];

export function VoiceCloning() {
  const [audioClips, setAudioClips] = useState<GeneratedAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([85]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => {
    if (!audioRef.current || !currentAudio) return;
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
      models={voiceModels}
      defaultModel="nova"
      placeholder="Type the script for synthesis..."
      welcomeTitle="Neural Voice Studio"
      welcomeDescription="Professional-grade speech synthesis and high-fidelity voice cloning architecture."
      apiEndpoint="audio"
      onResponse={(data) => {
        if (data.url) {
          const newClip: GeneratedAudio = {
            id: Date.now().toString(),
            url: data.url,
            text: data.text || "Generated speech",
            voice: "Nova",
            provider: "Pollinations",
            timestamp: new Date(),
          };
          setAudioClips((prev) => [newClip, ...prev]);
          setCurrentAudio(newClip);
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
          <track kind="captions" src="" label="English" default />
        </audio>

        {/* Console */}
        <Card className="p-6 border bg-card shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-8">
            <Badge
              variant="outline"
              className="font-bold uppercase text-[8px] border-emerald-500/20 text-emerald-500"
            >
              Live Link Ready
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[9px] font-bold uppercase"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload voice sample"
            >
              <Upload size={12} className="mr-1" /> Clone New
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="audio/*"
              />
            </Button>
          </div>

          <div className="w-40 h-40 rounded-full border-4 border-muted bg-muted/20 flex items-center justify-center mb-6 relative">
            <Mic2
              size={48}
              className={cn(
                "text-primary transition-all",
                isPlaying ? "scale-110" : "opacity-20",
              )}
            />
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
            )}
          </div>

          <div className="text-center mb-8">
            <h3 className="text-sm font-bold uppercase truncate max-w-[240px]">
              {currentAudio?.voice || "Neural Silence"}
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              {currentAudio
                ? `Linked via ${currentAudio.provider}`
                : "Awaiting Synthesis"}
            </p>
          </div>

          <div className="w-full space-y-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                size="icon"
                onClick={togglePlay}
                disabled={!currentAudio}
                className="h-14 w-14 rounded-full shadow-md"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="ml-1" />
                )}
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

        {/* Archive */}
        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden min-h-[250px]">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={14} className="text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Signatures ({audioClips.length})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[8px] font-bold uppercase"
              disabled={!currentAudio}
              aria-label="Save current project"
            >
              <Save size={12} className="mr-1" /> Save
            </Button>
          </div>
          <ScrollArea className="flex-1">
            {audioClips.length === 0 ? (
              <div className="py-10 text-center opacity-20">
                <Ear size={32} className="mx-auto" />
                <p className="text-[10px] font-bold uppercase mt-2">
                  No signatures found
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {audioClips.map((clip) => (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => {
                      setCurrentAudio(clip);
                      setIsPlaying(true);
                      if (audioRef.current) {
                        audioRef.current.src = clip.url;
                        audioRef.current.play();
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded border transition-all cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      currentAudio?.id === clip.id
                        ? "bg-primary/5 border-primary/20"
                        : "bg-background border-transparent hover:bg-muted/50",
                    )}
                  >
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <Zap
                        size={14}
                        className={cn(
                          currentAudio?.id === clip.id
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-bold uppercase truncate">
                        {clip.text}
                      </h4>
                      <p className="text-[8px] font-bold text-muted-foreground truncate uppercase tracking-tighter opacity-60">
                        {clip.voice} • {clip.provider}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                        aria-label="Download clip"
                      >
                        <a href={clip.url} download>
                          <Download size={12} />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAudioClips((prev) =>
                            prev.filter((c) => c.id !== clip.id),
                          );
                        }}
                        aria-label="Delete clip"
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
