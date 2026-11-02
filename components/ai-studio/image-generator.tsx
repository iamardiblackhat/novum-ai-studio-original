"use client";

import { useState } from "react";
import {
  Sparkles,
  Trash2,
  History,
  ImageIcon,
  Grid3X3,
  LayoutGrid,
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
  timestamp: Date;
}

const imageModels: Model[] = [
  // Pollinations free image models (no key, real generation when not queued)
  { id: "flux", name: "FLUX.2 [ultra]", provider: "pollinations", badge: "Free" },
  { id: "flux-realism", name: "FLUX Realism V2", provider: "pollinations", badge: "Free" },
  { id: "flux-anime", name: "FLUX Anime V2", provider: "pollinations", badge: "Free" },
  { id: "seedream5", name: "Seedream 5 (Free)", provider: "pollinations", badge: "Free" },
  { id: "seedream-pro", name: "Seedream Pro (Free)", provider: "pollinations", badge: "Free" },
  { id: "gptimage", name: "GPT Image (Free)", provider: "pollinations", badge: "Free" },
  { id: "gptimage-large", name: "GPT Image Large (Free)", provider: "pollinations", badge: "Free" },
  // Pro/paid (require key)
  { id: "openai/dall-e-4", name: "DALL-E 4", provider: "openrouter", badge: "PRO", requiresKey: true },
  { id: "stability/stable-diffusion-4", name: "SD 4 Ultra", provider: "openrouter", badge: "PRO", requiresKey: true },
];

export function ImageGenerator() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "focus">("grid");

  const deleteImage = (id: string) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  return (
    <ChatInterface
      models={imageModels}
      defaultModel="flux"
      placeholder="Describe the visual asset to synthesize..."
      welcomeTitle="Visual Asset Engine"
      welcomeDescription="Production-grade image synthesis using ultra-high-fidelity neural diffusers."
      showAttachments={false}
      apiEndpoint="image"
      onResponse={(data) => {
        if (data.url) {
          const validUrl: string = data.url;
          setImages((prev) => [
            {
              id: Date.now().toString(),
              url: validUrl,
              prompt: data.prompt || "Generated asset",
              model: "flux",
              timestamp: new Date(),
            },
            ...prev,
          ]);
        }
      }}
    >
      <Card className="flex flex-col h-full bg-background border rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-2 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary border">
              <ImageIcon size={14} />
            </div>
            <div className="flex items-center gap-1 bg-background border rounded p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                variant={viewMode === "focus" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("focus")}
                aria-label="Focus view"
              >
                <LayoutGrid size={14} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <History size={14} className="text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {images.length} ARCHIVED
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {images.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center py-20 opacity-30">
              <Sparkles size={40} strokeWidth={1} />
              <p className="text-[10px] font-bold uppercase mt-4">
                Registry Empty
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "p-4 grid gap-4",
                viewMode === "grid" ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              {images.map((img) => (
                <Dialog key={img.id}>
                  <DialogTrigger asChild>
                    <div
                      role="button"
                      tabIndex={0}
                      className="relative aspect-square rounded border overflow-hidden cursor-zoom-in group shadow-sm text-left"
                      aria-label={`View ${img.prompt}`}
                    >
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteImage(img.id);
                            }}
                            aria-label="Delete image"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white line-clamp-2 uppercase">
                            {img.prompt}
                          </p>
                          <Badge className="mt-2 text-[8px] font-black uppercase h-4 bg-primary border-0 text-white">
                            {img.model}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0 border-0 bg-transparent shadow-none">
                    <DialogHeader className="hidden">
                      <DialogTitle>Preview</DialogTitle>
                    </DialogHeader>
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full rounded-lg border shadow-2xl"
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </ChatInterface>
  );
}
