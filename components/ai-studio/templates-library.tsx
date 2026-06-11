"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Copy,
  ExternalLink,
  Zap,
  Globe,
  MessageSquare,
  Image,
  Music,
  Video,
  Mic,
  Code,
  BarChart,
  Mail,
  ShoppingCart,
  BookOpen,
  Cpu,
  Filter,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Category =
  | "all"
  | "chat"
  | "image"
  | "video"
  | "audio"
  | "web"
  | "code"
  | "business";

type Template = {
  id: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  icon: React.ReactNode;
  tags: string[];
  prompt: string;
  uses: number;
  featured?: boolean;
  difficulty: "Beginner" | "Intermediate" | "Expert";
};

const TEMPLATES: Template[] = [
  // Chat
  {
    id: "c1",
    title: "Strategy Consultant",
    category: "chat",
    description:
      "Elite business advisor for market analysis and growth planning.",
    icon: <BarChart size={18} />,
    tags: ["strategy", "business"],
    prompt:
      "You are an elite business strategy consultant. Provide detailed, actionable advice considering market dynamics and competitive landscape.",
    uses: 4821,
    featured: true,
    difficulty: "Intermediate",
  },
  {
    id: "c2",
    title: "Senior Code Reviewer",
    category: "chat",
    description: "Detailed code analysis for performance, security, and bugs.",
    icon: <Code size={18} />,
    tags: ["code", "review"],
    prompt:
      "Review this code for: 1) Logic errors, 2) Security issues, 3) Performance, 4) Style. Provide line-by-line feedback.",
    uses: 3620,
    difficulty: "Expert",
  },
  // Image
  {
    id: "i1",
    title: "Studio Product Shot",
    category: "image",
    description: "Clean, professional photography style for brand products.",
    icon: <Image size={18} />,
    tags: ["product", "photography"],
    prompt:
      "Professional product photography, studio lighting, white seamless background, 8K resolution, sharp focus.",
    uses: 7230,
    featured: true,
    difficulty: "Beginner",
  },
  {
    id: "i2",
    title: "Cyberpunk Aesthetic",
    category: "image",
    description: "Neon-drenched cityscapes with futuristic atmosphere.",
    icon: <Image size={18} />,
    tags: ["cyberpunk", "sci-fi"],
    prompt:
      "Cyberpunk cityscape at night, neon signs, wet streets, holographic advertisements, cinematic lighting.",
    uses: 6112,
    difficulty: "Intermediate",
  },
  // Video
  {
    id: "v1",
    title: "Cinematic Drone Flyover",
    category: "video",
    description: "Epic aerial shots of breathtaking natural landscapes.",
    icon: <Video size={18} />,
    tags: ["landscape", "drone"],
    prompt:
      "Aerial cinematic shot over dramatic mountain landscape at golden hour, slow motion, volumetric clouds.",
    uses: 3201,
    featured: true,
    difficulty: "Intermediate",
  },
  // Audio
  {
    id: "a1",
    title: "Modern Podcast Jingle",
    category: "audio",
    description: "Catchy, high-energy intro music for tech podcasts.",
    icon: <Mic size={18} />,
    tags: ["podcast", "jingle"],
    prompt:
      "Upbeat modern electronic podcast intro, 15 seconds, builds energy, clean professional mix.",
    uses: 4100,
    difficulty: "Beginner",
  },
  // Web
  {
    id: "w1",
    title: "AI SaaS Landing",
    category: "web",
    description: "Conversion-optimised landing page for AI startups.",
    icon: <Globe size={18} />,
    tags: ["saas", "landing"],
    prompt:
      "Build a modern SaaS landing page with hero, features grid, pricing table, and FAQ. Dark theme, Tailwind CSS.",
    uses: 5920,
    featured: true,
    difficulty: "Intermediate",
  },
  // Code
  {
    id: "code1",
    title: "Type-Safe API Route",
    category: "code",
    description: "Next.js API route with Zod validation and error handling.",
    icon: <Cpu size={18} />,
    tags: ["api", "typescript"],
    prompt:
      "Generate a Next.js API route with Zod input validation, proper error handling, and Prisma DB query.",
    uses: 4200,
    featured: true,
    difficulty: "Expert",
  },
];

export function TemplatesLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

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
    <div className="h-full bg-background transition-colors duration-500 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
            <Sparkles size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Blueprint Hub
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Prompt Templates
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Optimised engineering patterns for every AI modality. Jumpstart your
            workflow with verified high-performance prompts.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search library..."
              className="pl-10 h-11 bg-muted/30 border-2 focus-visible:ring-primary/20 rounded-xl"
            />
          </div>
          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as any)}
            className="w-full md:w-auto overflow-x-auto"
          >
            <TabsList className="bg-muted/50 border p-1 rounded-xl h-11">
              {[
                "all",
                "chat",
                "image",
                "video",
                "audio",
                "web",
                "code",
                "business",
              ].map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs px-4 rounded-lg capitalize"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((template) => (
              <TemplateCard
                key={template.id}
                t={template}
                isExpanded={expanded === template.id}
                onExpand={() =>
                  setExpanded(expanded === template.id ? null : template.id)
                }
                isCopied={copied === template.id}
                onCopy={() => {
                  navigator.clipboard.writeText(template.prompt);
                  setCopied(template.id);
                  setTimeout(() => setCopied(null), 2000);
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center opacity-50">
            <BookOpen
              size={40}
              className="mx-auto mb-4 text-muted-foreground"
            />
            <p className="font-medium text-lg">No templates found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({
  t,
  isExpanded,
  onExpand,
  isCopied,
  onCopy,
}: {
  t: Template;
  isExpanded: boolean;
  onExpand: () => void;
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group rounded-3xl border-2 transition-all duration-300 bg-card overflow-hidden ${
        isExpanded
          ? "border-primary ring-4 ring-primary/5"
          : "border-border hover:border-primary/20 shadow-sm"
      }`}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isExpanded ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
          >
            {t.icon}
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] font-bold ${
              t.difficulty === "Expert"
                ? "border-red-500/50 text-red-500"
                : t.difficulty === "Intermediate"
                  ? "border-amber-500/50 text-amber-500"
                  : "border-emerald-500/50 text-emerald-500"
            }`}
          >
            {t.difficulty}
          </Badge>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-lg">{t.title}</h4>
            {t.featured && (
              <Star size={14} className="text-amber-400 fill-amber-400" />
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {t.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full bg-muted text-muted-foreground border"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-2 flex gap-2">
          <Button
            className="flex-1 rounded-xl h-10 font-bold text-xs"
            onClick={onExpand}
            variant={isExpanded ? "secondary" : "default"}
          >
            {isExpanded ? "Close Preview" : "View Blueprint"}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-xl h-10 w-10 shrink-0"
            onClick={onCopy}
          >
            {isCopied ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <Copy size={16} />
            )}
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4"
            >
              <div className="p-4 rounded-2xl bg-muted/50 border font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap">
                {t.prompt}
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest px-1">
                <span>Used {t.uses.toLocaleString()} times</span>
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                  Open in Studio <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
