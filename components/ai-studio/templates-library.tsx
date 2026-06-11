'use client'

import { useState } from 'react'
import {
  Search, Grid3X3, LayoutGrid, Star, ExternalLink,
  Sparkles, Code2, ShoppingCart, FileText, BarChart3,
  MessageSquare, Globe, Briefcase, Bot, Mic, Music,
  Video, Zap, Mail, Database, Layers, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

const templates = [
  {
    id: '1',
    name: 'AI SaaS Landing',
    category: 'AI',
    stack: 'Next.js + Tailwind',
    description: 'Hero with animated gradient, feature bento grid, pricing table, waitlist CTA. Built for AI tool launches.',
    gradient: 'from-violet-600/30 via-purple-900/40 to-indigo-900/50',
    accent: '#7c3aed',
    tags: ['Bento Grid', 'Waitlist', 'Pricing', 'Dark Mode'],
    stars: 4.9,
    uses: 8420,
    badge: 'Trending',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    icon: Sparkles,
    preview: 'https://ui.shadcn.com',
    sections: ['Hero', 'Features Bento', 'Testimonials', 'Pricing', 'FAQ', 'CTA', 'Footer'],
  },
  {
    id: '2',
    name: 'AI Agent Dashboard',
    category: 'AI',
    stack: 'Next.js + shadcn/ui',
    description: 'Multi-agent management UI. Live activity feed, tool usage metrics, agent health status, task queue.',
    gradient: 'from-cyan-600/30 via-teal-900/40 to-emerald-900/50',
    accent: '#0d9488',
    tags: ['Dashboard', 'Real-time', 'Agents', 'Analytics'],
    stars: 4.9,
    uses: 6100,
    badge: 'Hot',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: Bot,
    preview: 'https://ui.shadcn.com',
    sections: ['Sidebar', 'Agent Cards', 'Activity Log', 'Task Queue', 'Metrics', 'Settings'],
  },
  {
    id: '3',
    name: 'AI Chatbot UI',
    category: 'AI',
    stack: 'Next.js + Vercel AI SDK',
    description: 'Production-ready chat interface. Streaming responses, multi-model switching, conversation history, RAG toggle.',
    gradient: 'from-blue-600/30 via-blue-900/40 to-indigo-900/50',
    accent: '#3b82f6',
    tags: ['Streaming', 'Multi-model', 'RAG', 'History'],
    stars: 4.8,
    uses: 12300,
    badge: 'Most Used',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: MessageSquare,
    preview: 'https://ui.shadcn.com',
    sections: ['Chat Window', 'Model Selector', 'Message History', 'File Upload', 'Settings Panel'],
  },
  {
    id: '4',
    name: 'Neobrutalist Portfolio',
    category: 'Portfolio',
    stack: 'Next.js + Tailwind',
    description: 'Bold neobrutalist design. Thick borders, clash colours, heavy typography. Cuts through the noise of generic portfolios.',
    gradient: 'from-yellow-400/30 via-orange-900/40 to-red-900/50',
    accent: '#f59e0b',
    tags: ['Neobrutalism', 'Bold', 'Portfolio', 'Animations'],
    stars: 4.8,
    uses: 5200,
    badge: 'Design Award',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    icon: Briefcase,
    preview: 'https://ui.shadcn.com',
    sections: ['Hero', 'Work Grid', 'About', 'Stack', 'Contact'],
  },
  {
    id: '5',
    name: 'SaaS Analytics Dashboard',
    category: 'Dashboard',
    stack: 'Next.js + Recharts',
    description: 'Full analytics suite. Revenue charts, user funnel, cohort retention, churn prediction. Connects to Stripe, Mixpanel, Posthog.',
    gradient: 'from-green-600/30 via-emerald-900/40 to-teal-900/50',
    accent: '#10b981',
    tags: ['Charts', 'Stripe', 'Posthog', 'Dark Mode'],
    stars: 4.9,
    uses: 9800,
    badge: 'Pro',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: BarChart3,
    preview: 'https://ui.shadcn.com',
    sections: ['Overview', 'Revenue', 'Users', 'Funnel', 'Retention', 'Reports'],
  },
  {
    id: '6',
    name: 'Voice AI App',
    category: 'AI',
    stack: 'Next.js + Vapi + WebRTC',
    description: 'Real-time voice AI interface. Visualised audio waveform, live transcription, voice cloning selector, call log history.',
    gradient: 'from-pink-600/30 via-rose-900/40 to-red-900/50',
    accent: '#ec4899',
    tags: ['Voice', 'WebRTC', 'Real-time', 'Vapi'],
    stars: 4.7,
    uses: 3400,
    badge: 'New',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: Mic,
    preview: 'https://ui.shadcn.com',
    sections: ['Voice Interface', 'Waveform', 'Transcript', 'Voice Selector', 'Call History'],
  },
  {
    id: '7',
    name: 'E-commerce + AI Search',
    category: 'E-commerce',
    stack: 'Next.js + Shopify + Algolia',
    description: 'Modern storefront with AI-powered semantic search, personalised recommendations, cart, and one-page checkout.',
    gradient: 'from-orange-600/30 via-amber-900/40 to-yellow-900/50',
    accent: '#f97316',
    tags: ['AI Search', 'Shopify', 'Recommendations', 'Checkout'],
    stars: 4.8,
    uses: 7600,
    badge: 'Popular',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    icon: ShoppingCart,
    preview: 'https://ui.shadcn.com',
    sections: ['Storefront', 'AI Search', 'Product Page', 'Cart', 'Checkout', 'Order Tracking'],
  },
  {
    id: '8',
    name: 'Glassmorphism SaaS',
    category: 'Landing',
    stack: 'Next.js + Framer Motion',
    description: 'Frosted glass UI over animated gradient mesh. Smooth scroll animations, floating feature cards, modal pricing.',
    gradient: 'from-sky-600/30 via-blue-900/40 to-purple-900/50',
    accent: '#0ea5e9',
    tags: ['Glassmorphism', 'Animations', 'Framer Motion', 'Landing'],
    stars: 4.7,
    uses: 4900,
    badge: null,
    badgeColor: '',
    icon: Globe,
    preview: 'https://ui.shadcn.com',
    sections: ['Hero', 'Features', 'How It Works', 'Pricing', 'Testimonials', 'Footer'],
  },
  {
    id: '9',
    name: 'Docs + Changelog Site',
    category: 'Docs',
    stack: 'Next.js + MDX + Contentlayer',
    description: 'Developer documentation with versioned sidebar, full-text search, API reference, and a public changelog feed.',
    gradient: 'from-slate-600/30 via-zinc-900/40 to-neutral-900/50',
    accent: '#64748b',
    tags: ['MDX', 'Search', 'API Docs', 'Changelog'],
    stars: 4.8,
    uses: 5500,
    badge: null,
    badgeColor: '',
    icon: FileText,
    preview: 'https://ui.shadcn.com',
    sections: ['Docs Sidebar', 'MDX Pages', 'API Reference', 'Changelog', 'Search'],
  },
  {
    id: '10',
    name: 'AI Music Studio UI',
    category: 'AI',
    stack: 'Next.js + Wavesurfer.js',
    description: 'Music generation interface with waveform visualiser, genre/mood selectors, stem separation view, and playlist manager.',
    gradient: 'from-purple-600/30 via-violet-900/40 to-fuchsia-900/50',
    accent: '#a855f7',
    tags: ['Music', 'Waveform', 'Suno', 'Udio'],
    stars: 4.6,
    uses: 2800,
    badge: 'New',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: Music,
    preview: 'https://ui.shadcn.com',
    sections: ['Generator', 'Waveform', 'Stem View', 'Playlist', 'History'],
  },
  {
    id: '11',
    name: 'n8n Automation Hub',
    category: 'Automation',
    stack: 'Next.js + React Flow',
    description: 'Visual workflow builder UI. Node-based canvas, pre-built integration blocks, run history, error logs.',
    gradient: 'from-red-600/30 via-rose-900/40 to-pink-900/50',
    accent: '#ef4444',
    tags: ['n8n', 'React Flow', 'Automation', 'Workflows'],
    stars: 4.9,
    uses: 6700,
    badge: 'Trending',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: Zap,
    preview: 'https://ui.shadcn.com',
    sections: ['Canvas', 'Node Library', 'Run History', 'Error Logs', 'Settings'],
  },
  {
    id: '12',
    name: 'Waitlist + Viral Loop',
    category: 'Landing',
    stack: 'Next.js + Supabase',
    description: 'High-converting waitlist page with referral tracking, position counter, social share cards, and admin dashboard.',
    gradient: 'from-lime-600/30 via-green-900/40 to-emerald-900/50',
    accent: '#84cc16',
    tags: ['Waitlist', 'Referral', 'Supabase', 'Viral'],
    stars: 4.7,
    uses: 3900,
    badge: null,
    badgeColor: '',
    icon: Mail,
    preview: 'https://ui.shadcn.com',
    sections: ['Hero', 'Waitlist Form', 'Referral Counter', 'Share Cards', 'Admin Panel'],
  },
  {
    id: '13',
    name: 'Video AI Generator UI',
    category: 'AI',
    stack: 'Next.js + Replicate',
    description: 'Video generation interface supporting LTX-Video, Wan 2.1, HunyuanVideo. Progress tracker, gallery, prompt history.',
    gradient: 'from-indigo-600/30 via-blue-900/40 to-violet-900/50',
    accent: '#6366f1',
    tags: ['Video AI', 'Replicate', 'LTX', 'Wan'],
    stars: 4.7,
    uses: 2200,
    badge: 'New',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: Video,
    preview: 'https://ui.shadcn.com',
    sections: ['Generator', 'Model Picker', 'Progress', 'Gallery', 'Prompt History'],
  },
  {
    id: '14',
    name: 'RAG Knowledge Base',
    category: 'AI',
    stack: 'Next.js + Qdrant + LangChain',
    description: 'Upload docs, chunk, embed, and query. Full RAG pipeline UI with source citations, chunk inspector, and embedding visualiser.',
    gradient: 'from-teal-600/30 via-cyan-900/40 to-sky-900/50',
    accent: '#14b8a6',
    tags: ['RAG', 'Qdrant', 'LangChain', 'Embeddings'],
    stars: 4.8,
    uses: 4100,
    badge: 'Developer',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: Database,
    preview: 'https://ui.shadcn.com',
    sections: ['Upload', 'Chunker', 'Query Interface', 'Citations', 'Chunk Inspector'],
  },
  {
    id: '15',
    name: 'Terminal / Hacker Blog',
    category: 'Portfolio',
    stack: 'Next.js + MDX',
    description: 'Monospace terminal aesthetic. Green-on-black, command-line navigation, ASCII art header, dev blog with syntax highlighting.',
    gradient: 'from-green-900/60 via-black to-green-950/80',
    accent: '#22c55e',
    tags: ['Terminal', 'Hacker', 'Blog', 'MDX'],
    stars: 4.6,
    uses: 3100,
    badge: null,
    badgeColor: '',
    icon: Code2,
    preview: 'https://ui.shadcn.com',
    sections: ['ASCII Header', 'Terminal Nav', 'Blog Posts', 'Projects', 'Contact'],
  },
]

const categories = ['All', 'AI', 'Dashboard', 'Landing', 'Portfolio', 'E-commerce', 'Docs', 'Automation']

export function TemplatesLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = templates.filter(t =>
    (selectedCategory === 'All' || t.category === selectedCategory) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Templates</h2>
          <p className="text-sm text-muted-foreground">{templates.length} production-ready templates for 2026</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates, tags, stacks..."
              className="pl-9 w-64 bg-secondary"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'large' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('large')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1">
        <div className={`grid gap-4 pr-2 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {filtered.map(template => {
            const isExpanded = expandedId === template.id
            return (
              <Card
                key={template.id}
                className="overflow-hidden group cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-primary/50"
                onClick={() => setExpandedId(isExpanded ? null : template.id)}
              >
                {/* Visual Preview */}
                <div className={`relative ${
                  viewMode === 'large' ? 'aspect-video' : 'aspect-[16/9]'
                } bg-gradient-to-br ${template.gradient} flex flex-col items-center justify-center overflow-hidden`}>
                  {/* Fake browser chrome */}
                  <div className="absolute inset-2 rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm flex flex-col overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-black/20 flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      <div className="flex-1 mx-2 h-4 rounded bg-white/10 text-[8px] flex items-center px-2 text-white/40 font-mono">
                        novum.ai/{template.name.toLowerCase().replace(/\s+/g, '-')}
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <template.icon
                        className="h-10 w-10 opacity-40"
                        style={{ color: template.accent }}
                      />
                    </div>
                    {/* Section pills */}
                    <div className="px-2 pb-2 flex flex-wrap gap-1">
                      {template.sections.slice(0, 4).map(s => (
                        <span key={s} className="text-[7px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">{s}</span>
                      ))}
                      {template.sections.length > 4 && (
                        <span className="text-[7px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">+{template.sections.length - 4}</span>
                      )}
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" className="gap-1.5" onClick={e => { e.stopPropagation(); window.open(template.preview, '_blank') }}>
                      <ExternalLink className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Use Template
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        {template.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${template.badgeColor}`}>
                            {template.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{template.stack}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium">{template.stars}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{template.description}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] h-5">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {template.uses.toLocaleString()} uses
                    </span>
                    <Badge variant="outline" className="text-[10px]">{template.category}</Badge>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No templates match your search</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
