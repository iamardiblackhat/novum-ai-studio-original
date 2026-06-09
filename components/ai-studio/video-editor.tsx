'use client'

import { useState } from 'react'
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Scissors, Copy, Trash2, Plus, ZoomIn, ZoomOut, 
  Undo, Redo, Download, Upload, Layers, Type, 
  Music, Film, ImageIcon, Mic, Sparkles, Wand2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

const timelineTracks = [
  { id: 'video', name: 'Video', icon: Film, color: 'bg-blue-500', clips: [
    { id: '1', start: 0, duration: 100, label: 'Intro Clip' },
    { id: '2', start: 120, duration: 80, label: 'Main Content' },
  ]},
  { id: 'audio', name: 'Audio', icon: Music, color: 'bg-green-500', clips: [
    { id: '3', start: 0, duration: 200, label: 'Background Music' },
  ]},
  { id: 'voiceover', name: 'Voiceover', icon: Mic, color: 'bg-yellow-500', clips: [
    { id: '4', start: 20, duration: 60, label: 'Narration 1' },
    { id: '5', start: 130, duration: 50, label: 'Narration 2' },
  ]},
  { id: 'text', name: 'Text', icon: Type, color: 'bg-purple-500', clips: [
    { id: '6', start: 0, duration: 40, label: 'Title' },
    { id: '7', start: 180, duration: 20, label: 'End Card' },
  ]},
]

const aiTools = [
  { id: 'auto-cut', name: 'Auto Cut', icon: Scissors, description: 'Remove silences' },
  { id: 'enhance', name: 'Enhance', icon: Sparkles, description: 'Improve quality' },
  { id: 'captions', name: 'Captions', icon: Type, description: 'Auto subtitles' },
  { id: 'bg-remove', name: 'Remove BG', icon: ImageIcon, description: 'Remove background' },
]

export function VideoEditor() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(45)
  const [zoom, setZoom] = useState([50])
  const [volume, setVolume] = useState([80])

  const totalDuration = 200

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Top Section - Preview & Tools */}
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Preview */}
        <Card className="flex-1 flex flex-col overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between p-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                1920 x 1080
              </Badge>
              <Badge variant="outline" className="text-xs">
                30 fps
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 bg-black flex items-center justify-center">
            <div className="text-center">
              <Film className="h-16 w-16 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Video Preview</p>
            </div>
          </div>
          {/* Playback Controls */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  className="h-10 w-10 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <span>{formatTime(currentTime)}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{formatTime(totalDuration)}</span>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider value={volume} onValueChange={setVolume} className="w-24" max={100} />
              </div>
            </div>
          </div>
        </Card>

        {/* Tools Panel */}
        <Card className="lg:w-72 flex flex-col overflow-hidden">
          <Tabs defaultValue="ai" className="flex flex-col h-full">
            <TabsList className="mx-2 mt-2">
              <TabsTrigger value="ai" className="flex-1">AI Tools</TabsTrigger>
              <TabsTrigger value="assets" className="flex-1">Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="flex-1 m-0 overflow-auto">
              <div className="p-2 space-y-2">
                {aiTools.map((tool) => (
                  <Card 
                    key={tool.id} 
                    className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <tool.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button className="w-full gap-2 mt-4">
                  <Wand2 className="h-4 w-4" />
                  Apply AI Enhancements
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="assets" className="flex-1 m-0 overflow-auto">
              <div className="p-2 space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Import Media
                </Button>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="aspect-video rounded bg-secondary flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="p-2">
        {/* Timeline Controls */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Redo className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Scissors className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider value={zoom} onValueChange={setZoom} className="w-32" max={100} />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Timeline Tracks */}
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            {/* Time Ruler */}
            <div className="h-6 border-b border-border flex items-end pl-24 relative">
              {[0, 30, 60, 90, 120, 150, 180].map((time) => (
                <div 
                  key={time} 
                  className="absolute text-xs text-muted-foreground"
                  style={{ left: `calc(96px + ${time * 3}px)` }}
                >
                  {formatTime(time)}
                </div>
              ))}
              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                style={{ left: `calc(96px + ${currentTime * 3}px)` }}
              >
                <div className="w-3 h-3 bg-primary rounded-full -ml-[5px] -mt-1" />
              </div>
            </div>

            {/* Tracks */}
            {timelineTracks.map((track) => (
              <div key={track.id} className="flex h-14 border-b border-border">
                <div className="w-24 shrink-0 flex items-center gap-2 px-2 bg-secondary/30">
                  <track.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium truncate">{track.name}</span>
                </div>
                <div className="flex-1 relative">
                  {track.clips.map((clip) => (
                    <div
                      key={clip.id}
                      className={`absolute top-2 bottom-2 ${track.color} rounded cursor-pointer hover:brightness-110 transition-all flex items-center px-2`}
                      style={{ 
                        left: `${clip.start * 3}px`, 
                        width: `${clip.duration * 3}px` 
                      }}
                    >
                      <span className="text-xs text-white truncate">{clip.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
