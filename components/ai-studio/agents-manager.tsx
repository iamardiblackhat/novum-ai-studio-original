'use client'

import { useState } from 'react'
import {
  Bot, Plus, Play, Settings, Trash2, Copy,
  MoreHorizontal, Globe, Code2, Mail, Calendar, FileText, Database, Search,
  CheckCircle2, AlertCircle, Clock, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Agent {
  id: string
  name: string
  description: string
  systemPrompt: string
  status: 'active' | 'idle' | 'paused'
  tasks: number
  tools: string[]
  avatar: string
}

interface Activity {
  id: string
  agent: string
  action: string
  time: string
  status: 'success' | 'error' | 'pending'
}

const availableTools = [
  { id: 'web', name: 'Web Search', icon: Globe, category: 'Research' },
  { id: 'code', name: 'Code Execution', icon: Code2, category: 'Development' },
  { id: 'email', name: 'Email', icon: Mail, category: 'Communication' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, category: 'Productivity' },
  { id: 'docs', name: 'Documents', icon: FileText, category: 'Productivity' },
  { id: 'database', name: 'Database', icon: Database, category: 'Data' },
]

export function AgentsManager() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPrompt, setNewPrompt] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [taskInput, setTaskInput] = useState('')

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const createAgent = () => {
    if (!newName.trim()) return
    const agent: Agent = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc,
      systemPrompt: newPrompt,
      status: 'idle',
      tasks: 0,
      tools: [],
      avatar: newName.slice(0, 2).toUpperCase(),
    }
    setAgents(prev => [...prev, agent])
    setNewName(''); setNewDesc(''); setNewPrompt('')
    setShowCreate(false)
  }

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id))
    if (selectedAgent === id) setSelectedAgent(null)
  }

  const runTask = async () => {
    if (!taskInput.trim() || !selectedAgent) return
    const agent = agents.find(a => a.id === selectedAgent)
    if (!agent) return
    setIsRunning(true)
    const newActivity: Activity = {
      id: Date.now().toString(),
      agent: agent.name,
      action: `Running: ${taskInput}`,
      time: 'just now',
      status: 'pending',
    }
    setActivity(prev => [newActivity, ...prev])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: agent.systemPrompt || `You are ${agent.name}. ${agent.description}` },
            { role: 'user', content: taskInput },
          ],
          model: 'llama3',
        }),
      })
      const data = await res.json()
      setAgents(prev => prev.map(a => a.id === selectedAgent ? { ...a, tasks: a.tasks + 1, status: 'active' } : a))
      setActivity(prev => prev.map(a => a.id === newActivity.id ? { ...a, action: data.content?.slice(0, 80) || a.action, status: 'success', time: 'just now' } : a))
    } catch {
      setActivity(prev => prev.map(a => a.id === newActivity.id ? { ...a, status: 'error' } : a))
    } finally {
      setIsRunning(false)
      setTaskInput('')
    }
  }

  const selected = agents.find(a => a.id === selectedAgent)

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      <Card className="lg:w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">My Agents</h3>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />New Agent</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Agent</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="e.g., Research Assistant" value={newName} onChange={e => setNewName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="What does this agent do?" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>System Prompt</Label>
                    <Textarea placeholder="You are a helpful assistant that..." value={newPrompt} onChange={e => setNewPrompt(e.target.value)} className="min-h-[100px]" />
                  </div>
                  <Button className="w-full" onClick={createAgent}>Create Agent</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search agents..." className="pl-9 bg-secondary" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredAgents.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No agents yet. Create one to get started.</p>
              </div>
            )}
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className={`p-3 cursor-pointer transition-all ${selectedAgent === agent.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary/50'}`} onClick={() => setSelectedAgent(agent.id)}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">{agent.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                      <Badge variant="outline" className={`text-[10px] ${agent.status === 'active' ? 'border-green-500 text-green-500' : agent.status === 'paused' ? 'border-yellow-500 text-yellow-500' : 'border-muted-foreground'}`}>{agent.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{agent.description}</p>
                    <Badge variant="secondary" className="text-[10px] mt-2">{agent.tasks} tasks</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <div className="flex-1 flex flex-col gap-4">
        <Card className="p-4">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary">{selected.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground">{selected.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteAgent(selected.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Give this agent a task..." value={taskInput} onChange={e => setTaskInput(e.target.value)} className="min-h-[80px] resize-none" />
                <Button className="w-full gap-2" onClick={runTask} disabled={isRunning}>
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {isRunning ? 'Running...' : 'Run Task'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Select an Agent</h3>
              <p className="text-sm text-muted-foreground">Choose an agent to run tasks</p>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Available Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {availableTools.map((tool) => (
              <Card key={tool.id} className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors text-center">
                <tool.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">{tool.name}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Activity Log</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {activity.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>}
              {activity.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${a.status === 'success' ? 'bg-green-500/20' : a.status === 'error' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                    {a.status === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : a.status === 'error' ? <AlertCircle className="h-4 w-4 text-red-500" /> : <Clock className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-medium">{a.agent}</span> — {a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
