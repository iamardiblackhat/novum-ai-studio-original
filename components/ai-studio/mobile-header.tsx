"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MobileHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const sectionTitles: Record<string, string> = {
  "web-builder": "Web Builder",
  "cartoon-gen": "Cartoon Episodes",
  podcast: "Podcast Studio",
  "video-gen": "Video Generation",
  "image-gen": "Image Generation",
  "voice-clone": "Voice Cloning",
  "music-gen": "Music Studio",
  "video-edit": "Video Editor",
  agents: "Agent Fleet",
  workflows: "Logic Flows",
  autonomous: "Autonomous",
  automations: "AI Automations",
  templates: "Blueprints",
  themes: "Aesthetics",
  layouts: "Architecture",
};

export function MobileHeader({ activeSection }: MobileHeaderProps) {
  return (
    <header className="flex md:hidden h-16 shrink-0 items-center justify-between border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 px-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-10 w-10 rounded-xl bg-primary/5 hover:bg-primary/10 border-2 border-primary/5 transition-all active:scale-95">
          <Menu className="h-5 w-5 text-primary" />
        </SidebarTrigger>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-tight uppercase leading-none">
              {sectionTitles[activeSection]}
            </span>
            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
            Novum Studio
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl hover:bg-primary/5 relative"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-background" />
        </Button>
        <Avatar className="h-9 w-9 border-2 border-primary/10">
          <AvatarFallback className="bg-primary text-primary-foreground font-black text-[10px]">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
