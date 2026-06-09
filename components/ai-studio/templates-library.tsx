'use client'

import { useState } from 'react'
import { 
  Search, Grid3X3, LayoutGrid, Star, Download, Eye,
  Code2, ShoppingCart, FileText, Users, BarChart3,
  MessageSquare, Calendar, Mail, Globe, Briefcase,
  Palette, Layers, Sparkles, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const templates = [
  { 
    id: '1', 
    name: 'SaaS Landing Page', 
    category: 'Landing',
    icon: Globe,
    downloads: 2450,
    rating: 4.9,
    tags: ['Hero', 'Pricing', 'Features']
  },
  { 
    id: '2', 
    name: 'E-commerce Store', 
    category: 'E-commerce',
    icon: ShoppingCart,
    downloads: 1820,
    rating: 4.8,
    tags: ['Products', 'Cart', 'Checkout']
  },
  { 
    id: '3', 
    name: 'Blog Platform', 
    category: 'Content',
    icon: FileText,
    downloads: 980,
    rating: 4.7,
    tags: ['Articles', 'Categories', 'Comments']
  },
  { 
    id: '4', 
    name: 'Dashboard', 
    category: 'Admin',
    icon: BarChart3,
    downloads: 3200,
    rating: 4.9,
    tags: ['Charts', 'Tables', 'Analytics']
  },
  { 
    id: '5', 
    name: 'Portfolio', 
    category: 'Personal',
    icon: Briefcase,
    downloads: 1560,
    rating: 4.6,
    tags: ['Projects', 'About', 'Contact']
  },
  { 
    id: '6', 
    name: 'Chat Application', 
    category: 'App',
    icon: MessageSquare,
    downloads: 890,
    rating: 4.7,
    tags: ['Messaging', 'Real-time', 'Groups']
  },
]

const themes = [
  { id: '1', name: 'Midnight', primary: '#6366f1', secondary: '#1e1e2e', accent: '#22d3ee' },
  { id: '2', name: 'Forest', primary: '#22c55e', secondary: '#0f1f14', accent: '#84cc16' },
  { id: '3', name: 'Ocean', primary: '#0ea5e9', secondary: '#0c1929', accent: '#06b6d4' },
  { id: '4', name: 'Sunset', primary: '#f97316', secondary: '#1c1210', accent: '#fbbf24' },
  { id: '5', name: 'Rose', primary: '#f43f5e', secondary: '#1c1015', accent: '#ec4899' },
  { id: '6', name: 'Minimal', primary: '#ffffff', secondary: '#000000', accent: '#737373' },
]

const layouts = [
  { id: '1', name: 'Single Column', description: 'Clean and focused layout' },
  { id: '2', name: 'Two Column', description: 'Sidebar with main content' },
  { id: '3', name: 'Three Column', description: 'Complex dashboard layout' },
  { id: '4', name: 'Grid', description: 'Flexible grid-based layout' },
  { id: '5', name: 'Magazine', description: 'Editorial style layout' },
  { id: '6', name: 'Full Width', description: 'Edge-to-edge content' },
]

const categories = ['All', 'Landing', 'E-commerce', 'Admin', 'Content', 'App', 'Personal']

export function TemplatesLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

  const filteredTemplates = templates.filter(t => 
    (selectedCategory === 'All' || t.category === selectedCategory) &&
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col gap-4">
      <Tabs defaultValue="templates" className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="templates" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="themes" className="gap-2">
              <Palette className="h-4 w-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="layouts" className="gap-2">
              <Layers className="h-4 w-4" />
              Layouts
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 bg-secondary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'large' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('large')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="templates" className="flex-1 mt-0 overflow-hidden flex flex-col">
          {/* Category Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <ScrollArea className="flex-1">
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden group">
                  <div className={`${viewMode === 'large' ? 'aspect-video' : 'aspect-[4/3]'} bg-gradient-to-br from-primary/20 via-secondary to-accent/20 flex items-center justify-center relative`}>
                    <template.icon className="h-12 w-12 text-primary/50" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button size="sm" variant="secondary" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Use
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="text-[10px] mt-1">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{template.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {template.downloads.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="themes" className="flex-1 mt-0 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {themes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`p-4 cursor-pointer transition-all ${
                  selectedTheme === theme.id ? 'ring-2 ring-primary' : 'hover:bg-secondary/50'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div className="flex gap-2 mb-3">
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{theme.name}</span>
                  {selectedTheme === theme.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layouts" className="flex-1 mt-0 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <Card key={layout.id} className="p-4 cursor-pointer hover:bg-secondary/50 transition-all group">
                <div className="aspect-video bg-secondary rounded mb-3 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-medium text-sm">{layout.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{layout.description}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
