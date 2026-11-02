"use client";

import { useState } from "react";
import { Search, Star, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

type Category =
  | "all"
  | "chat"
  | "image"
  | "video"
  | "audio"
  | "web"
  | "code"
  | "business";

interface Template {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  prompt: string;
  uses: number;
  featured?: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: "t1",
    title: "ARDI Zero-Trust Perimeter Audit",
    category: "chat",
    description: "Defensive TLS 1.3, CSP header verification, and reverse proxy isolation audit.",
    prompt: "You are ARDI Sec, Omnelia SI's senior defensive cybersecurity auditor. Perform a rigorous perimeter defense evaluation for an authorized enterprise domain. Check TLS cipher negotiation, strict HSTS, CSP frame-ancestors, and agent memory boundary isolation.",
    uses: 12480,
    featured: true,
  },
  {
    id: "t2",
    title: "Wan 2.1 14B Cinema Sequence",
    category: "video",
    description: "High-fidelity cinematic drone rotation with realistic lighting and reflections.",
    prompt: "Cinematic drone rotating smoothly around cybernetic obsidian glass sculpture in rain, reflections on wet pavement, volumetric cyan neon lighting, 4k ultra-realistic, photorealistic depth of field, 24fps motion blur.",
    uses: 18920,
    featured: true,
  },
  {
    id: "t3",
    title: "FLUX.2 Photoreal Studio Master",
    category: "image",
    description: "Ultra-sharp macro photography with authentic dynamic range and bokeh.",
    prompt: "Professional studio product photography of a glowing holographic microchip encased in frosted obsidian crystal, cyan and violet fiber optic traces, soft studio rim lighting, 8k resolution, photorealistic bokeh.",
    uses: 24150,
    featured: true,
  },
  {
    id: "t4",
    title: "Local Sovereign RAG Pipeline",
    category: "code",
    description: "Private vector database ingest and local Ollama inference script.",
    prompt: "Write a complete, production-grade Python script for an on-premise RAG pipeline using Ollama (qwen3.5:4b), FastEmbed embeddings, and Qdrant local vector storage. Enforce strict local boundaries with zero network telemetry.",
    uses: 9840,
    featured: true,
  },
  {
    id: "t5",
    title: "Kokoro-82M Voiceover Master",
    category: "audio",
    description: "Authoritative technical narration script for executive product briefings.",
    prompt: "Synthesize clear, authoritative executive technical narration introducing the Omnelia SI Sovereign Mesh architecture: private on-premise execution, zero data exfiltration, and high-performance open diffusers.",
    uses: 8230,
    featured: true,
  },
  {
    id: "t6",
    title: "Sovereign Dark Bento UI Forge",
    category: "web",
    description: "Next.js 16 & Tailwind CSS bento grid component with obsidian glass aesthetic.",
    prompt: "Build a single self-contained responsive HTML/CSS/JS bento grid dashboard component. Use obsidian dark background (#090b11), cyan accents (#57f1ef), crisp borders, Lucide-style vector SVG icons, and interactive hover states.",
    uses: 15420,
    featured: true,
  },
  {
    id: "t7",
    title: "Autonomous Fleet Coordinator",
    category: "chat",
    description: "Multi-agent task decomposition and tool dispatch architecture.",
    prompt: "Act as the Lead Autonomous Fleet Coordinator. Decompose a complex objective into sequential sub-tasks with assigned agent personas (Researcher, Architect, Security Auditor), execution prerequisites, and validation criteria.",
    uses: 7190,
  },
  {
    id: "t8",
    title: "Elegiac Rain Ambient Score",
    category: "audio",
    description: "Spectral ambient piano and melancholic strings for cinematic documentaries.",
    prompt: "Elegiac ambient piano composition, melancholic and contemplative, soft strings, rain ambiance, slow tempo, minor key, cinematic documentary score.",
    uses: 6410,
  },
  {
    id: "t9",
    title: "Full-Stack Security Gateway",
    category: "code",
    description: "Strict reverse-proxy configuration with security headers and rate-limits.",
    prompt: "Generate an Nginx and Cloudflare configuration snippet implementing strict security headers: Content-Security-Policy with nonces, HSTS preload, Permissions-Policy, and token-bucket API rate limiting.",
    uses: 11200,
  },
  {
    id: "t10",
    title: "Cyberpunk Urban Rain Reel",
    category: "video",
    description: "Fast-paced cinematic montage with pan-tilt camera motion and water droplets.",
    prompt: "Cinematic night timelapse of futuristic cityscape in heavy rain, neon reflections on wet glass, camera panning upwards to skyscraper spire, high shutter speed, photorealistic water droplet physics.",
    uses: 14300,
  },
  {
    id: "t11",
    title: "Neural Memory Graph Vectorizer",
    category: "code",
    description: "In-memory knowledge graph builder for persistent agent sessions.",
    prompt: "Design a lightweight TypeScript class for in-memory episodic and semantic memory indexing using cosine similarity, recency decay, and domain-isolated namespaces.",
    uses: 5310,
  },
  {
    id: "t12",
    title: "3D Obsidian Hardware Visualization",
    category: "image",
    description: "Futuristic supercomputing server rack in obsidian space environment.",
    prompt: "Futuristic supercomputing node in minimalist obsidian dark room, glowing cyan circuit channels, liquid cooling conduits, polished reflection floor, cinematic depth of field, hyper-detailed 8k render.",
    uses: 9640,
  },
];

export function TemplatesLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = category === "all" || t.category === category;
    const q = query.toLowerCase();
    return (
      matchCat &&
      (t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="p-6 rounded-lg border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Neural Templates
            </h2>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Optimized prompts for production workflows
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter blueprints..."
              className="pl-9 h-9 text-xs border-2"
            />
          </div>
        </div>

        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as Category)}
        >
          <TabsList className="bg-muted/50 border h-9 p-1">
            {["all", "chat", "image", "video", "audio", "web", "code"].map(
              (cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-[10px] font-bold uppercase px-6"
                >
                  {cat}
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t) => (
            <Card
              key={t.id}
              className="p-5 border bg-card shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <Badge
                    variant="outline"
                    className="text-[7px] font-black uppercase tracking-widest"
                  >
                    {t.category}
                  </Badge>
                  {t.featured && (
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold uppercase tracking-tight truncate">
                  {t.title}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 uppercase leading-relaxed">
                  {t.description}
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-[9px] font-bold uppercase"
                  onClick={() => {
                    navigator.clipboard.writeText(t.prompt);
                    setCopied(t.id);
                    setTimeout(() => setCopied(null), 2000);
                  }}
                  title="Copy prompt"
                >
                  {copied === t.id ? (
                    <Check size={12} className="mr-1.5 text-emerald-500" />
                  ) : (
                    <Copy size={12} className="mr-1.5" />
                  )}
                  {copied === t.id ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-[9px] font-bold uppercase"
                  title="Use in chat"
                >
                  Use
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center opacity-20 uppercase font-black text-[10px] tracking-[0.4em]">
            Blueprints Not Found
          </div>
        )}
      </div>
    </div>
  );
}
