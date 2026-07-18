import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  MdSend, MdAdd, MdDelete, MdContentCopy, MdCheck,
  MdRefresh, MdAttachFile, MdMic, MdSmartToy,
  MdPerson, MdChat, MdClose, MdMenu,
} from 'react-icons/md'

// ─── constants ───────────────────────────────────────────────────────────────

const WELCOME = `Hello! I'm your **AI KPI Assistant** powered by Gemini.

I can help you with:
- 📊 Analyzing business KPIs and metrics
- 🔍 Root cause analysis of anomalies
- 💡 Strategic recommendations
- 📈 Revenue forecasting insights
- 📋 Report interpretation

Ask me anything about your business data!`

const SUGGESTIONS = [
  'What are the key KPI anomalies detected?',
  'Explain the root causes of revenue decline.',
  'What recommendations do you have for Q3?',
  'Summarize the latest forecast results.',
]

// ─── helpers ─────────────────────────────────────────────────────────────────

function uid() { return crypto.randomUUID() }
function now() { return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }

function newConversation(name = 'New Chat') {
  return {
    id: uid(),
    name,
    createdAt: new Date().toISOString(),
    messages: [{ id: uid(), role: 'assistant', content: WELCOME, time: now() }],
  }
}

function loadConvos() {
  try { return JSON.parse(localStorage.getItem('kpi_chat_convos') || 'null') } catch { return null }
}
function saveConvos(c) { localStorage.setItem('kpi_chat_convos', JSON.stringify(c)) }

// ─── Typing dots ─────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

// ─── Copy button ─────────────────────────────────────────────────────────────

function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className={`p-1.5 rounded-lg transition-colors ${copied ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/60'} ${className}`}
    >
      {copied ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
    </button>
  )
}

// ─── Markdown renderer ───────────────────────────────────────────────────────

function MarkdownContent({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const code  = String(children).replace(/\n$/, '')
          if (!inline && match) {
            return (
              <div className="relative group/code my-2 rounded-xl overflow-hidden border border-slate-700/60">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-700/40">
                  <span className="text-xs text-slate-500 font-mono">{match[1]}</span>
                  <CopyButton text={code} />
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, background: 'transparent', padding: '1rem', fontSize: '0.75rem' }}
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            )
          }
          return (
            <code className="px-1.5 py-0.5 rounded-md bg-slate-700/60 text-violet-300 text-xs font-mono" {...props}>
              {children}
            </code>
          )
        },
        p:          ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        ul:         ({ children }) => <ul className="mb-2 space-y-1 list-none pl-0">{children}</ul>,
        ol:         ({ children }) => <ol className="mb-2 space-y-1 list-decimal pl-4">{children}</ol>,
        li:         ({ children }) => (
          <li className="flex gap-2 items-start text-sm">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            <span>{children}</span>
          </li>
        ),
        strong:     ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em:         ({ children }) => <em className="italic text-slate-300">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-blue-500 pl-3 my-2 text-slate-400 italic">{children}</blockquote>
        ),
        h1: ({ children }) => <h1 className="text-base font-bold text-white mb-2 mt-3">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold text-white mb-1.5 mt-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-200 mb-1 mt-2">{children}</h3>,
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="w-full text-xs border-collapse">{children}</table>
          </div>
        ),
        th: ({ children }) => <th className="border border-slate-700 px-3 py-1.5 bg-slate-800 text-slate-300 font-semibold text-left">{children}</th>,
        td: ({ children }) => <td className="border border-slate-700 px-3 py-1.5 text-slate-400">{children}</td>,
        hr: () => <hr className="border-slate-700 my-3" />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// ─── Message bubble ──────────────────────────────────────────────────────────

function MessageBubble({ msg, onRegenerate, isLast }) {
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5
        ${isUser ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-gradient-to-br from-violet-600 to-violet-800 text-white'}`}
      >
        {isUser ? <MdPerson size={15} /> : <MdSmartToy size={15} />}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[75%] min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'border border-slate-700/60 text-slate-300 rounded-tl-sm'
          }`}
          style={isUser ? {} : { background: 'var(--bg-card)' }}
        >
          {isUser
            ? <p className="whitespace-pre-wrap">{msg.content}</p>
            : <MarkdownContent content={msg.content} />
          }
        </div>

        {/* Actions row */}
        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-slate-600 px-1">{msg.time}</span>
          <CopyButton text={msg.content} />
          {!isUser && isLast && onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/60 transition-colors"
              title="Regenerate"
            >
              <MdRefresh size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Conversation item ───────────────────────────────────────────────────────

function ConvoItem({ convo, active, onSelect, onDelete }) {
  const preview = convo.messages.at(-1)?.content?.slice(0, 48) ?? ''
  return (
    <div
      onClick={() => onSelect(convo.id)}
      className={`group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors
        ${active ? 'bg-blue-600/20 border border-blue-600/30' : 'hover:bg-slate-700/40 border border-transparent'}`}
    >
      <MdChat size={14} className={`mt-0.5 shrink-0 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${active ? 'text-white' : 'text-slate-300'}`}>{convo.name}</p>
        <p className="text-xs text-slate-600 truncate mt-0.5">{preview}</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete(convo.id) }}
        className="shrink-0 p-1 rounded-md text-slate-600 hover:text-rose-400 hover:bg-rose-600/10 opacity-0 group-hover:opacity-100 transition-all"
      >
        <MdDelete size={12} />
      </button>
    </div>
  )
}

// ─── Simulated AI response ───────────────────────────────────────────────────

const AI_RESPONSES = [
  `Based on the KPI data analysis, here are the key findings:

**Revenue Performance**
- Total revenue shows a **14.2% increase** quarter-over-quarter
- Electronics category leads with 38% contribution

**Anomalies Detected**
1. Discount rate spike from 14.1% → 18.6%
2. AOV decline of 2.3% correlated with over-discounting
3. LTV:CAC ratio deteriorating (3.1x → 2.8x)

**Recommended Actions**
\`\`\`
Priority 1: Cap blanket discounts at 12%
Priority 2: Launch retention cohort campaign
Priority 3: Diversify category revenue mix
\`\`\`

Would you like me to dive deeper into any of these areas?`,

  `Here's a root cause analysis of the revenue anomaly:

## Root Cause Chain

The primary driver is **excessive discounting** without revenue-threshold guardrails.

| Factor | Impact |
|--------|--------|
| Discount Rate | +4.5pp increase |
| AOV | -2.3% decline |
| Gross Margin | -1.8pp compression |

> The discount rate increase is the **leading indicator** — it precedes the AOV decline by approximately 2 weeks in the data.

**Causal Chain:**
Blanket promotions → Higher discount rate → Lower AOV → Margin compression → LTV deterioration`,

  `The 7-day revenue forecast using the **Moving Average method** shows:

\`\`\`python
# Forecast methodology
method = "7-Day Moving Average"
window = 7
predicted_daily_revenue = rolling_mean(last_7_days)
\`\`\`

The forecast indicates **stable revenue** in the near term, with predicted daily revenue around the recent average. To improve accuracy, consider:

1. Incorporating **seasonality factors**
2. Adding **promotional calendar** as a feature
3. Using **Prophet** for longer-horizon forecasts`,
]

let aiIdx = 0
function getAIResponse() {
  const r = AI_RESPONSES[aiIdx % AI_RESPONSES.length]
  aiIdx++
  return r
}

// ─── Chat Page ───────────────────────────────────────────────────────────────

export default function Chat() {
  const initConvos = () => loadConvos() ?? [newConversation('KPI Analysis Chat')]

  const [convos,    setConvos]    = useState(initConvos)
  const [activeId,  setActiveId]  = useState(() => initConvos()[0]?.id)
  const [input,     setInput]     = useState('')
  const [typing,    setTyping]    = useState(false)
  const [sideOpen,  setSideOpen]  = useState(true)

  const messagesEndRef = useRef(null)
  const textareaRef    = useRef(null)

  const active = convos.find(c => c.id === activeId)

  // persist
  useEffect(() => { saveConvos(convos) }, [convos])

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages, typing])

  // auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [input])

  const updateActive = useCallback((fn) => {
    setConvos(prev => prev.map(c => c.id === activeId ? fn(c) : c))
  }, [activeId])

  const addMessage = useCallback((role, content) => {
    const msg = { id: uid(), role, content, time: now() }
    updateActive(c => ({ ...c, messages: [...c.messages, msg] }))
    return msg
  }, [updateActive])

  const sendMessage = useCallback(async (text = input.trim()) => {
    if (!text || typing) return
    setInput('')
    addMessage('user', text)

    // auto-name conversation from first user message
    setConvos(prev => prev.map(c => {
      if (c.id !== activeId) return c
      const isDefault = c.name === 'New Chat' || c.name === 'KPI Analysis Chat'
      return isDefault ? { ...c, name: text.slice(0, 32) + (text.length > 32 ? '…' : '') } : c
    }))

    setTyping(true)
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
    setTyping(false)
    addMessage('assistant', getAIResponse())
  }, [input, typing, addMessage, activeId])

  const regenerate = useCallback(async () => {
    if (typing) return
    setTyping(true)
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 600))
    setTyping(false)
    // replace last assistant message
    updateActive(c => {
      const msgs = [...c.messages]
      const lastAI = [...msgs].reverse().findIndex(m => m.role === 'assistant')
      if (lastAI === -1) return c
      const idx = msgs.length - 1 - lastAI
      msgs[idx] = { ...msgs[idx], content: getAIResponse(), time: now() }
      return { ...c, messages: msgs }
    })
  }, [typing, updateActive])

  const newChat = () => {
    const c = newConversation('New Chat')
    setConvos(prev => [c, ...prev])
    setActiveId(c.id)
  }

  const deleteConvo = (id) => {
    setConvos(prev => {
      const next = prev.filter(c => c.id !== id)
      if (next.length === 0) {
        const fresh = newConversation('New Chat')
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  const clearChat = () => {
    updateActive(c => ({ ...c, messages: [{ id: uid(), role: 'assistant', content: WELCOME, time: now() }] }))
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const messages = active?.messages ?? []
  const lastAIIdx = [...messages].map((m, i) => m.role === 'assistant' ? i : -1).filter(i => i !== -1).at(-1)

  return (
    <div className="flex h-full overflow-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* ── Sidebar ── */}
      <AnimatePresence initial={false}>
        {sideOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="flex flex-col shrink-0 overflow-hidden border-r border-slate-700/50 h-full"
            style={{ background: 'var(--bg-card)' }}
          >
            <div className="p-3 border-b border-slate-700/50 shrink-0">
              <button
                onClick={newChat}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                <MdAdd size={16} /> New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {convos.map(c => (
                <ConvoItem
                  key={c.id}
                  convo={c}
                  active={c.id === activeId}
                  onSelect={setActiveId}
                  onDelete={deleteConvo}
                />
              ))}
            </div>

            <div className="p-3 border-t border-slate-700/50 shrink-0">
              <button
                onClick={clearChat}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-medium hover:bg-slate-700/40 hover:text-white transition-colors"
              >
                <MdDelete size={13} /> Clear Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main chat area ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 shrink-0"
          style={{ background: 'var(--bg-card)' }}
        >
          <button
            onClick={() => setSideOpen(o => !o)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {sideOpen ? <MdClose size={18} /> : <MdMenu size={18} />}
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shrink-0">
              <MdSmartToy size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{active?.name ?? 'AI Chat'}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-500">Gemini · KPI Assistant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {/* Suggestion chips — show only on fresh chat */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center pt-2"
            >
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-full border border-slate-700 text-xs text-slate-400 hover:border-blue-500/50 hover:text-blue-300 hover:bg-blue-600/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isLast={i === lastAIIdx}
              onRegenerate={i === lastAIIdx ? regenerate : null}
            />
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shrink-0">
                  <MdSmartToy size={15} className="text-white" />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-700/60"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div
            className="flex items-end gap-2 rounded-2xl border border-slate-700 px-3 py-2.5 focus-within:border-blue-500/60 transition-colors"
            style={{ background: 'var(--bg-card)' }}
          >
            {/* Attach */}
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/60 transition-colors shrink-0 mb-0.5">
              <MdAttachFile size={18} />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your KPIs, anomalies, or recommendations…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none leading-relaxed py-0.5 max-h-40"
            />

            {/* Mic */}
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/60 transition-colors shrink-0 mb-0.5">
              <MdMic size={18} />
            </button>

            {/* Send */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shrink-0"
            >
              <MdSend size={16} />
            </button>
          </div>
          <p className="text-center text-xs text-slate-700 mt-2">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-500 font-mono text-xs">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-500 font-mono text-xs">Shift+Enter</kbd> for new line
          </p>
        </div>

      </div>
    </div>
  )
}
