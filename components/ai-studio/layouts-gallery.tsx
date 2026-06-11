"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Grid,
  Columns,
  Layers,
  Maximize2,
  Sparkles,
  Star,
  Smartphone,
  Laptop,
  Tablet,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LayoutCategory = "All" | "Dashboard" | "Landing" | "Content" | "Creative";

type AppLayout = {
  id: string;
  name: string;
  category: Exclude<LayoutCategory, "All">;
  description: string;
  trending?: boolean;
  preview: React.ReactNode;
  code: string;
};

const LAYOUTS: AppLayout[] = [
  {
    id: "bento",
    name: "Bento Grid",
    category: "Creative",
    description:
      "Modern asymmetric grid layout popularised by Apple. High information density with a premium feel.",
    trending: true,
    preview: (
      <div className="grid grid-cols-4 grid-rows-3 gap-2 h-full p-2">
        <div className="col-span-2 row-span-2 rounded-lg bg-primary/20 border border-primary/30" />
        <div className="col-span-2 rounded-lg bg-muted border" />
        <div className="rounded-lg bg-muted border" />
        <div className="rounded-lg bg-muted border" />
        <div className="col-span-2 rounded-lg bg-primary/40 border border-primary/50" />
      </div>
    ),
    code: '<div className="grid grid-cols-4 gap-4">\n  <div className="col-span-2 row-span-2">...</div>\n  <div className="col-span-2">...</div>\n  <div>...</div>\n  <div>...</div>\n  <div className="col-span-2">...</div>\n</div>',
  },
  {
    id: "holy-grail",
    name: "Holy Grail Dashboard",
    category: "Dashboard",
    description:
      "Classic sidebar-based dashboard with a header, multi-panel content area, and optional right utility bar.",
    preview: (
      <div className="flex h-full gap-2 p-2">
        <div className="w-8 rounded-lg bg-muted border" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 rounded-lg bg-muted border" />
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="col-span-2 rounded-lg bg-primary/20 border border-primary/30" />
            <div className="rounded-lg bg-muted border" />
          </div>
        </div>
      </div>
    ),
    code: '<div className="flex h-screen">\n  <aside className="w-64">...</aside>\n  <main className="flex-1 flex flex-col">\n    <header>...</header>\n    <div className="grid grid-cols-3">...</div>\n  </main>\n</div>',
  },
  {
    id: "magazine",
    name: "Magazine Editorial",
    category: "Content",
    description:
      "Asymmetric typography-heavy layout for deep reading and immersive visual storytelling.",
    preview: (
      <div className="grid grid-cols-3 grid-rows-4 gap-2 h-full p-2">
        <div className="col-span-3 row-span-2 rounded-lg bg-muted border" />
        <div className="col-span-2 row-span-2 rounded-lg bg-primary/20 border border-primary/30" />
        <div className="rounded-lg bg-muted border" />
        <div className="rounded-lg bg-muted border" />
      </div>
    ),
    code: '<div className="grid grid-cols-3 gap-6">\n  <article className="col-span-2">...</article>\n  <aside>...</aside>\n</div>',
  },
  {
    id: "split-hero",
    name: "Split Screen Hero",
    category: "Landing",
    description:
      "50/50 split layout focusing on a clear value proposition and a high-impact visual.",
    preview: (
      <div className="flex h-full gap-2 p-2">
        <div className="flex-1 rounded-lg bg-primary/10 border border-primary/20 flex flex-col justify-center p-2 gap-1">
          <div className="h-2 w-3/4 bg-primary/40 rounded" />
          <div className="h-1.5 w-1/2 bg-primary/30 rounded" />
          <div className="h-3 w-1/3 bg-primary rounded-md mt-1" />
        </div>
        <div className="flex-1 rounded-lg bg-muted border" />
      </div>
    ),
    code: '<div className="flex flex-col lg:flex-row min-h-[80vh]">\n  <div className="flex-1">Content</div>\n  <div className="flex-1">Visual</div>\n</div>',
  },
];

export function LayoutsGallery() {
  const [category, setCategory] = useState<LayoutCategory>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

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
    <div className="h-full bg-background transition-colors duration-500 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
              <Layers size={14} />
              <span className="text-xs font-bold uppercase tracking-widest">
                UI Architect
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Layout Blueprints
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Production-ready structural patterns for every interface type.
              Verified for responsiveness and modern aesthetics.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="h-10 px-4 rounded-xl border-dashed"
            >
              <Laptop size={14} className="mr-2 opacity-50" />
              Fully Responsive
            </Badge>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as any)}
            className="w-full md:w-auto overflow-x-auto"
          >
            <TabsList className="bg-muted/50 border p-1 rounded-xl h-11">
              {["All", "Dashboard", "Landing", "Content", "Creative"].map(
                (cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="text-xs px-6 rounded-lg"
                  >
                    {cat}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter patterns..."
              className="w-full bg-muted/30 border-2 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((layout) => (
              <LayoutCard
                key={layout.id}
                layout={layout}
                isSelected={selected === layout.id}
                onSelect={() =>
                  setSelected(selected === layout.id ? null : layout.id)
                }
              />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-3 opacity-50">
            <Layout size={40} className="mx-auto text-muted-foreground" />
            <p>No layouts match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LayoutCard({
  layout,
  isSelected,
  onSelect,
}: {
  layout: AppLayout;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(layout.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative rounded-3xl border-2 overflow-hidden transition-all duration-300 bg-card ${
        isSelected
          ? "border-primary ring-4 ring-primary/5"
          : "border-border hover:border-primary/20 shadow-sm"
      }`}
    >
      {/* Visual Canvas */}
      <div
        className="h-56 relative bg-muted/20 transition-colors group-hover:bg-muted/30 cursor-pointer"
        onClick={onSelect}
      >
        <div className="absolute inset-0 p-6 transition-transform duration-500 group-hover:scale-105">
          <div className="h-full rounded-2xl bg-background border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden">
            {layout.preview}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg font-bold"
          >
            {isSelected ? "Collapse Pattern" : "Inspect Architecture"}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/5 text-primary border-primary/10"
          >
            {layout.category}
          </Badge>
          {layout.trending && (
            <div className="flex items-center gap-1 text-[10px] font-extrabold text-amber-500 animate-pulse">
              <Sparkles size={10} /> TRENDING 2026
            </div>
          )}
        </div>

        <div>
          <h4 className="font-bold text-xl tracking-tight">{layout.name}</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
            {layout.description}
          </p>
        </div>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4 pt-2"
            >
              <div className="relative group/code">
                <pre className="text-[11px] bg-muted p-4 rounded-2xl font-mono text-muted-foreground overflow-x-auto border-2 border-primary/5">
                  {layout.code}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-background border-2 opacity-0 group-hover/code:opacity-100 transition-opacity hover:border-primary hover:text-primary"
                >
                  {copied ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-primary/10">
                  Implement Pattern
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl h-12 w-12 border-2"
                >
                  <ExternalLink size={18} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
