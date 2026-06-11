"use client";

import {
  Code2,
  Video,
  Image,
  Mic,
  Music,
  Scissors,
  Bot,
  Workflow,
  LayoutTemplate,
  Settings,
  HelpCircle,
  Sparkles,
  Plus,
  MessageSquare,
  History,
  ChevronDown,
  Palette,
  Layers,
  Film,
  Radio,
  Zap,
  Star,
  Compass,
  ArrowUpRight,
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const createItems = [
  { id: "web-builder", title: "Web Builder", icon: Code2, badge: "PRO" },
  { id: "cartoon-gen", title: "Cartoon Episodes", icon: Film },
  { id: "podcast", title: "Podcast Studio", icon: Radio },
  { id: "video-gen", title: "Video Generation", icon: Video },
  { id: "image-gen", title: "Image Generation", icon: Image },
  { id: "voice-clone", title: "Voice Cloning", icon: Mic },
  { id: "music-gen", title: "Music Studio", icon: Music },
  { id: "video-edit", title: "Video Editor", icon: Scissors },
];

const agentItems = [
  { id: "agents", title: "Agent Fleet", icon: Bot },
  { id: "workflows", title: "Logic Flows", icon: Workflow },
  { id: "autonomous", title: "Autonomous", icon: Compass },
  { id: "automations", title: "AI Automations", icon: Zap, badge: "NEW" },
  {
    id: "content-engine",
    title: "Content Engine",
    icon: PenTool,
    badge: "POWER",
  },
];

const resourceItems = [
  { id: "templates", title: "Blueprints", icon: LayoutTemplate },
  { id: "themes", title: "Aesthetics", icon: Palette },
  { id: "layouts", title: "Architecture", icon: Layers },
];

export function AppSidebar({
  activeSection,
  setActiveSection,
}: AppSidebarProps) {
  return (
    <Sidebar className="border-r-2 border-primary/5 bg-sidebar transition-all duration-300">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 rotate-3">
              <Sparkles className="h-5 w-5 text-primary-foreground -rotate-3" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight uppercase">
                Novum
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  Studio
                </span>
                <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 gap-0">
        <div className="px-3 mb-6">
          <Button
            className="w-full h-12 justify-start gap-3 rounded-2xl font-bold shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all border-b-4 border-primary/20 active:border-b-0 active:translate-y-1"
            onClick={() => setActiveSection("web-builder")}
          >
            <div className="bg-primary-foreground/20 p-1.5 rounded-xl">
              <Plus className="h-4 w-4" />
            </div>
            Forge New Project
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
            Creative Core
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {createItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    tooltip={item.title}
                    className={`h-11 rounded-xl px-4 transition-all duration-300 ${activeSection === item.id ? "bg-primary/5 font-bold shadow-sm" : "hover:bg-muted"}`}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-transform duration-300 ${activeSection === item.id ? "scale-110 text-primary" : "text-muted-foreground group-hover:scale-110"}`}
                    />
                    <span className="text-sm">{item.title}</span>
                    {item.badge && (
                      <Badge
                        className={`ml-auto text-[9px] font-black px-1.5 h-4 ${item.badge === "PRO" ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary"}`}
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

        <SidebarSeparator className="my-4 opacity-50 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
            Orchestration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {agentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    tooltip={item.title}
                    className={`h-11 rounded-xl px-4 transition-all duration-300 ${activeSection === item.id ? "bg-primary/5 font-bold shadow-sm" : "hover:bg-muted"}`}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-transform duration-300 ${activeSection === item.id ? "scale-110 text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">{item.title}</span>
                    {item.badge && (
                      <Badge className="ml-auto text-[9px] font-black px-1.5 h-4 bg-primary animate-pulse">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 opacity-50 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
            Assets & Systems
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    tooltip={item.title}
                    className={`h-11 rounded-xl px-4 transition-all duration-300 ${activeSection === item.id ? "bg-primary/5 font-bold shadow-sm" : "hover:bg-muted"}`}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-transform duration-300 ${activeSection === item.id ? "scale-110 text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 py-6">
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 space-y-3 overflow-hidden relative group">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Elite Upgrade
                </span>
              </div>
              <p className="text-xs font-medium leading-tight">
                Unlock Multi-Agent Architectures
              </p>
              <Button
                size="sm"
                className="w-full h-8 rounded-lg text-[10px] font-bold group-hover:scale-105 transition-transform"
              >
                Go Infinite <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-muted/30 border-t-2 border-primary/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 rounded-2xl p-3 hover:bg-background/80 border border-transparent hover:border-primary/10 transition-all cursor-pointer group">
              <Avatar className="h-10 w-10 border-2 border-primary/10 transition-transform group-hover:scale-110">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="text-sm font-black tracking-tight">
                  Aaron Account
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Enterprise Tier
                  </p>
                </div>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground group-hover:rotate-90 transition-transform duration-500" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
