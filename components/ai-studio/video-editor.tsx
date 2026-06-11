'use client'

import { useState, useRef } from 'react'
import {
  Play, Pause, SkipBack, SkipForward, Volume2,
  Plus, Scissors, Download, Trash2, Film, Upload,
  Loader2, Wand2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface VideoClip {
  id: string
  name: string
  url: string
  duration: number
  file?: File
}

interface EditAction {
  id: string
  type: string
  description: string
  status: 'pending' | 'processing' | 'done' | 'error'
}

export function VideoEditor() {
  const [clips, setClips] = useState<VideoClip[]>([])
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [editPrompt, setEditPrompt] = useState('')
  const [editActions, setEditActions] = useState<EditAction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      const video = document.createElement('video')
      video.src = url
      video.onloadedmetadata = () => {
        const clip: VideoClip = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url,
          duration: video.duration,
          file,
        }
        setClips(prev => [...prev, clip])
      }
    })
  }

  const playClip = (clip: VideoClip) => {
    setSelectedClip(clip)
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.src = clip.url
      videoRef.current.play()
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false) }
    else { videoRef.current.play(); setIsPlaying(true) }
  }

  const deleteClip = (id: string) => {
    setClips(prev => prev.filter(c => c.id !== id))
    if (selectedClip?.id === id) { setSelectedClip(null); setIsPlaying(false) }
  }

  const applyEdit = async () => {
    if (!editPrompt.trim()) return
    setIsProcessing(true)
    const action: EditAction = {
      id: Date.now().toString(),
      type: 'AI Edit',
      description: editPrompt,
      status: 'processing',
    }
    setEditActions(prev => [action, ...prev])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a video editing assistant. Describe the edit operations needed step by step.' },
            { role: 'user', content: `Edit instruction: ${editPrompt}${selectedClip ? `. Video: ${selectedClip.name}` : ''}` },
          ],
          model: 'llama3',
        }),
      })
      const data = await res.json()
      setEditActions(prev => prev.map(a => a.id === action.id ? { ...a, status: 'done', description: data.content || a.description } : a))
      setEditPrompt('')
    } catch {
      setEditActions(prev => prev.map(a => a.id === action.id ? { ...a, status: 'error' } : a))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      {/* Left: Clip Library */}
      <Card className="lg:w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Clip Library</h3>
            <Button size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />Upload
            </Button>
            <input ref={fileInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleFileUpload} />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {clips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Film className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Upload video clips to get started</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />Choose Files
              </Button>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {clips.map((clip) => (
                <Card key={clip.id} className={`p-2 cursor-pointer hover:bg-accent transition-all ${selectedClip?.id === clip.id ? 'ring-2 ring-primary' : ''}`} onClick={() => playClip(clip)}>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                      <Film className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{clip.name}</p>
                      <p className="text-xs text-muted-foreground">{clip.duration.toFixed(1)}s</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); deleteClip(clip.id) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Right: Player + AI Edit */}
      <div className="flex-1 flex flex-col gap-4">
        <Card className="overflow-hidden bg-black">
          <div className="aspect-video flex items-center justify-center">
            {selectedClip ? (
              <video ref={videoRef} className="w-full h-full" onEnded={() => setIsPlaying(false)} />
            ) : (
              <div className="text-center">
                <Film className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select a clip to preview</p>
              </div>
            )}
          </div>
          <div className="p-3 bg-black/80">
            <Slider defaultValue={[0]} max={100} className="mb-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" disabled={!selectedClip}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={togglePlay} disabled={!selectedClip}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" disabled={!selectedClip}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-white font-mono">{selectedClip?.name || 'No clip'}</span>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-white" />
                <Slider value={volume} onValueChange={(v) => { setVolume(v); if (videoRef.current) videoRef.current.volume = v[0] / 100 }} max={100} className="w-20" />
              </div>
            </div>
          </div>
        </Card>

        {/* AI Edit Panel */}
        <Card className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold mb-3">AI Edit Instructions</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Describe the edit you want</Label>
              <Textarea
                placeholder="e.g., Add captions, trim the first 5 seconds, add a fade transition..."
                value={editPrompt}
                onChange={e => setEditPrompt(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>
            <Button className="w-full gap-2" onClick={applyEdit} disabled={isProcessing || !editPrompt.trim()}>
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {isProcessing ? 'Processing...' : 'Apply AI Edit'}
            </Button>
          </div>

          {editActions.length > 0 && (
            <div className="mt-4 flex-1">
              <h4 className="text-sm font-medium mb-2">Edit History</h4>
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  {editActions.map((action) => (
                    <div key={action.id} className="flex items-start gap-2 p-2 rounded bg-secondary/30">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${action.status === 'done' ? 'bg-green-500' : action.status === 'error' ? 'bg-red-500' : action.status === 'processing' ? 'bg-blue-500' : 'bg-muted'}`} />
                      <p className="text-xs">{action.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
