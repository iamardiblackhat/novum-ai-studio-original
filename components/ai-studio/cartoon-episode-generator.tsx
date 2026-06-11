"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Plus,
  Film,
  Download,
  Trash2,
  MoreVertical,
  Layers,
  Sparkles,
  User,
  MessageSquare,
  Clapperboard,
  MonitorPlay,
  Layout,
  Zap,
  Sliders,
  ListVideo,
  History,
  Scissors,
  Palette,
  Mic2,
  Save,
  Loader2,
  Upload,
  Maximize2,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Character {
  id: string;
  name: string;
  avatar: string;
  voiceId: string;
  personality: string;
}

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
    name: "Wan 2.1 (Anime)",
    provider: "pollinations",
    badge: "Free",
  },
  {
    id: "ltx-2",
    name: "LTX Video (CGI)",
    provider: "pollinations",
    badge: "Fast",
  },
];

const PRESET_CHARACTERS: Character[] = [
  {
    id: "c1",
    name: "Nova",
    avatar: "N",
    voiceId: "nova",
    personality: "Energetic & Curious",
  },
  {
    id: "c2",
    name: "Echo",
    avatar: "E",
    voiceId: "echo",
    personality: "Calm & Wise",
  },
];

export function CartoonEpisodeGenerator() {
  const [characters, setCharacters] = useState<Character[]>(PRESET_CHARACTERS);
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: "s1",
      description: "Nova enters the bioluminescent lab.",
      duration: 4,
      status: "completed",
      url: "/placeholder.jpg",
    },
    {
      id: "s2",
      description: "Echo reveals the floating crystal.",
      duration: 4,
      status: "idle",
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(
    scenes[0].id,
  );
  const [isExporting, setIsExporting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 5000));
    setIsExporting(false);
    const link = document.createElement("a");
    link.href = "#";
    link.download = "novum-cartoon-master.mp4";
    link.click();
  };

  return (
    <ChatInterface
      models={cartoonModels}
      defaultModel="wan"
      placeholder="Synthesise an animated narrative..."
      welcomeTitle="Neural Animator"
      welcomeDescription="Translate multi-character scripts into full-motion episodic content."
      apiEndpoint="video"
    >
      <div className="flex flex-col h-full gap-6 bg-background">
        {/* Cinematic Preview */}
        <Card className="aspect-video relative rounded-[2.5rem] overflow-hidden border-2 border-primary/5 bg-black shadow-2xl group">
          {activeScene?.url ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
              src={activeScene.url}
              poster="/placeholder.jpg"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center space-y-4 text-white/20">
              <Clapperboard size={64} strokeWidth={1} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                Awaiting Render
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-2xl shadow-2xl"
                  onClick={togglePlay}
                  disabled={!activeScene?.url}
                >
                  {isPlaying ? (
                    <Pause size={24} />
                  ) : (
                    <Play size={24} className="ml-1" />
                  )}
                </Button>
                <div>
                  <h4 className="text-white font-black uppercase tracking-tight text-sm">
                    Scene {scenes.findIndex((s) => s.id === activeSceneId) + 1}
                  </h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                    {activeScene?.description || "No data"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white hover:bg-white/10"
              >
                <Maximize2 />
              </Button>
            </div>
          </div>
        </Card>

        {/* Character & Import Hub */}
        <Card className="p-6 border-2 border-primary/5 bg-card/30 rounded-[2rem] shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <User size={16} />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">
                Character Fleet
              </h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest border-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={12} className="mr-1.5" /> Import Ref
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-lg text-[9px] font-black uppercase tracking-widest"
              >
                <Plus size={12} className="mr-1.5" /> Provision
              </Button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {characters.map((char) => (
              <div
                key={char.id}
                className="flex flex-col items-center gap-2 shrink-0 group"
              >
                <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-inner group-hover:border-primary transition-all cursor-pointer">
                  <AvatarFallback className="font-black text-lg bg-primary/5 text-primary">
                    {char.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-tight">
                    {char.name}
                  </p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-60">
                    {char.personality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Storyboard Architecture */}
        <Card className="flex-1 flex flex-col border-2 border-primary/5 rounded-[2.5rem] shadow-2xl overflow-hidden bg-background/50 backdrop-blur-xl min-h-[300px]">
          <div className="px-8 py-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Storyboard Architecture
              </h3>
            </div>
            <Badge
              variant="outline"
              className="text-[9px] font-black uppercase tracking-widest"
            >
              {scenes.length} BLOCKS
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-3">
              {scenes.map((scene, idx) => (
                <motion.div
                  key={scene.id}
                  layout
                  onClick={() => setActiveSceneId(scene.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 flex items-center gap-4 transition-all cursor-pointer group",
                    activeSceneId === scene.id
                      ? "bg-primary/5 border-primary shadow-md"
                      : "bg-card border-transparent hover:border-primary/20",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs",
                      activeSceneId === scene.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground/40",
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                      {scene.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="h-4 px-1.5 text-[8px] font-black uppercase bg-primary/10 text-primary border-0">
                        {scene.duration}S
                      </Badge>
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                        {scene.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl"
                    >
                      <Scissors size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl"
                      asChild
                    >
                      <a href={scene.url} download>
                        <Download size={14} />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ))}
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
                <Save size={18} className="mr-2" />
              )}
              {isExporting
                ? "Compiling Episode..."
                : "Master & Export Full Episode"}
            </Button>
          </div>
        </Card>
      </div>
    </ChatInterface>
  );
}
