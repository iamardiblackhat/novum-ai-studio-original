"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Download,
  Music4,
  Volume2,
  Clock,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  Heart,
  MoreVertical,
  Trash2,
  Zap,
  Sparkles,
  Waves,
  ListMusic,
  Mic2,
  Disc,
  Sliders,
  Upload,
  PlusCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface, Model } from "./chat-interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    name: "MusicGen Melody",
    provider: "replicate",
    badge: "Fast",
  },
  {
    id: "musicgen-large",
    name: "MusicGen Large",
    provider: "replicate",
    badge: "High-Fi",
  },
  {
    id: "riffusion",
    name: "Riffusion V2",
    provider: "pollinations",
    badge: "Free",
  },
];

const durationOptions = [
  { id: 15, label: "15s", desc: "Social Clip" },
  { id: 30, label: "30s", desc: "Short Intro" },
  { id: 60, label: "60s", desc: "Standard Track" },
];

export function MusicStudio() {
  const [tracks, setTracks] = useState<GeneratedTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [duration, setDuration] = useState(30);
  const [isExporting, setIsExporting] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const newTrack: GeneratedTrack = {
        id: Math.random().toString(),
        title: file.name,
        prompt: "User Uploaded Reference",
        url,
        model: "Local Sync",
        duration: 0, // Should be metadata driven
        timestamp: new Date(),
        type: "uploaded",
      };
      setTracks((prev) => [newTrack, ...prev]);
    });
  };

  const playTrack = (track: GeneratedTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
    }
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
      placeholder="Describe the sonic atmosphere..."
      welcomeTitle="Sonic Alchemist"
      welcomeDescription="Translate textual descriptions into high-fidelity spectral compositions."
      apiEndpoint="music"
    >
      <div className="flex flex-col h-full gap-6">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

        {/* Advanced Player */}
        <Card className="p-8 border-2 border-primary/5 bg-card/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

          <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-8">
              <div
                className={cn(
                  "w-48 h-48 rounded-[3rem] bg-primary/10 flex items-center justify-center transition-all duration-700 border-4 border-primary/5 shadow-inner overflow-hidden",
                  isPlaying ? "scale-105 border-primary/20 shadow-2xl" : "",
                )}
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="playing"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5"
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [20, 60, 20] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.1,
                          }}
                          className="w-2 rounded-full bg-primary"
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Disc className="h-20 w-20 text-primary opacity-20 animate-spin-slow" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="absolute -bottom-4 right-4 h-12 w-12 rounded-2xl bg-background border-2 border-primary/20 shadow-xl flex items-center justify-center text-primary">
                <Music4 size={24} />
              </div>
            </div>

            <div className="text-center space-y-2 mb-8">
              <h3 className="text-2xl font-black tracking-tight uppercase truncate max-w-[280px]">
                {currentTrack?.title || "Sonic Neutral"}
              </h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none">
                {currentTrack
                  ? `${currentTrack.type === "uploaded" ? "Imported" : currentTrack.duration + "s"} via ${currentTrack.model}`
                  : "Awaiting Synthesis"}
              </p>
            </div>

            <div className="w-full space-y-8">
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary"
                >
                  <SkipBack />
                </Button>
                <Button
                  size="icon"
                  disabled={!currentTrack}
                  onClick={togglePlay}
                  className="h-20 w-20 rounded-[2.5rem] shadow-2xl shadow-primary/20 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <Pause size={32} />
                  ) : (
                    <Play size={32} className="ml-1" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary"
                >
                  <SkipForward />
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <Volume2 size={18} className="text-primary/40" />
                <Slider
                  value={volume}
                  onValueChange={(v) => {
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v[0] / 100;
                  }}
                  max={100}
                  className="cursor-pointer"
                />
                <span className="text-[10px] font-black text-primary w-8">
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Configuration & Import Hub */}
        <Card className="p-6 border-2 border-primary/5 bg-card/30 rounded-[2rem] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Synthesis Matrix
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 font-bold uppercase text-[9px] border-2 hover:bg-primary/5 hover:text-primary transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} className="mr-1.5" /> Import Reference
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="audio/*"
                onChange={handleFileUpload}
              />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {durationOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDuration(opt.id)}
                className={cn(
                  "p-3 rounded-2xl border-2 transition-all text-left group",
                  duration === opt.id
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-background border-transparent hover:border-primary/20",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-black uppercase transition-colors",
                    duration === opt.id
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {opt.label}
                </p>
                <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tighter mt-0.5">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Spectral Archive */}
        <Card className="flex-1 flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden min-h-[300px]">
          <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Spectral Archive
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/5 text-primary border-primary/10 font-black text-[9px] uppercase tracking-widest"
              >
                {tracks.length} STEMS
              </Badge>
              <Button
                size="sm"
                className="h-8 rounded-lg font-black uppercase text-[9px] px-4 shadow-lg shadow-primary/10"
                disabled={!currentTrack || isExporting}
              >
                <Save size={12} className="mr-1.5" /> Export Master
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            {tracks.length === 0 ? (
              <div className="py-20 text-center space-y-3 opacity-20">
                <ListMusic size={32} className="mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Archive Depleted
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {tracks.map((track) => (
                  <motion.div
                    key={track.id}
                    layout
                    onClick={() => playTrack(track)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                      currentTrack?.id === track.id
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-background border-transparent hover:border-primary/20",
                    )}
                  >
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Music4
                        size={18}
                        className={cn(
                          currentTrack?.id === track.id
                            ? "text-primary animate-pulse"
                            : "text-muted-foreground",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black uppercase tracking-tight truncate">
                          {track.title}
                        </h4>
                        <Badge className="h-4 px-1.5 text-[8px] font-black uppercase bg-primary/10 text-primary border-0">
                          {track.model}
                        </Badge>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest mt-1 opacity-60">
                        {track.prompt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-primary/5"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a href={track.url} download>
                          <Download size={16} />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTracks((prev) =>
                            prev.filter((t) => t.id !== track.id),
                          );
                        }}
                      >
                        <Trash2 size={16} />
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
