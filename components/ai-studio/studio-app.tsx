"use client";

import { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ai-studio/app-sidebar";
import { MobileHeader } from "@/components/ai-studio/mobile-header";
import { StudioDashboard } from "@/components/ai-studio/dashboard";
import { ArdiSecurity } from "@/components/ai-studio/ardi-security";
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
  dashboard: "Omnelia SI Studio Dashboard",
  "content-engine": "AI Command Console",
  "image-gen": "FLUX.2 Image Diffuser",
  "video-gen": "Wan 2.1 Video Studio",
  "voice-clone": "Kokoro-82M Voice Studio",
  "music-gen": "MusicGen Audio Studio",
  "documentary-montage": "75s Rainy Documentary Finisher",
  "cartoon-gen": "Cartoon Episode Generator",
  podcast: "Podcast Studio",
  "web-builder": "Full-Stack Web Architect",
  "video-edit": "Timeline Video Editor",
  "ardi-sec": "ARDI Cybersecurity & Asset Defense",
  agents: "Omnelia Autonomous Fleet",
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
  "ardi-sec": "Fleet & Security",
  agents: "Fleet & Security",
  workflows: "Fleet & Security",
  autonomous: "Fleet & Security",
  automations: "Fleet & Security",
  templates: "Resources",
  themes: "Resources",
  layouts: "Resources",
};

export function StudioApp() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section") || window.location.hash.replace("#", "");
      if (sec && sectionTitles[sec]) {
        setActiveSection(sec);
      }
    }
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("section", section);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <StudioDashboard onNavigate={handleSectionChange} />;
      case "ardi-sec":
        return <ArdiSecurity />;
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
          setActiveSection={handleSectionChange}
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
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(14,18,29,0.8)] border border-[rgba(87,241,239,0.2)] text-[11px] font-mono shadow-[0_0_15px_rgba(87,241,239,0.1)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#57f1ef] animate-pulse shadow-[0_0_8px_#57f1ef]" />
                <span className="text-muted-foreground">Omnelia SI Mesh:</span>
                <span className="text-[#57f1ef] font-semibold">Active · 14 Free OSS Models</span>
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
