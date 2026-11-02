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
  dashboard: "Studio Command",
  "web-builder": "Web Architect",
  "cartoon-gen": "Cartoon Episodes",
  podcast: "Podcast Studio",
  "video-gen": "Wan 2.1 Video",
  "image-gen": "FLUX.2 Diffuser",
  "voice-clone": "Kokoro-82M Voice",
  "music-gen": "MusicGen Studio",
  "documentary-montage": "Rain Documentary",
  "video-edit": "Video Editor",
  "ardi-sec": "ARDI Cybersecurity",
  agents: "Omnelia Fleet",
  workflows: "Workflows",
  autonomous: "Autonomous Tasks",
  automations: "Event Automations",
  templates: "Blueprints",
  themes: "Themes",
  layouts: "Layouts",
};

export function MobileHeader({ activeSection }: MobileHeaderProps) {
  return (
    <header className="flex md:hidden h-16 shrink-0 items-center justify-between border-b border-[rgba(87,241,239,0.15)] bg-[#090b11]/90 backdrop-blur-xl sticky top-0 z-50 px-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-10 w-10 rounded-xl bg-[rgba(87,241,239,0.1)] hover:bg-[rgba(87,241,239,0.2)] border border-[rgba(87,241,239,0.25)] transition-all active:scale-95 text-[#57f1ef]">
          <Menu className="h-5 w-5 text-[#57f1ef]" />
        </SidebarTrigger>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-tight uppercase leading-none text-foreground">
              {sectionTitles[activeSection] || "Command"}
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#57f1ef] animate-pulse" />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#57f1ef] uppercase tracking-widest leading-none mt-0.5">
            Omnelia SI
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
