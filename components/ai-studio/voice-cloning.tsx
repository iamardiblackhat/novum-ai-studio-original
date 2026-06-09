'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Upload, Mic, Volume2, Download, Trash2, Plus, StopCircle, AudioLines, MoreVertical, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChatInterface, Model } from './chat-interface'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Voice {
  id: string
  name: string
  type: 'cloned' | 'preset'
  samples: number
  accent?: string
  gender?: string
  sourceVoice?: string
}

interface GeneratedAudio {
  id: string
  text: string
  voiceId: string
  voiceName: string
  duration: string
  timestamp: Date
}

const voiceModels: Model[] = [
  // ElevenLabs
  { id: 'elevenlabs-v2', name: 'ElevenLabs v2', provider: 'elevenlabs', badge: 'Best', requiresKey: true },
  { id: 'elevenlabs-turbo', name: 'ElevenLabs Turbo', provider: 'elevenlabs', badge: 'Fast', requiresKey: true },
  // Local / Open Source
  { id: 'local-coqui', name: 'Coqui XTTS (Local)', provider: 'local', badge: 'Free' },
  { id: 'local-tortoise', name: 'Tortoise TTS (Local)', provider: 'local', badge: 'Quality' },
  { id: 'local-bark', name: 'Bark (Local)', provider: 'local', badge: 'Free' },
  { id: 'local-piper', name: 'Piper TTS (Local)', provider: 'local', badge: 'Fast' },
  // Replicate
  { id: 'replicate-xtts', name: 'XTTS v2', provider: 'replicate', badge: 'Quality', requiresKey: true },
  { id: 'replicate-bark', name: 'Bark', provider: 'replicate', badge: 'Emotive', requiresKey: true },
  // Hugging Face
  { id: 'hf-speecht5', name: 'SpeechT5', provider: 'huggingface', badge: 'Free', requiresKey: true },
  { id: 'hf-mms', name: 'MMS TTS', provider: 'huggingface', badge: 'Multilang', requiresKey: true },
]

const suggestedPrompts = [
  'Clone my voice from this recording',
  'Generate speech: "Welcome to our channel!"',
  'Create a professional narrator voice',
  'Make this text sound excited and energetic',
  'Convert this script to speech with Sarah\'s voice',
  'Add voice to my cartoon character Max',
]

const sampleVoices: Voice[] = [
  { id: '1', name: 'Max (Cartoon)', type: 'cloned', samples: 5, sourceVoice: 'John Smith', gender: 'Male' },
  { id: '2', name: 'Luna (Cartoon)', type: 'cloned', samples: 3, sourceVoice: 'Sarah Johnson', gender: 'Female' },
  { id: '3', name: 'Narrator Pro', type: 'cloned', samples: 8, sourceVoice: 'Mike Williams', gender: 'Male' },
  { id: '4', name: 'Default Female', type: 'preset', samples: 0, accent: 'American', gender: 'Female' },
  { id: '5', name: 'Default Male', type: 'preset', samples: 0, accent: 'British', gender: 'Male' },
]

export function VoiceCloning() {
  const [voices, setVoices] = useState<Voice[]>(sampleVoices)
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [generatedAudios, setGeneratedAudios] = useState<GeneratedAudio[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showAddVoice, setShowAddVoice] = useState(false)
  const [newVoiceName, setNewVoiceName] = useState('')
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startRecording = () => {
    setIsRecording(true)
    // Start timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
    // Store interval id to clear later
    return () => clearInterval(interval)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setRecordingTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <ChatInterface
      models={voiceModels}
      defaultModel="local-coqui"
      placeholder="Describe what you want to do with voice... (clone, generate speech, etc.)"
      welcomeTitle="Voice Cloning Studio"
      welcomeDescription="Clone voices, generate speech, and create character voices for your cartoons and podcasts."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['audio', 'file']}
    >
      {/* Voice Panel */}
      <div className="flex flex-col h-full gap-4">
        {/* Voice Library */}
        <Card className="flex-1 min-h-[250px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Voice Library</h3>
            <Dialog open={showAddVoice} onOpenChange={setShowAddVoice}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Voice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Voice</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="upload">
                  <TabsList className="w-full">
                    <TabsTrigger value="upload" className="flex-1">Upload Samples</TabsTrigger>
                    <TabsTrigger value="record" className="flex-1">Record</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Voice Name</Label>
                      <Input 
                        placeholder="e.g., Max (Cartoon Character)" 
                        value={newVoiceName}
                        onChange={(e) => setNewVoiceName(e.target.value)}
                      />
                    </div>
                    <div 
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="audio/*"
                        multiple
                      />
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drop audio files or click to upload
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP3, WAV, M4A (min 30 seconds recommended)
                      </p>
                    </div>
                    <Button className="w-full">Clone Voice</Button>
                  </TabsContent>
                  <TabsContent value="record" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Voice Name</Label>
                      <Input placeholder="e.g., My Voice Clone" />
                    </div>
                    <div className="flex flex-col items-center py-8">
                      <Button
                        variant={isRecording ? 'destructive' : 'default'}
                        size="lg"
                        className="h-20 w-20 rounded-full"
                        onClick={() => isRecording ? stopRecording() : startRecording()}
                      >
                        {isRecording ? (
                          <StopCircle className="h-10 w-10" />
                        ) : (
                          <Mic className="h-10 w-10" />
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4">
                        {isRecording ? 'Recording...' : 'Click to start recording'}
                      </p>
                      {isRecording && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="font-mono">{formatTime(recordingTime)}</span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full" disabled={!isRecording}>Clone Voice</Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
          <ScrollArea className="h-[200px]">
            <div className="p-2 space-y-2">
              {voices.map((voice) => (
                <Card
                  key={voice.id}
                  className={`p-3 cursor-pointer transition-all hover:bg-accent ${
                    selectedVoice?.id === voice.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedVoice(voice)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      voice.type === 'cloned' ? 'bg-primary/20' : 'bg-secondary'
                    }`}>
                      {voice.type === 'cloned' ? (
                        <AudioLines className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{voice.name}</h4>
                        <Badge variant={voice.type === 'cloned' ? 'default' : 'secondary'} className="text-[10px]">
                          {voice.type === 'cloned' ? 'Cloned' : 'Preset'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {voice.sourceVoice ? `Source: ${voice.sourceVoice}` : voice.accent}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Add Samples</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Generated Audio */}
        <Card className="flex-1 min-h-[200px] overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Generated Audio</h3>
            {selectedVoice && (
              <Badge variant="outline">Using: {selectedVoice.name}</Badge>
            )}
          </div>
          <ScrollArea className="h-[180px]">
            {generatedAudios.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <AudioLines className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Generated audio will appear here</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {generatedAudios.map((audio) => (
                  <Card key={audio.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={() => setPlayingAudioId(playingAudioId === audio.id ? null : audio.id)}
                      >
                        {playingAudioId === audio.id ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{audio.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">{audio.voiceName}</Badge>
                          <span className="text-xs text-muted-foreground">{audio.duration}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
      </div>
    </ChatInterface>
  )
}
