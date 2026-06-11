'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Plus, Film, Download, Trash2, MoreVertical, Layers } from 'lucide-react'
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
  url?: string
  timestamp: Date
}

const cartoonModels: Model[] = [
  { id: 'wan', name: 'Wan 2.1', provider: 'local', badge: 'Free' },
  { id: 'wan-fast', name: 'Wan Fast', provider: 'local', badge: 'Free' },
  { id: 'ltx-2', name: 'LTX Video 2', provider: 'local', badge: 'Free' },
  { id: 'runway-character', name: 'Runway Character', provider: 'runway', badge: 'Best', requiresKey: true },
]

const suggestedPrompts = [
  'Create a 30-second ad with Max and Luna discussing our new product',
  'Generate a TikTok episode where Rex reviews a coffee shop',
  'Make an intro sequence for my YouTube channel',
  'Create a character animation for my podcast',
  'Generate a product demo with cartoon characters',
  'Write and animate a short comedy skit',
]

const COLORS = ['bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500']

export function CartoonEpisodeGenerator() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAddCharacter, setShowAddCharacter] = useState(false)
  const [newCharName, setNewCharName] = useState('')
  const [newCharVoice, setNewCharVoice] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  const addCharacter = () => {
    if (!newCharName.trim()) return
    const char: Character = {
      id: Date.now().toString(),
      name: newCharName,
      color: COLORS[characters.length % COLORS.length],
      voiceId: newCharVoice,
      voiceName: newCharVoice || 'Default',
    }
    setCharacters(prev => [...prev, char])
    setNewCharName(''); setNewCharVoice('')
    setShowAddCharacter(false)
  }

  const deleteEpisode = (id: string) => {
    setEpisodes(prev => prev.filter(e => e.id !== id))
    if (selectedEpisode?.id === id) { setSelectedEpisode(null); setIsPlaying(false) }
  }

  const playEpisode = (episode: Episode) => {
    setSelectedEpisode(episode)
    setIsPlaying(true)
    if (videoRef.current && episode.url) {
      videoRef.current.src = episode.url
      videoRef.current.play()
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false) }
    else { videoRef.current.play(); setIsPlaying(true) }
  }

  return (
    <ChatInterface
      models={cartoonModels}
      defaultModel="wan"
      placeholder="Describe the cartoon episode you want to create..."
      welcomeTitle="Cartoon Episode Generator"
      welcomeDescription="Create animated episodes with your characters for social media, ads, and podcasts."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['image', 'audio']}
      apiEndpoint="video"
    >
      <div className="flex flex-col h-full gap-4">
        <Card className="min-h-[200px] overflow-hidden relative bg-black">
          {selectedEpisode?.url ? (
            <video ref={videoRef} className="w-full aspect-video" onEnded={() => setIsPlaying(false)} />
          ) : (
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <Film className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Episode Preview</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <Slider defaultValue={[0]} max={100} step={1} className="mb-2" />
            <div className="flex items-center justify-between">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={togglePlay} disabled={!selectedEpisode}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <span className="text-xs text-white font-mono">{selectedEpisode?.duration || '0:00'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Characters</h3>
            <Dialog open={showAddCharacter} onOpenChange={setShowAddCharacter}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost"><Plus className="h-4 w-4 mr-1" />Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Character</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., Max" value={newCharName} onChange={e => setNewCharName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Voice</Label>
                    <Input placeholder="Voice name or ID" value={newCharVoice} onChange={e => setNewCharVoice(e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={addCharacter}>Add Character</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {characters.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">No characters yet. Add one above.</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {characters.map((char) => (
                <div key={char.id} className="flex flex-col items-center gap-1 shrink-0">
                  <Avatar className={`h-12 w-12 ${char.color}`}>
                    <AvatarFallback className="text-white font-medium">{char.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{char.name}</span>
                  <span className="text-[10px] text-muted-foreground">{char.voiceName}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex-1 min-h-[150px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Episodes</h3>
            <Badge variant="secondary">{episodes.length}</Badge>
          </div>
          <ScrollArea className="h-[150px]">
            {episodes.length === 0 ? (
              <div className="text-center py-6">
                <Film className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Generated episodes appear here</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {episodes.map((episode) => (
                  <Card key={episode.id} className={`p-2 cursor-pointer hover:bg-accent ${selectedEpisode?.id === episode.id ? 'ring-2 ring-primary' : ''}`} onClick={() => playEpisode(episode)}>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                        <Film className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{episode.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-[10px]">{episode.format}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Layers className="h-3 w-3" />{episode.scenes} scenes</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {episode.url && <DropdownMenuItem asChild><a href={episode.url} download><Download className="h-4 w-4 mr-2" />Download</a></DropdownMenuItem>}
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteEpisode(episode.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  )
}
