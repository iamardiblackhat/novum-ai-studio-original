'use client'

import { useState } from 'react'
import { Play, Pause, Download, Plus, Music4, Volume2, Clock, Shuffle, Repeat, SkipBack, SkipForward, Heart, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInterface, Model } from './chat-interface'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface GeneratedTrack {
  id: string
  title: string
  prompt: string
  genre: string
  duration: string
  bpm: number
  model: string
  timestamp: Date
}

const musicModels: Model[] = [
  // Suno AI
  { id: 'suno-v4', name: 'Suno v4', provider: 'suno', badge: 'Best', requiresKey: true },
  { id: 'suno-v3.5', name: 'Suno v3.5', provider: 'suno', badge: 'Fast', requiresKey: true },
  // Local
  { id: 'local-musicgen', name: 'MusicGen (Local)', provider: 'local', badge: 'Free' },
  { id: 'local-audioldm', name: 'AudioLDM 2 (Local)', provider: 'local', badge: 'Free' },
  { id: 'local-riffusion', name: 'Riffusion (Local)', provider: 'local', badge: 'Free' },
  // Replicate
  { id: 'replicate-musicgen', name: 'MusicGen Large', provider: 'replicate', badge: 'Quality', requiresKey: true },
  { id: 'replicate-riffusion', name: 'Riffusion', provider: 'replicate', badge: 'Fast', requiresKey: true },
  // Hugging Face
  { id: 'hf-musicgen', name: 'MusicGen Medium', provider: 'huggingface', badge: 'Free', requiresKey: true },
  { id: 'hf-audioldm', name: 'AudioLDM 2', provider: 'huggingface', badge: 'Quality', requiresKey: true },
]

const suggestedPrompts = [
  'Upbeat electronic track for a tech video',
  'Chill lo-fi beat for studying',
  'Epic cinematic orchestra for trailer',
  'Funky background music for podcast',
  'Ambient soundscape for meditation',
  'Corporate jingle 30 seconds',
]

const sampleTracks: GeneratedTrack[] = [
  { id: '1', title: 'Tech Vibes', prompt: 'Upbeat electronic', genre: 'Electronic', duration: '2:30', bpm: 128, model: 'Suno v4', timestamp: new Date() },
  { id: '2', title: 'Study Session', prompt: 'Chill lo-fi beat', genre: 'Lo-Fi', duration: '3:15', bpm: 85, model: 'MusicGen', timestamp: new Date() },
  { id: '3', title: 'Epic Journey', prompt: 'Cinematic orchestra', genre: 'Cinematic', duration: '4:00', bpm: 90, model: 'Suno v4', timestamp: new Date() },
]

export function MusicStudio() {
  const [tracks, setTracks] = useState<GeneratedTrack[]>(sampleTracks)
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState([0])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const deleteTrack = (id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id))
    if (currentTrack?.id === id) setCurrentTrack(null)
  }

  return (
    <ChatInterface
      models={musicModels}
      defaultModel="local-musicgen"
      placeholder="Describe the music you want to create..."
      welcomeTitle="Music Studio"
      welcomeDescription="Create AI-generated music for your videos, podcasts, and projects. Describe the mood, genre, and style."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['audio']}
    >
      {/* Music Panel */}
      <div className="flex flex-col h-full gap-4">
        {/* Now Playing */}
        <Card className="p-4">
          <div className="flex flex-col items-center">
            {/* Album Art */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/30 via-secondary to-primary/20 flex items-center justify-center mb-4">
              <Music4 className="h-16 w-16 text-primary/50" />
            </div>
            
            {/* Track Info */}
            <h3 className="font-semibold text-center">
              {currentTrack?.title || 'No track selected'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentTrack?.genre || 'Select or generate a track'}
            </p>

            {/* Progress */}
            <div className="w-full mt-4 space-y-2">
              <Slider value={progress} onValueChange={setProgress} max={100} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0:45</span>
                <span>{currentTrack?.duration || '0:00'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-4">
              <Button 
                variant={shuffle ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-9 w-9"
                onClick={() => setShuffle(!shuffle)}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button 
                variant={repeat ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-9 w-9"
                onClick={() => setRepeat(!repeat)}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-full max-w-[200px] mt-4">
              <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider value={volume} onValueChange={setVolume} max={100} />
            </div>
          </div>
        </Card>

        {/* Track Library */}
        <Card className="flex-1 min-h-[200px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Generated Tracks</h3>
            <Badge variant="secondary">{tracks.length} tracks</Badge>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="divide-y divide-border">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors ${
                    currentTrack?.id === track.id ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => setCurrentTrack(track)}
                >
                  <span className="text-sm text-muted-foreground w-5">{index + 1}</span>
                  <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                    <Music4 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{track.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px]">{track.genre}</Badge>
                      <span className="text-xs text-muted-foreground">{track.bpm} BPM</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {track.duration}
                  </span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${favorites.has(track.id) ? 'text-red-500' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(track.id) ? 'fill-current' : ''}`} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteTrack(track.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  )
}
