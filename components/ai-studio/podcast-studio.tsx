'use client'

import { useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Plus,
  Users,
  Clock,
  Download,
  Trash2,
  MoreVertical,
  Radio,
  Headphones,
  FileAudio,
  Video,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChatInterface, Model } from './chat-interface'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Host {
  id: string
  name: string
  role: 'host' | 'co-host' | 'guest'
  color: string
  voiceId: string
  voiceName: string
  avatar?: string
}

interface PodcastEpisode {
  id: string
  title: string
  format: string
  outputType: 'audio' | 'video' | 'animated'
  duration: string
  segments: number
  status: 'draft' | 'rendering' | 'completed'
  progress?: number
  timestamp: Date
}

const podcastModels: Model[] = [
  // Local Pipeline
  { id: 'local-podcast', name: 'Local Pipeline (XTTS + Music)', provider: 'local', badge: 'Free' },
  // For script generation
  { id: 'groq-llama', name: 'Llama 3.1 70B (Script)', provider: 'groq', badge: 'Fast Script', requiresKey: true },
  { id: 'ollama-llama', name: 'Llama 3 Local (Script)', provider: 'ollama', badge: 'Script' },
  { id: 'openrouter-claude', name: 'Claude 3.5 (Script)', provider: 'openrouter', badge: 'Best Script', requiresKey: true },
  // Voice
  { id: 'elevenlabs-v2', name: 'ElevenLabs v2 (Voice)', provider: 'elevenlabs', badge: 'Best Voice', requiresKey: true },
  { id: 'local-coqui', name: 'Coqui XTTS (Voice)', provider: 'local', badge: 'Free Voice' },
  // For animated output
  { id: 'replicate-animate', name: 'Character Animator', provider: 'replicate', badge: 'Animated', requiresKey: true },
]

const suggestedPrompts = [
  'Create a podcast episode about AI trends with Alex and Jordan',
  'Generate an interview with Dr. Smith about machine learning',
  'Write and produce a 10-minute tech news segment',
  'Create an animated podcast intro with my characters',
  'Generate a sponsor read for our podcast',
  'Write a full podcast script about productivity tips',
]

const sampleHosts: Host[] = [
  { id: '1', name: 'Alex', role: 'host', color: 'bg-indigo-500', voiceId: 'v1', voiceName: 'Alex (Cloned)' },
  { id: '2', name: 'Jordan', role: 'co-host', color: 'bg-amber-500', voiceId: 'v2', voiceName: 'Jordan (Cloned)' },
  { id: '3', name: 'Dr. Smith', role: 'guest', color: 'bg-emerald-500', voiceId: 'v3', voiceName: 'Smith (Cloned)' },
]

const sampleEpisodes: PodcastEpisode[] = [
  { id: '1', title: 'Tech Talk Episode 42', format: 'Interview', outputType: 'animated', duration: '15:30', segments: 5, status: 'completed', timestamp: new Date() },
  { id: '2', title: 'AI Weekly Roundup', format: 'Panel', outputType: 'video', duration: '22:15', segments: 7, status: 'rendering', progress: 45, timestamp: new Date() },
  { id: '3', title: 'Startup Stories #12', format: 'Solo', outputType: 'audio', duration: '8:00', segments: 3, status: 'draft', timestamp: new Date() },
]

const outputIcons = {
  audio: FileAudio,
  video: Video,
  animated: Users,
}

export function PodcastStudio() {
  const [hosts, setHosts] = useState<Host[]>(sampleHosts)
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(sampleEpisodes)
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAddHost, setShowAddHost] = useState(false)

  const OutputIcon = selectedEpisode ? outputIcons[selectedEpisode.outputType] : Radio

  return (
    <ChatInterface
      models={podcastModels}
      defaultModel="local-podcast"
      placeholder="Describe the podcast episode you want to create..."
      welcomeTitle="Podcast Studio"
      welcomeDescription="Create full podcast episodes with your cloned voices. I'll write the script, generate the audio, and optionally animate your characters."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['audio', 'file']}
    >
      {/* Podcast Panel */}
      <div className="flex flex-col h-full gap-4">
        {/* Preview / Player */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            {/* Album Art / Preview */}
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/30 via-secondary to-primary/20 flex items-center justify-center shrink-0">
              <OutputIcon className="h-10 w-10 text-primary/50" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">
                {selectedEpisode?.title || 'No episode selected'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {selectedEpisode && (
                  <>
                    <Badge variant="outline" className="text-[10px]">{selectedEpisode.format}</Badge>
                    <Badge variant="secondary" className="text-[10px] capitalize">{selectedEpisode.outputType}</Badge>
                  </>
                )}
              </div>
              
              {/* Progress */}
              <div className="mt-3 space-y-1">
                <Slider defaultValue={[30]} max={100} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5:30</span>
                  <span>{selectedEpisode?.duration || '0:00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-11 w-11 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider defaultValue={[75]} max={100} className="w-24" />
            </div>
          </div>
        </Card>

        {/* Hosts */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Hosts & Guests</h3>
            <Dialog open={showAddHost} onOpenChange={setShowAddHost}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Host / Guest</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., Alex" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="host">Host</SelectItem>
                        <SelectItem value="co-host">Co-Host</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Voice (from Voice Library)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cloned voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">Alex (Cloned)</SelectItem>
                        <SelectItem value="v2">Jordan (Cloned)</SelectItem>
                        <SelectItem value="v3">Smith (Cloned)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Add Host</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {hosts.map((host) => (
              <div
                key={host.id}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <Avatar className={`h-12 w-12 ${host.color}`}>
                  <AvatarFallback className="text-white font-medium">
                    {host.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{host.name}</span>
                <Badge variant="outline" className="text-[10px] capitalize">{host.role}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Episodes */}
        <Card className="flex-1 min-h-[150px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Episodes</h3>
            <Badge variant="secondary">{episodes.length} episodes</Badge>
          </div>
          <ScrollArea className="h-[150px]">
            <div className="p-2 space-y-2">
              {episodes.map((episode) => {
                const EpIcon = outputIcons[episode.outputType]
                return (
                  <Card
                    key={episode.id}
                    className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                      selectedEpisode?.id === episode.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedEpisode(episode)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center shrink-0">
                        <EpIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{episode.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[10px]">{episode.format}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {episode.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {episode.status === 'completed' && (
                          <Badge className="bg-green-500/20 text-green-600 border-0 text-[10px]">Ready</Badge>
                        )}
                        {episode.status === 'rendering' && (
                          <Badge className="bg-yellow-500/20 text-yellow-600 border-0 text-[10px]">
                            {episode.progress}%
                          </Badge>
                        )}
                        {episode.status === 'draft' && (
                          <Badge variant="secondary" className="text-[10px]">Draft</Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  )
}
