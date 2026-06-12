"use client";

import { useState, useEffect } from "react";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
    id: "studio-light",
    name: "Studio Light",
    category: "Modern",
    description: "Default production environment for high-density workflows.",
    preview: {
      bg: "#ffffff",
      sidebar: "#f8fafc",
      card: "#ffffff",
      accent: "#7c3aed",
      text: "#0f172a",
      border: "#e2e8f0",
    },
    vars: {
      "--background": "0 0% 100%",
      "--foreground": "222 47% 11%",
      "--primary": "263 70% 50%",
      "--sidebar": "210 40% 98%",
    },
  },
  {
    id: "studio-dark",
    name: "Studio Dark",
    category: "Modern",
    description: "Low-light optimized interface for nocturnal engineering.",
    preview: {
      bg: "#09090b",
      sidebar: "#111113",
      card: "#18181b",
      accent: "#7c3aed",
      text: "#f4f4f5",
      border: "#27272a",
    },
    vars: {
      "--background": "240 10% 3.9%",
      "--foreground": "0 0% 98%",
      "--primary": "263 70% 50%",
    },
  },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  localStorage.setItem("studio-theme", theme.id);
}

export function ThemesManager() {
  const [active, setActive] = useState<string>("studio-dark"); // Much darker default for the entire studio (sinister, low-light, production dark aesthetic for the whole project cover)
  const [category, setCategory] = useState<"All" | "Modern" | "Retro" | "Playful" | "Artistic">("All");

  useEffect(() => {
    const stored = localStorage.getItem("studio-theme");
    if (stored) setActive(stored);
  }, []);

  const handleApply = (theme: Theme) => {
    setActive(theme.id);
    applyTheme(theme);
  };

  const filteredThemes =
    category === "All" ? THEMES : THEMES.filter((t) => t.category === category);

  return (
  <div className="h-full bg-background overflow-y-auto">
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="p-6 rounded-lg border bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Studio Aesthetics
            </h2>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Global CSS Variable Architecture
            </p>
          </div>
          <Tabs
            value={category}
            onValueChange={(v) =>
              setCategory(
                v as "All" | "Modern" | "Retro" | "Playful" | "Artistic",
              )
            }
          >
            <TabsList className="bg-background border h-9">
              {["All", "Modern", "Retro", "Playful", "Artistic"].map((cat) => (
                <TabsTrigger
                  key={`cat-${cat}`}
                  value={cat}
                  className="text-[10px] font-bold uppercase px-4"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThemes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleApply(theme)}
              className={cn(
                "w-full text-left p-4 border-2 transition-all cursor-pointer group shadow-sm rounded-lg bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active === theme.id
                  ? "border-primary"
                  : "border-transparent hover:border-primary/20",
              )}
              aria-label={`Apply ${theme.name} theme`}
            >
              <div
                className="h-32 rounded border relative mb-4 flex overflow-hidden shadow-inner"
                style={{ backgroundColor: theme.preview.bg }}
              >
                <div
                  className="w-10 h-full border-r"
                  style={{ backgroundColor: theme.preview.sidebar }}
                />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted/20" />
                  <div
                    className="h-10 w-full rounded border flex items-center justify-center"
                    style={{ backgroundColor: theme.preview.card }}
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: theme.preview.accent }}
                    />
                  </div>
                </div>
                {active === theme.id && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <Check size={12} className="text-primary-foreground" />
                  </div>
                )}
              </div>
              <h4 className="text-xs font-bold uppercase">{theme.name}</h4>
              <p className="text-[10px] text-muted-foreground uppercase mt-1 leading-relaxed">
                {theme.description}
              </p>
            </button>
          ))}
        </div>

        <Card className="p-6 border bg-muted/10 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase">System Integration</h4>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              Export current configuration to production.css
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-[10px] font-bold uppercase"
            aria-label="Export variables"
          >
            <Download size={14} className="mr-2" /> Export Variables
          </Button>
        </Card>
      </div>
    </div>
  );
}
