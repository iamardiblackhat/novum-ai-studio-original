"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Heart,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  Share2,
  Trash2,
  Maximize2,
  ImageIcon,
  Layers,
  Palette,
  Zap,
  History,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInterface, Model } from "./chat-interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  style?: string;
  timestamp: Date;
}

const imageModels: Model[] = [
  {
    id: "flux",
    name: "FLUX.1 [schnell]",
    provider: "pollinations",
    badge: "Free",
  },
  {
    id: "flux-realism",
    name: "FLUX Realism",
    provider: "pollinations",
    badge: "Free",
  },
  {
    id: "flux-anime",
    name: "FLUX Anime",
    provider: "pollinations",
    badge: "Free",
  },
  { id: "turbo", name: "SDXL Turbo", provider: "pollinations", badge: "Free" },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    provider: "openai",
    badge: "PRO",
    requiresKey: true,
  },
  {
    id: "stable-image-ultra",
    name: "SD Ultra",
    provider: "stability",
    badge: "PRO",
    requiresKey: true,
  },
];

const stylePresets = [
  { id: "photorealistic", name: "Photorealistic", icon: "📸" },
  { id: "cyberpunk", name: "Cyberpunk", icon: "🌃" },
  { id: "anime", name: "Anime / Manga", icon: "⛩️" },
  { id: "3d-render", name: "3D Render", icon: "🧊" },
  { id: "minimalist", name: "Minimalist", icon: "⚪" },
  { id: "oil-painting", name: "Oil Painting", icon: "🎨" },
  { id: "pixel-art", name: "Pixel Art", icon: "👾" },
  { id: "sketch", name: "Hand-drawn Sketch", icon: "✏️" },
];

const suggestedPrompts = [
  "Futuristic bioluminescent rainforest at night",
  "Portrait of a majestic cyborg owl",
  "Minimalist interior of a space station",
  "Ancient temple ruins overgrown with neon vines",
];

export function ImageGenerator() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "focus">("grid");
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <ChatInterface
      models={imageModels}
      defaultModel="flux"
      placeholder="Synthesize your visual imagination..."
      welcomeTitle="Neural Canvas"
      welcomeDescription="Translate high-dimensional concepts into high-fidelity visual assets."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="image"
    >
      <Card className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-2 border-primary/5 rounded-[2rem] shadow-2xl overflow-hidden">
        {/* Gallery Header */}
        <div className="px-6 py-4 border-b bg-background/40 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <ImageIcon size={18} />
            </div>
            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground opacity-50",
                )}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 rounded-lg transition-all",
                  viewMode === "focus"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground opacity-50",
                )}
                onClick={() => setViewMode("focus")}
              >
                <LayoutGrid size={14} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <History size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {images.length} ARCHIVED
            </span>
          </div>
        </div>

        {/* Style Selector */}
        <div className="px-6 py-3 border-b bg-muted/10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <Filter size={12} className="text-muted-foreground mr-2" />
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 rounded-full text-[10px] font-bold uppercase transition-all px-4",
                !activeStyle
                  ? "bg-primary text-primary-foreground border-primary"
                  : "opacity-60",
              )}
              onClick={() => setActiveStyle(null)}
            >
              All Styles
            </Button>
            {stylePresets.map((style) => (
              <Button
                key={style.id}
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 rounded-full text-[10px] font-bold uppercase transition-all gap-1.5 px-4",
                  activeStyle === style.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "opacity-60 hover:opacity-100",
                )}
                onClick={() => setActiveStyle(style.id)}
              >
                <span>{style.icon}</span>
                {style.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Canvas */}
        <ScrollArea className="flex-1">
          {images.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-20 w-20 rounded-[2.5rem] bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center text-primary/20">
                <Sparkles size={32} />
              </div>
              <div className="text-center space-y-1 px-10">
                <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                  Neural Matrix Empty
                </p>
                <p className="text-xs font-medium text-muted-foreground/60 max-w-[220px]">
                  Describe a visual concept in the chat to begin image
                  synthesis.
                </p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "p-6 grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              <AnimatePresence mode="popLayout">
                {images.map((image) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="relative aspect-square rounded-[1.5rem] overflow-hidden border-2 border-primary/5 hover:border-primary transition-all cursor-zoom-in shadow-xl group">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Hover Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                              <Button
                                variant="secondary"
                                size="icon"
                                className={cn(
                                  "h-9 w-9 rounded-xl shadow-lg transition-all",
                                  favorites.has(image.id)
                                    ? "text-rose-500"
                                    : "text-foreground",
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(image.id);
                                }}
                              >
                                <Heart
                                  size={18}
                                  className={cn(
                                    favorites.has(image.id)
                                      ? "fill-current"
                                      : "",
                                  )}
                                />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9 rounded-xl shadow-lg hover:text-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(image.id);
                                }}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 space-y-2">
                              <p className="text-xs font-bold text-white leading-relaxed line-clamp-2">
                                {image.prompt}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-primary/90 text-primary-foreground text-[8px] font-black uppercase">
                                  {image.model}
                                </Badge>
                                <Button
                                  size="sm"
                                  className="h-7 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border-0 text-white font-black text-[9px] uppercase ml-auto"
                                >
                                  <Download size={12} className="mr-1.5" /> Save
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none rounded-none">
                        <DialogHeader className="hidden">
                          <DialogTitle>Preview</DialogTitle>
                        </DialogHeader>
                        <div className="relative group/modal">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full rounded-[2rem] shadow-2xl border-2 border-white/10"
                          />
                          <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-white opacity-0 group-hover/modal:opacity-100 transition-all">
                            <p className="text-sm font-medium leading-relaxed">
                              {image.prompt}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex gap-4">
                                <div>
                                  <p className="text-[9px] font-black uppercase text-white/40">
                                    Neural Core
                                  </p>
                                  <p className="text-xs font-bold">
                                    {image.model}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-black uppercase text-white/40">
                                    Timestamp
                                  </p>
                                  <p className="text-xs font-bold">
                                    {image.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <Button className="rounded-xl font-bold px-6">
                                <Download size={18} className="mr-2" /> Download
                                HQ
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </Card>
    </ChatInterface>
  );
}
