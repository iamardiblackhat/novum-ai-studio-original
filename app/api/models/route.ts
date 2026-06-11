export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const res = await fetch('http://localhost:11434/api/tags')
    if (!res.ok) throw new Error('Ollama not running')
    const data = await res.json()
    const models = (data.models || []).map((m: { name: string }) => ({
      id: m.name, name: m.name, provider: 'ollama', badge: 'Local'
    }))
    return Response.json({ chat: models.length ? models : [{ id: 'llama3.1', name: 'Llama 3.1', provider: 'ollama', badge: 'Local' }] })
  } catch {
    return Response.json({ chat: [
      { id: 'llama3.1', name: 'Llama 3.1', provider: 'ollama', badge: 'Local' },
      { id: 'mistral', name: 'Mistral', provider: 'ollama', badge: 'Local' },
      { id: 'gemma3', name: 'Gemma 3', provider: 'ollama', badge: 'Local' },
      { id: 'qwen2.5-coder', name: 'Qwen 2.5 Coder', provider: 'ollama', badge: 'Local' },
      { id: 'phi4', name: 'Phi-4', provider: 'ollama', badge: 'Local' },
    ]})
  }
}
