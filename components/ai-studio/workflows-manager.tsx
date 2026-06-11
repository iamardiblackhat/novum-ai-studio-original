'use client'

import { useState } from 'react'
import {
  Plus, Play, Trash2, GitBranch, Zap,
  Bot, Globe, Mail, FileText, Database,
  CheckCircle2, Clock, Loader2, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface WorkflowStep {
  id: string
  type: 'trigger' | 'ai' | 'action'
  name: string
  description: string
  icon: string
}

interface WorkflowRun {
  id: string
  startedAt: string
  status: 'running' | 'completed' | 'failed'
  output?: string
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  runs: WorkflowRun[]
  isRunning: boolean
}

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  trigger: Zap,
  ai: Bot,
  web: Globe,
  email: Mail,
  docs: FileText,
  database: Database,
}

export function WorkflowsManager() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const createWorkflow = () => {
    if (!newName.trim()) return
    const wf: Workflow = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc,
      steps: [
        { id: '1', type: 'trigger', name: 'Manual Trigger', description: 'Start workflow manually', icon: 'trigger' },
        { id: '2', type: 'ai', name: 'AI Processing', description: 'Process with AI model', icon: 'ai' },
      ],
      runs: [],
      isRunning: false,
    }
    setWorkflows(prev => [...prev, wf])
    setSelectedId(wf.id)
    setNewName(''); setNewDesc('')
    setShowCreate(false)
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const runWorkflow = async (id: string) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, isRunning: true } : w))
    const run: WorkflowRun = { id: Date.now().toString(), startedAt: new Date().toLocaleTimeString(), status: 'running' }
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, runs: [run, ...w.runs] } : w))

    try {
      const wf = workflows.find(w => w.id === id)!
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a workflow automation engine. Execute the workflow and return results.' },
            { role: 'user', content: `Execute workflow: ${wf.name}. Steps: ${wf.steps.map(s => s.name).join(' → ')}` },
          ],
          model: 'llama3',
        }),
      })
      const data = await res.json()
      setWorkflows(prev => prev.map(w => w.id === id ? {
        ...w,
        isRunning: false,
        runs: w.runs.map(r => r.id === run.id ? { ...r, status: 'completed', output: data.content } : r),
      } : w))
    } catch {
      setWorkflows(prev => prev.map(w => w.id === id ? {
        ...w,
        isRunning: false,
        runs: w.runs.map(r => r.id === run.id ? { ...r, status: 'failed' } : r),
      } : w))
    }
  }

  const selected = workflows.find(w => w.id === selectedId)

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      <Card className="lg:w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Workflows</h3>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="h-4 w-4" />New</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Workflow</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label>Name</Label><Input placeholder="e.g., Email Responder" value={newName} onChange={e => setNewName(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What does this workflow do?" value={newDesc} onChange={e => setNewDesc(e.target.value)} /></div>
                  <Button className="w-full" onClick={createWorkflow}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {workflows.length === 0 && (
              <div className="text-center py-8">
                <GitBranch className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No workflows yet</p>
              </div>
            )}
            {workflows.map((wf) => (
              <Card key={wf.id} className={`p-3 cursor-pointer transition-all ${selectedId === wf.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary/50'}`} onClick={() => setSelectedId(wf.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{wf.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{wf.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Badge variant="secondary" className="text-[10px]">{wf.steps.length} steps</Badge>
                      <Badge variant="outline" className="text-[10px]">{wf.runs.length} runs</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); runWorkflow(wf.id) }} disabled={wf.isRunning}>
                      {wf.isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); deleteWorkflow(wf.id) }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <div className="flex-1 flex flex-col gap-4">
        {selected ? (
          <>
            <Card className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <Button className="gap-2" onClick={() => runWorkflow(selected.id)} disabled={selected.isRunning}>
                  {selected.isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {selected.isRunning ? 'Running...' : 'Run Now'}
                </Button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {selected.steps.map((step, i) => {
                  const Icon = stepIcons[step.icon] || Zap
                  return (
                    <div key={step.id} className="flex items-center gap-2 shrink-0">
                      <Card className="p-3 min-w-[120px] bg-secondary/30">
                        <Icon className="h-5 w-5 text-primary mb-2" />
                        <p className="text-xs font-medium">{step.name}</p>
                        <p className="text-[10px] text-muted-foreground">{step.description}</p>
                      </Card>
                      {i < selected.steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border"><h4 className="font-semibold">Run History</h4></div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-3">
                  {selected.runs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No runs yet. Click Run Now to start.</p>}
                  {selected.runs.map((run) => (
                    <div key={run.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${run.status === 'completed' ? 'bg-green-500/20' : run.status === 'failed' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                        {run.status === 'completed' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : run.status === 'failed' ? <Zap className="h-4 w-4 text-red-500" /> : <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">{run.status}</span>
                          <span className="text-xs text-muted-foreground">{run.startedAt}</span>
                        </div>
                        {run.output && <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{run.output}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Select a Workflow</h3>
              <p className="text-sm text-muted-foreground">Create or select a workflow to view details</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
