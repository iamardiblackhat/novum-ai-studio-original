"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Plus,
  Scissors,
  Download,
  Trash2,
  Film,
  Upload,
  Loader2,
  Wand2,
  MonitorPlay,
  Clapperboard,
  Layers,
  Zap,
  Sparkles,
  Sliders,
  History,
  Maximize2,
  Move,
  Split,
  Timer,
  Square,
  Music4,
  Waves,
  Disc,
  Mic2,
  Activity,
  AudioLines,
  Image as ImageIcon,
  FileAudio,
  PlusCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MediaTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  type: "visual" | "audio";
  status: "idle" | "rendering" | "synced";
}

export function VideoEditor() {
  const [tracks, setTracks] = useState<MediaTrack[]>([
    {
      id: "t1",
      name: "Primary Footage",
      url: "/placeholder.jpg",
      duration: 15,
      startTime: 0,
      type: "visual",
      status: "synced",
    },
    {
      id: "t2",
      name: "Background Score",
      url: "/placeholder.mp3",
      duration: 30,
      startTime: 0,
      type: "audio",
      status: "synced",
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState([50]);
  const [masterVolume, setMasterVolume] = useState([80]);
  const [isExporting, setIsExporting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<"visual" | "audio">("visual");

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "visual" | "audio",
  ) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const newTrack: MediaTrack = {
        id: Math.random().toString(),
        name: file.name,
        url,
        duration: 10, // Default duration, should be metadata-driven in real app
        startTime: currentTime,
        type,
        status: "synced",
      };
      setTracks((prev) => [...prev, newTrack]);
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 3000));
    setIsExporting(false);
    // In real app, this would trigger a download of the merged buffer
    const link = document.createElement("a");
    link.href = "#";
    link.download = "novum-master-export.mp4";
    link.click();
  };

  return (
    <div className="h-full flex flex-col gap-6 bg-background">
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Cinematic Monitor */}
        <div className="flex-[1.5] flex flex-col gap-4 min-w-0">
          <Card className="flex-1 relative rounded-[2.5rem] overflow-hidden border-2 border-primary/5 bg-black shadow-2xl group">
            <div className="h-full w-full flex items-center justify-center relative">
              <video
                ref={videoRef}
                className="max-h-full max-w-full object-contain"
                poster="/placeholder.jpg"
              />

              {/* Audio Reactive Overlay */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                    className="w-64 h-64 rounded-full border-8 border-primary blur-2xl"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
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
                      <p className="text-white font-black uppercase tracking-tight text-sm">
                        Sequence Master
                      </p>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                        00:00:{currentTime.toFixed(0).padStart(2, "0")} /
                        00:00:30
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary text-primary-foreground font-black text-[8px] uppercase">
                      Beat-Sync Active
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-white hover:bg-white/10"
                    >
                      <Maximize2 />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Signal Import Hub */}
          <Card className="p-4 border-2 border-primary/5 bg-muted/20 rounded-3xl flex items-center gap-4">
            <div className="flex items-center gap-2">
              <PlusCircle size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Import Hub
              </span>
            </div>
            <div className="h-4 w-px bg-border mx-2" />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-9 font-bold uppercase text-[9px] border-2 hover:bg-primary/5 hover:text-primary transition-all"
                onClick={() => {
                  setUploadType("visual");
                  fileInputRef.current?.click();
                }}
              >
                <ImageIcon size={14} className="mr-1.5" /> Upload Visuals
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-9 font-bold uppercase text-[9px] border-2 hover:bg-primary/5 hover:text-primary transition-all"
                onClick={() => {
                  setUploadType("audio");
                  fileInputRef.current?.click();
                }}
              >
                <FileAudio size={14} className="mr-1.5" /> Upload Music
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={uploadType === "visual" ? "video/*,image/*" : "audio/*"}
                multiple
                onChange={(e) => handleFileUpload(e, uploadType)}
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[8px] font-black uppercase border-dashed"
              >
                Cloud Relay Linked
              </Badge>
            </div>
          </Card>
        </div>

        {/* Intelligence & Layers */}
        <div className="flex-1 flex flex-col gap-6">
          <Card className="p-6 border-2 border-primary/5 bg-card/30 rounded-[2rem] shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Sparkles size={16} />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">
                Neural Directing
              </h3>
            </div>
            <div className="space-y-4">
              <Textarea
                placeholder="Synchronise transitions to the snare, apply cinematic music video grading, or add lyric overlays..."
                className="min-h-[100px] rounded-2xl border-2 bg-background focus-visible:ring-primary/20 resize-none text-sm font-medium"
              />
              <Button className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                <Waves size={18} className="mr-2" /> Execute Sonic Alignment
              </Button>
            </div>
          </Card>

          <Card className="flex-1 flex flex-col border-2 border-primary/5 rounded-[2rem] shadow-xl overflow-hidden bg-background/50 backdrop-blur-xl">
            <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AudioLines size={16} className="text-primary" />
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Signal Inventory
                </h3>
              </div>
              <Badge variant="outline" className="text-[9px] font-black">
                {tracks.length} ACTIVE
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {tracks.map((t) => (
                  <motion.div
                    key={t.id}
                    className={cn(
                      "p-4 rounded-2xl border-2 border-primary/5 bg-card flex items-center gap-4 hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing",
                      t.type === "audio"
                        ? "bg-primary/5 border-primary/10"
                        : "",
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-14 rounded-lg flex items-center justify-center shrink-0",
                        t.type === "audio"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {t.type === "visual" ? (
                        <Film size={18} />
                      ) : (
                        <Music4 size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-tight truncate">
                        {t.name}
                      </p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase">
                        {t.duration}S {t.type.toUpperCase()} SIGNAL
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Scissors size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500/60 hover:text-rose-500"
                        onClick={() =>
                          setTracks((prev) =>
                            prev.filter((tr) => tr.id !== t.id),
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Temporal Timeline */}
      <Card className="h-[340px] border-2 border-primary/5 rounded-[2.5rem] shadow-2xl overflow-hidden bg-background/80 backdrop-blur-xl flex flex-col">
        <div className="px-8 py-4 border-b flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">
                Multimodal Temporal Axis
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-[9px] font-black px-3"
              >
                <Plus size={12} className="mr-1.5" /> Marker
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-[9px] font-black px-3"
              >
                <Zap size={12} className="mr-1.5" /> Auto-Sync
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <Volume2 size={12} className="text-primary" />
              <Slider
                value={masterVolume}
                onValueChange={setMasterVolume}
                max={100}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-2">
              <Square size={10} className="text-muted-foreground" />
              <Slider
                value={zoom}
                onValueChange={setZoom}
                max={100}
                className="w-32"
              />
              <Maximize2 size={10} className="text-muted-foreground" />
            </div>
            <Button
              size="sm"
              className="h-10 rounded-xl font-black uppercase text-[10px] px-8 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <Save size={14} className="mr-2" />
              )}
              {isExporting ? "Encoding..." : "Master & Export"}
            </Button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* Time Ruler */}
          <div className="h-8 border-b bg-muted/5 flex items-end px-4 gap-20">
            {[0, 5, 10, 15, 20, 25, 30].map((s) => (
              <div key={s} className="flex flex-col items-start pb-1">
                <div className="h-2 w-0.5 bg-muted-foreground/20" />
                <span className="text-[8px] font-bold text-muted-foreground/40">
                  {s}S
                </span>
              </div>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3 relative" style={{ width: "200%" }}>
              {/* Playhead */}
              <motion.div
                className="absolute top-0 bottom-0 w-0.5 bg-primary z-50 shadow-[0_0_10px_rgba(124,58,237,0.5)] pointer-events-none"
                animate={isPlaying ? { left: "100%" } : { left: "0%" }}
                transition={{ duration: 30, ease: "linear" }}
              >
                <div className="absolute top-0 -left-1.5 h-3 w-3 rotate-45 bg-primary rounded-sm" />
              </motion.div>

              {/* Tracks */}
              {tracks.map((t) => (
                <div
                  key={t.id}
                  className="h-14 bg-muted/10 rounded-2xl border-2 border-primary/5 flex items-center px-4 relative group"
                >
                  <motion.div
                    className={cn(
                      "absolute top-1 bottom-1 rounded-xl border-2 shadow-sm flex flex-col justify-center px-4",
                      t.type === "visual"
                        ? "bg-primary/20 border-primary/40"
                        : "bg-emerald-500/20 border-emerald-500/40",
                    )}
                    style={{
                      left: `${t.startTime * 4}%`,
                      width: `${t.duration * 4}%`,
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase truncate text-foreground/80">
                        {t.name}
                      </span>
                      {t.type === "audio" && (
                        <div className="flex items-center gap-0.5 h-4">
                          {[0, 1, 2, 1, 0, 2, 1, 0].map((h, i) => (
                            <div
                              key={i}
                              className="w-0.5 bg-emerald-500/40"
                              style={{ height: `${20 + h * 20}%` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}

              {/* Beat Markers (Visual Only) */}
              <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
                {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((s) => (
                  <div
                    key={s}
                    className="absolute h-full w-px bg-primary/10 border-l border-dashed border-primary/20"
                    style={{ left: `${s * 4}%` }}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
