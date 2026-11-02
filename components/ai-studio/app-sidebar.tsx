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
  Shield,
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
  { id: "image-gen", title: "FLUX.2 Image Diffuser", icon: ImageIcon, badge: "Free" },
  { id: "video-gen", title: "Wan 2.1 Video Studio", icon: Video, badge: "OSS" },
  { id: "voice-clone", title: "Kokoro-82M Voice", icon: Mic, badge: "82M" },
  { id: "music-gen", title: "MusicGen Studio", icon: Music },
  { id: "documentary-montage", title: "75s Rain Documentary", icon: CloudRain, badge: "Cinematic" },
  { id: "cartoon-gen", title: "Cartoon Episodes", icon: Film },
  { id: "podcast", title: "Podcast Studio", icon: Radio },
  { id: "web-builder", title: "Web & Code Architect", icon: Code2 },
  { id: "video-edit", title: "Timeline Video Editor", icon: Scissors },
];

const agentItems = [
  { id: "ardi-sec", title: "ARDI Cybersecurity", icon: Shield, badge: "Defense" },
  { id: "agents", title: "Autonomous Fleet", icon: Bot, badge: "Memory" },
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
    <Sidebar className="border-r border-[rgba(87,241,239,0.15)] bg-[#07090e]/95 backdrop-blur-2xl">
      <SidebarHeader className="p-4 border-b border-[rgba(87,241,239,0.12)]">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveSection("dashboard")}
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(87,241,239,0.1)] border border-[rgba(87,241,239,0.3)] shadow-[0_0_15px_rgba(87,241,239,0.2)] group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/branding/omnelia-icon-180.png"
                alt="Omnelia SI"
                className="h-7 w-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <Sparkles className="h-4.5 w-4.5 text-[#57f1ef] hidden" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-[#f3f4f8]">OMNELIA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[rgba(87,241,239,0.15)] text-[#57f1ef] border border-[rgba(87,241,239,0.3)] font-bold">
                  SI
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">Superintelligence Studio</div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-3">
        <div className="px-2 pt-1">
          <Button
            className="w-full h-9 justify-start gap-2 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(87,241,239,0.2)] bg-[#57f1ef] hover:bg-[#57f1ef]/90 text-[#090b11]"
            onClick={() => setActiveSection("dashboard")}
            aria-label="Open studio dashboard"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Command Center
          </Button>
        </div>

        {/* Command Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-[#57f1ef]/80 mb-0.5">
            Command
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commandItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`h-8.5 px-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeSection === item.id
                        ? "bg-[rgba(87,241,239,0.12)] text-[#57f1ef] border border-[rgba(87,241,239,0.3)] shadow-[0_0_12px_rgba(87,241,239,0.15)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-[rgba(87,241,239,0.05)]"
                    }`}
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-[#57f1ef]" : "text-muted-foreground"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 font-mono ml-auto bg-[rgba(26,32,53,0.8)] border border-[rgba(87,241,239,0.2)]"
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
          <SidebarGroupLabel className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-[#c7a0ff]/80 mb-0.5">
            Creative Generation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`h-8.5 px-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeSection === item.id
                        ? "bg-[rgba(87,241,239,0.12)] text-[#57f1ef] border border-[rgba(87,241,239,0.3)] shadow-[0_0_12px_rgba(87,241,239,0.15)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-[rgba(87,241,239,0.05)]"
                    }`}
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-[#57f1ef]" : "text-muted-foreground"
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
          <SidebarGroupLabel className="px-2 text-[10px] uppercase font-mono font-bold tracking-wider text-[#ffadd7]/80 mb-0.5">
            Fleet &amp; Security
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {agentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`h-8.5 px-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeSection === item.id
                        ? "bg-[rgba(87,241,239,0.12)] text-[#57f1ef] border border-[rgba(87,241,239,0.3)] shadow-[0_0_12px_rgba(87,241,239,0.15)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-[rgba(87,241,239,0.05)]"
                    }`}
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-[#57f1ef]" : "text-muted-foreground"
                      }`}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 font-mono ml-auto ${
                          item.id === "ardi-sec"
                            ? "text-[#57f1ef] border-[rgba(87,241,239,0.3)]"
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
            Design &amp; Layouts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-8.5 px-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[rgba(87,241,239,0.05)]"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        activeSection === item.id ? "text-[#57f1ef]" : "text-muted-foreground"
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

      <SidebarFooter className="p-3 border-t border-[rgba(87,241,239,0.12)]">
        <div className="flex items-center justify-between rounded-xl p-2.5 bg-[rgba(14,18,29,0.9)] border border-[rgba(87,241,239,0.2)]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#57f1ef] animate-ping" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground">Omnelia SI Mesh</span>
              <span className="text-[9px] text-muted-foreground font-mono">14 Free OSS Models</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-[#57f1ef]"
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
