'use client'

import { useState } from 'react'
import { 
  Plus, Play, Pause, Settings, Trash2, Copy, Save,
  MoreHorizontal, ArrowRight, Circle, Square, Diamond,
  Zap, Clock, CheckCircle2, AlertCircle, GitBranch,
  Bot, Globe, Mail, Database, Code2, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const workflows = [
  { 
    id: '1', 
    name: 'Content Pipeline', 
    description: 'Research → Write → Review → Publish',
    status: 'active',
    runs: 45,
    lastRun: '5m ago'
  },
  { 
    id: '2', 
    name: 'Data Processing', 
    description: 'Fetch → Clean → Analyze → Report',
    status: 'idle',
    runs: 128,
    lastRun: '1h ago'
  },
  { 
    id: '3', 
    name: 'Customer Support', 
    description: 'Receive → Classify → Respond → Log',
    status: 'active',
    runs: 892,
    lastRun: '1m ago'
  },
  { 
    id: '4', 
    name: 'Code Review', 
    description: 'PR → Analyze → Comment → Approve',
    status: 'error',
    runs: 23,
    lastRun: '30m ago'
  },
]

const nodeTypes = [
  { id: 'trigger', name: 'Trigger', icon: Zap, color: 'bg-yellow-500' },
  { id: 'agent', name: 'AI Agent', icon: Bot, color: 'bg-primary' },
  { id: 'action', name: 'Action', icon: Play, color: 'bg-blue-500' },
  { id: 'condition', name: 'Condition', icon: GitBranch, color: 'bg-purple-500' },
  { id: 'delay', name: 'Delay', icon: Clock, color: 'bg-orange-500' },
]

const sampleNodes = [
  { id: '1', type: 'trigger', name: 'On New Email', x: 50, y: 100 },
  { id: '2', type: 'agent', name: 'Classify Email', x: 250, y: 100 },
  { id: '3', type: 'condition', name: 'Is Urgent?', x: 450, y: 100 },
  { id: '4', type: 'agent', name: 'Draft Response', x: 650, y: 50 },
  { id: '5', type: 'action', name: 'Send Email', x: 850, y: 50 },
  { id: '6', type: 'delay', name: 'Wait 1 hour', x: 650, y: 150 },
]

export function WorkflowsManager() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>('1')
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      {/* Left Panel - Workflows List */}
      <Card className="lg:w-80 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Workflows</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id} 
                className={`p-3 cursor-pointer transition-all ${
                  selectedWorkflow === workflow.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-secondary/50'
                }`}
                onClick={() => setSelectedWorkflow(workflow.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{workflow.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${
                      workflow.status === 'active' ? 'border-green-500 text-green-500' :
                      workflow.status === 'error' ? 'border-red-500 text-red-500' :
                      'border-muted-foreground'
                    }`}
                  >
                    {workflow.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {workflow.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{workflow.runs} runs</span>
                  <span>•</span>
                  <span>Last: {workflow.lastRun}</span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Right Panel - Workflow Editor */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {selectedWorkflow ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Input 
                  defaultValue={workflows.find(w => w.id === selectedWorkflow)?.name}
                  className="w-48 h-8 bg-secondary"
                />
                <Badge variant="outline" className="text-xs">
                  {workflows.find(w => w.id === selectedWorkflow)?.runs} runs
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  Run
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Node Palette */}
            <div className="flex items-center gap-2 p-2 border-b border-border bg-secondary/30">
              <span className="text-xs text-muted-foreground mr-2">Add:</span>
              {nodeTypes.map((node) => (
                <Button 
                  key={node.id} 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 h-7 text-xs"
                >
                  <div className={`w-3 h-3 rounded-full ${node.color}`} />
                  {node.name}
                </Button>
              ))}
            </div>

            {/* Canvas */}
            <div className="flex-1 relative bg-[radial-gradient(circle,_var(--border)_1px,_transparent_1px)] bg-[size:20px_20px] overflow-auto">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Connections */}
                <path d="M 150 115 C 200 115, 200 115, 250 115" stroke="var(--border)" strokeWidth="2" fill="none" />
                <path d="M 350 115 C 400 115, 400 115, 450 115" stroke="var(--border)" strokeWidth="2" fill="none" />
                <path d="M 550 100 C 600 100, 600 65, 650 65" stroke="var(--border)" strokeWidth="2" fill="none" />
                <path d="M 550 130 C 600 130, 600 165, 650 165" stroke="var(--border)" strokeWidth="2" fill="none" />
                <path d="M 750 65 C 800 65, 800 65, 850 65" stroke="var(--border)" strokeWidth="2" fill="none" />
              </svg>

              {/* Nodes */}
              {sampleNodes.map((node) => {
                const nodeType = nodeTypes.find(t => t.id === node.type)
                return (
                  <div
                    key={node.id}
                    className="absolute cursor-move"
                    style={{ left: node.x, top: node.y }}
                  >
                    <Card className="w-[100px] p-2 hover:ring-2 hover:ring-primary transition-all">
                      <div className={`w-6 h-6 rounded ${nodeType?.color} flex items-center justify-center mb-1 mx-auto`}>
                        {nodeType && <nodeType.icon className="h-3 w-3 text-white" />}
                      </div>
                      <p className="text-[10px] text-center font-medium truncate">{node.name}</p>
                    </Card>
                  </div>
                )
              })}
            </div>

            {/* Run History */}
            <div className="border-t border-border p-3">
              <h4 className="text-sm font-medium mb-2">Recent Runs</h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { status: 'success', time: '5m ago' },
                  { status: 'success', time: '15m ago' },
                  { status: 'error', time: '30m ago' },
                  { status: 'success', time: '1h ago' },
                  { status: 'success', time: '2h ago' },
                ].map((run, i) => (
                  <div key={i} className="flex items-center gap-1 shrink-0">
                    {run.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-muted-foreground">{run.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Select a Workflow</h3>
              <p className="text-sm text-muted-foreground">
                Choose a workflow to view and edit
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
