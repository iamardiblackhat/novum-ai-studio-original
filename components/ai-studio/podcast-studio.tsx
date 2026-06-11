'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Plus, Download, Trash2, MoreVertical, Radio, Clock, FileAudio, Video, Users } from 'lucide-react'
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

interface Host {
  id: string
  name: string
  role: 'host' | 'co-host' | 'guest'
  color: string
  voiceName: string
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
  url?: string
  timestamp: Date
}

const podcastModels: Model[] = [
  { id: 'local-podcast', name: 'Local Pipeline (XTTS)', provider: 'local', badge: 'Free' },
  { id: 'groq-llama', name: 'Llama 3.1 (Script)', provider: 'groq', badge: 'Fast', requiresKey: true },
  { id: 'ollama-llama', name: 'Llama 3 Local', provider: 'ollama', badge: 'Free' },
  { id: 'elevenlabs-v2', name: 'ElevenLabs v2', provider: 'elevenlabs', badge: 'Best Voice', requiresKey: true },
]

const suggestedPrompts = [
  'Create a podcast episode about AI trends with Alex and Jordan',
  'Generate an interview with Dr. Smith about machine learning',
  'Write and produce a 10-minute tech news segment',
  'Create an animated podcast intro with my characters',
  'Generate a sponsor read for our podcast',
]

const COLORS = ['bg-indigo-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-sky-500']
const outputIcons = { audio: FileAudio, video: Video, animated: Users }

export function PodcastStudio() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAddHost, setShowAddHost] = useState(false)
  const [newHostName, setNewHostName] = useState('')
  const [newHostRole, setNewHostRole] = useState<'host' | 'co-host' | 'guest'>('host')
  const [newHostVoice, setNewHostVoice] = useState('')
  const [volume, setVolume] = useState([75])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const addHost = () => {
    if (!newHostName.trim()) return
    setHosts(prev => [...prev, {
      id: Date.now().toString(),
      name: newHostName,
      role: newHostRole,
      color: COLORS[prev.length % COLORS.length],
      voiceName: newHostVoice || 'Default',
    }])
    setNewHostName(''); setNewHostVoice('')
    setShowAddHost(false)
  }

  const deleteEpisode = (id: string) => {
    setEpisodes(prev => prev.filter(e => e.id !== id))
    if (selectedEpisode?.id === id) { setSelectedEpisode(null); setIsPlaying(false) }
  }

  const playEpisode = (ep: PodcastEpisode) => {
    setSelectedEpisode(ep)
    setIsPlaying(true)
    if (audioRef.current && ep.url) {
      audioRef.current.src = ep.url
      audioRef.current.play()
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
    else { audioRef.current.play(); setIsPlaying(true) }
  }

  const OutputIcon = selectedEpisode ? outputIcons[selectedEpisode.outputType] : Radio

  return (
    <ChatInterface
      models={podcastModels}
      defaultModel="local-podcast"
      placeholder="Describe the podcast episode you want to create..."
      welcomeTitle="Podcast Studio"
      welcomeDescription="Create full podcast episodes with your cloned voices."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['audio', 'file']}
      apiEndpoint="audio"
    >
      <div className="flex flex-col h-full gap-4">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/30 via-secondary to-primary/20 flex items-center justify-center shrink-0">
              <OutputIcon className="h-10 w-10 text-primary/50" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{selectedEpisode?.title || 'No episode selected'}</h3>
              {selectedEpisode && <Badge variant="outline" className="text-[10px] mt-1 capitalize">{selectedEpisode.outputType}</Badge>}
              <Slider defaultValue={[0]} max={100} className="mt-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0:00</span>
                <span>{selectedEpisode?.duration || '0:00'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button size="icon" className="h-11 w-11 rounded-full" onClick={togglePlay} disabled={!selectedEpisode}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Slider value={volume} onValueChange={(v) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v[0] / 100 }} max={100} className="w-24" />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Hosts & Guests</h3>
            <Dialog open={showAddHost} onOpenChange={setShowAddHost}>
              <DialogTrigger asChild><Button size="sm" variant="ghost"><Plus className="h-4 w-4 mr-1" />Add</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Host / Guest</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label>Name</Label><Input placeholder="e.g., Alex" value={newHostName} onChange={e => setNewHostName(e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={newHostRole} onValueChange={(v: 'host' | 'co-host' | 'guest') => setNewHostRole(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="host">Host</SelectItem>
                        <SelectItem value="co-host">Co-Host</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Voice</Label><Input placeholder="Voice name or ID" value={newHostVoice} onChange={e => setNewHostVoice(e.target.value)} /></div>
                  <Button className="w-full" onClick={addHost}>Add Host</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {hosts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">No hosts yet. Add one to get started.</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {hosts.map((host) => (
                <div key={host.id} className="flex flex-col items-center gap-1 shrink-0">
                  <Avatar className={`h-12 w-12 ${host.color}`}>
                    <AvatarFallback className="text-white font-medium">{host.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{host.name}</span>
                  <Badge variant="outline" className="text-[10px] capitalize">{host.role}</Badge>
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
              <div className="text-center py-6"><Radio className="h-8 w-8 text-muted-foreground mx-auto mb-2" /><p className="text-sm text-muted-foreground">Generated episodes appear here</p></div>
            ) : (
              <div className="p-2 space-y-2">
                {episodes.map((ep) => {
                  const EpIcon = outputIcons[ep.outputType]
                  return (
                    <Card key={ep.id} className={`p-2 cursor-pointer hover:bg-accent ${selectedEpisode?.id === ep.id ? 'ring-2 ring-primary' : ''}`} onClick={() => playEpisode(ep)}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center shrink-0"><EpIcon className="h-5 w-5 text-muted-foreground" /></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{ep.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px]">{ep.format}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{ep.duration}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {ep.url && <DropdownMenuItem asChild><a href={ep.url} download><Download className="h-4 w-4 mr-2" />Download</a></DropdownMenuItem>}
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteEpisode(ep.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </ChatInterface>
  )
}
