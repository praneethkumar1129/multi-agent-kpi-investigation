import { useState, useCallback, useId } from 'react'
import { motion } from 'framer-motion'
import {
  MdSend, MdSave, MdPreview, MdAutoAwesome, MdCancel,
  MdAttachFile, MdEmojiEmotions, MdFormatBold, MdFormatItalic,
  MdFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered,
  MdEmail, MdPerson, MdSubject, MdHistory,
} from 'react-icons/md'
import Toast from '../components/Toast'

// ─── Mock history data ────────────────────────────────────────────────────────

const MOCK_HISTORY = [
  { id: 1, recipient: 'ceo@acme.com',        subject: 'Weekly KPI Report – W28',       date: '2025-07-14', status: 'Sent'    },
  { id: 2, recipient: 'board@acme.com',       subject: 'Monthly Report – June 2025',    date: '2025-07-01', status: 'Sent'    },
  { id: 3, recipient: 'ops@acme.com',         subject: 'Incident Report – Outage #42',  date: '2025-06-28', status: 'Failed'  },
  { id: 4, recipient: 'finance@acme.com',     subject: 'Executive Summary Q2',          date: '2025-06-25', status: 'Sent'    },
  { id: 5, recipient: 'marketing@acme.com',   subject: 'Weekly KPI Report – W26',       date: '2025-06-23', status: 'Draft'   },
  { id: 6, recipient: 'vp-sales@acme.com',    subject: 'Monthly Report – May 2025',     date: '2025-06-01', status: 'Sent'    },
  { id: 7, recipient: 'analytics@acme.com',   subject: 'Custom Analysis – Churn Deep Dive', date: '2025-05-30', status: 'Pending' },
  { id: 8, recipient: 'cto@acme.com',         subject: 'Executive Summary Q1',          date: '2025-04-02', status: 'Sent'    },
]

const TEMPLATES = [
  { value: 'weekly',    label: 'Weekly KPI Report',  body: 'Dear Team,\n\nPlease find attached the Weekly KPI Report for the current period.\n\nKey highlights:\n• Revenue performance vs target\n• Order volume trends\n• Customer acquisition metrics\n\nBest regards,\nKPI System' },
  { value: 'monthly',   label: 'Monthly Report',     body: 'Dear Stakeholders,\n\nThis is the Monthly Business Report summarising performance across all key metrics for the past month.\n\nPlease review the attached data and reach out with any questions.\n\nBest regards,\nKPI System' },
  { value: 'executive', label: 'Executive Summary',  body: 'Dear Executive Team,\n\nBelow is the AI-generated Executive Summary for the current reporting period.\n\nOverall business health is strong with notable improvements in revenue and customer retention.\n\nRegards,\nKPI System' },
  { value: 'incident',  label: 'Incident Report',    body: 'Dear Team,\n\nThis email documents the incident that occurred and the steps taken to resolve it.\n\nIncident ID: #\nSeverity: High\nStatus: Resolved\n\nPlease review and acknowledge.\n\nRegards,\nKPI System' },
  { value: 'custom',    label: 'Custom',             body: '' },
]

const STATUS_STYLES = {
  Sent:    'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
  Draft:   'bg-slate-400/10  text-slate-400  border border-slate-400/20',
  Failed:  'bg-red-400/10    text-red-400    border border-red-400/20',
  Pending: 'bg-amber-400/10  text-amber-400  border border-amber-400/20',
}

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputField({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
        <Icon size={13} className="text-slate-500" /> {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  )
}

function ToolbarBtn({ icon: Icon, title }) {
  return (
    <button
      title={title}
      type="button"
      className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
    >
      <Icon size={16} />
    </button>
  )
}

function ActionBtn({ icon: Icon, label, onClick, variant = 'ghost' }) {
  const base = 'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150'
  const variants = {
    primary: `${base} bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20`,
    success: `${base} bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20`,
    ghost:   `${base} border border-slate-700 text-slate-400 hover:bg-slate-700/60 hover:text-white`,
    danger:  `${base} border border-red-500/30 text-red-400 hover:bg-red-500/10`,
  }
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick} className={variants[variant]}>
      <Icon size={15} /> {label}
    </motion.button>
  )
}

function PreviewCard({ to, subject, body }) {
  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden h-full flex flex-col" style={{ background: 'var(--bg-card)' }}>
      <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-xs text-slate-500 font-medium">Email Preview</span>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1 pb-3 border-b border-slate-700/60">
          <div className="flex gap-2 text-xs">
            <span className="text-slate-500 w-12 shrink-0">To:</span>
            <span className="text-slate-200 truncate">{to || <span className="text-slate-600 italic">recipient@example.com</span>}</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-slate-500 w-12 shrink-0">Subject:</span>
            <span className="text-slate-200 truncate">{subject || <span className="text-slate-600 italic">No subject</span>}</span>
          </div>
        </div>
        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto max-h-64">
          {body || <span className="text-slate-600 italic">Email body will appear here…</span>}
        </div>
      </div>
    </div>
  )
}

function HistoryTable({ rows }) {
  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden" style={{ background: 'var(--bg-card)' }}>
      <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-2">
        <MdHistory size={18} className="text-blue-400" />
        <h2 className="text-sm font-semibold text-white">Email History</h2>
        <span className="ml-auto text-xs text-slate-500">{rows.length} records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700/60">
              {['Recipient', 'Subject', 'Date', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
              >
                <td className="px-5 py-3 text-slate-300 font-medium">{row.recipient}</td>
                <td className="px-5 py-3 text-slate-400 max-w-[220px] truncate">{row.subject}</td>
                <td className="px-5 py-3 text-slate-500">{row.date}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_STYLES[row.status]}`}>
                    {row.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

let _toastId = 0

export default function Email() {
  const [form, setForm] = useState({ to: '', cc: '', bcc: '', subject: '', template: 'weekly', body: TEMPLATES[0].body })
  const [toasts, setToasts] = useState([])

  const set = key => val => setForm(f => ({ ...f, [key]: val }))

  const handleTemplate = val => {
    const tpl = TEMPLATES.find(t => t.value === val)
    setForm(f => ({ ...f, template: val, body: tpl?.body ?? '' }))
  }

  const addToast = useCallback((message, type = 'info') => {
    const id = ++_toastId
    setToasts(t => [...t, { id, message, type }])
  }, [])

  const removeToast = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), [])

  const actions = [
    { icon: MdAutoAwesome, label: 'Generate with AI', variant: 'primary',  fn: () => addToast('AI generation coming soon!', 'info')    },
    { icon: MdPreview,     label: 'Preview',          variant: 'ghost',    fn: () => addToast('Preview updated in the right panel.', 'info') },
    { icon: MdSave,        label: 'Save Draft',       variant: 'ghost',    fn: () => addToast('Draft saved successfully.', 'success')   },
    { icon: MdSend,        label: 'Send Email',       variant: 'success',  fn: () => addToast('Email queued for sending!', 'success')   },
    { icon: MdCancel,      label: 'Cancel',           variant: 'danger',   fn: () => { setForm({ to: '', cc: '', bcc: '', subject: '', template: 'weekly', body: TEMPLATES[0].body }); addToast('Composer cleared.', 'info') } },
  ]

  return (
    <>
      <Toast toasts={toasts} remove={removeToast} />

      <motion.div initial="hidden" animate="show" variants={container} className="flex flex-col gap-6 pb-8">

        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MdEmail size={22} className="text-blue-400" /> Email Center
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Generate and send AI-powered business reports.</p>
        </motion.div>

        {/* Composer grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Left panel */}
          <div className="xl:col-span-1 rounded-xl border border-slate-700 p-5 flex flex-col gap-4" style={{ background: 'var(--bg-card)' }}>
            <h2 className="text-sm font-semibold text-white">Compose</h2>

            <InputField icon={MdPerson}  label="Recipient"  value={form.to}      onChange={set('to')}      placeholder="recipient@example.com" />
            <InputField icon={MdPerson}  label="CC"         value={form.cc}      onChange={set('cc')}      placeholder="cc@example.com" />
            <InputField icon={MdPerson}  label="BCC"        value={form.bcc}     onChange={set('bcc')}     placeholder="bcc@example.com" />
            <InputField icon={MdSubject} label="Subject"    value={form.subject} onChange={set('subject')} placeholder="Email subject…" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-medium">Template</label>
              <select
                value={form.template}
                onChange={e => handleTemplate(e.target.value)}
                className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Body editor */}
          <div className="xl:col-span-1 rounded-xl border border-slate-700 flex flex-col overflow-hidden" style={{ background: 'var(--bg-card)' }}>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-slate-700 flex-wrap">
              <ToolbarBtn icon={MdFormatBold}         title="Bold" />
              <ToolbarBtn icon={MdFormatItalic}       title="Italic" />
              <ToolbarBtn icon={MdFormatUnderlined}   title="Underline" />
              <div className="w-px h-4 bg-slate-700 mx-1" />
              <ToolbarBtn icon={MdFormatListBulleted} title="Bullet List" />
              <ToolbarBtn icon={MdFormatListNumbered} title="Numbered List" />
              <div className="w-px h-4 bg-slate-700 mx-1" />
              <ToolbarBtn icon={MdAttachFile}         title="Attach" />
              <ToolbarBtn icon={MdEmojiEmotions}      title="Emoji" />
            </div>
            <textarea
              value={form.body}
              onChange={e => set('body')(e.target.value)}
              placeholder="Write your email body here…"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none min-h-[280px]"
            />
          </div>

          {/* Right preview */}
          <div className="xl:col-span-1">
            <PreviewCard to={form.to} subject={form.subject} body={form.body} />
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
          {actions.map(a => (
            <ActionBtn key={a.label} icon={a.icon} label={a.label} onClick={a.fn} variant={a.variant} />
          ))}
        </motion.div>

        {/* History */}
        <motion.div variants={fadeUp}>
          <HistoryTable rows={MOCK_HISTORY} />
        </motion.div>

      </motion.div>
    </>
  )
}
