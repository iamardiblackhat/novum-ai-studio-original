'use client'

import { useState } from 'react'
import {
  Sparkles, Play, Pause, Trash2,
  Bot, Zap, Clock, CheckCircle2,
  AlertCircle, Loader2, Target, BarChart3, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TaskLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface AutonomousTask {
  id: string
  name: string
  goal: string
  status: 'running' | 'completed' | 'paused' | 'failed'
  progress: number
  steps: number
  completedSteps: number
  startedAt: string
  error?: string
  logs: TaskLog[]
}

export function AutonomousTasks() {
  const [tasks, setTasks] = useState<AutonomousTask[]>([])
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [newTaskGoal, setNewTaskGoal] = useState('')
  const [agentType, setAgentType] = useState('auto')
  const [isStarting, setIsStarting] = useState(false)

  const startTask = async () => {
    if (!newTaskGoal.trim()) return
    setIsStarting(true)
    const task: AutonomousTask = {
      id: Date.now().toString(),
      name: newTaskGoal.slice(0, 40),
      goal: newTaskGoal,
      status: 'running',
      progress: 0,
      steps: 5,
      completedSteps: 0,
      startedAt: 'just now',
      logs: [{ time: new Date().toLocaleTimeString(), message: 'Task started...', type: 'info' }],
    }
    setTasks(prev => [task, ...prev])
    setSelectedTask(task.id)
    setNewTaskGoal('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an autonomous AI agent. Break the goal into steps, execute each step, and return a detailed result. Think step by step.' },
            { role: 'user', content: task.goal },
          ],
          model: 'llama3',
        }),
      })
      const data = await res.json()
      const resultLog: TaskLog = { time: new Date().toLocaleTimeString(), message: data.content || 'Task complete', type: 'success' }
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed', progress: 100, completedSteps: t.steps, logs: [...t.logs, resultLog] } : t))
    } catch (err) {
      const errLog: TaskLog = { time: new Date().toLocaleTimeString(), message: 'Task failed', type: 'error' }
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'failed', error: 'Connection error', logs: [...t.logs, errLog] } : t))
    } finally {
      setIsStarting(false)
    }
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (selectedTask === id) setSelectedTask(null)
  }

  const selected = tasks.find(t => t.id === selectedTask)

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      <Card className="lg:w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold mb-3">Autonomous Tasks</h3>
          <div className="space-y-2">
            <Textarea
              placeholder="Describe what you want the AI to accomplish autonomously..."
              value={newTaskGoal}
              onChange={(e) => setNewTaskGoal(e.target.value)}
              className="min-h-[80px] resize-none bg-secondary"
            />
            <div className="flex gap-2">
              <Select value={agentType} onValueChange={setAgentType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-select</SelectItem>
                  <SelectItem value="research">Research Agent</SelectItem>
                  <SelectItem value="code">Code Agent</SelectItem>
                  <SelectItem value="content">Content Agent</SelectItem>
                </SelectContent>
              </Select>
              <Button className="flex-1 gap-2" onClick={startTask} disabled={isStarting || !newTaskGoal.trim()}>
                {isStarting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Start Task
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              </div>
            )}
            {tasks.map((task) => (
              <Card key={task.id} className={`p-3 cursor-pointer transition-all ${selectedTask === task.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary/50'}`} onClick={() => setSelectedTask(task.id)}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm flex-1 mr-2 truncate">{task.name}</h4>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${task.status === 'running' ? 'border-blue-500 text-blue-500' : task.status === 'completed' ? 'border-green-500 text-green-500' : task.status === 'failed' ? 'border-red-500 text-red-500' : 'border-yellow-500 text-yellow-500'}`}>
                    {task.status === 'running' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    {task.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.goal}</p>
                <Progress value={task.progress} className="h-1 mb-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{task.completedSteps}/{task.steps} steps</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); deleteTask(task.id) }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
                  <h3 className="font-semibold text-lg">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selected.goal}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1"><Target className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Progress</span></div>
                  <div className="text-xl font-bold">{selected.progress}%</div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1"><Zap className="h-4 w-4 text-yellow-500" /><span className="text-xs text-muted-foreground">Steps</span></div>
                  <div className="text-xl font-bold">{selected.completedSteps}/{selected.steps}</div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1"><Clock className="h-4 w-4 text-blue-500" /><span className="text-xs text-muted-foreground">Started</span></div>
                  <div className="text-sm font-bold">{selected.startedAt}</div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1"><BarChart3 className="h-4 w-4 text-green-500" /><span className="text-xs text-muted-foreground">Status</span></div>
                  <div className="text-sm font-bold capitalize">{selected.status}</div>
                </Card>
              </div>
            </Card>

            <Card className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border"><h4 className="font-semibold">Live Logs</h4></div>
              <ScrollArea className="flex-1">
                <div className="p-3 font-mono text-xs space-y-1">
                  {selected.logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-muted-foreground shrink-0">[{log.time}]</span>
                      <span className={log.type === 'success' ? 'text-green-500' : log.type === 'warning' ? 'text-yellow-500' : log.type === 'error' ? 'text-red-500' : 'text-foreground'}>{log.message}</span>
                    </div>
                  ))}
                  {selected.status === 'running' && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /><span>Processing...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Select a Task</h3>
              <p className="text-sm text-muted-foreground">Create or select a task to view progress</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
