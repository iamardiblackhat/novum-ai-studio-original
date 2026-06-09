'use client'

import { useState } from 'react'
import { Download, Heart, Expand, Grid3X3, LayoutGrid, Sparkles, X, Trash2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInterface, Model } from './chat-interface'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  model: string
  timestamp: Date
}

const imageModels: Model[] = [
  // Local / Ollama + ComfyUI
  { id: 'local-sdxl', name: 'SDXL (Local)', provider: 'local', badge: 'Free' },
  { id: 'local-sd3', name: 'SD 3.5 (Local)', provider: 'local', badge: 'Free' },
  { id: 'local-flux', name: 'Flux.1 (Local)', provider: 'local', badge: 'Free' },
  // Stability AI
  { id: 'stability-sdxl', name: 'SDXL 1.0', provider: 'stability', badge: 'Quality', requiresKey: true },
  { id: 'stability-sd3', name: 'Stable Diffusion 3', provider: 'stability', badge: 'Best', requiresKey: true },
  // Replicate
  { id: 'replicate-flux', name: 'Flux Schnell', provider: 'replicate', badge: 'Fast', requiresKey: true },
  { id: 'replicate-flux-pro', name: 'Flux Pro', provider: 'replicate', badge: 'Best', requiresKey: true },
  { id: 'replicate-sdxl', name: 'SDXL Lightning', provider: 'replicate', badge: 'Fast', requiresKey: true },
  // Hugging Face
  { id: 'hf-sdxl', name: 'SDXL Base', provider: 'huggingface', badge: 'Free', requiresKey: true },
  { id: 'hf-kandinsky', name: 'Kandinsky 3', provider: 'huggingface', badge: 'Art', requiresKey: true },
  // OpenRouter (for DALL-E, etc)
  { id: 'openrouter-dalle3', name: 'DALL-E 3', provider: 'openrouter', badge: 'Premium', requiresKey: true },
  // OpenAI Direct
  { id: 'openai-dalle3', name: 'DALL-E 3', provider: 'openai', badge: 'Premium', requiresKey: true },
]

const suggestedPrompts = [
  'A futuristic cityscape at sunset',
  'Portrait of a cyberpunk character',
  'Magical forest with glowing mushrooms',
  'Product photo of a sleek smartphone',
  'Abstract geometric art in vibrant colors',
  'Cozy coffee shop interior',
]

export function ImageGenerator() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid')
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  // Sample images for demo
  const sampleImages: GeneratedImage[] = [
    { id: '1', url: '', prompt: 'Futuristic city at sunset', model: 'Flux Pro', timestamp: new Date() },
    { id: '2', url: '', prompt: 'Abstract geometric art', model: 'SDXL', timestamp: new Date() },
    { id: '3', url: '', prompt: 'Portrait of a warrior', model: 'SD 3', timestamp: new Date() },
    { id: '4', url: '', prompt: 'Magical forest', model: 'DALL-E 3', timestamp: new Date() },
  ]

  const displayImages = images.length > 0 ? images : sampleImages

  return (
    <ChatInterface
      models={imageModels}
      defaultModel="local-sdxl"
      placeholder="Describe the image you want to create..."
      welcomeTitle="Image Generator"
      welcomeDescription="Describe any image and I'll generate it for you using AI. Be specific about style, colors, and composition."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['image']}
    >
      {/* Gallery Panel */}
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Generated Images</h3>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'large' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('large')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {displayImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Generated images will appear here</p>
            </div>
          ) : (
            <div className={`p-4 grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {displayImages.map((image) => (
                <Dialog key={image.id}>
                  <DialogTrigger asChild>
                    <Card
                      className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-primary/10 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary/50" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-xs text-white/90 line-clamp-2 mb-2">{image.prompt}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-[10px]">{image.model}</Badge>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`h-7 w-7 ${favorites.has(image.id) ? 'text-red-500' : 'text-white'} hover:text-red-500`}
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(image.id); }}
                              >
                                <Heart className={`h-4 w-4 ${favorites.has(image.id) ? 'fill-current' : ''}`} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:text-primary">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary to-primary/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-16 w-16 text-primary/50" />
                    </div>
                    <div className="mt-4">
                      <p className="font-medium mb-2">{image.prompt}</p>
                      <div className="flex items-center justify-between">
                        <Badge>{image.model}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </ScrollArea>
      </Card>
    </ChatInterface>
  )
}
