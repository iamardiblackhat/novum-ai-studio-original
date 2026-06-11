"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Scissors,
  Download,
  Trash2,
  Film,
  Upload,
  Sparkles,
  Sliders,
  History,
  Maximize2,
  Timer,
  Square,
  Music4,
  AudioLines,
  Save,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MediaTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  type: "visual" | "audio";
}

export function VideoEditor() {
  const [tracks, setTracks] = useState<MediaTrack[]>([
    {
      id: "t1",
      name: "Primary Clip",
      url: "/placeholder.jpg",
      duration: 15,
      startTime: 0,
      type: "visual",
    },
    {
      id: "t2",
      name: "Audio Master",
      url: "/placeholder.mp3",
      duration: 30,
      startTime: 0,
      type: "audio",
    },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="h-full flex flex-col gap-4 bg-background">
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Monitor */}
        <div className="flex-[1.5] flex flex-col gap-4 min-w-0">
          <Card className="flex-1 relative rounded border bg-black shadow-sm group overflow-hidden flex items-center justify-center">
            <video
              className="max-h-full max-w-full object-contain"
              poster="/placeholder.jpg"
            />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-10 w-10 rounded-full shadow-lg"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} className="ml-0.5" />
                  )}
                </Button>
                <div className="text-white font-bold uppercase text-[10px] tracking-widest">
                  00:00:{currentTime.toFixed(0).padStart(2, "0")} / 00:00:30
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground font-black text-[8px] uppercase">
                Master Output
              </Badge>
            </div>
          </Card>

          {/* Import */}
          <Card className="p-3 border bg-muted/20 rounded-lg flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              Import Hub
            </span>
            <div className="h-4 w-px bg-border" />
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[9px] font-bold uppercase"
              onClick={() => fileInputRef.current?.click()}
              title="Upload media"
            >
              <Upload size={12} className="mr-1.5" /> Media
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[9px] font-bold uppercase"
              title="Import from cloud"
            >
              <PlusCircle size={12} className="mr-1.5" /> Library
            </Button>
          </Card>
        </div>

        {/* Tools */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="p-4 border bg-card/50 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Neural Director
              </span>
            </div>
            <Textarea
              placeholder="Apply beat-sync, color grade, or subtitles..."
              className="min-h-[80px] text-xs font-medium border-2"
            />
            <Button className="w-full h-10 font-bold uppercase text-[10px]">
              Align & Render
            </Button>
          </Card>

          <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AudioLines size={14} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Signal Layers
                </span>
              </div>
              <Badge variant="outline" className="text-[8px] font-bold">
                {tracks.length} ACTORS
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {tracks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-2 rounded border bg-background group"
                  >
                    <div className="h-8 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                      {t.type === "visual" ? (
                        <Film size={14} />
                      ) : (
                        <Music4 size={14} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase truncate">
                        {t.name}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Split"
                      >
                        <Scissors size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <Card className="h-[280px] border bg-background shadow-sm flex flex-col overflow-hidden">
        <div className="px-4 py-2 border-b flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-4">
            <Timer size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Temporal Axis
            </span>
          </div>
          <Button
            size="sm"
            className="h-8 font-bold uppercase text-[9px] px-6"
            title="Export production"
          >
            <Save size={12} className="mr-2" /> Master & Export
          </Button>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col bg-muted/5">
          <div className="h-6 border-b bg-muted/5 flex items-end px-4 gap-20">
            {[0, 5, 10, 15, 20, 25, 30].map((s) => (
              <div key={s} className="flex flex-col items-start pb-1">
                <div className="h-1.5 w-px bg-border" />
                <span className="text-[7px] font-bold opacity-30">{s}S</span>
              </div>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2 relative" style={{ width: "150%" }}>
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-px bg-primary z-50 pointer-events-none transition-all"
                style={{ left: `${(currentTime / 30) * 100}%` }}
              >
                <div className="absolute top-0 -left-1 h-2 w-2 rotate-45 bg-primary" />
              </div>

              {tracks.map((t) => (
                <div
                  key={t.id}
                  className="h-10 bg-muted/20 rounded border flex items-center px-4 relative"
                >
                  <div
                    className={cn(
                      "absolute top-1 bottom-1 rounded border-2 shadow-sm flex items-center px-3",
                      t.type === "visual"
                        ? "bg-primary/10 border-primary/30"
                        : "bg-emerald-500/10 border-emerald-500/30",
                    )}
                    style={{
                      left: `${(t.startTime / 30) * 100}%`,
                      width: `${(t.duration / 30) * 100}%`,
                    }}
                  >
                    <span className="text-[8px] font-bold uppercase truncate opacity-60">
                      {t.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
