'use client'

import { useState } from 'react'
import { Code2, Eye, Copy, Download, RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatInterface, Model } from './chat-interface'

const webBuilderModels: Model[] = [
  // Local / Ollama
  { id: 'ollama-codellama', name: 'CodeLlama 34B', provider: 'ollama', badge: 'Local' },
  { id: 'ollama-deepseek', name: 'DeepSeek Coder', provider: 'ollama', badge: 'Local' },
  { id: 'ollama-qwen', name: 'Qwen 2.5 Coder', provider: 'ollama', badge: 'Local' },
  // Groq
  { id: 'groq-llama', name: 'Llama 3.1 70B', provider: 'groq', badge: 'Fast', requiresKey: true },
  { id: 'groq-mixtral', name: 'Mixtral 8x7B', provider: 'groq', badge: 'Fast', requiresKey: true },
  // OpenRouter
  { id: 'openrouter-claude', name: 'Claude 3.5 Sonnet', provider: 'openrouter', badge: 'Best', requiresKey: true },
  { id: 'openrouter-gpt4', name: 'GPT-4 Turbo', provider: 'openrouter', badge: 'Premium', requiresKey: true },
  { id: 'openrouter-deepseek', name: 'DeepSeek V3', provider: 'openrouter', badge: 'Code', requiresKey: true },
  // Direct API
  { id: 'openai-gpt4', name: 'GPT-4o', provider: 'openai', badge: 'Premium', requiresKey: true },
  { id: 'anthropic-claude', name: 'Claude 3.5', provider: 'anthropic', badge: 'Best', requiresKey: true },
]

const suggestedPrompts = [
  'Build a SaaS landing page',
  'Create a dashboard with charts',
  'Design a pricing page',
  'Make a contact form',
  'Build an e-commerce product page',
  'Create a blog layout',
]

export function WebBuilder() {
  const [activeTab, setActiveTab] = useState('preview')
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [generatedCode, setGeneratedCode] = useState<string>('')

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  }

  return (
    <ChatInterface
      models={webBuilderModels}
      defaultModel="ollama-codellama"
      placeholder="Describe the website or component you want to build..."
      welcomeTitle="Web Builder"
      welcomeDescription="Describe your website, landing page, or component and I'll generate the code for you."
      suggestedPrompts={suggestedPrompts}
      showAttachments={true}
      attachmentTypes={['image', 'file']}
    >
      {/* Preview Panel */}
      <Card className="flex flex-col h-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <TabsList className="bg-transparent">
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code2 className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-1">
              {activeTab === 'preview' && (
                <>
                  <Button
                    variant={viewportSize === 'desktop' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewportSize('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewportSize === 'tablet' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewportSize('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewportSize === 'mobile' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewportSize('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-border mx-1" />
                </>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <TabsContent value="preview" className="flex-1 m-0 overflow-auto bg-secondary/30">
            <div className="h-full flex items-start justify-center p-4">
              <div className={`bg-background border rounded-lg shadow-sm ${viewportWidths[viewportSize]} min-h-[400px] transition-all duration-300`}>
                {generatedCode ? (
                  <iframe
                    srcDoc={generatedCode}
                    className="w-full h-full min-h-[400px] rounded-lg"
                    title="Preview"
                  />
                ) : (
                  <div className="h-full min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Preview will appear here</p>
                      <p className="text-xs text-muted-foreground mt-1">Describe what you want to build</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code" className="flex-1 m-0 overflow-auto">
            <pre className="h-full p-4 text-sm font-mono bg-secondary/50 overflow-auto">
              <code className="text-foreground">
                {generatedCode || '// Your generated code will appear here\n// Start a conversation to build your website'}
              </code>
            </pre>
          </TabsContent>
        </Tabs>
      </Card>
    </ChatInterface>
  )
}
