'use client'

import { 
  Menu, Search, Bell, Settings, User, Sparkles,
  Code2, Video, Image, Mic, Music, Scissors, 
  Bot, Workflow, LayoutTemplate, Palette, Layers,
  Film, Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThemeToggle } from './theme-toggle'

interface MobileHeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const menuItems = [
  { id: 'web-builder', title: 'Web Builder', icon: Code2, badge: 'AI' },
  { id: 'cartoon-gen', title: 'Cartoon Episodes', icon: Film },
  { id: 'podcast', title: 'Podcast Studio', icon: Radio },
  { id: 'video-gen', title: 'Video Generation', icon: Video },
  { id: 'image-gen', title: 'Image Generation', icon: Image },
  { id: 'voice-clone', title: 'Voice Cloning', icon: Mic },
  { id: 'music-gen', title: 'Music Studio', icon: Music },
  { id: 'video-edit', title: 'Video Editor', icon: Scissors },
  { id: 'agents', title: 'My Agents', icon: Bot },
  { id: 'workflows', title: 'Workflows', icon: Workflow },
  { id: 'autonomous', title: 'Autonomous Tasks', icon: Sparkles },
  { id: 'templates', title: 'Templates', icon: LayoutTemplate },
  { id: 'themes', title: 'Themes', icon: Palette },
  { id: 'layouts', title: 'Layouts', icon: Layers },
]

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
  'templates': 'Templates',
  'themes': 'Themes',
  'layouts': 'Layouts',
}

export function MobileHeader({ activeSection, setActiveSection }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-border bg-background px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                AI Studio
              </div>
              <ThemeToggle />
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-3 mb-1"
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm">{sectionTitles[activeSection]}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Search className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="p-2 text-sm font-semibold">Notifications</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Episode generation complete</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Podcast ready for download</span>
                <span className="text-xs text-muted-foreground">10 minutes ago</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
