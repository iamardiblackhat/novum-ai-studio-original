'use client'

import { useState } from 'react'
import { Play, Download, Trash2, Film, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInterface, Model } from './chat-interface'

interface GeneratedVideo {
  id: string
  url: string
  prompt: string
  model: string
  timestamp: Date
}

const videoModels: Model[] = [
  { id: 'wan', name: 'Wan 2.1', provider: 'local', badge: 'Free' },
  { id: 'wan-fast', name: 'Wan Fast', provider: 'local', badge: 'Free' },
  { id: 'ltx-2', name: 'LTX Video 2', provider: 'local', badge: 'Free' },
  { id: 'seedance-pro', name: 'Seedance Pro', provider: 'local', badge: 'Free' },
]

const suggestedPrompts = [
  'A drone flying over a mountain range',
  'Time lapse of a sunset over the ocean',
  'A robot walking through a neon city',
  'Flowers blooming in fast motion',
  'A campfire crackling at night',
]

export function VideoGenerator() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([])

  const deleteVideo = (id: string) => setVideos(prev => prev.filter(v => v.id !== id))

  return (
    <ChatInterface
      models={videoModels}
      defaultModel="wan"
      placeholder="Describe the video you want to generate..."
      welcomeTitle="Video Generator"
      welcomeDescription="Generate AI videos from text descriptions."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="video"
    >
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Generated Videos</h3>
          <Badge variant="secondary">{videos.length} videos</Badge>
        </div>
        <ScrollArea className="flex-1">
          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Film className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Generated videos will appear here</p>
            </div>
          ) : (
            <div className="p-4 grid gap-4 grid-cols-1">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <video src={video.url} controls className="w-full" />
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium truncate">{video.prompt}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{video.model}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={video.url} download><Download className="h-4 w-4" /></a>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteVideo(video.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </ChatInterface>
  )
}
