"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Radio,
  Clock,
  FileAudio,
  Users,
  Mic2,
  Sparkles,
  Volume2,
  Headphones,
  Activity,
  Save,
  Upload,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInterface, Model } from "./chat-interface";
import { cn } from "@/lib/utils";

interface Speaker {
  id: string;
  name: string;
  role: "host" | "guest";
  voiceId: string;
  avatar: string;
}

interface Segment {
  id: string;
  speakerId: string;
  text: string;
  status: "completed" | "idle";
}

const podcastModels: Model[] = [
  {
    id: "elevenlabs/v3-pro",
    name: "ElevenLabs V3",
    provider: "openrouter",
    badge: "Elite",
    requiresKey: true,
  },
  {
    id: "openai/tts-2",
    name: "OpenAI TTS 2",
    provider: "openrouter",
    badge: "Pro",
    requiresKey: true,
  },
  { id: "nova", name: "Nova (V2)", provider: "pollinations", badge: "Free" },
];

const PRESET_SPEAKERS: Speaker[] = [
  {
    id: "s1",
    name: "Me (Host)",
    role: "host",
    voiceId: "user-clone-id",
    avatar: "M",
  },
  {
    id: "s2",
    name: "Guest",
    role: "guest",
    voiceId: "guest-clone-id",
    avatar: "G",
  },
];

export function PodcastStudio() {
  const [speakers, setSpeakers] = useState<Speaker[]>(PRESET_SPEAKERS);
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: "seg1",
      speakerId: "s1",
      text: "Welcome to the show. Let's discuss the June 2026 AI shift.",
      status: "completed",
    },
    {
      id: "seg2",
      speakerId: "s2",
      text: "Glad to be here. The multi-modal breakthroughs are staggering.",
      status: "idle",
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(
    segments[0].id,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeSegment = segments.find((s) => s.id === activeSegmentId);
  const activeSpeaker = speakers.find((s) => s.id === activeSegment?.speakerId);

  const togglePlay = () => {
    if (!audioRef.current) return;
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
      models={podcastModels}
      defaultModel="elevenlabs/v3-pro"
      placeholder="Script the dialogue or conceptualize..."
      welcomeTitle="Neural Broadcast Hub"
      welcomeDescription="Full-stack podcast production using cloned voices and reactive animated entities."
      apiEndpoint="audio"
    >
      <div className="flex flex-col h-full gap-4">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

        {/* Production Stage */}
        <Card className="aspect-video relative rounded border bg-zinc-950 shadow-sm overflow-hidden flex items-center justify-center">
          <div className="flex gap-12 items-end pb-8">
            {speakers.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "w-24 h-24 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition-all",
                    activeSegment?.speakerId === s.id && isPlaying
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.3)] translate-y-[-5px]"
                      : "border-white/10 bg-white/5 opacity-40",
                  )}
                >
                  {s.avatar}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[8px] font-bold uppercase",
                    activeSegment?.speakerId === s.id && isPlaying
                      ? "border-primary text-primary"
                      : "text-white/20",
                  )}
                >
                  {s.name}
                </Badge>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <Button
              size="icon"
              onClick={togglePlay}
              className="h-10 w-10 rounded-full"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="ml-0.5" />
              )}
            </Button>
            <Badge className="bg-black/60 text-white border-white/10 text-[8px] font-bold uppercase">
              Animated Monitor
            </Badge>
          </div>
        </Card>

        {/* Registry */}
        <Card className="p-4 border bg-card/50 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic2 size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Casting Hub
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[8px] font-bold uppercase"
              title="Import audio sample"
            >
              <Upload size={10} className="mr-1" /> Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[8px] font-bold uppercase"
              title="Add speaker"
            >
              <UserPlus size={10} className="mr-1" /> Add
            </Button>
          </div>
        </Card>

        {/* Script */}
        <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden min-h-[300px]">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Script Timeline
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[8px] font-black uppercase tracking-widest"
            >
              {segments.length} STEMS
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {segments.map((seg) => {
                const speaker = speakers.find((s) => s.id === seg.speakerId);
                return (
                  <div
                    key={seg.id}
                    onClick={() => setActiveSegmentId(seg.id)}
                    className={cn(
                      "p-3 rounded border transition-all cursor-pointer group flex gap-3",
                      activeSegmentId === seg.id
                        ? "bg-primary/5 border-primary/20"
                        : "bg-background border-transparent hover:bg-muted/50",
                    )}
                  >
                    <Avatar className="h-7 w-7 border shrink-0">
                      <AvatarFallback className="text-[10px] font-bold">
                        {speaker?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase text-primary">
                          {speaker?.name}
                        </span>
                        {seg.status === "completed" && (
                          <CheckCircle2
                            size={10}
                            className="text-emerald-500"
                          />
                        )}
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed">
                        {seg.text}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Download"
                      >
                        <Download size={12} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/10">
            <Button
              className="w-full h-10 font-bold uppercase text-[10px] shadow-sm"
              title="Export production"
            >
              <Save size={14} className="mr-2" /> Master Export
            </Button>
          </div>
        </Card>
      </div>
    </ChatInterface>
  );
}
