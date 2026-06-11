'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Download, Mic, Volume2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInterface, Model } from './chat-interface'

interface GeneratedAudio {
  id: string
  url: string
  text: string
  voice: string
  timestamp: Date
}

const voiceModels: Model[] = [
  { id: 'alloy', name: 'Alloy', provider: 'local', badge: 'Free' },
  { id: 'nova', name: 'Nova', provider: 'local', badge: 'Free' },
  { id: 'echo', name: 'Echo', provider: 'local', badge: 'Free' },
  { id: 'shimmer', name: 'Shimmer', provider: 'local', badge: 'Free' },
  { id: 'onyx', name: 'Onyx', provider: 'local', badge: 'Free' },
  { id: 'fable', name: 'Fable', provider: 'local', badge: 'Free' },
]

const suggestedPrompts = [
  'Welcome to our product demo video',
  'Thank you for your purchase',
  'Please hold while we connect your call',
  'Your order has been confirmed',
  'Have a great day!',
]

export function VoiceCloning() {
  const [audioClips, setAudioClips] = useState<GeneratedAudio[]>([])
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const deleteClip = (id: string) => {
    setAudioClips(prev => prev.filter(a => a.id !== id))
    if (currentAudio?.id === id) { setCurrentAudio(null); setIsPlaying(false) }
  }

  const playClip = (clip: GeneratedAudio) => {
    setCurrentAudio(clip)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = clip.url
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
      models={voiceModels}
      defaultModel="nova"
      placeholder="Type text to convert to speech..."
      welcomeTitle="Voice & TTS"
      welcomeDescription="Convert any text to natural-sounding speech. Choose a voice and type your text."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="audio"
    >
      <div className="flex flex-col h-full gap-4">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 via-secondary to-primary/20 flex items-center justify-center mb-4">
              <Mic className="h-12 w-12 text-primary/50" />
            </div>
            <h3 className="font-semibold">{currentAudio ? currentAudio.voice : 'No clip selected'}</h3>
            <p className="text-sm text-muted-foreground text-center mt-1 line-clamp-2">{currentAudio?.text || 'Select or generate a clip'}</p>
            <Button className="mt-4 rounded-full h-12 w-12" size="icon" onClick={togglePlay} disabled={!currentAudio}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <div className="flex items-center gap-2 w-full max-w-[200px] mt-4">
              <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider value={volume} onValueChange={(v) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v[0] / 100 }} max={100} />
            </div>
          </div>
        </Card>

        <Card className="flex-1 min-h-[200px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Generated Clips</h3>
            <Badge variant="secondary">{audioClips.length} clips</Badge>
          </div>
          <ScrollArea className="h-[200px]">
            {audioClips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Mic className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Generated audio will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {audioClips.map((clip, index) => (
                  <div key={clip.id} className={`flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors ${currentAudio?.id === clip.id ? 'bg-primary/5' : ''}`} onClick={() => playClip(clip)}>
                    <span className="text-sm text-muted-foreground w-5">{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{clip.text}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">{clip.voice}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={clip.url} download><Download className="h-4 w-4" /></a>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); deleteClip(clip.id) }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
