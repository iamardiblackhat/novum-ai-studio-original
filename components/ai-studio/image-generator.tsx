'use client'

import { useState } from 'react'
import { Download, Heart, Grid3X3, LayoutGrid, Sparkles, Share2, Trash2 } from 'lucide-react'
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
  { id: 'flux', name: 'Flux', provider: 'local', badge: 'Free' },
  { id: 'flux-realism', name: 'Flux Realism', provider: 'local', badge: 'Free' },
  { id: 'flux-anime', name: 'Flux Anime', provider: 'local', badge: 'Free' },
  { id: 'flux-3d', name: 'Flux 3D', provider: 'local', badge: 'Free' },
  { id: 'any-dark', name: 'Any Dark', provider: 'local', badge: 'Free' },
  { id: 'turbo', name: 'Turbo', provider: 'local', badge: 'Free' },
  { id: 'kontext', name: 'Kontext', provider: 'local', badge: 'Free' },
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

  return (
    <ChatInterface
      models={imageModels}
      defaultModel="flux"
      placeholder="Describe the image you want to create..."
      welcomeTitle="Image Generator"
      welcomeDescription="Describe any image and AI will generate it for you. Be specific about style, colors, and composition."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="image"
    >
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">Generated Images</h3>
          <div className="flex gap-1">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === 'large' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('large')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Generated images will appear here</p>
            </div>
          ) : (
            <div className={`p-4 grid gap-4 ${
              viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}>
              {images.map((image) => (
                <Dialog key={image.id}>
                  <DialogTrigger asChild>
                    <Card className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      {image.url ? (
                        <img src={image.url} alt={image.prompt} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-primary/10 flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-xs text-white/90 line-clamp-2 mb-2">{image.prompt}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-[10px]">{image.model}</Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className={`h-7 w-7 ${favorites.has(image.id) ? 'text-red-500' : 'text-white'}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(image.id) }}>
                                <Heart className={`h-4 w-4 ${favorites.has(image.id) ? 'fill-current' : ''}`} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-white" asChild>
                                <a href={image.url} download><Download className="h-4 w-4" /></a>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-white" onClick={(e) => { e.stopPropagation(); deleteImage(image.id) }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    {image.url && <img src={image.url} alt={image.prompt} className="w-full rounded-lg" />}
                    <div className="mt-4">
                      <p className="font-medium mb-2">{image.prompt}</p>
                      <div className="flex items-center justify-between">
                        <Badge>{image.model}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={image.url} download>
                              <Download className="h-4 w-4 mr-2" />Download
                            </a>
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
