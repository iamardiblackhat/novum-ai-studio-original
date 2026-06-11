'use client'

import { useState } from 'react'
import { Check, Sparkles, Copy, CheckCheck, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Layout {
  id: string
  name: string
  category: string
  description: string
  useCases: string[]
  trend: string | null
  trendColor: string
  complexity: 'Simple' | 'Medium' | 'Complex'
  preview: React.FC
}

const LayoutPreviewBento: React.FC = () => (
  <div className="h-full p-2 grid grid-cols-3 grid-rows-3 gap-1">
    <div className="col-span-2 row-span-2 rounded bg-primary/30 border border-primary/20" />
    <div className="rounded bg-secondary/60 border border-border" />
    <div className="rounded bg-secondary/60 border border-border" />
    <div className="rounded bg-accent/20 border border-accent/20" />
    <div className="rounded bg-secondary/60 border border-border" />
    <div className="rounded bg-secondary/60 border border-border" />
  </div>
)

const LayoutPreviewHolyGrail: React.FC = () => (
  <div className="h-full flex flex-col gap-1 p-2">
    <div className="h-4 rounded bg-primary/30 border border-primary/20" />
    <div className="flex-1 flex gap-1">
      <div className="w-10 rounded bg-secondary/80 border border-border" />
      <div className="flex-1 rounded bg-secondary/40 border border-border" />
      <div className="w-8 rounded bg-secondary/60 border border-border" />
    </div>
    <div className="h-3 rounded bg-secondary/60 border border-border" />
  </div>
)

const LayoutPreviewMagazine: React.FC = () => (
  <div className="h-full p-2 grid gap-1" style={{ gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1.5fr 1fr 1fr' }}>
    <div className="row-span-2 rounded bg-primary/25 border border-primary/20" />
    <div className="rounded bg-secondary/70 border border-border" />
    <div className="rounded bg-accent/20 border border-accent/20" />
    <div className="col-span-2 rounded bg-secondary/50 border border-border" />
  </div>
)

const LayoutPreviewDashboard: React.FC = () => (
  <div className="h-full flex gap-1 p-2">
    <div className="w-10 flex flex-col gap-1">
      <div className="h-5 rounded bg-primary/30 border border-primary/20" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 rounded bg-secondary/70 border border-border" />
      ))}
    </div>
    <div className="flex-1 flex flex-col gap-1">
      <div className="grid grid-cols-3 gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 rounded bg-secondary/60 border border-border" />
        ))}
      </div>
      <div className="flex-1 rounded bg-secondary/40 border border-border" />
    </div>
  </div>
)

const LayoutPreviewSplitScreen: React.FC = () => (
  <div className="h-full flex gap-0 p-2">
    <div className="flex-1 rounded-l-lg bg-primary/25 border border-primary/20 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-primary/40 border border-primary/30" />
    </div>
    <div className="w-px bg-border" />
    <div className="flex-1 rounded-r-lg bg-secondary/40 border border-border flex flex-col justify-center gap-1 p-2">
      <div className="h-1.5 rounded bg-foreground/20" style={{ width: '80%' }} />
      <div className="h-1.5 rounded bg-muted-foreground/30" style={{ width: '60%' }} />
      <div className="h-4 rounded bg-primary/30 border border-primary/20 mt-1" style={{ width: '50%' }} />
    </div>
  </div>
)

const LayoutPreviewMasonry: React.FC = () => (
  <div className="h-full p-2 grid grid-cols-3 gap-1 items-start">
    <div className="space-y-1">
      <div className="h-10 rounded bg-primary/25 border border-primary/20" />
      <div className="h-6 rounded bg-secondary/60 border border-border" />
      <div className="h-8 rounded bg-accent/20 border border-accent/20" />
    </div>
    <div className="space-y-1">
      <div className="h-6 rounded bg-secondary/60 border border-border" />
      <div className="h-12 rounded bg-primary/20 border border-primary/20" />
      <div className="h-4 rounded bg-secondary/60 border border-border" />
    </div>
    <div className="space-y-1">
      <div className="h-8 rounded bg-accent/20 border border-accent/20" />
      <div className="h-5 rounded bg-secondary/60 border border-border" />
      <div className="h-9 rounded bg-primary/15 border border-primary/20" />
    </div>
  </div>
)

const LayoutPreviewFullBleed: React.FC = () => (
  <div className="h-full flex flex-col gap-1 p-1">
    <div className="flex-1 rounded bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/20 flex items-center justify-center">
      <div className="text-center space-y-1">
        <div className="h-2 rounded bg-foreground/20 w-16 mx-auto" />
        <div className="h-1.5 rounded bg-muted-foreground/20 w-12 mx-auto" />
        <div className="h-3 rounded bg-primary/50 w-10 mx-auto" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-6 rounded bg-secondary/60 border border-border" />
      ))}
    </div>
  </div>
)

const LayoutPreviewTimeline: React.FC = () => (
  <div className="h-full flex p-2 gap-2">
    <div className="flex flex-col items-center">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: i === 0 ? 'hsl(var(--primary))' : 'hsl(var(--border))', backgroundColor: i === 0 ? 'hsl(var(--primary))' : 'transparent' }} />
          {i < 3 && <div className="w-px h-5 bg-border" />}
        </div>
      ))}
    </div>
    <div className="flex-1 space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-5 rounded bg-secondary/60 border border-border" />
      ))}
    </div>
  </div>
)

const LayoutPreviewTerminal: React.FC = () => (
  <div className="h-full p-2">
    <div className="h-full rounded bg-black/80 border border-green-500/30 overflow-hidden">
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-green-500/20">
        <div className="w-2 h-2 rounded-full bg-red-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-green-500/60" />
      </div>
      <div className="p-2 space-y-1">
        {['$ npm run dev', '> novum@1.0.0 dev', '> next dev', '✓ Ready on :3000'].map((line, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="h-1.5 rounded" style={{ width: `${[30, 50, 30, 40][i]}%`, backgroundColor: ['#22c55e', '#86efac', '#86efac', '#22c55e'][i], opacity: 0.8 }} />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const LayoutPreviewStickySidebar: React.FC = () => (
  <div className="h-full flex gap-1 p-2">
    <div className="w-12 flex flex-col gap-1">
      <div className="h-4 rounded bg-primary/30 border border-primary/20" />
      <div className="flex-1 rounded bg-secondary/60 border border-border" />
    </div>
    <div className="flex-1 space-y-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`rounded border border-border ${ i % 3 === 0 ? 'h-12' : 'h-6' } bg-secondary/40`} />
      ))}
    </div>
  </div>
)

const LayoutPreviewFloatingCards: React.FC = () => (
  <div className="h-full bg-gradient-to-br from-primary/10 to-accent/10 p-2 relative overflow-hidden rounded">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-2 w-full px-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-card/80 border border-border backdrop-blur-sm shadow-lg" />
        ))}
      </div>
    </div>
  </div>
)

const layouts: Layout[] = [
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    category: 'Feature',
    description: 'Asymmetric grid cells of varied sizes. Popularised by Apple, Notion, and Stripe. The #1 landing page layout trend in 2026.',
    useCases: ['AI SaaS landing', 'Feature showcases', 'App homepages', 'Portfolio'],
    trend: '#1 Trend 2026',
    trendColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    complexity: 'Medium',
    preview: LayoutPreviewBento,
  },
  {
    id: 'holy-grail',
    name: 'Holy Grail',
    category: 'App',
    description: 'Header + left sidebar + main content + optional right panel + footer. The standard pattern for web apps and dashboards.',
    useCases: ['Dashboards', 'Admin panels', 'Docs sites', 'CMS'],
    trend: 'Standard',
    trendColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    complexity: 'Medium',
    preview: LayoutPreviewHolyGrail,
  },
  {
    id: 'magazine-editorial',
    name: 'Magazine Editorial',
    category: 'Content',
    description: 'Varied image sizes, asymmetric columns, editorial typography hierarchy. Used by publications and editorial-style landing pages.',
    useCases: ['News sites', 'Editorial blogs', 'Media platforms', 'Portfolios'],
    trend: 'Trending',
    trendColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    complexity: 'Complex',
    preview: LayoutPreviewMagazine,
  },
  {
    id: 'dashboard',
    name: 'Data Dashboard',
    category: 'App',
    description: 'Fixed sidebar navigation, top metric cards, chart panels. Industry-standard layout for analytics products.',
    useCases: ['Analytics', 'SaaS admin', 'CRM', 'Business intelligence'],
    trend: 'Standard',
    trendColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    complexity: 'Complex',
    preview: LayoutPreviewDashboard,
  },
  {
    id: 'split-screen',
    name: 'Split Screen',
    category: 'Landing',
    description: '50/50 horizontal split. One half visual, one half copy and CTA. High-converting hero pattern for product and auth pages.',
    useCases: ['Hero sections', 'Auth pages', 'Product launches', 'Comparisons'],
    trend: null,
    trendColor: '',
    complexity: 'Simple',
    preview: LayoutPreviewSplitScreen,
  },
  {
    id: 'masonry',
    name: 'Masonry Grid',
    category: 'Gallery',
    description: 'Pinterest-style variable-height cards. Best for image-heavy content, media galleries, and generative AI output grids.',
    useCases: ['Image galleries', 'AI output grids', 'Portfolio work', 'Inspiration boards'],
    trend: null,
    trendColor: '',
    complexity: 'Medium',
    preview: LayoutPreviewMasonry,
  },
  {
    id: 'full-bleed-hero',
    name: 'Full Bleed Hero',
    category: 'Landing',
    description: 'Edge-to-edge hero with centred content, often over a video or animated gradient. Below-the-fold feature grid or cards.',
    useCases: ['Marketing sites', 'Game launches', 'Brand pages', 'Agency sites'],
    trend: null,
    trendColor: '',
    complexity: 'Simple',
    preview: LayoutPreviewFullBleed,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'Content',
    description: 'Vertical or horizontal event sequence. Used for changelogs, roadmaps, histories, and step-by-step how-it-works sections.',
    useCases: ['Changelogs', 'Roadmaps', 'Step flows', 'History pages'],
    trend: null,
    trendColor: '',
    complexity: 'Simple',
    preview: LayoutPreviewTimeline,
  },
  {
    id: 'terminal',
    name: 'Terminal / CLI',
    category: 'Developer',
    description: 'Command-line aesthetic UI. Monospace font, dark terminal panels, typed-output animations. Popular for developer tools and hacker portfolios.',
    useCases: ['Dev tools', 'CLI products', 'Hacker portfolios', 'Technical blogs'],
    trend: 'Niche Favourite',
    trendColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    complexity: 'Medium',
    preview: LayoutPreviewTerminal,
  },
  {
    id: 'sticky-sidebar',
    name: 'Sticky Sidebar',
    category: 'Content',
    description: 'Long-form content with a sticky table of contents or context panel. Standard for documentation, technical articles, and tutorials.',
    useCases: ['Documentation', 'Long-form articles', 'Tutorials', 'Legal pages'],
    trend: null,
    trendColor: '',
    complexity: 'Simple',
    preview: LayoutPreviewStickySidebar,
  },
  {
    id: 'floating-cards',
    name: 'Floating Cards',
    category: 'Feature',
    description: 'Glassmorphic cards floating over a gradient or blurred mesh background. High visual impact for AI products and feature showcases.',
    useCases: ['AI product pages', 'Feature grids', 'Pricing', 'Testimonials'],
    trend: 'Trending',
    trendColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    complexity: 'Medium',
    preview: LayoutPreviewFloatingCards,
  },
]

const categories = ['All', 'Feature', 'App', 'Landing', 'Content', 'Gallery', 'Developer']
const complexities = ['All', 'Simple', 'Medium', 'Complex']

export function LayoutsGallery() {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [complexityFilter, setComplexityFilter] = useState('All')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = layouts.filter(l =>
    (categoryFilter === 'All' || l.category === categoryFilter) &&
    (complexityFilter === 'All' || l.complexity === complexityFilter)
  )

  const copyUseCase = (layout: Layout) => {
    navigator.clipboard.writeText(layout.useCases.join(', '))
    setCopied(layout.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Layouts</h2>
          <p className="text-sm text-muted-foreground">{layouts.length} layout patterns — with live visual previews</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {complexities.map(c => (
              <Button
                key={c}
                variant={complexityFilter === c ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setComplexityFilter(c)}
              >{c}</Button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0"
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Layout Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pr-2">
          {filtered.map(layout => {
            const PreviewComponent = layout.preview
            const isSelected = selectedLayout === layout.id
            return (
              <Card
                key={layout.id}
                className={`overflow-hidden cursor-pointer transition-all duration-200 group ${
                  isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/40'
                }`}
                onClick={() => setSelectedLayout(isSelected ? null : layout.id)}
              >
                {/* Live SVG Preview */}
                <div className="h-44 bg-card border-b border-border relative overflow-hidden">
                  <PreviewComponent />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{layout.name}</span>
                      {layout.trend && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${layout.trendColor}`}>
                          {layout.trend}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{layout.category}</Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          layout.complexity === 'Simple' ? 'border-green-500/40 text-green-400' :
                          layout.complexity === 'Medium' ? 'border-yellow-500/40 text-yellow-400' :
                          'border-red-500/40 text-red-400'
                        }`}
                      >
                        {layout.complexity}
                      </Badge>
                    </div>
                  </div>

                  {isSelected ? (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{layout.description}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{layout.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {layout.useCases.slice(0, 2).map(u => (
                        <Badge key={u} variant="secondary" className="text-[10px]">{u}</Badge>
                      ))}
                      {layout.useCases.length > 2 && (
                        <Badge variant="secondary" className="text-[10px]">+{layout.useCases.length - 2}</Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={e => { e.stopPropagation(); copyUseCase(layout) }}
                    >
                      {copied === layout.id ? <CheckCheck className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
