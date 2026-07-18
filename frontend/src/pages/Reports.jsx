import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdDescription, MdDownload, MdVisibility, MdSearch,
  MdSort, MdDelete, MdClose, MdOpenInNew, MdInbox,
  MdCheckCircle, MdWarning, MdCalendarToday, MdStorage,
} from 'react-icons/md'
import { useReports }   from '../hooks/useReports'
import { getReportUrl } from '../api/api'

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function statusBadge(status) {
  if (status === 'ready')  return { label: 'Ready',   cls: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/25', icon: MdCheckCircle }
  if (status === 'no-pdf') return { label: 'Text Only', cls: 'bg-amber-600/20 text-amber-300 border-amber-600/25',   icon: MdWarning     }
  return                          { label: 'Unknown',  cls: 'bg-slate-600/20 text-slate-400 border-slate-600/25',    icon: MdWarning     }
}

// ─── Preview Modal ───────────────────────────────────────────────────────────

function PreviewModal({ report, onClose }) {
  const pdfUrl = report.filename ? getReportUrl(report.filename) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl h-[85vh] rounded-2xl border border-slate-700 flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-card)' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-blue-600/15 shrink-0">
              <MdDescription size={16} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{report.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{fmtDate(report.generatedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors"
              >
                <MdOpenInNew size={13} /> Open in Tab
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <MdClose size={18} />
            </button>
          </div>
        </div>

        {/* PDF viewer or text fallback */}
        <div className="flex-1 overflow-hidden">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={report.name}
              className="w-full h-full border-0"
            />
          ) : report.reportText ? (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="rounded-xl bg-amber-600/10 border border-amber-600/20 px-4 py-3 text-xs text-amber-300">
                  PDF not available — showing text report content.
                </div>
                {report.reportText.split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{para}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
              <MdDescription size={40} />
              <p className="text-sm">No preview available for this report.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Report Card ─────────────────────────────────────────────────────────────

function ReportCard({ report, onPreview, onDelete, index }) {
  const badge  = statusBadge(report.status)
  const BadgeIcon = badge.icon
  const pdfUrl = report.filename ? getReportUrl(report.filename) : null

  const handleDownload = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href     = pdfUrl
    a.download = report.filename
    a.target   = '_blank'
    a.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4 group"
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/20 shrink-0 mt-0.5">
            <MdDescription size={18} className="text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-snug truncate">{report.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <BadgeIcon size={11} className={badge.cls.split(' ')[1]} />
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(report.id)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-600/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
        >
          <MdDelete size={15} />
        </button>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
          <MdCalendarToday size={12} className="text-slate-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Generated</p>
            <p className="text-xs text-slate-300 font-medium truncate">{fmtDate(report.generatedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
          <MdStorage size={12} className="text-slate-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Dataset</p>
            <p className="text-xs text-slate-300 font-medium truncate">{report.dataset}</p>
          </div>
        </div>
      </div>

      {/* Table / Project */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 font-mono truncate max-w-[50%]">
          {report.table}
        </span>
        <span className="text-slate-600">·</span>
        <span className="truncate text-slate-500">{report.projectId}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onPreview(report)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700/60 hover:text-white transition-colors"
        >
          <MdVisibility size={14} /> Preview
        </button>
        <button
          onClick={handleDownload}
          disabled={!pdfUrl}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
        >
          <MdDownload size={14} /> Download
        </button>
      </div>
    </motion.div>
  )
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

export default function Reports() {
  const { reports, removeReport, clearAll } = useReports()
  const [search,  setSearch]  = useState('')
  const [sort,    setSort]    = useState('newest')
  const [preview, setPreview] = useState(null)

  const filtered = useMemo(() => {
    let list = [...reports]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.name.toLowerCase().includes(q)     ||
        r.dataset.toLowerCase().includes(q)  ||
        r.table.toLowerCase().includes(q)    ||
        r.projectId.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      const da = new Date(a.generatedAt), db = new Date(b.generatedAt)
      return sort === 'newest' ? db - da : da - db
    })
    return list
  }, [reports, search, sort])

  const readyCount = reports.filter(r => r.status === 'ready').length

  return (
    <>
      <AnimatePresence>
        {preview && <PreviewModal report={preview} onClose={() => setPreview(null)} />}
      </AnimatePresence>

      <motion.div initial="hidden" animate="show" variants={container} className="flex flex-col gap-6">

        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-white">Reports</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {reports.length} report{reports.length !== 1 ? 's' : ''} · {readyCount} with PDF
            </p>
          </div>
          {reports.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs font-semibold hover:border-rose-600/40 hover:text-rose-400 transition-colors"
            >
              <MdDelete size={14} /> Clear All
            </button>
          )}
        </motion.div>

        {/* Stats strip */}
        {reports.length > 0 && (
          <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Reports',  value: reports.length,                                    color: 'text-blue-400'    },
              { label: 'PDF Ready',      value: readyCount,                                         color: 'text-emerald-400' },
              { label: 'Text Only',      value: reports.filter(r => r.status === 'no-pdf').length,  color: 'text-amber-400'   },
              { label: 'Datasets',       value: new Set(reports.map(r => r.dataset)).size,           color: 'text-violet-400'  },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-slate-700/50 px-4 py-3" style={{ background: 'var(--bg-card)' }}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Search + Sort */}
        <motion.div variants={item} className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, dataset, table…"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <MdSort className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </motion.div>

        {/* Report grid or empty state */}
        {filtered.length === 0 ? (
          <motion.div
            variants={item}
            className="flex flex-col items-center justify-center py-24 gap-4 rounded-2xl border border-dashed border-slate-700/60"
            style={{ background: 'var(--bg-card)' }}
          >
            <div className="p-4 rounded-2xl bg-slate-700/30">
              <MdInbox size={36} className="text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-400">
                {search ? 'No reports match your search' : 'No reports yet'}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {search ? 'Try a different search term.' : 'Run an analysis from the Dashboard to generate your first report.'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={item}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((report, i) => (
              <ReportCard
                key={report.id}
                report={report}
                index={i}
                onPreview={setPreview}
                onDelete={removeReport}
              />
            ))}
          </motion.div>
        )}

      </motion.div>
    </>
  )
}
