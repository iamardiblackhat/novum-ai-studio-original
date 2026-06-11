'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Download, Music4, Volume2, Clock, Shuffle, Repeat, SkipBack, SkipForward, Heart, MoreVertical, Trash2 } from 'lucide-react'
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
  url: string
  model: string
  timestamp: Date
}

const musicModels: Model[] = [
  { id: 'musicgen', name: 'MusicGen', provider: 'local', badge: 'Free' },
]

const suggestedPrompts = [
  'Upbeat electronic track for a tech video',
  'Chill lo-fi beat for studying',
  'Epic cinematic orchestra for trailer',
  'Funky background music for podcast',
  'Ambient soundscape for meditation',
  'Corporate jingle 30 seconds',
]

export function MusicStudio() {
  const [tracks, setTracks] = useState<GeneratedTrack[]>([])
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    if (currentTrack?.id === id) { setCurrentTrack(null); setIsPlaying(false) }
  }

  const playTrack = (track: GeneratedTrack) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = track.url
      audioRef.current.play()
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
    else { audioRef.current.play(); setIsPlaying(true) }
  }

  return (
    <ChatInterface
      models={musicModels}
      defaultModel="musicgen"
      placeholder="Describe the music you want to create..."
      welcomeTitle="Music Studio"
      welcomeDescription="Create AI-generated music for your videos, podcasts, and projects."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="music"
    >
      <div className="flex flex-col h-full gap-4">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary/30 via-secondary to-primary/20 flex items-center justify-center mb-4">
              <Music4 className="h-16 w-16 text-primary/50" />
            </div>
            <h3 className="font-semibold text-center">{currentTrack?.title || 'No track selected'}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack ? currentTrack.prompt : 'Generate or select a track'}</p>
            <div className="flex items-center gap-2 mt-4">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay} disabled={!currentTrack}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-[200px] mt-4">
              <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider value={volume} onValueChange={(v) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v[0] / 100 }} max={100} />
            </div>
          </div>
        </Card>

        <Card className="flex-1 min-h-[200px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Generated Tracks</h3>
            <Badge variant="secondary">{tracks.length} tracks</Badge>
          </div>
          <ScrollArea className="h-[200px]">
            {tracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Music4 className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Generated tracks will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {tracks.map((track, index) => (
                  <div key={track.id} className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors ${currentTrack?.id === track.id ? 'bg-primary/5' : ''}`} onClick={() => playTrack(track)}>
                    <span className="text-sm text-muted-foreground w-5">{index + 1}</span>
                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                      <Music4 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{track.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{track.prompt}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className={`h-8 w-8 ${favorites.has(track.id) ? 'text-red-500' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id) }}>
                        <Heart className={`h-4 w-4 ${favorites.has(track.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={track.url} download><Download className="h-4 w-4 mr-2" />Download</a>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteTrack(track.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  )
}
