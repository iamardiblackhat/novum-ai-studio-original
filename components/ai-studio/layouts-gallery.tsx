"use client";

import { useState } from "react";
import {
  Layout,
  Grid,
  Columns,
  Layers,
  Maximize2,
  Sparkles,
  Star,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

type LayoutCategory = "All" | "Dashboard" | "Landing" | "Content" | "Creative";

interface AppLayout {
  id: string;
  name: string;
  category: Exclude<LayoutCategory, "All">;
  description: string;
  trending?: boolean;
  code: string;
}

const LAYOUTS: AppLayout[] = [
  {
    id: "bento",
    name: "Bento Grid",
    category: "Creative",
    description: "Asymmetric grid for high information density.",
    code: '<div className="grid grid-cols-4 gap-4">...</div>',
    trending: true,
  },
  {
    id: "holy-grail",
    name: "Standard Dashboard",
    category: "Dashboard",
    description: "Classic sidebar + header admin architecture.",
    code: '<div className="flex h-screen">...</div>',
  },
  {
    id: "magazine",
    name: "Magazine Editorial",
    category: "Content",
    description: "Typography-heavy asymmetric layout.",
    code: '<div className="grid grid-cols-3 gap-6">...</div>',
  },
];

export function LayoutsGallery() {
  const [category, setCategory] = useState<LayoutCategory>("All");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = LAYOUTS.filter((l) => {
    const matchCat = category === "All" || l.category === category;
    const q = query.toLowerCase();
    return (
      matchCat &&
      (l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="h-full bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="p-6 rounded-lg border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              UI Architecture
            </h2>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Production-ready structural patterns
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              placeholder="Filter blueprints..."
              className="pl-9 h-9 text-xs border-2"
            />
          </div>
        </div>

        <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
          <TabsList className="bg-muted/50 border h-9 p-1">
            {["All", "Dashboard", "Landing", "Content", "Creative"].map(
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((l) => (
            <Card
              key={l.id}
              className="p-5 border bg-card shadow-sm flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <Badge
                    variant="outline"
                    className="text-[7px] font-black uppercase tracking-widest"
                  >
                    {l.category}
                  </Badge>
                  {l.trending && (
                    <div className="flex items-center gap-1 text-[7px] font-black text-primary">
                      <Sparkles size={10} /> TRENDING 2026
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-bold uppercase tracking-tight truncate">
                  {l.name}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 uppercase leading-relaxed">
                  {l.description}
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-[9px] font-bold uppercase"
                  onClick={() => {
                    navigator.clipboard.writeText(l.code);
                    setCopied(l.id);
                    setTimeout(() => setCopied(null), 2000);
                  }}
                  title="Copy code"
                >
                  {copied === l.id ? (
                    <Check size={12} className="mr-1.5 text-emerald-500" />
                  ) : (
                    <Copy size={12} className="mr-1.5" />
                  )}
                  {copied === l.id ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  title="Full screen preview"
                >
                  <Maximize2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center opacity-20 uppercase font-black text-[10px] tracking-[0.4em]">
            Architecture Not Found
          </div>
        )}
      </div>
    </div>
  );
}
