'use client'

import { useState } from 'react'
import { Code2, Monitor, Smartphone, Tablet, RefreshCw, Download, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChatInterface, Model } from './chat-interface'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const webModels: Model[] = [
  { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'local', badge: 'Free' },
  { id: 'codellama', name: 'Code Llama', provider: 'ollama', badge: 'Free' },
  { id: 'llama3', name: 'Llama 3', provider: 'ollama', badge: 'Free' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', badge: 'Best', requiresKey: true },
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'anthropic', badge: 'Best', requiresKey: true },
]

const suggestedPrompts = [
  'Build a landing page for a SaaS product',
  'Create a portfolio website',
  'Build a dashboard with charts',
  'Create a pricing page with 3 tiers',
  'Build a contact form with validation',
  'Create a blog homepage',
]

type Viewport = 'desktop' | 'tablet' | 'mobile'

const viewportWidths: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export function WebBuilder() {
  const [generatedCode, setGeneratedCode] = useState('')
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [viewport, setViewport] = useState<Viewport>('desktop')

  return (
    <ChatInterface
      models={webModels}
      defaultModel="deepseek-coder"
      placeholder="Describe the website or component you want to build..."
      welcomeTitle="Web Builder"
      welcomeDescription="Describe any webpage and AI will generate the HTML, CSS and JavaScript for you."
      suggestedPrompts={suggestedPrompts}
      showAttachments={false}
      apiEndpoint="chat"
    >
      <Card className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'code')}>
            <TabsList className="h-8">
              <TabsTrigger value="preview" className="text-xs"><Monitor className="h-3 w-3 mr-1" />Preview</TabsTrigger>
              <TabsTrigger value="code" className="text-xs"><Code2 className="h-3 w-3 mr-1" />Code</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1">
            {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((v) => (
              <Button key={v} variant={viewport === v ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewport(v)}>
                {v === 'desktop' ? <Monitor className="h-3 w-3" /> : v === 'tablet' ? <Tablet className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
              </Button>
            ))}
            {generatedCode && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                const blob = new Blob([generatedCode], { type: 'text/html' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = 'index.html'; a.click()
              }}>
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-2">
          {activeTab === 'preview' ? (
            generatedCode ? (
              <div className="h-full flex justify-center">
                <iframe
                  srcDoc={generatedCode}
                  className="h-full border-0 rounded transition-all"
                  style={{ width: viewportWidths[viewport] }}
                  sandbox="allow-scripts"
                  title="Preview"
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <Monitor className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Preview will appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Describe a website in the chat to get started</p>
              </div>
            )
          ) : (
            generatedCode ? (
              <div className="h-full overflow-auto">
                <pre className="text-xs p-3 bg-secondary rounded-lg h-full overflow-auto">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No code generated yet</p>
              </div>
            )
          )}
        </div>
      </Card>
    </ChatInterface>
  )
}
