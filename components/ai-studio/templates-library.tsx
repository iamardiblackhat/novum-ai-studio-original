"use client";

import { useState } from "react";
import {
  Search,
  Star,
  Copy,
  ExternalLink,
  Zap,
  Globe,
  MessageSquare,
  ImageIcon,
  Music,
  Video,
  Mic,
  Code2,
  BarChart,
  Mail,
  ShoppingCart,
  BookOpen,
  Cpu,
  Filter,
  Check,
  Sparkles,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    id: "c1",
    title: "Consultant",
    category: "chat",
    description: "Elite advisor for market analysis.",
    prompt: "You are an elite business consultant...",
    uses: 4821,
    featured: true,
  },
  {
    id: "i1",
    title: "Product Shot",
    category: "image",
    description: "Studio photography style.",
    prompt: "Professional product photography...",
    uses: 7230,
    featured: true,
  },
  {
    id: "w1",
    title: "SaaS Landing",
    category: "web",
    description: "Optimized landing page.",
    prompt: "Build a modern SaaS landing page...",
    uses: 5920,
    featured: true,
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

        <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
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
