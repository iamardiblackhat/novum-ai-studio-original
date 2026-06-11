'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout, Copy, Check, Grid, Columns, Rows, Square, ExternalLink } from 'lucide-react'

type LayoutCategory = 'all' | 'marketing' | 'dashboard' | 'ecommerce' | 'blog' | 'app'

type LayoutItem = {
  id: string
  name: string
  description: string
  category: Exclude<LayoutCategory, 'all'>
  tags: string[]
  trending?: boolean
  code: string
  preview: {
    type: 'bento' | 'sidebar' | 'hero' | 'grid' | 'split' | 'magazine' | 'masonry' | 'dashboard' | 'command' | 'timeline'
    label: string
  }
}

const LAYOUTS: LayoutItem[] = [
  {
    id: 'l1', name: 'Bento Grid Hero', category: 'marketing',
    description: 'Apple WWDC-style asymmetric bento grid with featured card and info cells.',
    tags: ['bento', 'hero', 'asymmetric'], trending: true,
    preview: { type: 'bento', label: 'Bento Grid' },
    code: `<section className="grid grid-cols-3 grid-rows-2 gap-3 h-[480px]">
  <div className="col-span-2 row-span-2 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-8 flex flex-col justify-end">
    <h1 className="text-4xl font-bold text-white">Main Feature</h1>
    <p className="text-violet-200 mt-2">Your headline story or hero product.</p>
  </div>
  <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col justify-between">
    <span className="text-xs text-zinc-500 uppercase tracking-wide">Metric</span>
    <span className="text-3xl font-bold text-white">98%</span>
  </div>
  <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
      <span className="text-xl">⚡</span>
    </div>
    <div>
      <div className="text-sm font-semibold text-zinc-100">Fast</div>
      <div className="text-xs text-zinc-500">Sub 100ms</div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'l2', name: 'Holy Grail Dashboard', category: 'dashboard',
    description: 'Classic sticky header, fixed sidebar, scrollable main, footer — the backbone of every admin UI.',
    tags: ['dashboard', 'sidebar', 'admin'], trending: true,
    preview: { type: 'dashboard', label: 'Dashboard' },
    code: `<div className="h-screen flex flex-col">
  {/* Header */}
  <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 sticky top-0 z-10">
    <span className="font-semibold text-zinc-100">Dashboard</span>
  </header>
  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar */}
    <aside className="w-56 border-r border-zinc-800 bg-zinc-950 overflow-y-auto shrink-0">
      <nav className="p-3 space-y-1">
        {['Overview', 'Analytics', 'Users', 'Settings'].map(item => (
          <button key={item} className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">{item}</button>
        ))}
      </nav>
    </aside>
    {/* Main */}
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">{/* content */}</div>
    </main>
  </div>
</div>`,
  },
  {
    id: 'l3', name: 'Magazine Editorial', category: 'blog',
    description: 'Varied image sizes, pull quotes, and asymmetric columns — editorial print feel on the web.',
    tags: ['magazine', 'editorial', 'blog'], trending: true,
    preview: { type: 'magazine', label: 'Magazine' },
    code: `<section className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
  {/* Lead story */}
  <article className="col-span-8">
    <div className="aspect-video rounded-xl overflow-hidden bg-zinc-800 mb-4" />
    <div className="text-xs text-violet-400 uppercase tracking-widest mb-2">Feature</div>
    <h2 className="text-3xl font-bold text-zinc-100 leading-tight mb-3">The Future of AI-Generated Design</h2>
    <p className="text-zinc-400 leading-relaxed">Lorem ipsum dolor sit amet...</p>
  </article>
  {/* Sidebar stories */}
  <aside className="col-span-4 space-y-5 border-l border-zinc-800 pl-6">
    {[1,2,3].map(i => (
      <div key={i} className="flex gap-3 pb-5 border-b border-zinc-800 last:border-0">
        <div className="w-20 h-16 rounded-lg bg-zinc-800 shrink-0" />
        <div>
          <div className="text-xs text-zinc-500 mb-1">Topic #{i}</div>
          <div className="text-sm font-semibold text-zinc-200 leading-tight">Article headline here</div>
        </div>
      </div>
    ))}
  </aside>
</section>`,
  },
  {
    id: 'l4', name: 'Split Screen Hero', category: 'marketing',
    description: 'Bold 50/50 split with contrasting visual left and text CTA right.',
    tags: ['hero', 'split', 'landing'],
    preview: { type: 'split', label: 'Split Screen' },
    code: `<section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
  {/* Visual half */}
  <div className="relative bg-gradient-to-br from-violet-900 via-indigo-900 to-black flex items-center justify-center">
    <div className="w-48 h-48 rounded-full bg-violet-500/20 blur-3xl absolute" />
    <div className="text-8xl relative z-10">✨</div>
  </div>
  {/* Text half */}
  <div className="bg-zinc-950 flex items-center px-12">
    <div className="max-w-lg">
      <div className="text-xs text-violet-400 uppercase tracking-widest mb-4">New Release</div>
      <h1 className="text-5xl font-bold text-zinc-100 leading-tight mb-6">Build Something Extraordinary</h1>
      <p className="text-lg text-zinc-400 mb-8">The AI studio that turns your ideas into reality.</p>
      <div className="flex gap-3">
        <button className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors">Get Started</button>
        <button className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors">Learn More</button>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'l5', name: 'Floating Cards Grid', category: 'marketing',
    description: 'Cards floating over a full-bleed gradient background — modern SaaS feature section.',
    tags: ['cards', 'features', 'saas'], trending: true,
    preview: { type: 'grid', label: 'Cards Grid' },
    code: `<section className="relative py-24 px-4 overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

  <div className="relative z-10 max-w-5xl mx-auto">
    <h2 className="text-4xl font-bold text-center text-zinc-100 mb-16">Everything You Need</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map(f => (
        <div key={f.id} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur p-6 hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-4">
            <f.icon size={18} className="text-violet-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100 mb-2">{f.title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>`,
  },
  {
    id: 'l6', name: 'Masonry Gallery', category: 'ecommerce',
    description: 'Pinterest-style masonry column layout for image-heavy content.',
    tags: ['masonry', 'gallery', 'images'],
    preview: { type: 'masonry', label: 'Masonry' },
    code: `<div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
  {items.map((item, i) => (
    <div
      key={item.id}
      className="break-inside-avoid rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 group cursor-pointer"
      style={{ height: [180, 240, 160, 280, 200][i % 5] }}
    >
      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700 group-hover:opacity-90 transition-opacity" />
    </div>
  ))}
</div>`,
  },
  {
    id: 'l7', name: 'Command Palette Layout', category: 'app',
    description: 'Full-screen command-line / terminal aesthetic for power-user interfaces.',
    tags: ['terminal', 'command', 'dark'], trending: true,
    preview: { type: 'command', label: 'Command' },
    code: `<div className="min-h-screen bg-zinc-950 font-mono text-sm">
  {/* Status bar */}
  <div className="border-b border-zinc-800 px-4 py-1.5 flex items-center justify-between">
    <div className="flex items-center gap-3 text-zinc-500 text-xs">
      <span className="text-emerald-400">● connected</span>
      <span>novum-studio v2.0</span>
    </div>
    <span className="text-zinc-600 text-xs">{new Date().toLocaleTimeString()}</span>
  </div>

  {/* Command input */}
  <div className="p-4 border-b border-zinc-800">
    <div className="flex items-center gap-2">
      <span className="text-violet-400">❯</span>
      <input
        className="flex-1 bg-transparent text-zinc-200 outline-none placeholder:text-zinc-700"
        placeholder="Enter command..."
      />
    </div>
  </div>

  {/* Output */}
  <div className="p-4 space-y-2">
    {output.map((line, i) => (
      <div key={i} className={`${
        line.type === 'success' ? 'text-emerald-400' :
        line.type === 'error' ? 'text-red-400' :
        line.type === 'info' ? 'text-cyan-400' : 'text-zinc-400'
      }`}>{line.text}</div>
    ))}
  </div>
</div>`,
  },
  {
    id: 'l8', name: 'Timeline Feed', category: 'app',
    description: 'Vertical timeline with alternating cards — for activity feeds and changelogs.',
    tags: ['timeline', 'feed', 'activity'],
    preview: { type: 'timeline', label: 'Timeline' },
    code: `<div className="max-w-2xl mx-auto py-8">
  <div className="relative">
    {/* Centre line */}
    <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-800" />

    <div className="space-y-6">
      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-5 pl-14">
          {/* Dot */}
          <div className="absolute left-[18px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-violet-500 shrink-0" />

          {/* Card */}
          <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-zinc-100">{event.title}</span>
              <span className="text-xs text-zinc-600">{event.time}</span>
            </div>
            <p className="text-sm text-zinc-500">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>`,
  },
  {
    id: 'l9', name: 'Full Bleed Hero', category: 'marketing',
    description: 'Edge-to-edge hero with video/gradient background and centered text overlay.',
    tags: ['hero', 'full-bleed', 'cinematic'],
    preview: { type: 'hero', label: 'Full Bleed' },
    code: `<section className="relative h-screen flex items-center justify-center overflow-hidden">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-violet-950 to-zinc-950" />
  {/* Noise texture */}
  <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,...')]" />
  {/* Glow orbs */}
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

  {/* Content */}
  <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-8">
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> Now in Beta
    </div>
    <h1 className="text-6xl sm:text-8xl font-bold text-zinc-100 leading-none tracking-tight mb-6">
      Create Without Limits
    </h1>
    <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">The complete AI creative studio.</p>
    <button className="px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-lg transition-all">
      Start Creating
    </button>
  </div>
</section>`,
  },
  {
    id: 'l10', name: 'Sticky Sidebar Docs', category: 'app',
    description: 'Documentation-style layout with sticky TOC sidebar and scrollable content.',
    tags: ['docs', 'sidebar', 'toc'],
    preview: { type: 'sidebar', label: 'Docs Layout' },
    code: `<div className="max-w-7xl mx-auto flex gap-8 px-4 py-8">
  {/* TOC Sidebar */}
  <aside className="hidden lg:block w-56 shrink-0">
    <div className="sticky top-20">
      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">On This Page</div>
      <nav className="space-y-1">
        {sections.map(s => (
          <a key={s.id} href={\`#\${s.id}\`}
            className="block text-sm text-zinc-500 hover:text-zinc-200 py-1 transition-colors">
            {s.title}
          </a>
        ))}
      </nav>
    </div>
  </aside>

  {/* Content */}
  <main className="flex-1 min-w-0 space-y-12">
    {sections.map(s => (
      <section key={s.id} id={s.id}>
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">{s.title}</h2>
        <div className="prose prose-invert max-w-none">{s.content}</div>
      </section>
    ))}
  </main>
</div>`,
  },
]

const CATEGORIES: { id: LayoutCategory; label: string }[] = [
  { id: 'all', label: 'All Layouts' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'blog', label: 'Blog / Editorial' },
  { id: 'app', label: 'App / Tool' },
]

const PREVIEW_ICONS: Record<LayoutItem['preview']['type'], React.ReactNode> = {
  bento: <Grid size={24} />,
  sidebar: <Columns size={24} />,
  hero: <Square size={24} />,
  grid: <Grid size={24} />,
  split: <Columns size={24} />,
  magazine: <Rows size={24} />,
  masonry: <Grid size={24} />,
  dashboard: <Layout size={24} />,
  command: <Rows size={24} />,
  timeline: <Rows size={24} />,
}

export function LayoutsGallery() {
  const [category, setCategory] = useState<LayoutCategory>('all')
  const [copied, setCopied] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = LAYOUTS.filter(l => category === 'all' || l.category === category)
  const trending = filtered.filter(l => l.trending)
  const rest = filtered.filter(l => !l.trending)

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layout size={15} className="text-violet-400" />
            <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">Layouts Gallery</span>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-100">Production-Ready Layouts</h2>
          <p className="text-sm text-zinc-500 mt-1">Copy Tailwind + React layout code. Drop into your project and customise.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === c.id
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Trending */}
        {trending.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">🔥 Trending 2026</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trending.map(l => <LayoutCard key={l.id} layout={l} copied={copied} expanded={expanded} onCopy={handleCopy} onExpand={setExpanded} />)}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div>
            {trending.length > 0 && <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">All Layouts</h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rest.map(l => <LayoutCard key={l.id} layout={l} copied={copied} expanded={expanded} onCopy={handleCopy} onExpand={setExpanded} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LayoutCard({
  layout, copied, expanded, onCopy, onExpand,
}: {
  layout: LayoutItem
  copied: string | null
  expanded: string | null
  onCopy: (id: string, code: string) => void
  onExpand: (id: string | null) => void
}) {
  const isExpanded = expanded === layout.id
  return (
    <motion.div
      layout
      className="rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all overflow-hidden"
    >
      {/* Preview */}
      <div className="h-28 bg-zinc-950 border-b border-zinc-800 flex items-center justify-center relative">
        <div className="text-zinc-700 opacity-60">{PREVIEW_ICONS[layout.preview.type]}</div>
        <div className="absolute bottom-2 left-3 text-[10px] text-zinc-600 font-mono">{layout.preview.label}</div>
        {layout.trending && (
          <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">Trending</div>
        )}
      </div>

      {/* Info */}
      <button
        onClick={() => onExpand(isExpanded ? null : layout.id)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-zinc-100 mb-0.5">{layout.name}</div>
            <p className="text-xs text-zinc-500 leading-relaxed">{layout.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {layout.tags.map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-600 border border-zinc-700">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </button>

      {/* Code Expander */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-zinc-800"
        >
          <div className="p-4 space-y-3">
            <pre className="text-[11px] text-zinc-400 bg-zinc-950 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed border border-zinc-800">
              {layout.code}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => onCopy(layout.id, layout.code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white transition-all"
              >
                {copied === layout.id ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy Code</>}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-all">
                <ExternalLink size={11} /> Use in Builder
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
