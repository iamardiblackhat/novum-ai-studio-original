'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Copy, ExternalLink, Zap, Globe, MessageSquare, Image, Music, Video, Mic, Code, BarChart, Mail, ShoppingCart, BookOpen, Cpu, Filter } from 'lucide-react'

type Category = 'all' | 'chat' | 'image' | 'video' | 'audio' | 'web' | 'code' | 'business'

type Template = {
  id: string
  title: string
  description: string
  category: Exclude<Category, 'all'>
  icon: React.ReactNode
  tags: string[]
  prompt: string
  uses: number
  featured?: boolean
}

const TEMPLATES: Template[] = [
  // Chat
  {
    id: 'c1', title: 'Business Strategy Advisor', category: 'chat',
    description: 'Get expert-level business strategy advice, market analysis, and growth planning.',
    icon: <BarChart size={18} />, tags: ['strategy', 'business', 'planning'],
    prompt: 'You are an elite business strategy consultant with 20 years of experience advising Fortune 500 companies. Provide detailed, actionable strategic advice. Always consider market dynamics, competitive landscape, and execution feasibility.',
    uses: 4821, featured: true,
  },
  {
    id: 'c2', title: 'Code Review Assistant', category: 'chat',
    description: 'Review code for bugs, security issues, performance, and best practices.',
    icon: <Code size={18} />, tags: ['code', 'review', 'debugging'],
    prompt: 'You are a senior software engineer specializing in code review. Analyze code for: 1) Bugs and logic errors, 2) Security vulnerabilities, 3) Performance bottlenecks, 4) Code style and best practices. Provide specific line-by-line feedback with suggestions.',
    uses: 3620,
  },
  {
    id: 'c3', title: 'Email Copywriter', category: 'chat',
    description: 'Write high-converting email campaigns, cold outreach, and newsletters.',
    icon: <Mail size={18} />, tags: ['email', 'copywriting', 'marketing'],
    prompt: 'You are a world-class email copywriter with a track record of 40%+ open rates. Write compelling, personalized emails that drive action. Focus on subject lines, hooks, value propositions, and clear CTAs. Match the tone to the audience.',
    uses: 2940,
  },
  {
    id: 'c4', title: 'AI Tutor', category: 'chat',
    description: 'Learn any subject with a patient, adaptive tutor that meets you at your level.',
    icon: <BookOpen size={18} />, tags: ['education', 'learning', 'tutoring'],
    prompt: 'You are a brilliant, patient tutor who can explain any subject from beginner to expert level. Use the Socratic method, real-world examples, and analogies. Always check for understanding before moving on. Adapt your explanation style to the learner.',
    uses: 5103, featured: true,
  },
  // Image
  {
    id: 'i1', title: 'Product Photography', category: 'image',
    description: 'Generate studio-quality product photos on clean, professional backgrounds.',
    icon: <Image size={18} />, tags: ['product', 'photography', 'commercial'],
    prompt: 'Professional product photography, studio lighting, white seamless background, high detail, sharp focus, 8K resolution, commercial quality, shot on Hasselblad H6D, soft box lighting, no shadows, product centered, brand identity',
    uses: 7230, featured: true,
  },
  {
    id: 'i2', title: 'Cyberpunk Cityscape', category: 'image',
    description: 'Neon-drenched futuristic cityscapes with rain, fog, and urban atmosphere.',
    icon: <Image size={18} />, tags: ['cyberpunk', 'cityscape', 'sci-fi'],
    prompt: 'Cyberpunk cityscape at night, neon signs reflecting in wet streets, towering skyscrapers, fog and rain, holographic advertisements, flying vehicles, dark moody atmosphere, blade runner aesthetic, ultra detailed, cinematic lighting, 8K',
    uses: 6112,
  },
  {
    id: 'i3', title: 'Portrait Artist', category: 'image',
    description: 'Stunning portrait photography with professional lighting and composition.',
    icon: <Image size={18} />, tags: ['portrait', 'photography', 'artistic'],
    prompt: 'Professional portrait photography, golden hour lighting, bokeh background, sharp eyes in focus, cinematic color grading, editorial quality, shot on Sony A7IV with 85mm f/1.4 lens, natural expression, high fashion aesthetic',
    uses: 4890,
  },
  {
    id: 'i4', title: 'Logo Designer', category: 'image',
    description: 'Clean, minimal, memorable logo concepts for modern brands.',
    icon: <Image size={18} />, tags: ['logo', 'branding', 'design'],
    prompt: 'Minimal modern logo design, clean vector style, white background, bold geometric shapes, professional branding, scalable design, no text, striking icon mark, award-winning logo design, flat design, strong visual identity',
    uses: 3780,
  },
  // Video
  {
    id: 'v1', title: 'Cinematic Landscape', category: 'video',
    description: 'Epic cinematic flyover shots of breathtaking natural landscapes.',
    icon: <Video size={18} />, tags: ['landscape', 'cinematic', 'nature'],
    prompt: 'Aerial cinematic shot over dramatic mountain landscape at golden hour, sweeping camera movement, volumetric clouds, epic scale, film grain, anamorphic lens flare, National Geographic quality, slow motion',
    uses: 3201, featured: true,
  },
  {
    id: 'v2', title: 'Product Showcase', category: 'video',
    description: 'Sleek product reveal animations with premium feel.',
    icon: <Video size={18} />, tags: ['product', 'commercial', 'animation'],
    prompt: 'Luxury product reveal video, dark studio environment, dramatic spotlight, product rotating slowly, light trails and particles, premium feel, Apple-style commercial aesthetic, smooth camera orbit, 4K quality',
    uses: 2840,
  },
  // Audio
  {
    id: 'a1', title: 'Podcast Intro Jingle', category: 'audio',
    description: 'Catchy, professional podcast intro music in any genre.',
    icon: <Mic size={18} />, tags: ['podcast', 'jingle', 'music'],
    prompt: 'Upbeat, professional podcast intro music, modern electronic with subtle orchestral elements, builds energy in 15 seconds, clean mix, professional mastering, memorable hook, suitable for tech and business podcast',
    uses: 4100, featured: true,
  },
  {
    id: 'a2', title: 'Lo-fi Study Beats', category: 'audio',
    description: 'Relaxing lo-fi hip hop beats perfect for focus and study sessions.',
    icon: <Music size={18} />, tags: ['lofi', 'study', 'ambient'],
    prompt: 'Lo-fi hip hop music, chill relaxing beats, vinyl crackle, soft piano melodies, gentle drums at 85 BPM, warm nostalgic atmosphere, rainy day vibe, perfect for studying and focus, mellow bass, 3 minutes',
    uses: 6580,
  },
  // Web
  {
    id: 'w1', title: 'SaaS Landing Page', category: 'web',
    description: 'High-converting SaaS product landing page with modern design.',
    icon: <Globe size={18} />, tags: ['saas', 'landing', 'conversion'],
    prompt: 'Build a modern SaaS landing page with: hero section with headline + CTA, feature grid with icons, social proof section, pricing table with 3 tiers, FAQ accordion, footer. Dark theme, gradient accents, Tailwind CSS, responsive, Next.js.',
    uses: 5920, featured: true,
  },
  {
    id: 'w2', title: 'E-commerce Product Page', category: 'web',
    description: 'Beautiful e-commerce product detail page with cart functionality.',
    icon: <ShoppingCart size={18} />, tags: ['ecommerce', 'product', 'shop'],
    prompt: 'Build a premium e-commerce product page: image gallery with zoom, product details, variant selector (size/color), add to cart with animation, reviews section, related products carousel. Clean minimal design, Tailwind, React hooks.',
    uses: 3450,
  },
  // Code
  {
    id: 'code1', title: 'REST API Builder', category: 'code',
    description: 'Generate complete REST API routes with validation and error handling.',
    icon: <Cpu size={18} />, tags: ['api', 'backend', 'nodejs'],
    prompt: 'Generate a complete REST API endpoint with: input validation using Zod, proper error handling with typed error responses, authentication middleware check, database query with Prisma, rate limiting, and JSDoc documentation. TypeScript, Express or Next.js API route.',
    uses: 4200, featured: true,
  },
  {
    id: 'code2', title: 'React Component Generator', category: 'code',
    description: 'Generate reusable, typed React components with props and tests.',
    icon: <Code size={18} />, tags: ['react', 'component', 'typescript'],
    prompt: 'Generate a reusable React component with: full TypeScript props interface, forwardRef support, className merging with cn(), compound component variants, accessibility attributes (aria-*), and a Jest unit test. Follow shadcn/ui patterns.',
    uses: 5310,
  },
  // Business
  {
    id: 'b1', title: 'Investor Pitch Deck', category: 'business',
    description: 'Structure a compelling investor pitch with all key slides.',
    icon: <BarChart size={18} />, tags: ['pitch', 'investor', 'startup'],
    prompt: 'Create a compelling investor pitch deck outline: 1) Problem (pain point with data), 2) Solution (product overview), 3) Market size (TAM/SAM/SOM), 4) Business model (revenue streams), 5) Traction (key metrics), 6) Team, 7) Ask (funding amount + use of funds). Make it persuasive and data-driven.',
    uses: 3890, featured: true,
  },
  {
    id: 'b2', title: 'Social Media Content Calendar', category: 'business',
    description: 'Plan a month of engaging social media content across platforms.',
    icon: <MessageSquare size={18} />, tags: ['social', 'content', 'marketing'],
    prompt: 'Create a 30-day social media content calendar for [brand]. Include: post type (image/video/carousel/story), platform (LinkedIn/Instagram/Twitter/TikTok), topic, hook line, call to action, and best posting time. Mix educational, entertaining, and promotional content at an 80/20 ratio.',
    uses: 4670,
  },
]

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Zap size={13} /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare size={13} /> },
  { id: 'image', label: 'Image', icon: <Image size={13} /> },
  { id: 'video', label: 'Video', icon: <Video size={13} /> },
  { id: 'audio', label: 'Audio', icon: <Mic size={13} /> },
  { id: 'web', label: 'Web', icon: <Globe size={13} /> },
  { id: 'code', label: 'Code', icon: <Code size={13} /> },
  { id: 'business', label: 'Business', icon: <BarChart size={13} /> },
]

export function TemplatesLibrary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [copied, setCopied] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = TEMPLATES.filter(t => {
    const matchCat = category === 'all' || t.category === category
    const q = query.toLowerCase()
    const matchQ = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q))
    return matchCat && matchQ
  })

  const featured = filtered.filter(t => t.featured)
  const rest = filtered.filter(t => !t.featured)

  const handleCopy = (t: Template) => {
    navigator.clipboard.writeText(t.prompt)
    setCopied(t.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={15} className="text-violet-400" />
            <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">Templates Library</span>
          </div>
          <h2 className="text-2xl font-semibold text-zinc-100">Ready-made AI Prompts</h2>
          <p className="text-sm text-zinc-500 mt-1">Click any template to expand it, then copy the prompt straight into any AI tool.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-9 pr-4 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === c.id
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Star size={12} className="text-amber-400" /> Featured
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featured.map(t => <TemplateCard key={t.id} t={t} copied={copied} expanded={expanded} onCopy={handleCopy} onExpand={setExpanded} />)}
            </div>
          </div>
        )}

        {/* All Templates */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Filter size={12} /> All ({rest.length})
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rest.map(t => <TemplateCard key={t.id} t={t} copied={copied} expanded={expanded} onCopy={handleCopy} onExpand={setExpanded} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-600">
            <Search size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No templates match &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TemplateCard({
  t, copied, expanded, onCopy, onExpand,
}: {
  t: Template
  copied: string | null
  expanded: string | null
  onCopy: (t: Template) => void
  onExpand: (id: string | null) => void
}) {
  const isExpanded = expanded === t.id
  return (
    <motion.div
      layout
      className="rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all overflow-hidden"
    >
      <button
        onClick={() => onExpand(isExpanded ? null : t.id)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-violet-400 shrink-0">
              {t.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-100">{t.title}</span>
                {t.featured && <Star size={10} className="text-amber-400 fill-amber-400" />}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{t.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {t.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-xs text-zinc-600 shrink-0">{(t.uses / 1000).toFixed(1)}k</div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="border-t border-zinc-800 p-4 space-y-3">
              <pre className="text-xs text-zinc-400 bg-zinc-950 rounded-lg p-3 whitespace-pre-wrap leading-relaxed font-mono border border-zinc-800">
                {t.prompt}
              </pre>
              <div className="flex gap-2">
                <button
                  onClick={() => onCopy(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white transition-all"
                >
                  <Copy size={11} />
                  {copied === t.id ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-all">
                  <ExternalLink size={11} /> Use in Chat
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
