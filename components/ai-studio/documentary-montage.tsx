"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  Film,
  Upload,
  Sparkles,
  Timer,
  Music4,
  Save,
  CloudRain,
  SkipBack,
  SkipForward,
  Volume2,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  startTime: number;
  endTime: number;
  url: string;
  name: string;
  position: number;
}

interface DocumentaryData {
  success: boolean;
  totalDuration: number;
  clipDuration: number;
  numClips: number;
  clips: {
    index: number;
    url: string;
    name: string;
    duration: number;
    startTime: number;
    endTime: number;
    position: number;
  }[];
  music: { url: string; prompt: string; duration: number };
  timeline: TimelineEntry[];
  footageRequired: {
    minClips: number;
    suggestedClips: number;
    maxClips: number;
    note: string;
  };
  error?: string;
}

interface UploadedFootage {
  id: string;
  name: string;
  url: string;
  duration: number;
  loaded: boolean;
}

const TOTAL_DURATION = 75;
const MIN_FOOTAGE_CLIPS = 1;
const SUGGESTED_FOOTAGE_CLIPS = 5;

export function DocumentaryMontage() {
  const [isAssembling, setIsAssembling] = useState(false);
  const [docData, setDocData] = useState<DocumentaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [uploadedFootage, setUploadedFootage] = useState<UploadedFootage[]>([]);
  const [customMusicPrompt, setCustomMusicPrompt] = useState(
    "Elegiac ambient piano composition, melancholic and contemplative, soft strings, rain ambiance, slow tempo, minor key, cinematic documentary score"
  );
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animFrameRef = useRef<number>(0);

  // Progress simulation during assembly
  useEffect(() => {
    if (!isAssembling) {
      setProgress(0);
      setProgressLabel("");
      return;
    }

    const steps = [
      { at: 5, label: "Processing footage..." },
      { at: 30, label: "Building timeline..." },
      { at: 50, label: "Composing music score..." },
      { at: 75, label: "Syncing audio and video..." },
      { at: 90, label: "Finalizing montage..." },
    ];

    setProgress(2);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 1, 98);
        const step = steps.find((s) => next >= s.at);
        if (step) setProgressLabel(step.label);
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isAssembling]);

  // Sync video playback with timeline
  useEffect(() => {
    if (!docData || !isPlaying) return;

    const video = videoRef.current;
    if (!video) return;

    const clipIndex = Math.floor(currentTime / docData.clipDuration);
    if (clipIndex !== currentClipIndex && docData.clips[clipIndex]) {
      setCurrentClipIndex(clipIndex);
      const clip = docData.clips[clipIndex];
      if (clip.url && video.src !== clip.url) {
        video.src = clip.url;
        video.load();
        video.play().catch(() => {});
      }
    }
  }, [currentTime, currentClipIndex, docData, isPlaying]);

  // Audio sync with music track
  useEffect(() => {
    if (!docData?.music?.url || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, docData, volume]);

  // Time tracking
  useEffect(() => {
    if (!isPlaying || !docData) return;

    const startTime = performance.now();
    let startOffset = currentTime;

    const tick = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const newTime = Math.min(startOffset + elapsed, TOTAL_DURATION);
      setCurrentTime(newTime);

      if (newTime >= TOTAL_DURATION) {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentClipIndex(0);
        return;
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, docData, currentTime]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      uploadedFootage.forEach((f) => URL.revokeObjectURL(f.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    if (!docData) return;
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
    } else {
      if (currentTime >= TOTAL_DURATION) {
        setCurrentTime(0);
        setCurrentClipIndex(0);
      }
      setIsPlaying(true);
    }
  }, [docData, isPlaying, currentTime]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        setUploadedFootage((prev) => [
          ...prev,
          {
            id: `footage-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: file.name,
            url,
            duration: 0,
            loaded: false,
          },
        ]);
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  const removeFootage = useCallback((id: string) => {
    setUploadedFootage((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const assembleMontage = useCallback(async () => {
    if (uploadedFootage.length === 0) {
      setError("Please upload at least one video clip of city life in the rain.");
      return;
    }

    setIsAssembling(true);
    setError(null);
    setDocData(null);
    setCurrentTime(0);
    setCurrentClipIndex(0);

    try {
      const footagePayload = uploadedFootage.map((f) => ({
        url: f.url,
        name: f.name,
      }));

      const res = await fetch("/api/documentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          footage: footagePayload,
          musicPrompt: customMusicPrompt,
        }),
      });

      const data: DocumentaryData = await res.json();

      if (!data.success || data.error) {
        throw new Error(data.error || "Failed to assemble montage");
      }

      setDocData(data);
      setProgress(100);
      setProgressLabel("Complete!");

      // Preload first clip from user footage
      if (data.clips[0]?.url && videoRef.current) {
        videoRef.current.src = data.clips[0].url;
        videoRef.current.load();
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Documentary assembly failed"
      );
    } finally {
      setIsAssembling(false);
    }
  }, [uploadedFootage, customMusicPrompt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const canAssemble = uploadedFootage.length >= MIN_FOOTAGE_CLIPS && !isAssembling;

  return (
    <div className="h-full flex flex-col gap-4 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <CloudRain size={16} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Documentary Montage
            </h2>
            <p className="text-[10px] text-muted-foreground">
              City Life in the Rain · 75s · Real Footage Only · No Narration
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9px] font-bold">
          {TOTAL_DURATION}S
        </Badge>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Left: Preview + Footage Upload */}
        <div className="flex-[1.5] flex flex-col gap-4 min-w-0">
          {/* Monitor */}
          <Card className="flex-1 relative rounded border bg-black shadow-sm overflow-hidden flex items-center justify-center min-h-[280px]">
            {docData?.clips[currentClipIndex]?.url ? (
              <video
                ref={videoRef}
                className="max-h-full max-w-full object-contain"
                muted
                playsInline
              >
                
              </video>
            ) : (
              <div className="flex flex-col items-center gap-3 opacity-30 p-8 text-center">
                <CloudRain size={48} strokeWidth={1} />
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  {isAssembling ? "Assembling..." : "Upload Real Footage"}
                </p>
                {uploadedFootage.length === 0 && !isAssembling && (
                  <p className="text-[9px] max-w-xs">
                    Upload video clips of city life in the rain to create your
                    documentary. No AI-generated footage — only real recordings.
                  </p>
                )}
              </div>
            )}

            {/* Overlay controls */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={togglePlay}
                  disabled={!docData || isAssembling}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} className="ml-0.5" />
                  )}
                </Button>
                <span className="text-white font-bold uppercase text-[9px] tracking-widest drop-shadow-lg">
                  {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {docData?.music?.url && (
                  <Badge
                    variant="secondary"
                    className="bg-black/50 text-white text-[7px] font-bold uppercase border-white/10"
                  >
                    <Music4 size={10} className="mr-1" />
                    Score Active
                  </Badge>
                )}
                {docData && (
                  <Badge className="bg-primary text-primary-foreground text-[7px] font-black uppercase">
                    {currentClipIndex + 1}/{docData.clips.length}
                  </Badge>
                )}
              </div>
            </div>

            {/* Assembly overlay */}
            {isAssembling && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-10">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                  {progressLabel || "Initializing..."}
                </p>
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Footage Upload Controls */}
          <Card className="p-3 border bg-muted/20 rounded-lg space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                Real Footage
              </span>
              <div className="h-4 w-px bg-border" />
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[8px] font-bold uppercase"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAssembling}
                aria-label="Upload real video footage"
              >
                <Upload size={11} className="mr-1.5" />
                Upload Videos
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="video/*"
                  onChange={handleFileUpload}
                />
              </Button>
              <Button
                variant={canAssemble ? "default" : "outline"}
                size="sm"
                className="h-8 text-[8px] font-bold uppercase"
                onClick={assembleMontage}
                disabled={!canAssemble}
                aria-label="Assemble 75-second documentary"
              >
                {isAssembling ? (
                  <Loader2 size={11} className="mr-1.5 animate-spin" />
                ) : (
                  <Sparkles size={11} className="mr-1.5" />
                )}
                {isAssembling
                  ? "Assembling..."
                  : docData
                  ? "Reassemble"
                  : "Assemble 75s Montage"}
              </Button>
              {docData && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[8px] font-bold uppercase"
                  onClick={assembleMontage}
                  disabled={isAssembling}
                  aria-label="Regenerate"
                >
                  <RefreshCw size={11} className="mr-1.5" />
                  Reassemble
                </Button>
              )}
            </div>

            {/* Info banner */}
            {uploadedFootage.length > 0 && uploadedFootage.length < SUGGESTED_FOOTAGE_CLIPS && (
              <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
                <Info size={10} className="shrink-0" />
                <span>
                  {uploadedFootage.length} clip{uploadedFootage.length !== 1 ? "s" : ""} uploaded.{" "}
                  For best variety across 75 seconds, upload{" "}
                  {SUGGESTED_FOOTAGE_CLIPS - uploadedFootage.length} more
                  clip{SUGGESTED_FOOTAGE_CLIPS - uploadedFootage.length !== 1 ? "s" : ""}.
                  Footage will be cycled to fill the timeline.
                </span>
              </div>
            )}
          </Card>

          {/* Uploaded Footage List */}
          {uploadedFootage.length > 0 && (
            <Card className="p-3 border bg-muted/20 rounded-lg">
              <p className="text-[8px] font-bold uppercase tracking-widest opacity-40 mb-2">
                Your Footage ({uploadedFootage.length} clip
                {uploadedFootage.length !== 1 ? "s" : ""})
              </p>
              <div className="flex flex-wrap gap-2">
                {uploadedFootage.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 px-2 py-1 rounded bg-background border text-[10px] font-medium"
                  >
                    <video
                      className="h-8 w-12 rounded object-cover bg-black"
                      src={f.url}
                      muted
                      preload="metadata"
                    />
                    <span className="truncate max-w-[100px] text-[9px]">
                      {f.name}
                    </span>
                    <button
                      onClick={() => removeFootage(f.id)}
                      className="text-rose-500 ml-1"
                      aria-label={`Remove ${f.name}`}
                    >
                      <XCircle size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="p-3 border-rose-500/30 bg-rose-500/5 rounded-lg flex items-center gap-2">
              <XCircle size={14} className="text-rose-500 shrink-0" />
              <p className="text-[10px] font-medium text-rose-500">{error}</p>
            </Card>
          )}
        </div>

        {/* Right: Music + Scene List */}
        <div className="flex-1 flex flex-col gap-4 max-w-sm">
          {/* Music Controls */}
          <Card className="p-4 border bg-card/50 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Music4 size={14} className="text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Music Direction (Elegiac Tone)
              </span>
            </div>
            <Textarea
              placeholder="Describe the musical tone (e.g., melancholic ambient piano with soft strings and rain ambiance)..."
              className="min-h-[60px] text-xs font-medium border-2"
              value={customMusicPrompt}
              onChange={(e) => setCustomMusicPrompt(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <Volume2 size={12} className="opacity-40 shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 accent-primary"
                aria-label="Volume"
              />
              <span className="text-[9px] font-bold opacity-40 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </Card>

          {/* Clip List */}
          <Card className="flex-1 flex flex-col border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film size={14} className="text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Timeline Segments
                </span>
              </div>
              <Badge variant="outline" className="text-[7px] font-bold">
                {docData?.clips.length || 0} SEGMENTS
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {docData?.clips.map((clip, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded border bg-background group transition-colors",
                      i === currentClipIndex && isPlaying
                        ? "border-primary/50 bg-primary/5"
                        : "border-transparent"
                    )}
                  >
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0 text-[8px] font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-medium truncate">
                        {clip.name}
                      </p>
                      <p className="text-[7px] text-muted-foreground mt-0.5">
                        {formatTime(clip.startTime)} – {formatTime(clip.endTime)}
                      </p>
                    </div>
                    {clip.url && (
                      <Badge
                        variant="outline"
                        className="text-[6px] font-bold h-4 shrink-0"
                      >
                        <CheckCircle2 size={8} className="mr-0.5 text-green-500" />
                        Ready
                      </Badge>
                    )}
                  </div>
                ))}
                {!docData && uploadedFootage.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <CheckCircle2 size={24} strokeWidth={1} />
                    <p className="text-[9px] font-bold uppercase mt-2">
                      {uploadedFootage.length} Clip{uploadedFootage.length !== 1 ? "s" : ""} Ready
                    </p>
                    <p className="text-[8px] text-center mt-1">
                      Click "Assemble 75s Montage" to build your timeline
                    </p>
                  </div>
                )}
                {!docData && uploadedFootage.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <CloudRain size={24} strokeWidth={1} />
                    <p className="text-[9px] font-bold uppercase mt-2">
                      No Footage Yet
                    </p>
                    <p className="text-[8px] text-center mt-1">
                      Upload real video clips of city life in the rain
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <Card className="h-[200px] border bg-background shadow-sm flex flex-col overflow-hidden">
        <div className="px-4 py-2 border-b flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-4">
            <Timer size={14} className="text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Temporal Axis · {TOTAL_DURATION}s
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => {
                setCurrentTime(0);
                setCurrentClipIndex(0);
                setIsPlaying(false);
              }}
              disabled={!docData}
              aria-label="Skip to start"
            >
              <SkipBack size={12} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-7 w-7 rounded-full"
              onClick={togglePlay}
              disabled={!docData || isAssembling}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={12} />
              ) : (
                <Play size={12} className="ml-0.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => {
                setCurrentTime(TOTAL_DURATION);
                setCurrentClipIndex(
                  docData ? docData.clips.length - 1 : 0
                );
                setIsPlaying(false);
              }}
              disabled={!docData}
              aria-label="Skip to end"
            >
              <SkipForward size={12} />
            </Button>
          </div>
          <Button
            size="sm"
            className="h-8 font-bold uppercase text-[8px] px-4"
            disabled={!docData}
            aria-label="Export montage"
          >
            <Save size={11} className="mr-1.5" /> Export
          </Button>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col bg-muted/5">
          {/* Time ruler */}
          <div className="h-5 border-b bg-muted/5 flex items-end px-4 relative">
            {Array.from({
              length: Math.ceil(TOTAL_DURATION / 5) + 1,
            }).map((_, i) => (
              <div
                key={`ruler-${i}`}
                className="flex flex-col items-start pb-0.5 absolute"
                style={{
                  left: `${(i * 5) / TOTAL_DURATION * 100}%`,
                }}
              >
                <div className="h-1 w-px bg-border" />
                <span className="text-[6px] font-bold opacity-30">
                  {i * 5}S
                </span>
              </div>
            ))}
          </div>

          {/* Track area */}
          <ScrollArea className="flex-1">
            <div className="p-3 relative min-h-[100px]">
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-px bg-primary z-50 pointer-events-none transition-all"
                style={{
                  left: `${(currentTime / TOTAL_DURATION) * 100}%`,
                }}
              >
                <div className="absolute top-0 -left-1 h-2 w-2 rotate-45 bg-primary" />
              </div>

              {/* Video track */}
              <div className="mb-2">
                <p className="text-[7px] font-bold uppercase opacity-30 mb-1">
                  Real Footage Track
                </p>
                <div className="h-12 bg-muted/20 rounded border relative">
                  {docData?.timeline.map((entry, i) => (
                    <div
                      key={`timeline-clip-${i}`}
                      className={cn(
                        "absolute top-1 bottom-1 rounded border-2 shadow-sm flex items-center px-2 transition-colors cursor-pointer",
                        i === currentClipIndex && isPlaying
                          ? "bg-primary/20 border-primary/50"
                          : "bg-primary/10 border-primary/30 hover:bg-primary/15"
                      )}
                      style={{
                        left: `${
                          (entry.startTime / TOTAL_DURATION) * 100
                        }%`,
                        width: `${
                          ((entry.endTime - entry.startTime) /
                            TOTAL_DURATION) *
                          100
                        }%`,
                      }}
                      onClick={() => {
                        setCurrentTime(entry.startTime);
                        setCurrentClipIndex(i);
                      }}
                      title={entry.name}
                    >
                      <span className="text-[6px] font-bold uppercase truncate opacity-60 w-full">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Music track */}
              {docData?.music?.url && (
                <div>
                  <p className="text-[7px] font-bold uppercase opacity-30 mb-1">
                    Music Track
                  </p>
                  <div className="h-8 bg-emerald-500/10 rounded border border-emerald-500/20 relative flex items-center px-3">
                    <audio
                      ref={audioRef}
                      src={docData.music.url}
                      preload="auto"
                    />
                    <div
                      className="absolute inset-0 bg-emerald-500/10 rounded"
                      style={{
                        width: `${
                          (currentTime / TOTAL_DURATION) * 100
                        }%`,
                      }}
                    />
                    <div className="flex items-center gap-2 relative z-10">
                      <Music4 size={10} className="text-emerald-500" />
                      <span className="text-[7px] font-bold uppercase text-emerald-500">
                        Elegiac Score · {docData.music.duration}s
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!docData && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <p className="text-[9px] font-bold uppercase">
                    Upload footage and assemble to populate the timeline
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}