"use client";

import {
  Code2,
  Video,
  Image as ImageIcon,
  Mic,
  Music,
  Scissors,
  Bot,
  Workflow,
  LayoutTemplate,
  Plus,
  Palette,
  Layers,
  Film,
  Radio,
  Zap,
  Compass,
  PenTool,
  Settings,
  CloudRain,
  LayoutDashboard,
  DollarSign,
  Cpu,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const commandItems = [
  { id: "dashboard", title: "Studio Dashboard", icon: LayoutDashboard, badge: "Main" },
  { id: "content-engine", title: "AI Command Chat", icon: PenTool },
];

const createItems = [
  { id: "image-gen", title: "FLUX.2 Image Studio", icon: ImageIcon, badge: "Free" },
  { id: "video-gen", title: "Wan 2.1 Video Studio", icon: Video, badge: "OSS" },
  { id: "voice-clone", title: "Kokoro-82M Voice", icon: Mic, badge: "82M" },
  { id: "music-gen", title: "MusicGen Studio", icon: Music },
  { id: "documentary-montage", title: "75s Rain Documentary", icon: CloudRain, badge: "Cinematic" },
  { id: "cartoon-gen", title: "Cartoon Episodes", icon: Film },
  { id: "podcast", title: "Podcast Studio", icon: Radio },
  { id: "web-builder", title: "Web & Code Builder", icon: Code2 },
  { id: "video-edit", title: "Timeline Video Editor", icon: Scissors },
];

const agentItems = [
  { id: "agents", title: "Autonomous Fleet", icon: Bot, badge: "Memory" },
  { id: "monetization", title: "Monetization Suite", icon: DollarSign, badge: "Agency" },
  { id: "workflows", title: "Workflows (n8n/Mastra)", icon: Workflow },
  { id: "autonomous", title: "Autonomous Tasks", icon: Compass },
  { id: "automations", title: "Event Automations", icon: Zap },
];

const resourceItems = [
  { id: "templates", title: "Templates", icon: LayoutTemplate },
  { id: "themes", title: "Themes & Visuals", icon: Palette },
  { id: "layouts", title: "Layouts Gallery", icon: Layers },
];

export function AppSidebar({
  activeSection,
  setActiveSection,
}: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-border/70 bg-sidebar/95 backdrop-blur-xl">
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveSection("dashboard")}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/25 border border-primary/40 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-foreground">NOVUM</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                  STUDIOS
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">Autonomous Engine v4.2</div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-3">
        <div className="px-2 pt-1">
          <Button
            className="w-full h-9 justify-start gap-2 rounded-lg font-semibold text-xs shadow-sm bg-primary/90 hover:bg-primary text-primary-foreground"
            onClick={() => setActiveSection("dashboard")}
            aria-label="Open studio dashboard"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Open Command Center
          </Button>
        </div>

        {/* Command Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground/80 mb-0.5">
            Command
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commandItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-8.5 px-2.5 rounded-lg text-xs font-medium"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 font-mono ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Creative Suite Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground/80 mb-0.5">
            Creative Generation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-8.5 px-2.5 rounded-lg text-xs font-medium"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 font-mono text-muted-foreground border-border/80 ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Agents & Orchestration Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground/80 mb-0.5">
            Agents & Memory
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {agentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-8.5 px-2.5 rounded-lg text-xs font-medium"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 font-mono ml-auto ${
                          item.id === "monetization"
                            ? "text-emerald-400 border-emerald-500/30"
                            : "text-muted-foreground border-border/80"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Resources Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-muted-foreground/80 mb-0.5">
            Design & Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-8.5 px-2.5 rounded-lg text-xs font-medium"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-xs">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/50">
        <div className="flex items-center justify-between rounded-xl p-2.5 bg-muted/40 border border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground">Local/Cloud Ready</span>
              <span className="text-[9px] text-muted-foreground font-mono">14 Free Models</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => setActiveSection("themes")}
            title="Settings & Themes"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
