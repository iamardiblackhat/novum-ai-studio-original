'use client'

import { useState } from 'react'
import { 
  Bot, Plus, Play, Pause, Settings, Trash2, Copy, 
  MoreHorizontal, MessageSquare, Zap, Globe, Database,
  Code2, Mail, Calendar, FileText, Search, Sparkles,
  CheckCircle2, AlertCircle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const agents = [
  { 
    id: '1', 
    name: 'Research Assistant', 
    description: 'Web research & summarization',
    status: 'active',
    tasks: 12,
    tools: ['Web Search', 'Summarizer'],
    avatar: 'RA'
  },
  { 
    id: '2', 
    name: 'Code Generator', 
    description: 'Writes and reviews code',
    status: 'idle',
    tasks: 8,
    tools: ['Code Exec', 'GitHub'],
    avatar: 'CG'
  },
  { 
    id: '3', 
    name: 'Email Drafter', 
    description: 'Composes professional emails',
    status: 'active',
    tasks: 24,
    tools: ['Gmail', 'Calendar'],
    avatar: 'ED'
  },
  { 
    id: '4', 
    name: 'Data Analyst', 
    description: 'Analyzes datasets & creates reports',
    status: 'paused',
    tasks: 5,
    tools: ['Database', 'Charts'],
    avatar: 'DA'
  },
]

const availableTools = [
  { id: 'web', name: 'Web Search', icon: Globe, category: 'Research' },
  { id: 'code', name: 'Code Execution', icon: Code2, category: 'Development' },
  { id: 'email', name: 'Email', icon: Mail, category: 'Communication' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, category: 'Productivity' },
  { id: 'docs', name: 'Documents', icon: FileText, category: 'Productivity' },
  { id: 'database', name: 'Database', icon: Database, category: 'Data' },
]

const recentActivity = [
  { id: '1', agent: 'Research Assistant', action: 'Completed web search', time: '2m ago', status: 'success' },
  { id: '2', agent: 'Email Drafter', action: 'Drafted 3 emails', time: '5m ago', status: 'success' },
  { id: '3', agent: 'Code Generator', action: 'Waiting for approval', time: '10m ago', status: 'pending' },
  { id: '4', agent: 'Data Analyst', action: 'Error processing data', time: '15m ago', status: 'error' },
]

export function AgentsManager() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col lg:flex-row gap-4">
      {/* Left Panel - Agents List */}
      <Card className="lg:w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">My Agents</h3>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Agent
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search agents..." 
              className="pl-9 bg-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredAgents.map((agent) => (
              <Card 
                key={agent.id} 
                className={`p-3 cursor-pointer transition-all ${
                  selectedAgent === agent.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-secondary/50'
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {agent.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${
                          agent.status === 'active' ? 'border-green-500 text-green-500' :
                          agent.status === 'paused' ? 'border-yellow-500 text-yellow-500' :
                          'border-muted-foreground'
                        }`}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {agent.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {agent.tasks} tasks
                      </Badge>
                      {agent.tools.slice(0, 2).map((tool) => (
                        <Badge key={tool} variant="outline" className="text-[10px]">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Right Panel - Agent Details & Activity */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Agent Details */}
        <Card className="p-4">
          {selectedAgent ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {agents.find(a => a.id === selectedAgent)?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {agents.find(a => a.id === selectedAgent)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {agents.find(a => a.id === selectedAgent)?.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-3 bg-secondary/30">
                  <div className="text-2xl font-bold text-primary">
                    {agents.find(a => a.id === selectedAgent)?.tasks}
                  </div>
                  <div className="text-xs text-muted-foreground">Tasks Completed</div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="text-2xl font-bold">2.4s</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </Card>
                <Card className="p-3 bg-secondary/30">
                  <div className="text-2xl font-bold">
                    {agents.find(a => a.id === selectedAgent)?.tools.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Tools</div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Select an Agent</h3>
              <p className="text-sm text-muted-foreground">
                Choose an agent to view details and activity
              </p>
            </div>
          )}
        </Card>

        {/* Available Tools */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Available Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {availableTools.map((tool) => (
              <Card 
                key={tool.id} 
                className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors text-center"
              >
                <tool.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs font-medium">{tool.name}</p>
              </Card>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Recent Activity</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-500/20' :
                    activity.status === 'error' ? 'bg-red-500/20' :
                    'bg-yellow-500/20'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : activity.status === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.agent}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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
