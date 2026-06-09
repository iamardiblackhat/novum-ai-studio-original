'use client'

import { useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Plus,
  Film,
  Clock,
  Users,
  Download,
  Trash2,
  MoreVertical,
  Layers,
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

interface Character {
  id: string
  name: string
  color: string
  voiceId: string
  voiceName: string
}

interface Episode {
  id: string
  title: string
  format: string
  style: string
  duration: string
  scenes: number
  status: 'draft' | 'rendering' | 'completed'
  progress?: number
  timestamp: Date
}

const cartoonModels: Model[] = [
  // Video Generation + Voice
  { id: 'combo-local', name: 'Local Pipeline (SVD + XTTS)', provider: 'local', badge: 'Free' },
  // Replicate Combos
  { id: 'replicate-cartoon', name: 'Cartoon Generator', provider: 'replicate', badge: 'Quality', requiresKey: true },
  { id: 'replicate-animate', name: 'AnimateDiff + Voice', provider: 'replicate', badge: 'Fast', requiresKey: true },
  // Runway
  { id: 'runway-character', name: 'Runway Character', provider: 'runway', badge: 'Best', requiresKey: true },
  // Stability
  { id: 'stability-animate', name: 'Stable Animation', provider: 'stability', badge: 'Quality', requiresKey: true },
  // For script/dialogue
  { id: 'groq-llama', name: 'Llama 3.1 (Script)', provider: 'groq', badge: 'Script', requiresKey: true },
  { id: 'ollama-llama', name: 'Llama 3 (Local Script)', provider: 'ollama', badge: 'Script' },
]

const suggestedPrompts = [
  'Create a 30-second ad with Max and Luna discussing our new product',
  'Generate a TikTok episode where Rex reviews a coffee shop',
  'Make an intro sequence for my YouTube channel',
  'Create a character animation for my podcast',
  'Generate a product demo with cartoon characters',
  'Write and animate a short comedy skit',
]

const sampleCharacters: Character[] = [
  { id: '1', name: 'Max', color: 'bg-blue-500', voiceId: 'v1', voiceName: 'John (Cloned)' },
  { id: '2', name: 'Luna', color: 'bg-pink-500', voiceId: 'v2', voiceName: 'Sarah (Cloned)' },
  { id: '3', name: 'Rex', color: 'bg-green-500', voiceId: 'v3', voiceName: 'Mike (Cloned)' },
]

const sampleEpisodes: Episode[] = [
  { id: '1', title: 'Product Launch Promo', format: 'Short (30s)', style: '2D Cartoon', duration: '0:30', scenes: 3, status: 'completed', timestamp: new Date() },
  { id: '2', title: 'Coffee Shop Review', format: 'Medium (2min)', style: 'Anime', duration: '2:15', scenes: 5, status: 'rendering', progress: 65, timestamp: new Date() },
  { id: '3', title: 'Channel Intro', format: 'Short (15s)', style: '3D Stylized', duration: '0:15', scenes: 2, status: 'draft', timestamp: new Date() },
]

export function CartoonEpisodeGenerator() {
  const [characters, setCharacters] = useState<Character[]>(sampleCharacters)
  const [episodes, setEpisodes] = useState<Episode[]>(sampleEpisodes)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAddCharacter, setShowAddCharacter] = useState(false)

  return (
    <ChatInterface
      models={cartoonModels}
      defaultModel="combo-local"
      placeholder="Describe the cartoon episode you want to create..."
      welcomeTitle="Cartoon Episode Generator"
      welcomeDescription="Create animated episodes with your characters for social media, ads, and podcasts. Just describe the scene and I'll generate it."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['image', 'audio']}
    >
      {/* Episode Panel */}
      <div className="flex flex-col h-full gap-4">
        {/* Preview */}
        <Card className="min-h-[200px] overflow-hidden relative">
          <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-center">
              <Film className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Episode Preview</p>
            </div>
          </div>
          {/* Playback Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="mb-2">
              <Slider defaultValue={[30]} max={100} step={1} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-white font-mono">
                0:15 / {selectedEpisode?.duration || '0:00'}
              </span>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Characters */}
        <Card className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Characters</h3>
            <Dialog open={showAddCharacter} onOpenChange={setShowAddCharacter}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Character</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Character Name</Label>
                    <Input placeholder="e.g., Max" />
                  </div>
                  <div className="space-y-2">
                    <Label>Voice (from Voice Library)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cloned voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">John (Cloned)</SelectItem>
                        <SelectItem value="v2">Sarah (Cloned)</SelectItem>
                        <SelectItem value="v3">Mike (Cloned)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Add Character</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {characters.map((char) => (
              <div
                key={char.id}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <Avatar className={`h-12 w-12 ${char.color}`}>
                  <AvatarFallback className="text-white font-medium">
                    {char.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{char.name}</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[60px]">
                  {char.voiceName}
                </span>
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
              {episodes.map((episode) => (
                <Card
                  key={episode.id}
                  className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                    selectedEpisode?.id === episode.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedEpisode(episode)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                      <Film className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{episode.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px]">{episode.format}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {episode.scenes} scenes
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
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  )
}
