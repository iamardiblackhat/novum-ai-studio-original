'use client'

import { useState, useEffect } from 'react'
import { Check, Sparkles, Eye, RotateCcw, Copy, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Theme {
  id: string
  name: string
  style: string
  description: string
  badge?: string
  badgeColor?: string
  bg: string
  vars: {
    '--background': string
    '--foreground': string
    '--primary': string
    '--primary-foreground': string
    '--secondary': string
    '--secondary-foreground': string
    '--muted': string
    '--muted-foreground': string
    '--accent': string
    '--accent-foreground': string
    '--border': string
    '--card': string
    '--card-foreground': string
    '--radius': string
  }
  preview: {
    bg: string
    surface: string
    primary: string
    text: string
    muted: string
    border: string
  }
}

const themes: Theme[] = [
  {
    id: 'midnight-ai',
    name: 'Midnight AI',
    style: 'Dark',
    description: 'Deep indigo-black base with violet primary. The go-to for AI tools and developer products in 2026.',
    badge: 'Default',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    bg: 'from-[#0d0d1a] to-[#1a1030]',
    vars: {
      '--background': '240 15% 7%',
      '--foreground': '240 10% 96%',
      '--primary': '263 70% 58%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '240 10% 14%',
      '--secondary-foreground': '240 10% 80%',
      '--muted': '240 10% 16%',
      '--muted-foreground': '240 8% 55%',
      '--accent': '188 78% 52%',
      '--accent-foreground': '0 0% 100%',
      '--border': '240 10% 20%',
      '--card': '240 12% 10%',
      '--card-foreground': '240 10% 96%',
      '--radius': '0.625rem',
    },
    preview: { bg: '#0d0d1a', surface: '#1a1030', primary: '#7c3aed', text: '#e2e2f4', muted: '#555570', border: '#2a2545' },
  },
  {
    id: 'neobrutalism',
    name: 'Neobrutalism',
    style: 'Light',
    description: 'Thick black borders, primary colour blocks, raw unpolished feel. Dominant UI trend in 2026 indie and startup spaces.',
    badge: 'Trending',
    badgeColor: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    bg: 'from-yellow-50 to-orange-50',
    vars: {
      '--background': '45 100% 96%',
      '--foreground': '0 0% 5%',
      '--primary': '24 100% 50%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '45 80% 88%',
      '--secondary-foreground': '0 0% 5%',
      '--muted': '45 50% 90%',
      '--muted-foreground': '0 0% 35%',
      '--accent': '330 100% 50%',
      '--accent-foreground': '0 0% 100%',
      '--border': '0 0% 5%',
      '--card': '45 100% 98%',
      '--card-foreground': '0 0% 5%',
      '--radius': '0px',
    },
    preview: { bg: '#fefce8', surface: '#fff7d6', primary: '#f97316', text: '#0d0d0d', muted: '#7a7a7a', border: '#0d0d0d' },
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    style: 'Dark',
    description: 'Frosted glass surfaces over vivid gradient mesh backgrounds. Translucent cards, blur effects, vivid highlights.',
    badge: 'Hot',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    bg: 'from-[#0a0a2e] via-[#1a0a3e] to-[#0a1a2e]',
    vars: {
      '--background': '235 50% 8%',
      '--foreground': '210 40% 95%',
      '--primary': '199 89% 60%',
      '--primary-foreground': '0 0% 5%',
      '--secondary': '235 30% 16%',
      '--secondary-foreground': '210 40% 85%',
      '--muted': '235 25% 18%',
      '--muted-foreground': '215 20% 55%',
      '--accent': '270 70% 65%',
      '--accent-foreground': '0 0% 100%',
      '--border': '235 40% 22%',
      '--card': '235 40% 11%',
      '--card-foreground': '210 40% 95%',
      '--radius': '1rem',
    },
    preview: { bg: '#070720', surface: '#0f0f35', primary: '#38bdf8', text: '#e8f0fe', muted: '#4a5a7a', border: '#1e2050' },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    style: 'Dark',
    description: 'Classic green-on-black hacker aesthetic. Monospace everywhere, scanline feel, CRT glow on highlights.',
    badge: null,
    bg: 'from-[#000a00] to-[#001200]',
    vars: {
      '--background': '120 100% 2%',
      '--foreground': '120 60% 75%',
      '--primary': '120 70% 45%',
      '--primary-foreground': '120 100% 3%',
      '--secondary': '120 40% 8%',
      '--secondary-foreground': '120 50% 65%',
      '--muted': '120 30% 10%',
      '--muted-foreground': '120 30% 40%',
      '--accent': '120 80% 55%',
      '--accent-foreground': '120 100% 3%',
      '--border': '120 40% 16%',
      '--card': '120 60% 4%',
      '--card-foreground': '120 60% 75%',
      '--radius': '0.25rem',
    },
    preview: { bg: '#000a00', surface: '#001500', primary: '#22c55e', text: '#86efac', muted: '#2d5a2d', border: '#1a4020' },
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth',
    style: 'Light',
    description: 'Terracotta, sand, and sage. Warm organic palette popular in wellness, sustainability, and lifestyle brands.',
    badge: null,
    bg: 'from-[#fdf4e7] to-[#f5e6d0]',
    vars: {
      '--background': '36 60% 95%',
      '--foreground': '25 30% 18%',
      '--primary': '20 65% 45%',
      '--primary-foreground': '36 60% 97%',
      '--secondary': '36 35% 88%',
      '--secondary-foreground': '25 30% 25%',
      '--muted': '36 25% 90%',
      '--muted-foreground': '25 20% 50%',
      '--accent': '80 35% 45%',
      '--accent-foreground': '0 0% 100%',
      '--border': '30 20% 80%',
      '--card': '36 55% 97%',
      '--card-foreground': '25 30% 18%',
      '--radius': '0.75rem',
    },
    preview: { bg: '#fdf4e7', surface: '#f5e6d0', primary: '#b45309', text: '#3d2712', muted: '#9e8070', border: '#d4b896' },
  },
  {
    id: 'candy-pop',
    name: 'Candy Pop',
    style: 'Light',
    description: 'Pastel base with neon accents. Playful, bold, maximalist. Works for consumer apps, entertainment, and Gen-Z products.',
    badge: null,
    bg: 'from-pink-50 via-purple-50 to-cyan-50',
    vars: {
      '--background': '300 30% 97%',
      '--foreground': '270 40% 20%',
      '--primary': '320 90% 60%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '280 40% 92%',
      '--secondary-foreground': '270 40% 25%',
      '--muted': '290 20% 92%',
      '--muted-foreground': '270 20% 50%',
      '--accent': '180 80% 45%',
      '--accent-foreground': '0 0% 100%',
      '--border': '290 25% 84%',
      '--card': '300 25% 99%',
      '--card-foreground': '270 40% 20%',
      '--radius': '1.5rem',
    },
    preview: { bg: '#fdf0fa', surface: '#f5e6f8', primary: '#ec4899', text: '#3b1a5e', muted: '#a07890', border: '#e8c8e8' },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    style: 'Dark',
    description: 'Neon yellow and magenta on near-black. Glitch-ready aesthetic for gaming, tech, and high-energy brands.',
    badge: null,
    bg: 'from-[#0a0014] to-[#140020]',
    vars: {
      '--background': '280 100% 4%',
      '--foreground': '60 100% 85%',
      '--primary': '60 100% 55%',
      '--primary-foreground': '280 100% 5%',
      '--secondary': '280 60% 12%',
      '--secondary-foreground': '60 80% 75%',
      '--muted': '280 40% 14%',
      '--muted-foreground': '280 20% 50%',
      '--accent': '300 100% 60%',
      '--accent-foreground': '0 0% 100%',
      '--border': '280 50% 20%',
      '--card': '280 70% 7%',
      '--card-foreground': '60 100% 85%',
      '--radius': '0.125rem',
    },
    preview: { bg: '#0a0014', surface: '#140020', primary: '#facc15', text: '#fef9c3', muted: '#6b4e8a', border: '#2d1050' },
  },
  {
    id: 'minimal-ink',
    name: 'Minimal Ink',
    style: 'Light',
    description: 'Near-black on white, zero decoration. Pure typography hierarchy. Influenced by Linear, Vercel, and Apple design systems.',
    badge: null,
    bg: 'from-white to-zinc-50',
    vars: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 7%',
      '--primary': '0 0% 9%',
      '--primary-foreground': '0 0% 98%',
      '--secondary': '0 0% 96%',
      '--secondary-foreground': '0 0% 12%',
      '--muted': '0 0% 96%',
      '--muted-foreground': '0 0% 45%',
      '--accent': '0 0% 96%',
      '--accent-foreground': '0 0% 9%',
      '--border': '0 0% 90%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 7%',
      '--radius': '0.375rem',
    },
    preview: { bg: '#ffffff', surface: '#f9f9f9', primary: '#171717', text: '#111111', muted: '#737373', border: '#e5e5e5' },
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    style: 'Dark',
    description: 'Deep navy to teal gradient system. Cool, trustworthy, modern. Popular in fintech, productivity, and SaaS.',
    badge: null,
    bg: 'from-[#020c1b] to-[#0a192f]',
    vars: {
      '--background': '212 50% 6%',
      '--foreground': '210 30% 90%',
      '--primary': '187 80% 50%',
      '--primary-foreground': '212 50% 5%',
      '--secondary': '212 35% 13%',
      '--secondary-foreground': '210 25% 80%',
      '--muted': '212 28% 15%',
      '--muted-foreground': '210 18% 48%',
      '--accent': '215 70% 58%',
      '--accent-foreground': '0 0% 100%',
      '--border': '212 30% 20%',
      '--card': '212 45% 9%',
      '--card-foreground': '210 30% 90%',
      '--radius': '0.5rem',
    },
    preview: { bg: '#020c1b', surface: '#0a192f', primary: '#0dd3d3', text: '#ccd6f6', muted: '#3d5a80', border: '#1d3557' },
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    style: 'Light',
    description: 'Primary colour geometry. Bold red, blue, and yellow on white. Inspired by Bauhaus and Swiss International design systems.',
    badge: null,
    bg: 'from-white to-red-50',
    vars: {
      '--background': '0 0% 99%',
      '--foreground': '0 0% 6%',
      '--primary': '4 90% 52%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '210 90% 92%',
      '--secondary-foreground': '210 50% 20%',
      '--muted': '0 0% 94%',
      '--muted-foreground': '0 0% 40%',
      '--accent': '45 100% 50%',
      '--accent-foreground': '0 0% 5%',
      '--border': '0 0% 86%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 6%',
      '--radius': '0rem',
    },
    preview: { bg: '#fefefe', surface: '#f8f0f0', primary: '#e63227', text: '#0f0f0f', muted: '#666666', border: '#cccccc' },
  },
]

export function ThemesManager() {
  const [activeTheme, setActiveTheme] = useState('midnight-ai')
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [styleFilter, setStyleFilter] = useState<'All' | 'Dark' | 'Light'>('All')

  const displayTheme = previewTheme || activeTheme
  const currentTheme = themes.find(t => t.id === displayTheme) || themes[0]

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    setActiveTheme(theme.id)
    setPreviewTheme(null)
  }

  const copyCSS = (theme: Theme) => {
    const css = Object.entries(theme.vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
    navigator.clipboard.writeText(`:root {\n${css}\n}`)
    setCopied(theme.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const resetToDefault = () => {
    applyTheme(themes[0])
  }

  const filtered = themes.filter(t => styleFilter === 'All' || t.style === styleFilter)

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Themes</h2>
          <p className="text-sm text-muted-foreground">{themes.length} design systems — click to apply live</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {(['All', 'Dark', 'Light'] as const).map(s => (
              <Button
                key={s}
                variant={styleFilter === s ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setStyleFilter(s)}
              >{s}</Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={resetToDefault}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Live Preview Banner */}
      <Card className="p-4 border-primary/30 bg-primary/5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border-2 flex-shrink-0"
              style={{
                backgroundColor: currentTheme.preview.primary,
                borderColor: currentTheme.preview.border,
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{currentTheme.name}</p>
                {previewTheme && (
                  <Badge variant="outline" className="text-[10px] text-yellow-500 border-yellow-500/40">Previewing</Badge>
                )}
                {!previewTheme && (
                  <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/40">Active</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{currentTheme.description}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => copyCSS(currentTheme)}
            >
              {copied === currentTheme.id ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              Copy CSS
            </Button>
            {previewTheme && (
              <Button size="sm" className="gap-1.5" onClick={() => applyTheme(currentTheme)}>
                <Check className="h-3.5 w-3.5" />
                Apply
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Theme Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pr-2">
          {filtered.map(theme => (
            <Card
              key={theme.id}
              className={`overflow-hidden cursor-pointer transition-all duration-200 group ${
                activeTheme === theme.id
                  ? 'ring-2 ring-primary'
                  : 'hover:ring-1 hover:ring-primary/40'
              }`}
              onMouseEnter={() => setPreviewTheme(theme.id)}
              onMouseLeave={() => setPreviewTheme(null)}
              onClick={() => applyTheme(theme)}
            >
              {/* Visual mockup */}
              <div className={`h-40 bg-gradient-to-br ${theme.bg} p-3 relative overflow-hidden`}>
                {/* Mini UI mockup */}
                <div
                  className="absolute inset-2 rounded-lg overflow-hidden"
                  style={{ backgroundColor: theme.preview.bg, border: `1px solid ${theme.preview.border}` }}
                >
                  {/* Top bar */}
                  <div
                    className="h-7 flex items-center gap-2 px-3 border-b"
                    style={{ backgroundColor: theme.preview.surface, borderColor: theme.preview.border }}
                  >
                    <div className="w-10 h-2 rounded-full" style={{ backgroundColor: theme.preview.primary }} />
                    <div className="flex-1" />
                    <div className="w-4 h-2 rounded" style={{ backgroundColor: theme.preview.muted }} />
                    <div className="w-4 h-2 rounded" style={{ backgroundColor: theme.preview.muted }} />
                  </div>
                  <div className="flex gap-2 p-2">
                    {/* Sidebar */}
                    <div
                      className="w-12 rounded"
                      style={{ backgroundColor: theme.preview.surface, border: `1px solid ${theme.preview.border}` }}
                    >
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="mx-1 my-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: i === 0 ? theme.preview.primary : theme.preview.muted, width: i === 0 ? '80%' : '60%' }}
                        />
                      ))}
                    </div>
                    {/* Main */}
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2 rounded" style={{ backgroundColor: theme.preview.text, width: '60%', opacity: 0.8 }} />
                      <div className="h-1.5 rounded" style={{ backgroundColor: theme.preview.muted, width: '90%' }} />
                      <div className="h-1.5 rounded" style={{ backgroundColor: theme.preview.muted, width: '75%' }} />
                      <div className="mt-2 h-5 rounded flex items-center justify-center" style={{ backgroundColor: theme.preview.primary, width: '40%' }}>
                        <div className="h-1.5 w-6 rounded" style={{ backgroundColor: theme.preview.bg, opacity: 0.8 }} />
                      </div>
                    </div>
                  </div>
                </div>
                {activeTheme === theme.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{theme.name}</span>
                    {theme.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${theme.badgeColor}`}>
                        {theme.badge}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px]">{theme.style}</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{theme.description}</p>
                {/* Colour swatches */}
                <div className="flex gap-1.5 mt-3">
                  {Object.entries(theme.preview).slice(0, 5).map(([key, colour]) => (
                    <div
                      key={key}
                      className="w-5 h-5 rounded-full border border-white/10 flex-shrink-0"
                      style={{ backgroundColor: colour }}
                      title={key}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
