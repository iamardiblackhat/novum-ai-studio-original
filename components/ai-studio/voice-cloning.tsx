"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Download,
  Mic2,
  Volume2,
  Trash2,
  Zap,
  Sparkles,
  Waves,
  ListMusic,
  User,
  Headphones,
  Activity,
  Settings2,
  Share2,
  Ear,
  MessageSquare,
  Speaker,
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
  {
    id: "nova",
    name: "Nova (Smooth)",
    provider: "pollinations",
    badge: "Neutral",
  },
  {
    id: "eleven-v2",
    name: "ElevenLabs V2",
    provider: "elevenlabs",
    badge: "Ultra-Real",
    requiresKey: true,
  },
  { id: "alloy", name: "Alloy (Brisk)", provider: "openai", badge: "Pro" },
  { id: "echo", name: "Echo (Warm)", provider: "openai", badge: "Pro" },
  { id: "onyx", name: "Onyx (Deep)", provider: "pollinations", badge: "Male" },
];

const suggestedPrompts = [
  "Welcome to the future of high-fidelity voice cloning.",
  "This message was synthesised in sub-500 milliseconds.",
  "Harnessing the power of advanced neural voice engines.",
  "Experience crystal-clear speech synthesis in any language.",
];

export function VoiceCloning() {
  const [audioClips, setAudioClips] = useState<GeneratedAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([85]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClip = (clip: GeneratedAudio) => {
    setCurrentAudio(clip);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = clip.url;
      audioRef.current.play();
    }
  };

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
      placeholder="Transmit semantic data for synthesis..."
      welcomeTitle="Neural Vocalist"
      welcomeDescription="Translate high-level semantic intent into high-fidelity audible signals."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="audio"
    >
      <div className="flex flex-col h-full gap-6">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

        {/* Main Console */}
        <Card className="p-8 border-2 border-primary/5 bg-card/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

          <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-8">
              <div
                className={cn(
                  "w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-700 border-4 border-primary/5 shadow-inner overflow-hidden",
                  isPlaying ? "scale-105 border-primary/20 shadow-2xl" : "",
                )}
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="vibrating"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <Waves className="h-20 w-20 text-primary" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="still"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Mic2 className="h-20 w-20 text-primary opacity-20" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute -bottom-2 right-2 h-10 w-10 rounded-xl bg-background border-2 border-primary/20 shadow-xl flex items-center justify-center text-primary">
                <Speaker size={20} />
              </div>
            </div>

            <div className="text-center space-y-2 mb-8">
              <h3 className="text-2xl font-black tracking-tight uppercase truncate max-w-[280px]">
                {currentAudio ? currentAudio.voice : "Neural Silence"}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isPlaying
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-muted-foreground/30",
                  )}
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {currentAudio
                    ? `Linked via ${currentAudio.provider}`
                    : "Offline - Awaiting Data"}
                </span>
              </div>
            </div>

            <div className="w-full space-y-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  disabled={!currentAudio}
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-[1.75rem] shadow-2xl shadow-primary/20 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} className="ml-1" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-6 px-4 py-3 rounded-2xl bg-muted/30 border border-primary/5">
                <Volume2 size={16} className="text-primary/40" />
                <Slider
                  value={volume}
                  onValueChange={(v) => {
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v[0] / 100;
                  }}
                  max={100}
                />
                <span className="text-[9px] font-black text-primary min-w-[30px]">
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Synthesis Archive */}
        <Card className="flex-1 flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden min-h-[300px]">
          <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Synthesis Archive
              </h3>
            </div>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest"
            >
              {audioClips.length} SIGNATURES
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            {audioClips.length === 0 ? (
              <div className="py-20 text-center space-y-3 opacity-20">
                <Ear size={32} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Silence Detected
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {audioClips.map((clip) => (
                  <motion.div
                    key={clip.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => playClip(clip)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                      currentAudio?.id === clip.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-background border-transparent hover:border-primary/20",
                    )}
                  >
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/10">
                      <Activity
                        size={18}
                        className={cn(
                          currentAudio?.id === clip.id
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate leading-none uppercase tracking-tight">
                        {clip.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge className="h-3.5 px-1.5 text-[8px] font-black uppercase bg-primary/10 text-primary border-0">
                          {clip.voice}
                        </Badge>
                        <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">
                          {clip.provider}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href={clip.url} download>
                          <Download size={14} />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:text-rose-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAudioClips((prev) =>
                            prev.filter((a) => a.id !== clip.id),
                          );
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  );
}
