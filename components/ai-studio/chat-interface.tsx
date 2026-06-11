'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Settings, ChevronDown, Plus, Sparkles, Bot, User, Key, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface Model {
  id: string
  name: string
  provider: 'ollama' | 'groq' | 'openrouter' | 'openai' | 'anthropic' | 'local' | 'custom' | 'replicate' | 'huggingface' | 'elevenlabs' | 'suno' | 'runway' | 'stability'
  badge?: string
  requiresKey?: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments?: { type: 'image' | 'file' | 'audio' | 'video'; url: string; name: string }[]
  generatedContent?: {
    type: 'image' | 'video' | 'audio' | 'code'
    url?: string
    code?: string
  }
  timestamp: Date
  isLoading?: boolean
}

interface ChatInterfaceProps {
  models: Model[]
  defaultModel?: string
  placeholder?: string
  systemPrompt?: string
  showAttachments?: boolean
  attachmentTypes?: ('image' | 'file' | 'audio' | 'video')[]
  apiEndpoint?: 'chat' | 'image' | 'audio' | 'music' | 'video'
  welcomeTitle?: string
  welcomeDescription?: string
  suggestedPrompts?: string[]
  children?: React.ReactNode
}

const providerLabels: Record<string, string> = {
  ollama: 'Ollama (Local)',
  groq: 'Groq',
  openrouter: 'OpenRouter',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  local: 'Local Models',
  custom: 'Custom',
  replicate: 'Replicate',
  huggingface: 'Hugging Face',
  elevenlabs: 'ElevenLabs',
  suno: 'Suno AI',
  runway: 'Runway',
  stability: 'Stability AI',
}

export function ChatInterface({
  models,
  defaultModel,
  placeholder = 'Type your message...',
  showAttachments = true,
  attachmentTypes = ['image', 'file'],
  apiEndpoint = 'chat',
  welcomeTitle = 'Start a Conversation',
  welcomeDescription = 'Describe what you want to create and AI will help you.',
  suggestedPrompts = [],
  children,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState(defaultModel || models[0]?.id || '')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [pendingAttachments, setPendingAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentModel = models.find(m => m.id === selectedModel)
  const providerGroups = models.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = []
    acc[model.provider].push(model)
    return acc
  }, {} as Record<string, Model[]>)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() && pendingAttachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      attachments: pendingAttachments.map(f => ({
        type: f.type.startsWith('image') ? 'image' : f.type.startsWith('audio') ? 'audio' : f.type.startsWith('video') ? 'video' : 'file',
        url: URL.createObjectURL(f),
        name: f.name,
      })),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setPendingAttachments([])
    setIsLoading(true)

    try {
      let responseContent = ''
      let generatedContent: Message['generatedContent'] | undefined

      if (apiEndpoint === 'chat') {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: currentInput },
            ],
            model: selectedModel,
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        responseContent = data.content

      } else if (apiEndpoint === 'image') {
        const res = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: currentInput, model: selectedModel }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        responseContent = `Generated image for: "${currentInput}"`
        generatedContent = { type: 'image', url: data.url }

      } else if (apiEndpoint === 'audio') {
        const res = await fetch('/api/audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: currentInput, voice: selectedModel }),
        })
        if (!res.ok) throw new Error(`Audio failed (${res.status})`)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        responseContent = `Generated audio for: "${currentInput}"`
        generatedContent = { type: 'audio', url }

      } else if (apiEndpoint === 'music') {
        const res = await fetch('/api/music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: currentInput, model: selectedModel }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        responseContent = `Generated music for: "${currentInput}"`
        generatedContent = { type: 'audio', url: data.url }

      } else if (apiEndpoint === 'video') {
        const res = await fetch('/api/video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: currentInput, model: selectedModel }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        responseContent = `Generated video for: "${currentInput}"`
        generatedContent = { type: 'video', url: data.url }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        generatedContent,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (err: unknown) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Something went wrong. Make sure Ollama is running.'}`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPendingAttachments(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      <div className="flex flex-1 flex-col min-w-0">
        {/* Model Selector */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Bot className="h-4 w-4" />
                <span className="truncate max-w-[150px]">{currentModel?.name || 'Select Model'}</span>
                {currentModel?.badge && (
                  <Badge variant="secondary" className="text-[10px]">{currentModel.badge}</Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {Object.entries(providerGroups).map(([provider, providerModels]) => (
                <div key={provider}>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {providerLabels[provider] || provider}
                  </DropdownMenuLabel>
                  {providerModels.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className="flex items-center justify-between"
                    >
                      <span>{model.name}</span>
                      {model.badge && (
                        <Badge variant="secondary" className="text-[10px]">{model.badge}</Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </div>
              ))}
              <DropdownMenuItem onClick={() => setShowApiKeyDialog(true)}>
                <Key className="h-4 w-4 mr-2" />
                Configure API Keys
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{welcomeTitle}</h3>
                <p className="text-muted-foreground max-w-sm mb-6">{welcomeDescription}</p>
                {suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                    {suggestedPrompts.map((prompt, i) => (
                      <Button key={i} variant="outline" size="sm" className="text-xs" onClick={() => setInput(prompt)}>
                        {prompt}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {message.attachments.map((att, i) => (
                          <div key={i}>
                            {att.type === 'image' ? (
                              <img src={att.url} alt={att.name} className="h-20 w-20 rounded object-cover" />
                            ) : (
                              <div className="flex items-center gap-2 bg-background/50 rounded px-2 py-1 text-xs">
                                <Paperclip className="h-3 w-3" />
                                {att.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.generatedContent && (
                      <div className="mt-3 rounded-lg overflow-hidden border">
                        {message.generatedContent.type === 'image' && message.generatedContent.url && (
                          <img src={message.generatedContent.url} alt="Generated" className="w-full rounded-lg" />
                        )}
                        {(message.generatedContent.type === 'audio' || message.generatedContent.type === 'video') && message.generatedContent.url && (
                          <audio controls src={message.generatedContent.url} className="w-full mt-2" />
                        )}
                        {message.generatedContent.type === 'code' && message.generatedContent.code && (
                          <pre className="p-3 bg-secondary text-xs overflow-auto">
                            <code>{message.generatedContent.code}</code>
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Attachments Preview */}
        {pendingAttachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {pendingAttachments.map((file, i) => (
              <div key={i} className="relative group">
                {file.type.startsWith('image') ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-16 rounded object-cover border" />
                ) : (
                  <div className="h-16 px-3 flex items-center gap-2 bg-muted rounded border text-xs">
                    <Paperclip className="h-4 w-4" />
                    <span className="truncate max-w-[100px]">{file.name}</span>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(i)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="mt-4 space-y-2">
          <div className="relative">
            <Textarea
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              className="min-h-[100px] resize-none pr-24 bg-background"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              {showAttachments && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                    accept={attachmentTypes.map(t => {
                      if (t === 'image') return 'image/*'
                      if (t === 'audio') return 'audio/*'
                      if (t === 'video') return 'video/*'
                      return '*/*'
                    }).join(',')}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button size="icon" className="h-8 w-8" onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>

      {children && (
        <div className="flex-1 min-h-[400px] lg:min-h-0">{children}</div>
      )}

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure API Keys</DialogTitle>
            <DialogDescription>
              Add your API keys to use different model providers. Keys are stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {['openai', 'anthropic', 'groq', 'openrouter', 'replicate', 'huggingface', 'elevenlabs', 'stability'].map((provider) => (
              <div key={provider} className="space-y-2">
                <Label htmlFor={`key-${provider}`} className="capitalize">{providerLabels[provider] || provider}</Label>
                <Input
                  id={`key-${provider}`}
                  type="password"
                  placeholder={`Enter ${provider} API key`}
                  value={apiKeys[provider] || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                />
              </div>
            ))}
            <div className="pt-2">
              <Label>Ollama URL (Local)</Label>
              <Input
                placeholder="http://localhost:11434"
                value={apiKeys.ollama_url || ''}
                onChange={(e) => setApiKeys(prev => ({ ...prev, ollama_url: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Default: http://localhost:11434</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
