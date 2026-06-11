'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check, RefreshCw, Download, Sun, Moon, Monitor } from 'lucide-react'

type ThemeMode = 'dark' | 'light' | 'system'

type Theme = {
  id: string
  name: string
  description: string
  preview: {
    bg: string
    sidebar: string
    card: string
    accent: string
    text: string
    border: string
  }
  vars: Record<string, string>
}

const THEMES: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep black with zinc grays — the default dark experience.',
    preview: { bg: '#09090b', sidebar: '#111113', card: '#18181b', accent: '#7c3aed', text: '#f4f4f5', border: '#27272a' },
    vars: {
      '--background': '240 10% 3.9%', '--foreground': '0 0% 98%',
      '--card': '240 10% 3.9%', '--card-foreground': '0 0% 98%',
      '--primary': '263 70% 58%', '--primary-foreground': '0 0% 98%',
      '--border': '240 3.7% 15.9%', '--muted': '240 3.7% 15.9%',
      '--muted-foreground': '240 5% 64.9%', '--accent': '240 3.7% 15.9%',
      '--sidebar': '240 5.9% 10%',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Depth',
    description: 'Dark teal-blue tones with cyan accents.',
    preview: { bg: '#050e18', sidebar: '#071525', card: '#0c1f33', accent: '#06b6d4', text: '#e0f2fe', border: '#0e4166' },
    vars: {
      '--background': '213 90% 7%', '--foreground': '199 90% 94%',
      '--card': '213 65% 12%', '--card-foreground': '199 90% 94%',
      '--primary': '189 94% 43%', '--primary-foreground': '0 0% 100%',
      '--border': '213 65% 22%', '--muted': '213 50% 16%',
      '--muted-foreground': '213 30% 55%', '--accent': '213 50% 16%',
      '--sidebar': '213 80% 9%',
    },
  },
  {
    id: 'forest',
    name: 'Dark Forest',
    description: 'Organic deep greens with emerald highlights.',
    preview: { bg: '#050f09', sidebar: '#081409', card: '#0d1f10', accent: '#10b981', text: '#d1fae5', border: '#14532d' },
    vars: {
      '--background': '140 85% 5%', '--foreground': '140 50% 93%',
      '--card': '140 60% 9%', '--card-foreground': '140 50% 93%',
      '--primary': '158 64% 40%', '--primary-foreground': '0 0% 100%',
      '--border': '140 50% 20%', '--muted': '140 40% 13%',
      '--muted-foreground': '140 25% 52%', '--accent': '140 40% 13%',
      '--sidebar': '140 75% 7%',
    },
  },
  {
    id: 'crimson',
    name: 'Crimson Night',
    description: 'Deep dark red with rose and ruby accents.',
    preview: { bg: '#0f050a', sidebar: '#180810', card: '#1f0d16', accent: '#e11d48', text: '#ffe4e6', border: '#4c0519' },
    vars: {
      '--background': '340 90% 5%', '--foreground': '350 80% 94%',
      '--card': '340 65% 10%', '--card-foreground': '350 80% 94%',
      '--primary': '346 87% 50%', '--primary-foreground': '0 0% 100%',
      '--border': '340 65% 22%', '--muted': '340 50% 14%',
      '--muted-foreground': '340 30% 52%', '--accent': '340 50% 14%',
      '--sidebar': '340 80% 7%',
    },
  },
  {
    id: 'amber',
    name: 'Amber Forge',
    description: 'Warm dark amber tones with golden glows.',
    preview: { bg: '#0f0a03', sidebar: '#1a1205', card: '#221808', accent: '#f59e0b', text: '#fef3c7', border: '#451a03' },
    vars: {
      '--background': '38 90% 5%', '--foreground': '48 90% 94%',
      '--card': '38 70% 8%', '--card-foreground': '48 90% 94%',
      '--primary': '43 96% 56%', '--primary-foreground': '26 83% 14%',
      '--border': '38 65% 18%', '--muted': '38 50% 12%',
      '--muted-foreground': '38 30% 50%', '--accent': '38 50% 12%',
      '--sidebar': '38 80% 6%',
    },
  },
  {
    id: 'slate',
    name: 'Slate Minimal',
    description: 'Clean cool-gray with subtle blue undertones.',
    preview: { bg: '#0a0c10', sidebar: '#0d1017', card: '#131720', accent: '#6366f1', text: '#e2e8f0', border: '#1e2332' },
    vars: {
      '--background': '222 47% 5%', '--foreground': '214 32% 91%',
      '--card': '222 35% 9%', '--card-foreground': '214 32% 91%',
      '--primary': '239 84% 67%', '--primary-foreground': '0 0% 100%',
      '--border': '222 35% 17%', '--muted': '222 30% 14%',
      '--muted-foreground': '222 20% 52%', '--accent': '222 30% 14%',
      '--sidebar': '222 45% 7%',
    },
  },
  {
    id: 'light-clean',
    name: 'Clean White',
    description: 'Bright minimal light theme with crisp contrast.',
    preview: { bg: '#ffffff', sidebar: '#f8fafc', card: '#f1f5f9', accent: '#7c3aed', text: '#0f172a', border: '#e2e8f0' },
    vars: {
      '--background': '0 0% 100%', '--foreground': '222 47% 11%',
      '--card': '0 0% 100%', '--card-foreground': '222 47% 11%',
      '--primary': '263 70% 50%', '--primary-foreground': '0 0% 100%',
      '--border': '214 32% 91%', '--muted': '210 40% 96%',
      '--muted-foreground': '215 16% 47%', '--accent': '210 40% 96%',
      '--sidebar': '210 40% 98%',
    },
  },
  {
    id: 'nord',
    name: 'Nord Aurora',
    description: 'Inspired by the Nordic aurora — soft blues and polar whites.',
    preview: { bg: '#2e3440', sidebar: '#272c36', card: '#3b4252', accent: '#88c0d0', text: '#eceff4', border: '#434c5e' },
    vars: {
      '--background': '220 17% 22%', '--foreground': '218 27% 94%',
      '--card': '220 17% 27%', '--card-foreground': '218 27% 94%',
      '--primary': '193 43% 67%', '--primary-foreground': '220 17% 22%',
      '--border': '220 17% 36%', '--muted': '220 17% 32%',
      '--muted-foreground': '220 10% 65%', '--accent': '220 17% 32%',
      '--sidebar': '220 17% 20%',
    },
  },
]

function applyTheme(theme: Theme) {
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  localStorage.setItem('novum-theme', theme.id)
}

export function ThemesManager() {
  const [active, setActive] = useState<string>('midnight')
  const [mode, setMode] = useState<ThemeMode>('dark')
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('novum-theme')
    if (stored) setActive(stored)
  }, [])

  const handleApply = (theme: Theme) => {
    setActive(theme.id)
    applyTheme(theme)
    setSaved(theme.id)
    setTimeout(() => setSaved(null), 2000)
  }

  const handleReset = () => {
    const midnight = THEMES[0]
    handleApply(midnight)
  }

  const activeTheme = THEMES.find(t => t.id === active) || THEMES[0]

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette size={15} className="text-violet-400" />
            <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">Themes Manager</span>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-100">Customise Your Studio</h2>
          <p className="text-sm text-zinc-500 mt-1">Changes apply instantly across the entire app via CSS variables.</p>
        </div>

        {/* Mode Switcher */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Appearance Mode</h3>
          <div className="flex gap-2">
            {([['dark', <Moon size={14} key="m" />, 'Dark'], ['light', <Sun size={14} key="s" />, 'Light'], ['system', <Monitor size={14} key="mo" />, 'System']] as [ThemeMode, React.ReactNode, string][]).map(([m, icon, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  mode === m
                    ? 'bg-zinc-700 border-zinc-600 text-zinc-100'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Theme Preview */}
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Active: {activeTheme.name}</h3>
              <p className="text-xs text-zinc-500">{activeTheme.description}</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <RefreshCw size={11} /> Reset
            </button>
          </div>
          <div className="flex gap-2">
            {Object.entries(activeTheme.preview).slice(0, 5).map(([key, color]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg border border-zinc-700/50" style={{ backgroundColor: color }} />
                <span className="text-[9px] text-zinc-600 capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Grid */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Available Themes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {THEMES.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={active === theme.id}
                isSaved={saved === theme.id}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-300">Export Theme</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Download your current theme as a CSS variables file.</p>
            </div>
            <button
              onClick={() => {
                const css = `:root {\n${Object.entries(activeTheme.vars).map(([k,v]) => `  ${k}: ${v};`).join('\n')}\n}`
                const blob = new Blob([css], { type: 'text/css' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `novum-theme-${activeTheme.id}.css`
                a.click()
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-all"
            >
              <Download size={12} /> Export CSS
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

function ThemeCard({ theme, isActive, isSaved, onApply }: {
  theme: Theme
  isActive: boolean
  isSaved: boolean
  onApply: (t: Theme) => void
}) {
  const p = theme.preview
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
        isActive ? 'border-violet-500/50 ring-1 ring-violet-500/20' : 'border-zinc-800 hover:border-zinc-700'
      }`}
      onClick={() => onApply(theme)}
    >
      {/* Mini preview */}
      <div className="h-20 relative flex" style={{ backgroundColor: p.bg }}>
        <div className="w-12 h-full" style={{ backgroundColor: p.sidebar }} />
        <div className="flex-1 p-2 space-y-1.5">
          <div className="h-2.5 w-3/4 rounded" style={{ backgroundColor: p.card }} />
          <div className="h-2 w-1/2 rounded" style={{ backgroundColor: p.border }} />
          <div className="h-4 w-1/3 rounded-md mt-1" style={{ backgroundColor: p.accent }} />
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
            <Check size={10} className="text-white" />
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3 border-t" style={{ borderColor: p.border, backgroundColor: p.card }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold" style={{ color: p.text }}>{theme.name}</div>
            <div className="text-[10px] mt-0.5" style={{ color: p.border === '#e2e8f0' ? '#64748b' : '#71717a' }}>{theme.description}</div>
          </div>
          {isSaved && (
            <span className="text-[10px] text-emerald-400 font-medium">Applied ✓</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
