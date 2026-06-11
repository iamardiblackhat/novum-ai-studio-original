"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Check,
  RefreshCw,
  Download,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Layout,
  Type,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ThemeMode = "dark" | "light" | "system";

type Theme = {
  id: string;
  name: string;
  category: "Modern" | "Retro" | "Playful" | "Artistic";
  description: string;
  preview: {
    bg: string;
    sidebar: string;
    card: string;
    accent: string;
    text: string;
    border: string;
  };
  vars: Record<string, string>;
};

const THEMES: Theme[] = [
  {
    id: "cupcake",
    name: "Cupcake",
    category: "Playful",
    description: "Soft pastels and creamy whites. Inspired by daisyUI.",
    preview: {
      bg: "#faf7f5",
      sidebar: "#efeae6",
      card: "#ffffff",
      accent: "#65c3c8",
      text: "#291334",
      border: "#e5e7eb",
    },
    vars: {
      "--background": "30 33% 97%",
      "--foreground": "280 46% 14%",
      "--card": "0 0% 100%",
      "--card-foreground": "280 46% 14%",
      "--primary": "182 43% 59%",
      "--primary-foreground": "0 0% 100%",
      "--border": "210 20% 90%",
      "--muted": "30 18% 92%",
      "--muted-foreground": "280 10% 40%",
      "--accent": "320 60% 85%",
      "--sidebar": "30 15% 92%",
    },
  },
  {
    id: "retro",
    name: "Retro",
    category: "Retro",
    description: "Vintage sepia tones and bold borders. 80s computer feel.",
    preview: {
      bg: "#ece3ca",
      sidebar: "#e4d8b4",
      card: "#ffffff",
      accent: "#ef9995",
      text: "#282425",
      border: "#a49b82",
    },
    vars: {
      "--background": "45 37% 86%",
      "--foreground": "345 5% 15%",
      "--card": "0 0% 100%",
      "--card-foreground": "345 5% 15%",
      "--primary": "3 68% 76%",
      "--primary-foreground": "0 0% 100%",
      "--border": "45 15% 58%",
      "--muted": "45 30% 80%",
      "--muted-foreground": "345 5% 40%",
      "--accent": "180 30% 70%",
      "--sidebar": "45 35% 80%",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    category: "Artistic",
    description: "High-contrast neon yellow and magenta. Aggressive and bold.",
    preview: {
      bg: "#ffee00",
      sidebar: "#e6d700",
      card: "#ffffff",
      accent: "#ff00ff",
      text: "#000000",
      border: "#000000",
    },
    vars: {
      "--background": "56 100% 50%",
      "--foreground": "0 0% 0%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 0%",
      "--primary": "300 100% 50%",
      "--primary-foreground": "0 0% 100%",
      "--border": "0 0% 0%",
      "--muted": "56 100% 45%",
      "--muted-foreground": "0 0% 20%",
      "--accent": "180 100% 50%",
      "--sidebar": "56 100% 45%",
    },
  },
  {
    id: "aqua",
    name: "Aqua",
    category: "Modern",
    description: "Bright teals and deep ocean blues. Refreshing and clean.",
    preview: {
      bg: "#3abff8",
      sidebar: "#0ea5e9",
      card: "#ffffff",
      accent: "#0891b2",
      text: "#002b3d",
      border: "#bae6fd",
    },
    vars: {
      "--background": "199 94% 60%",
      "--foreground": "198 100% 12%",
      "--card": "0 0% 100%",
      "--card-foreground": "198 100% 12%",
      "--primary": "192 91% 36%",
      "--primary-foreground": "0 0% 100%",
      "--border": "199 89% 86%",
      "--muted": "199 94% 55%",
      "--muted-foreground": "198 60% 30%",
      "--accent": "187 100% 42%",
      "--sidebar": "199 89% 48%",
    },
  },
  {
    id: "lofi",
    name: "Lofi",
    category: "Artistic",
    description: "Minimal grayscale with a hand-drawn sketch aesthetic.",
    preview: {
      bg: "#ffffff",
      sidebar: "#f2f2f2",
      card: "#ffffff",
      accent: "#000000",
      text: "#000000",
      border: "#000000",
    },
    vars: {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 0%",
      "--primary": "0 0% 0%",
      "--primary-foreground": "0 0% 100%",
      "--border": "0 0% 0%",
      "--muted": "0 0% 95%",
      "--muted-foreground": "0 0% 40%",
      "--accent": "0 0% 90%",
      "--sidebar": "0 0% 95%",
    },
  },
  {
    id: "fantasy",
    name: "Fantasy",
    category: "Artistic",
    description: "Royal purples and gold accents. Magical and vibrant.",
    preview: {
      bg: "#6e0b75",
      sidebar: "#5a0960",
      card: "#ffffff",
      accent: "#f6d860",
      text: "#ffffff",
      border: "#8b1093",
    },
    vars: {
      "--background": "296 83% 25%",
      "--foreground": "0 0% 100%",
      "--card": "0 0% 100%",
      "--card-foreground": "296 83% 15%",
      "--primary": "48 91% 67%",
      "--primary-foreground": "296 83% 15%",
      "--border": "296 80% 32%",
      "--muted": "296 83% 20%",
      "--muted-foreground": "296 30% 80%",
      "--accent": "192 91% 36%",
      "--sidebar": "296 83% 20%",
    },
  },
  {
    id: "synthwave",
    name: "Synthwave",
    category: "Retro",
    description: "80s aesthetic with neon pinks and deep space purples.",
    preview: {
      bg: "#241b35",
      sidebar: "#1a1325",
      card: "#2d2342",
      accent: "#ff71ce",
      text: "#01cdfe",
      border: "#b967ff",
    },
    vars: {
      "--background": "259 32% 16%",
      "--foreground": "192 99% 50%",
      "--card": "259 30% 20%",
      "--card-foreground": "192 99% 50%",
      "--primary": "321 100% 72%",
      "--primary-foreground": "0 0% 100%",
      "--border": "273 100% 70%",
      "--muted": "259 32% 12%",
      "--muted-foreground": "259 20% 60%",
      "--accent": "179 100% 50%",
      "--sidebar": "259 32% 11%",
    },
  },
  {
    id: "claymorphism",
    name: "Claymorphism",
    category: "Playful",
    description: "Soft 3D extruded shapes with pastel colors.",
    preview: {
      bg: "#f0f4ff",
      sidebar: "#e0e7ff",
      card: "#ffffff",
      accent: "#818cf8",
      text: "#3730a3",
      border: "#c7d2fe",
    },
    vars: {
      "--background": "226 100% 97%",
      "--foreground": "236 54% 41%",
      "--card": "0 0% 100%",
      "--card-foreground": "236 54% 41%",
      "--primary": "235 90% 74%",
      "--primary-foreground": "0 0% 100%",
      "--border": "232 91% 89%",
      "--muted": "226 100% 94%",
      "--muted-foreground": "232 20% 60%",
      "--accent": "320 60% 85%",
      "--sidebar": "226 100% 94%",
    },
  },
  {
    id: "brutalist",
    name: "Brutalist",
    category: "Artistic",
    description: "Raw, unpolished design with heavy borders and high contrast.",
    preview: {
      bg: "#ffffff",
      sidebar: "#ffffff",
      card: "#ffffff",
      accent: "#fbbf24",
      text: "#000000",
      border: "#000000",
    },
    vars: {
      "--background": "0 0% 100%",
      "--foreground": "0 0% 0%",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 0%",
      "--primary": "45 96% 62%",
      "--primary-foreground": "0 0% 0%",
      "--border": "0 0% 0%",
      "--muted": "0 0% 100%",
      "--muted-foreground": "0 0% 30%",
      "--accent": "0 0% 100%",
      "--sidebar": "0 0% 100%",
    },
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    category: "Modern",
    description: "Translucent layers with frosted glass effects.",
    preview: {
      bg: "#f8fafc",
      sidebar: "#ffffff",
      card: "rgba(255,255,255,0.7)",
      accent: "#06b6d4",
      text: "#0f172a",
      border: "rgba(255,255,255,0.5)",
    },
    vars: {
      "--background": "210 40% 98%",
      "--foreground": "222 47% 11%",
      "--card": "0 0% 100%",
      "--card-foreground": "222 47% 11%",
      "--primary": "189 94% 43%",
      "--primary-foreground": "0 0% 100%",
      "--border": "0 0% 100%",
      "--muted": "210 40% 96%",
      "--muted-foreground": "215 16% 47%",
      "--accent": "210 40% 96%",
      "--sidebar": "0 0% 100%",
    },
  },
  {
    id: "y2k",
    name: "Y2K",
    category: "Retro",
    description: "Metallic chrome, lime green, and pixel-inspired patterns.",
    preview: {
      bg: "#d1d5db",
      sidebar: "#9ca3af",
      card: "#ffffff",
      accent: "#22c55e",
      text: "#111827",
      border: "#4b5563",
    },
    vars: {
      "--background": "215 14% 83%",
      "--foreground": "221 39% 11%",
      "--card": "0 0% 100%",
      "--card-foreground": "221 39% 11%",
      "--primary": "142 71% 45%",
      "--primary-foreground": "221 39% 11%",
      "--border": "215 14% 34%",
      "--muted": "215 14% 75%",
      "--muted-foreground": "215 10% 40%",
      "--accent": "215 14% 70%",
      "--sidebar": "215 14% 64%",
    },
  },
  {
    id: "notebook",
    name: "Notebook Chic",
    category: "Artistic",
    description: "Lined paper texture with ink blue accents.",
    preview: {
      bg: "#fffdf0",
      sidebar: "#f5f2d0",
      card: "#ffffff",
      accent: "#1e3a8a",
      text: "#1e293b",
      border: "#cbd5e1",
    },
    vars: {
      "--background": "54 100% 97%",
      "--foreground": "217 33% 17%",
      "--card": "0 0% 100%",
      "--card-foreground": "217 33% 17%",
      "--primary": "224 76% 33%",
      "--primary-foreground": "0 0% 100%",
      "--border": "214 32% 91%",
      "--muted": "54 50% 90%",
      "--muted-foreground": "217 10% 45%",
      "--accent": "54 50% 85%",
      "--sidebar": "54 50% 88%",
    },
  },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  localStorage.setItem("novum-theme", theme.id);
}

export function ThemesManager() {
  const [active, setActive] = useState<string>("cupcake");
  const [category, setCategory] = useState<
    "All" | "Modern" | "Retro" | "Playful" | "Artistic"
  >("All");
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("novum-theme");
    if (stored) setActive(stored);
  }, []);

  const handleApply = (theme: Theme) => {
    setActive(theme.id);
    applyTheme(theme);
    setSaved(theme.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const filteredThemes =
    category === "All" ? THEMES : THEMES.filter((t) => t.category === category);
  const activeTheme = THEMES.find((t) => t.id === active) || THEMES[0];

  return (
    <div className="h-full bg-background transition-colors duration-500 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-primary/5 p-8 border border-primary/10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Personalisation Engine
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Studio Aesthetics
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Instantly transform your workspace with curated design systems.
                Every choice adapts the entire studio&apos;s visual DNA.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {THEMES.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="w-10 h-10 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: t.preview.accent }}
                  />
                ))}
              </div>
              <div className="text-sm font-medium text-foreground bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border">
                12+ Presets
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>

        {/* Active Theme Spotlight */}
        <Card className="p-6 border-2 border-primary/20 shadow-xl shadow-primary/5 overflow-hidden relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 bg-primary/10 text-primary border-primary/20"
                >
                  Active Design System
                </Badge>
                <h3 className="text-2xl font-bold">{activeTheme.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTheme.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {Object.entries(activeTheme.preview).map(([key, color]) => (
                  <div key={key} className="space-y-1.5">
                    <div
                      className="w-12 h-12 rounded-2xl shadow-inner border"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-[10px] font-bold uppercase text-center text-muted-foreground">
                      {key}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApply(activeTheme)}>
                  <RefreshCw size={14} className="mr-2" /> Re-apply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const css = `:root {\n${Object.entries(activeTheme.vars)
                      .map(([k, v]) => `  ${k}: ${v};`)
                      .join("\n")}\n}`;
                    const blob = new Blob([css], { type: "text/css" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `novum-theme-${activeTheme.id}.css`;
                    a.click();
                  }}
                >
                  <Download size={14} className="mr-2" /> Export CSS
                </Button>
              </div>
            </div>

            <div
              className="relative h-48 rounded-2xl border shadow-lg overflow-hidden flex transition-all duration-500"
              style={{ backgroundColor: activeTheme.preview.bg }}
            >
              <div
                className="w-16 h-full transition-colors duration-500"
                style={{ backgroundColor: activeTheme.preview.sidebar }}
              />
              <div className="flex-1 p-4 space-y-3">
                <div
                  className="h-6 w-3/4 rounded-lg transition-colors duration-500"
                  style={{
                    backgroundColor: activeTheme.preview.card,
                    border: `1px solid ${activeTheme.preview.border}`,
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="h-20 rounded-xl transition-colors duration-500"
                    style={{
                      backgroundColor: activeTheme.preview.card,
                      border: `1px solid ${activeTheme.preview.border}`,
                    }}
                  />
                  <div
                    className="h-20 rounded-xl transition-colors duration-500 shadow-lg scale-105 z-10"
                    style={{ backgroundColor: activeTheme.preview.accent }}
                  />
                </div>
                <div
                  className="h-4 w-1/2 rounded-full transition-colors duration-500"
                  style={{ backgroundColor: activeTheme.preview.border }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Theme Explorer */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Layout size={18} className="text-primary" />
              <h3 className="font-bold text-lg">Design Explorer</h3>
            </div>
            <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
              <TabsList className="bg-muted/50 border">
                {["All", "Modern", "Retro", "Playful", "Artistic"].map(
                  (cat) => (
                    <TabsTrigger key={cat} value={cat} className="text-xs px-4">
                      {cat}
                    </TabsTrigger>
                  ),
                )}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isActive={active === theme.id}
                  isSaved={saved === theme.id}
                  onApply={handleApply}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeCard({
  theme,
  isActive,
  isSaved,
  onApply,
}: {
  theme: Theme;
  isActive: boolean;
  isSaved: boolean;
  onApply: (t: Theme) => void;
}) {
  const p = theme.preview;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className={`group rounded-3xl border-2 overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${
        isActive
          ? "border-primary ring-4 ring-primary/10"
          : "border-border hover:border-primary/30"
      }`}
      onClick={() => onApply(theme)}
    >
      {/* Visual Canvas */}
      <div
        className="h-32 relative flex transition-colors duration-500"
        style={{ backgroundColor: p.bg }}
      >
        <div
          className="w-10 h-full opacity-50 transition-colors duration-500"
          style={{ backgroundColor: p.sidebar }}
        />
        <div className="flex-1 p-3 space-y-2">
          <div
            className="h-3 w-3/4 rounded-full opacity-30 transition-colors duration-500"
            style={{ backgroundColor: p.text }}
          />
          <div className="flex gap-2">
            <div
              className="h-10 w-10 rounded-lg shadow-sm transition-colors duration-500"
              style={{
                backgroundColor: p.card,
                border: `1px solid ${p.border}`,
              }}
            />
            <div
              className="h-10 w-10 rounded-lg shadow-md transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: p.accent }}
            />
          </div>
          <div
            className="h-2 w-1/2 rounded-full opacity-10 transition-colors duration-500"
            style={{ backgroundColor: p.text }}
          />
        </div>

        {isActive && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Check size={12} className="text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-card border-t" style={{ borderColor: p.border }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {theme.category}
          </span>
          {isSaved && (
            <Badge
              variant="secondary"
              className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              Applied
            </Badge>
          )}
        </div>
        <h4 className="font-bold text-sm text-foreground">{theme.name}</h4>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
          {theme.description}
        </p>
      </div>
    </motion.div>
  );
}
