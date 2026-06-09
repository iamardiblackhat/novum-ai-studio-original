'use client'

import { useState } from 'react'
import { 
  Sparkles, Play, Pause, Settings, Trash2, Plus,
  MoreHorizontal, Bot, Zap, Clock, CheckCircle2, 
  AlertCircle, Loader2, Target, BarChart3, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const autonomousTasks = [
  { 
    id: '1', 
    name: 'Market Research Report', 
    goal: 'Research competitors and create comprehensive market analysis',
    status: 'running',
    progress: 65,
    steps: 8,
    completedSteps: 5,
    startedAt: '10 minutes ago'
  },
  { 
    id: '2', 
    name: 'Content Calendar', 
    goal: 'Plan and schedule 30 days of social media content',
    status: 'completed',
    progress: 100,
    steps: 12,
    completedSteps: 12,
    startedAt: '2 hours ago'
  },
  { 
    id: '3', 
    name: 'Bug Triage', 
    goal: 'Review and categorize all open GitHub issues',
    status: 'paused',
    progress: 40,
    steps: 20,
    completedSteps: 8,
    startedAt: '1 hour ago'
  },
  { 
    id: '4', 
    name: 'SEO Optimization', 
    goal: 'Analyze website and suggest SEO improvements',
    status: 'failed',
    progress: 30,
    steps: 6,
    completedSteps: 2,
    startedAt: '30 minutes ago',
    error: 'Unable to access website'
  },
]

const taskLogs = [
  { time: '10:42:15', message: 'Starting market research task...', type: 'info' },
  { time: '10:42:18', message: 'Identified 15 competitors', type: 'success' },
  { time: '10:43:02', message: 'Analyzing competitor pricing strategies', type: 'info' },
  { time: '10:44:30', message: 'Fetched 250 data points from public sources', type: 'success' },
  { time: '10:45:12', message: 'Generating market size estimates', type: 'info' },
  { time: '10:46:00', message: 'Warning: Limited data for Q4 projections', type: 'warning' },
  { time: '10:47:15', message: 'Creating visualization charts...', type: 'info' },
]

export function AutonomousTasks() {
  const [selectedTask, setSelectedTask] = useState<string | null>('1')
  const [newTaskGoal, setNewTaskGoal] = useState('')

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      {/* Left Panel - Task List */}
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
              <Select defaultValue="auto">
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
              <Button className="flex-1 gap-2">
                <Sparkles className="h-4 w-4" />
                Start Task
              </Button>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {autonomousTasks.map((task) => (
              <Card 
                key={task.id} 
                className={`p-3 cursor-pointer transition-all ${
                  selectedTask === task.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-secondary/50'
                }`}
                onClick={() => setSelectedTask(task.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{task.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${
                      task.status === 'running' ? 'border-blue-500 text-blue-500' :
                      task.status === 'completed' ? 'border-green-500 text-green-500' :
                      task.status === 'failed' ? 'border-red-500 text-red-500' :
                      'border-yellow-500 text-yellow-500'
                    }`}
                  >
                    {task.status === 'running' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    {task.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {task.goal}
                </p>
                <Progress value={task.progress} className="h-1 mb-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{task.completedSteps}/{task.steps} steps</span>
                  <span>{task.startedAt}</span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Right Panel - Task Details */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedTask ? (
          <>
            {/* Task Overview */}
            <Card className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {autonomousTasks.find(t => t.id === selectedTask)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {autonomousTasks.find(t => t.id === selectedTask)?.goal}
                  </p>
                </div>
                <div className="flex gap-2">
                  {autonomousTasks.find(t => t.id === selectedTask)?.status === 'running' ? (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Restart
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Progress</span>
                  </div>
                  <div className="text-xl font-bold">
                    {autonomousTasks.find(t => t.id === selectedTask)?.progress}%
                  </div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">Steps</span>
                  </div>
                  <div className="text-xl font-bold">
                    {autonomousTasks.find(t => t.id === selectedTask)?.completedSteps}/
                    {autonomousTasks.find(t => t.id === selectedTask)?.steps}
                  </div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-muted-foreground">Duration</span>
                  </div>
                  <div className="text-xl font-bold">10m</div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Tokens</span>
                  </div>
                  <div className="text-xl font-bold">12.4k</div>
                </Card>
              </div>
            </Card>

            {/* Task Steps */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Execution Steps</h4>
              <div className="space-y-3">
                {['Gather initial data', 'Analyze competitors', 'Identify trends', 'Generate insights', 'Create report', 'Review & refine'].map((step, i) => {
                  const task = autonomousTasks.find(t => t.id === selectedTask)
                  const isCompleted = task && i < task.completedSteps
                  const isCurrent = task && i === task.completedSteps
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-green-500' :
                        isCurrent ? 'bg-primary' :
                        'bg-secondary'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : isCurrent ? (
                          <Loader2 className="h-4 w-4 text-white animate-spin" />
                        ) : (
                          <span className="text-xs text-muted-foreground">{i + 1}</span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        isCompleted ? 'text-muted-foreground line-through' :
                        isCurrent ? 'font-medium' :
                        'text-muted-foreground'
                      }`}>
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Logs */}
            <Card className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border">
                <h4 className="font-semibold">Live Logs</h4>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 font-mono text-xs space-y-1">
                  {taskLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-muted-foreground shrink-0">[{log.time}]</span>
                      <span className={
                        log.type === 'success' ? 'text-green-500' :
                        log.type === 'warning' ? 'text-yellow-500' :
                        log.type === 'error' ? 'text-red-500' :
                        'text-foreground'
                      }>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Processing...</span>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Select a Task</h3>
              <p className="text-sm text-muted-foreground">
                Choose a task to view progress and logs
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
