'use client'

import { useState } from 'react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ai-studio/app-sidebar'
import { MobileHeader } from '@/components/ai-studio/mobile-header'
import { WebBuilder } from '@/components/ai-studio/web-builder'
import { ImageGenerator } from '@/components/ai-studio/image-generator'
import { VideoGenerator } from '@/components/ai-studio/video-generator'
import { VoiceCloning } from '@/components/ai-studio/voice-cloning'
import { MusicStudio } from '@/components/ai-studio/music-studio'
import { VideoEditor } from '@/components/ai-studio/video-editor'
import { AgentsManager } from '@/components/ai-studio/agents-manager'
import { WorkflowsManager } from '@/components/ai-studio/workflows-manager'
import { AutonomousTasks } from '@/components/ai-studio/autonomous-tasks'
import { TemplatesLibrary } from '@/components/ai-studio/templates-library'
import { ThemesManager } from '@/components/ai-studio/themes-manager'
import { LayoutsGallery } from '@/components/ai-studio/layouts-gallery'
import { CartoonEpisodeGenerator } from '@/components/ai-studio/cartoon-episode-generator'
import { PodcastStudio } from '@/components/ai-studio/podcast-studio'
import { AutomationsBuilder } from '@/components/ai-studio/automations-builder'
import { Separator } from '@/components/ui/separator'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbList, 
  BreadcrumbPage,
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'

const sectionTitles: Record<string, string> = {
  'web-builder': 'Web Builder',
  'cartoon-gen': 'Cartoon Episodes',
  'podcast': 'Podcast Studio',
  'video-gen': 'Video Generation',
  'image-gen': 'Image Generation',
  'voice-clone': 'Voice Cloning',
  'music-gen': 'Music Studio',
  'video-edit': 'Video Editor',
  'agents': 'My Agents',
  'workflows': 'Workflows',
  'autonomous': 'Autonomous Tasks',
  'automations': 'AI Automations',
  'templates': 'Templates',
  'themes': 'Themes',
  'layouts': 'Layouts',
}

const sectionCategories: Record<string, string> = {
  'web-builder': 'Create',
  'cartoon-gen': 'Create',
  'podcast': 'Create',
  'video-gen': 'Create',
  'image-gen': 'Create',
  'voice-clone': 'Create',
  'music-gen': 'Create',
  'video-edit': 'Create',
  'agents': 'Agents & Automation',
  'workflows': 'Agents & Automation',
  'autonomous': 'Agents & Automation',
  'automations': 'Agents & Automation',
  'templates': 'Resources',
  'themes': 'Resources',
  'layouts': 'Resources',
}

export default function AIStudio() {
  const [activeSection, setActiveSection] = useState('web-builder')

  const renderContent = () => {
    switch (activeSection) {
      case 'web-builder': return <WebBuilder />
      case 'cartoon-gen': return <CartoonEpisodeGenerator />
      case 'podcast': return <PodcastStudio />
      case 'image-gen': return <ImageGenerator />
      case 'video-gen': return <VideoGenerator />
      case 'voice-clone': return <VoiceCloning />
      case 'music-gen': return <MusicStudio />
      case 'video-edit': return <VideoEditor />
      case 'agents': return <AgentsManager />
      case 'workflows': return <WorkflowsManager />
      case 'autonomous': return <AutonomousTasks />
      case 'automations': return <AutomationsBuilder />
      case 'templates': return <TemplatesLibrary />
      case 'themes': return <ThemesManager />
      case 'layouts': return <LayoutsGallery />
      default: return <WebBuilder />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <SidebarInset className="flex flex-col h-screen">
        <MobileHeader activeSection={activeSection} setActiveSection={setActiveSection} />
        <header className="hidden md:flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-muted-foreground">{sectionCategories[activeSection]}</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{sectionTitles[activeSection]}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-4">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
