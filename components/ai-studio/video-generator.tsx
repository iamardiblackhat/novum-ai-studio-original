'use client'

import { useState } from 'react'
import { Play, Pause, Download, Trash2, Film, Clock, Plus, Volume2, Maximize2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { ChatInterface, Model } from './chat-interface'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface GeneratedVideo {
  id: string
  title: string
  prompt: string
  duration: string
  status: 'completed' | 'processing' | 'queued' | 'failed'
  progress?: number
  model: string
  aspectRatio: string
  timestamp: Date
}

const videoModels: Model[] = [
  // Local
  { id: 'local-animatediff', name: 'AnimateDiff (Local)', provider: 'local', badge: 'Free' },
  { id: 'local-svd', name: 'Stable Video (Local)', provider: 'local', badge: 'Free' },
  // Replicate
  { id: 'replicate-runway', name: 'Runway Gen-3', provider: 'replicate', badge: 'Best', requiresKey: true },
  { id: 'replicate-svd', name: 'Stable Video Diffusion', provider: 'replicate', badge: 'Quality', requiresKey: true },
  { id: 'replicate-animatediff', name: 'AnimateDiff Lightning', provider: 'replicate', badge: 'Fast', requiresKey: true },
  // Runway Direct
  { id: 'runway-gen3', name: 'Gen-3 Alpha', provider: 'runway', badge: 'Best', requiresKey: true },
  { id: 'runway-gen2', name: 'Gen-2', provider: 'runway', badge: 'Fast', requiresKey: true },
  // Stability
  { id: 'stability-svd', name: 'Stable Video', provider: 'stability', badge: 'Quality', requiresKey: true },
  // Hugging Face
  { id: 'hf-cogvideo', name: 'CogVideoX', provider: 'huggingface', badge: 'New', requiresKey: true },
]

const suggestedPrompts = [
  'A drone shot flying over a mountain landscape',
  'Product showcase with rotating camera',
  'Cinematic sunrise over the ocean',
  'Character walking through a neon city',
  'Logo animation with particle effects',
  'Time-lapse of clouds moving',
]

const sampleVideos: GeneratedVideo[] = [
  { id: '1', title: 'Mountain Flyover', prompt: 'Drone shot over mountains', duration: '0:05', status: 'completed', model: 'Gen-3', aspectRatio: '16:9', timestamp: new Date() },
  { id: '2', title: 'Product Demo', prompt: 'Rotating smartphone showcase', duration: '0:10', status: 'completed', model: 'SVD', aspectRatio: '1:1', timestamp: new Date() },
  { id: '3', title: 'City Walk', prompt: 'Character walking through neon city', duration: '0:15', status: 'processing', progress: 65, model: 'Gen-3', aspectRatio: '9:16', timestamp: new Date() },
  { id: '4', title: 'Logo Intro', prompt: 'Particle logo reveal', duration: '0:05', status: 'queued', model: 'AnimateDiff', aspectRatio: '16:9', timestamp: new Date() },
]

export function VideoGenerator() {
  const [videos, setVideos] = useState<GeneratedVideo[]>(sampleVideos)
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id))
    if (selectedVideo?.id === id) setSelectedVideo(null)
  }

  return (
    <ChatInterface
      models={videoModels}
      defaultModel="local-svd"
      placeholder="Describe the video you want to generate..."
      welcomeTitle="Video Generator"
      welcomeDescription="Describe any video scene and I'll generate it for you. Include details about camera movement, style, and duration."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['image', 'video']}
    >
      {/* Video Panel */}
      <div className="flex flex-col h-full gap-4">
        {/* Video Preview */}
        <Card className="flex-1 min-h-[250px] overflow-hidden">
          <div className="h-full bg-black flex items-center justify-center relative">
            {selectedVideo && selectedVideo.status === 'completed' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10">
                <Film className="h-16 w-16 text-primary/50" />
              </div>
            ) : (
              <div className="text-center">
                <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select or generate a video</p>
              </div>
            )}
            
            {/* Video Controls Overlay */}
            {selectedVideo && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="mb-2">
                  <Slider defaultValue={[30]} max={100} step={1} className="w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-10 w-10 text-white hover:text-primary"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <span className="text-sm text-white font-mono">0:00 / {selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-white" />
                    <Slider value={volume} onValueChange={setVolume} max={100} className="w-20" />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Video Queue/Library */}
        <Card className="flex-1 min-h-[200px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Generated Videos</h3>
            <Badge variant="secondary">{videos.length} videos</Badge>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="p-2 space-y-2">
              {videos.map((video) => (
                <Card 
                  key={video.id} 
                  className={`p-2 cursor-pointer transition-all hover:bg-accent ${
                    selectedVideo?.id === video.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex gap-3">
                    <div className="w-20 h-12 rounded bg-secondary flex items-center justify-center shrink-0 relative overflow-hidden">
                      <Film className="h-5 w-5 text-muted-foreground" />
                      {video.status === 'processing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm truncate">{video.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.duration}
                            </span>
                            <Badge variant="outline" className="text-[10px]">{video.aspectRatio}</Badge>
                          </div>
                        </div>
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
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={(e) => { e.stopPropagation(); deleteVideo(video.id); }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {video.status === 'processing' && video.progress && (
                        <Progress value={video.progress} className="h-1 mt-2" />
                      )}
                      {video.status === 'queued' && (
                        <Badge variant="secondary" className="text-[10px] mt-1">Queued</Badge>
                      )}
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
