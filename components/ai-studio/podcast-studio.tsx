"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Plus,
  Download,
  Trash2,
  MoreVertical,
  Radio,
  Clock,
  FileAudio,
  Video,
  Users,
  Mic2,
  Sparkles,
  Zap,
  Volume2,
  Settings2,
  MonitorPlay,
  MessageSquare,
  Headphones,
  Activity,
  Share2,
  Ear,
  Waves,
  Clapperboard,
  UserPlus,
  Upload,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInterface, Model } from "./chat-interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Speaker {
  id: string;
  name: string;
  role: "host" | "guest";
  voiceId: string;
  isCloned: boolean;
  avatar?: string;
}

interface PodcastSegment {
  id: string;
  speakerId: string;
  text: string;
  status: "idle" | "synthesizing" | "completed";
  audioUrl?: string;
}

const podcastModels: Model[] = [
  {
    id: "eleven-v2",
    name: "ElevenLabs V2 (Podcast)",
    provider: "elevenlabs",
    badge: "Ultra-Real",
    requiresKey: true,
  },
  {
    id: "nova",
    name: "Nova (Conversational)",
    provider: "pollinations",
    badge: "Free",
  },
  { id: "alloy", name: "Alloy (Brisk)", provider: "openai", badge: "Pro" },
];

const PRESET_SPEAKERS: Speaker[] = [
  {
    id: "s1",
    name: "Me (Host)",
    role: "host",
    voiceId: "my-clone-id",
    isCloned: true,
    avatar: "M",
  },
  {
    id: "s2",
    name: "Expert Guest",
    role: "guest",
    voiceId: "guest-clone-id",
    isCloned: true,
    avatar: "G",
  },
];

export function PodcastStudio() {
  const [speakers, setSpeakers] = useState<Speaker[]>(PRESET_SPEAKERS);
  const [segments, setSegments] = useState<PodcastSegment[]>([
    {
      id: "seg1",
      speakerId: "s1",
      text: "Welcome to the show. Today we're exploring neural architectures.",
      status: "completed",
    },
    {
      id: "seg2",
      speakerId: "s2",
      text: "Thanks for having me. The evolution of multi-agent systems is truly fascinating.",
      status: "idle",
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentId, setActiveSceneId] = useState<string | null>(
    segments[0].id,
  );
  const [productionMode, setProductionMode] = useState<"audio" | "animated">(
    "animated",
  );
  const [isExporting, setIsExporting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSegment = segments.find((s) => s.id === activeSegmentId);
  const activeSpeaker = speakers.find((s) => s.id === activeSegment?.speakerId);

  const togglePlay = () => {
    if (!audioRef.current || !activeSegment?.audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 4000));
    setIsExporting(false);
    const link = document.createElement("a");
    link.href = "#";
    link.download = "novum-podcast-master.mp3";
    link.click();
  };

  return (
    <ChatInterface
      models={podcastModels}
      defaultModel="eleven-v2"
      placeholder="Script the conversation or describe the topic..."
      welcomeTitle="Neural Broadcast Suite"
      welcomeDescription="Orchestrate high-fidelity conversations between cloned voices and animated entities."
      apiEndpoint="audio"
    >
      <div className="flex flex-col h-full gap-6 bg-background">
        {/* Production Monitor */}
        <Card className="aspect-video relative rounded-[2.5rem] overflow-hidden border-2 border-primary/5 bg-black shadow-2xl group">
          {productionMode === "animated" ? (
            <div className="h-full w-full flex items-center justify-center bg-zinc-950 relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="flex gap-12 items-end pb-12 relative z-10">
                {speakers.map((s) => (
                  <motion.div
                    key={s.id}
                    className="flex flex-col items-center gap-4"
                    animate={
                      activeSegment?.speakerId === s.id && isPlaying
                        ? { y: [0, -10, 0] }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <div
                      className={cn(
                        "h-32 w-32 rounded-full border-4 flex items-center justify-center text-4xl font-black transition-all duration-500",
                        activeSegment?.speakerId === s.id && isPlaying
                          ? "border-primary bg-primary/10 shadow-[0_0_40px_rgba(124,58,237,0.3)]"
                          : "border-white/10 bg-white/5 opacity-40",
                      )}
                    >
                      {s.avatar}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-black uppercase text-[10px]",
                        activeSegment?.speakerId === s.id && isPlaying
                          ? "bg-primary text-white border-primary"
                          : "text-white/40",
                      )}
                    >
                      {s.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            productionMode === "audio" && (
              <div className="h-full w-full flex items-center justify-center text-primary/20">
                <Waves
                  className={cn("h-40 w-40", isPlaying ? "animate-pulse" : "")}
                  strokeWidth={1}
                />
              </div>
            )
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-2xl shadow-2xl"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} className="ml-1" />
                  )}
                </Button>
                <div>
                  <h4 className="text-white font-black uppercase tracking-tight text-sm">
                    Now Recording: {activeSpeaker?.name}
                  </h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    Neural Link: {activeSpeaker?.voiceId}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 rounded-lg text-[9px] font-black uppercase tracking-widest border-2",
                    productionMode === "animated"
                      ? "bg-white text-black border-white"
                      : "text-white border-white/20",
                  )}
                  onClick={() => setProductionMode("animated")}
                >
                  <Users size={12} className="mr-1" /> Animated
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 rounded-lg text-[9px] font-black uppercase tracking-widest border-2",
                    productionMode === "audio"
                      ? "bg-white text-black border-white"
                      : "text-white border-white/20",
                  )}
                  onClick={() => setProductionMode("audio")}
                >
                  <Headphones size={12} className="mr-1" /> Audio Only
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Casting & Import Hub */}
        <Card className="p-6 border-2 border-primary/5 bg-card/30 rounded-[2rem] shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Mic2 size={16} />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">
                Casting Registry
              </h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} className="mr-1.5" /> Import Audio
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="audio/*"
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                <UserPlus size={14} className="mr-1.5" /> Clone Voice
              </Button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {speakers.map((s) => (
              <div
                key={s.id}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div
                  className={cn(
                    "h-14 w-14 rounded-2xl border-2 flex items-center justify-center transition-all",
                    s.isCloned
                      ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-500"
                      : "border-primary/20 bg-primary/5 text-primary",
                  )}
                >
                  <span className="font-black text-lg">{s.avatar}</span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-tight">
                    {s.name}
                  </p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">
                    {s.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Script & Timeline */}
        <Card className="flex-1 flex flex-col border-2 border-primary/5 rounded-[2.5rem] shadow-2xl overflow-hidden bg-background/50 backdrop-blur-xl min-h-[350px]">
          <div className="px-8 py-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Conversational Timeline
              </h3>
            </div>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest"
            >
              {segments.length} UTTERANCES
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {segments.map((seg) => {
                const speaker = speakers.find((s) => s.id === seg.speakerId);
                return (
                  <motion.div
                    key={seg.id}
                    layout
                    onClick={() => setActiveSceneId(seg.id)}
                    className={cn(
                      "p-5 rounded-2xl border-2 transition-all cursor-pointer group flex gap-4",
                      activeSegmentId === seg.id
                        ? "bg-primary/5 border-primary shadow-md"
                        : "bg-card border-transparent hover:border-primary/20",
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-10 w-10 border-2 border-primary/10 group-hover:border-primary transition-all">
                        <AvatarFallback className="font-black text-xs">
                          {speaker?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="h-full w-0.5 bg-muted group-last:hidden" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          {speaker?.name}
                        </span>
                        {seg.status === "completed" && (
                          <CheckCircle2
                            size={10}
                            className="text-emerald-500"
                          />
                        )}
                      </div>
                      <p className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors">
                        {seg.text}
                      </p>
                      <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl"
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl"
                        >
                          <Trash2 size={14} />
                        </Button>
                        <Button className="h-8 rounded-xl px-4 text-[9px] font-black uppercase ml-auto">
                          Re-Synthesise
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-muted/10">
            <Button
              className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 size={18} className="mr-2 animate-spin" />
              ) : (
                <Sparkles size={18} className="mr-2" />
              )}
              {isExporting
                ? "Encoding Final Master..."
                : "Master & Export Production"}
            </Button>
          </div>
        </Card>
      </div>
    </ChatInterface>
  );
}
