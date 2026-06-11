'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Play, Plus, Search, ChevronRight, Zap, Brain, GitBranch, Clock, Filter } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type StepType = 'trigger' | 'ai' | 'action' | 'condition'

type WorkflowStep = {
  id: string
  type: StepType
  label: string
  description: string
  icon: string
  status: 'idle' | 'running' | 'done'
}

type AutomationTemplate = {
  id: string
  title: string
  description: string
  category: 'support' | 'dev' | 'sales' | 'custom'
  steps: WorkflowStep[]
}

type Project = {
  id: string
  title: string
  category: string
  lastRun: string
  status: 'active' | 'paused' | 'draft'
  runs: number
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TEMPLATES: AutomationTemplate[] = [
  {
    id: 'summarize-support',
    title: 'Summarize customer support tickets',
    description: 'Auto-classify, summarize, and route inbound support tickets.',
    category: 'support',
    steps: [
      { id: 's1', type: 'trigger', label: 'New Ticket', description: 'Webhook from Zendesk / Intercom', icon: '📨', status: 'idle' },
      { id: 's2', type: 'ai', label: 'LLM Classify', description: 'Categorise: Bug / Billing / Feature', icon: '🧠', status: 'idle' },
      { id: 's3', type: 'ai', label: 'Summarise', description: 'Generate 2-sentence summary', icon: '✍️', status: 'idle' },
      { id: 's4', type: 'condition', label: 'Priority Check', description: 'If priority = HIGH → escalate', icon: '⚡', status: 'idle' },
      { id: 's5', type: 'action', label: 'Route & Notify', description: 'Assign agent + Slack alert', icon: '📤', status: 'idle' },
    ],
  },
  {
    id: 'triage-github',
    title: 'Triage GitHub issues',
    description: 'Label, prioritise, and assign new GitHub issues automatically.',
    category: 'dev',
    steps: [
      { id: 'g1', type: 'trigger', label: 'Issue Opened', description: 'GitHub webhook on issues.opened', icon: '🐛', status: 'idle' },
      { id: 'g2', type: 'ai', label: 'Analyse Context', description: 'Read repo README + issue body', icon: '🧠', status: 'idle' },
      { id: 'g3', type: 'ai', label: 'Label & Score', description: 'bug / enhancement / critical', icon: '🏷️', status: 'idle' },
      { id: 'g4', type: 'condition', label: 'Duplicate Check', description: 'Semantic similarity vs open issues', icon: '🔍', status: 'idle' },
      { id: 'g5', type: 'action', label: 'Apply & Assign', description: 'GitHub API: set labels + assignee', icon: '✅', status: 'idle' },
    ],
  },
  {
    id: 'score-leads',
    title: 'Score inbound leads',
    description: 'Enrich, score, and qualify new leads from any form or CRM trigger.',
    category: 'sales',
    steps: [
      { id: 'l1', type: 'trigger', label: 'Form Submission', description: 'Typeform / HubSpot / webhook', icon: '📋', status: 'idle' },
      { id: 'l2', type: 'action', label: 'Enrich Lead', description: 'Apollo / Clearbit company data', icon: '🔎', status: 'idle' },
      { id: 'l3', type: 'ai', label: 'Score (0–100)', description: 'ICP match + intent signals', icon: '🧠', status: 'idle' },
      { id: 'l4', type: 'condition', label: 'Score Gate', description: 'Score ≥ 70 → hot lead path', icon: '🎯', status: 'idle' },
      { id: 'l5', type: 'action', label: 'CRM + Notify', description: 'Push to pipeline + Slack DM', icon: '💼', status: 'idle' },
    ],
  },
]

const RECENT_PROJECTS: Project[] = [
  { id: 'p1', title: 'Novum Syndicate Lead Scorer', category: 'sales', lastRun: '2 hours ago', status: 'active', runs: 247 },
  { id: 'p2', title: 'GitHub Issue Triage — novumaistudiomain', category: 'dev', lastRun: '1 day ago', status: 'active', runs: 89 },
  { id: 'p3', title: 'Support Ticket Router', category: 'support', lastRun: '3 days ago', status: 'paused', runs: 512 },
]

const SUGGESTED_PROMPTS = [
  'Summarize customer support tickets',
  'Triage GitHub issues',
  'Score inbound leads',
  'Send weekly digest to Slack',
  'Auto-reply to cold emails',
  'Monitor competitor pricing',
]

const TYPE_COLORS: Record<StepType, { border: string; bg: string; text: string; dot: string }> = {
  trigger:   { border: 'border-violet-500/40', bg: 'bg-violet-500/10', text: 'text-violet-300', dot: 'bg-violet-400' },
  ai:        { border: 'border-cyan-500/40',   bg: 'bg-cyan-500/10',   text: 'text-cyan-300',   dot: 'bg-cyan-400' },
  action:    { border: 'border-emerald-500/40',bg: 'bg-emerald-500/10',text: 'text-emerald-300',dot: 'bg-emerald-400' },
  condition: { border: 'border-amber-500/40',  bg: 'bg-amber-500/10',  text: 'text-amber-300',  dot: 'bg-amber-400' },
}

const STATUS_COLORS: Record<Project['status'], string> = {
  active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  paused: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  draft:  'text-zinc-400 bg-zinc-400/10 border-zinc-400/30',
}

const CATEGORY_ICONS: Record<string, string> = {
  support: '🎧',
  dev: '⚙️',
  sales: '💰',
  custom: '✨',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkflowNode({
  step, index, isLast, isAnimating,
}: {
  step: WorkflowStep
  index: number
  isLast: boolean
  isAnimating: boolean
}) {
  const c = TYPE_COLORS[step.type]
  const delay = index * 0.12
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.35, ease: 'easeOut' }}
        className={`relative w-full rounded-xl border ${c.border} ${c.bg} px-4 py-3 flex items-center gap-3`}
      >
        {isAnimating && (
          <motion.div
            className={`absolute inset-0 rounded-xl ${c.bg} opacity-0`}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.2, delay: index * 0.3, repeat: Infinity }}
          />
        )}
        <span className="text-xl shrink-0">{step.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${c.text}`}>{step.label}</div>
          <div className="text-xs text-zinc-500 truncate">{step.description}</div>
        </div>
        <div className={`shrink-0 w-2 h-2 rounded-full ${c.dot} ${isAnimating ? 'animate-pulse' : ''}`} />
      </motion.div>
      {!isLast && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="w-px h-5 bg-gradient-to-b from-zinc-600/60 to-zinc-700/20 origin-top"
        />
      )}
    </div>
  )
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full text-left rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all p-4"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{CATEGORY_ICONS[project.category]}</span>
          <span className="text-sm font-medium text-zinc-100 leading-tight">{project.title}</span>
        </div>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[project.status]}`}>
          {project.status}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><Clock size={10} /> {project.lastRun}</span>
        <span className="flex items-center gap-1"><Play size={10} /> {project.runs} runs</span>
      </div>
    </motion.button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AutomationsBuilder() {
  const [prompt, setPrompt] = useState('')
  const [activeTemplate, setActiveTemplate] = useState<AutomationTemplate | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'mine' | 'shared'>('all')
  const [generatedSteps, setGeneratedSteps] = useState<WorkflowStep[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setActiveTemplate(null)
    setGeneratedSteps([])

    // Match prompt to a template, or use a generic fallback
    const matched = TEMPLATES.find(t =>
      prompt.toLowerCase().includes(t.title.split(' ').slice(0, 3).join(' ').toLowerCase())
    )

    await new Promise(r => setTimeout(r, 900))

    if (matched) {
      setActiveTemplate(matched)
      setGeneratedSteps(matched.steps)
    } else {
      // Generic AI-generated workflow
      const fallback: WorkflowStep[] = [
        { id: 'f1', type: 'trigger', label: 'Trigger', description: prompt.slice(0, 40), icon: '⚡', status: 'idle' },
        { id: 'f2', type: 'ai', label: 'AI Process', description: 'Analyse and transform input', icon: '🧠', status: 'idle' },
        { id: 'f3', type: 'condition', label: 'Check Result', description: 'Validate AI output', icon: '🔍', status: 'idle' },
        { id: 'f4', type: 'action', label: 'Execute', description: 'Send output to destination', icon: '📤', status: 'idle' },
      ]
      setGeneratedSteps(fallback)
    }

    setIsGenerating(false)
  }

  const handleRun = async () => {
    if (!generatedSteps.length) return
    setIsRunning(true)
    await new Promise(r => setTimeout(r, generatedSteps.length * 400))
    setIsRunning(false)
  }

  const handleTemplateClick = (t: AutomationTemplate) => {
    setActiveTemplate(t)
    setGeneratedSteps(t.steps)
    setPrompt(t.title)
  }

  return (
    <div className="flex h-full gap-6 flex-col lg:flex-row">

      {/* ── Left Panel ────────────────────────────────── */}
      <div className="lg:w-[340px] shrink-0 flex flex-col gap-4">

        {/* Prompt Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            Build AI Powered Automations
          </h2>
          <textarea
            rows={3}
            className="w-full resize-none rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-sm text-zinc-100 placeholder:text-zinc-600 px-3 py-2 focus:outline-none focus:border-cyan-500/50 transition-colors"
            placeholder="Describe the automation you want to build..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate() }}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 font-semibold text-sm py-2.5 transition-colors"
          >
            {isGenerating ? (
              <><span className="animate-spin">◌</span> Generating...</>
            ) : (
              <><Sparkles size={14} /> Generate Workflow</>
            )}
          </button>
          {/* Suggested prompts */}
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => { setPrompt(p); }}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100">Recent Projects</h3>
            <button className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              <Filter size={10} /> Filter
            </button>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1">
            {(['all', 'mine', 'shared'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-[11px] px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  activeFilter === f
                    ? 'bg-zinc-700 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Project list */}
          <div className="flex flex-col gap-2">
            {RECENT_PROJECTS
              .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => {}} />
              ))
            }
          </div>
          <button className="mt-auto flex items-center gap-2 w-full rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 text-xs py-2.5 justify-center transition-colors">
            <Plus size={12} /> Create New
          </button>
        </div>
      </div>

      {/* ── Right Panel: Canvas ────────────────────────── */}
      <div className="flex-1 flex flex-col gap-4">
        {generatedSteps.length === 0 ? (
          /* Empty state — template picker */
          <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-center justify-center gap-6 p-8">
            <div className="text-center">
              <Zap size={32} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">Describe an automation above, or pick a template</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateClick(t)}
                  className="text-left rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-cyan-500/40 hover:bg-zinc-800/80 p-4 transition-all group"
                >
                  <span className="text-2xl mb-2 block">{CATEGORY_ICONS[t.category]}</span>
                  <p className="text-xs font-semibold text-zinc-200 mb-1 leading-tight">{t.title}</p>
                  <p className="text-[11px] text-zinc-500 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Use template <ChevronRight size={10} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Workflow header */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  {activeTemplate?.title || prompt.slice(0, 60)}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {generatedSteps.length} steps · {activeTemplate?.category || 'custom'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setGeneratedSteps([]); setActiveTemplate(null); setPrompt('') }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-900 font-semibold text-xs px-4 py-2 transition-colors"
                >
                  {isRunning ? (
                    <><span className="animate-spin">◌</span> Running...</>
                  ) : (
                    <><Play size={12} /> Run Workflow</>
                  )}
                </button>
              </div>
            </div>

            {/* Workflow canvas */}
            <AnimatePresence mode="wait">
              <motion.div
                key={generatedSteps.map(s => s.id).join('-')}
                className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 overflow-y-auto"
              >
                <div className="max-w-sm mx-auto flex flex-col gap-0">
                  {generatedSteps.map((step, i) => (
                    <WorkflowNode
                      key={step.id}
                      step={step}
                      index={i}
                      isLast={i === generatedSteps.length - 1}
                      isAnimating={isRunning}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 px-1">
              {(Object.entries(TYPE_COLORS) as [StepType, typeof TYPE_COLORS[StepType]][]).map(([type, c]) => (
                <div key={type} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
