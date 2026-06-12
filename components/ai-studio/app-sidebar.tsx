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
import { ThemeToggle } from "./theme-toggle";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const createItems = [
  { id: "web-builder", title: "Web Builder", icon: Code2 },
  { id: "cartoon-gen", title: "Cartoon Episodes", icon: Film },
  { id: "podcast", title: "Podcast Studio", icon: Radio },
  { id: "video-gen", title: "Video Generation", icon: Video },
  { id: "image-gen", title: "Image Generation", icon: ImageIcon },
  { id: "voice-clone", title: "Voice Cloning", icon: Mic },
  { id: "music-gen", title: "Music Studio", icon: Music },
  { id: "video-edit", title: "Video Editor", icon: Scissors },
];

const agentItems = [
  { id: "agents", title: "Agents", icon: Bot },
  { id: "workflows", title: "Workflows", icon: Workflow },
  { id: "autonomous", title: "Autonomous Tasks", icon: Compass },
  { id: "automations", title: "AI Automations", icon: Zap },
  { id: "content-engine", title: "Content Engine", icon: PenTool },
];

const resourceItems = [
  { id: "templates", title: "Templates", icon: LayoutTemplate },
  { id: "themes", title: "Themes", icon: Palette },
  { id: "layouts", title: "Layouts", icon: Layers },
];

export function AppSidebar({
  activeSection,
  setActiveSection,
}: AppSidebarProps) {
  return (
    <Sidebar className="border-r bg-background">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">AI STUDIO</span>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-4">
        <div className="px-2 pt-2">
          <Button
            className="w-full h-10 justify-start gap-2 rounded-md font-medium"
            onClick={() => setActiveSection("web-builder")}
            aria-label="Create new project"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground mb-1">
            Create
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-9 px-2 rounded-md"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${activeSection === item.id ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground mb-1">
            Orchestration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {agentItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-9 px-2 rounded-md"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${activeSection === item.id ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground mb-1">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="h-9 px-2 rounded-md"
                    aria-label={item.title}
                  >
                    <item.icon
                      className={`h-4 w-4 ${activeSection === item.id ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors cursor-pointer group">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">Studio Operator</p>
            <p className="text-xs text-muted-foreground uppercase font-black text-[8px]">
              Open Source Tier
            </p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
