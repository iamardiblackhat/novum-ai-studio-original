"use client";

import { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ai-studio/app-sidebar";
import { MobileHeader } from "@/components/ai-studio/mobile-header";
import { StudioDashboard } from "@/components/ai-studio/dashboard";
import { MonetizationAgents } from "@/components/ai-studio/monetization-agents";
import { WebBuilder } from "@/components/ai-studio/web-builder";
import { ImageGenerator } from "@/components/ai-studio/image-generator";
import { VideoGenerator } from "@/components/ai-studio/video-generator";
import { VoiceCloning } from "@/components/ai-studio/voice-cloning";
import { MusicStudio } from "@/components/ai-studio/music-studio";
import { VideoEditor } from "@/components/ai-studio/video-editor";
import { DocumentaryMontage } from "@/components/ai-studio/documentary-montage";
import { AgentsManager } from "@/components/ai-studio/agents-manager";
import { WorkflowsManager } from "@/components/ai-studio/workflows-manager";
import { AutonomousTasks } from "@/components/ai-studio/autonomous-tasks";
import { TemplatesLibrary } from "@/components/ai-studio/templates-library";
import { ThemesManager } from "@/components/ai-studio/themes-manager";
import { LayoutsGallery } from "@/components/ai-studio/layouts-gallery";
import { CartoonEpisodeGenerator } from "@/components/ai-studio/cartoon-episode-generator";
import { PodcastStudio } from "@/components/ai-studio/podcast-studio";
import { AutomationsBuilder } from "@/components/ai-studio/automations-builder";
import { PromptEnhancer } from "@/components/ai-studio/prompt-enhancer";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

const sectionTitles: Record<string, string> = {
  dashboard: "Studio Command Dashboard",
  "content-engine": "AI Command Console",
  "image-gen": "FLUX.2 Image Studio",
  "video-gen": "Wan 2.1 Video Studio",
  "voice-clone": "Kokoro-82M Voice Studio",
  "music-gen": "MusicGen Audio Studio",
  "documentary-montage": "75s Rainy Documentary Finisher",
  "cartoon-gen": "Cartoon Episode Generator",
  podcast: "Podcast Studio",
  "web-builder": "Full-Stack Web Architect",
  "video-edit": "Timeline Video Editor",
  agents: "Autonomous Agent Fleet & Memory",
  monetization: "Commercial & Monetization Engine",
  workflows: "Workflows & Pipelines",
  autonomous: "Autonomous Tasks",
  automations: "Event Automations",
  templates: "Production Templates",
  themes: "Themes & Visual Styles",
  layouts: "Layouts Gallery",
};

const sectionCategories: Record<string, string> = {
  dashboard: "Command",
  "content-engine": "Command",
  "image-gen": "Creative Studio",
  "video-gen": "Creative Studio",
  "voice-clone": "Creative Studio",
  "music-gen": "Creative Studio",
  "documentary-montage": "Creative Studio",
  "cartoon-gen": "Creative Studio",
  podcast: "Creative Studio",
  "web-builder": "Creative Studio",
  "video-edit": "Creative Studio",
  agents: "Agents & Memory",
  monetization: "Commercial OS",
  workflows: "Agents & Memory",
  autonomous: "Agents & Memory",
  automations: "Agents & Memory",
  templates: "Resources",
  themes: "Resources",
  layouts: "Resources",
};

export default function AIStudio() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <StudioDashboard onNavigate={setActiveSection} />;
      case "monetization":
        return <MonetizationAgents />;
      case "image-gen":
        return <ImageGenerator />;
      case "video-gen":
        return <VideoGenerator />;
      case "voice-clone":
        return <VoiceCloning />;
      case "music-gen":
        return <MusicStudio />;
      case "documentary-montage":
        return <DocumentaryMontage />;
      case "cartoon-gen":
        return <CartoonEpisodeGenerator />;
      case "podcast":
        return <PodcastStudio />;
      case "web-builder":
        return <WebBuilder />;
      case "video-edit":
        return <VideoEditor />;
      case "agents":
        return <AgentsManager />;
      case "workflows":
        return <WorkflowsManager />;
      case "autonomous":
        return <AutonomousTasks />;
      case "automations":
        return <AutomationsBuilder />;
      case "content-engine":
        return <PromptEnhancer />;
      case "templates":
        return <TemplatesLibrary />;
      case "themes":
        return <ThemesManager />;
      case "layouts":
        return <LayoutsGallery />;
      default:
        return <StudioDashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AppSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navbar */}
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 px-4 bg-background/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block text-xs font-mono text-muted-foreground uppercase">
                    {sectionCategories[activeSection] || "Studio"}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold text-xs">
                      {sectionTitles[activeSection] || "Overview"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border/50 text-[11px] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-muted-foreground">Engine:</span>
                <span className="text-foreground font-semibold">Active · 14 Free OSS Models</span>
              </div>
            </div>
          </header>

          {/* Main Workspace Stage */}
          <main className="flex-1 overflow-hidden relative bg-muted/10">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
