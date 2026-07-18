import { MdBiotech, MdCircle } from 'react-icons/md'
import { motion } from 'framer-motion'
import { CardSkeleton } from './Skeletons'

const severityColors = [
  { dot: 'bg-rose-500',   badge: 'bg-rose-600/15 text-rose-400 border-rose-600/25',   label: 'Critical' },
  { dot: 'bg-amber-500',  badge: 'bg-amber-600/15 text-amber-400 border-amber-600/25', label: 'High'     },
  { dot: 'bg-yellow-500', badge: 'bg-yellow-600/15 text-yellow-400 border-yellow-600/25', label: 'Medium' },
  { dot: 'bg-slate-500',  badge: 'bg-slate-600/15 text-slate-400 border-slate-600/25', label: 'Low'      },
]

export default function RootCauseCard({ rootCauses, loading }) {
  if (loading) return <CardSkeleton rows={5} />

  const items = Array.isArray(rootCauses) ? rootCauses : []

  return (
    <div
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-600/15">
            <MdBiotech size={14} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Root Cause Analysis</h2>
            <p className="text-slate-500 text-xs mt-0.5">AI-detected causes</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-600/20 text-rose-300 font-medium border border-rose-600/20">
          {items.length} {items.length === 1 ? 'Cause' : 'Causes'}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-4 text-center">No root causes identified.</p>
      ) : (
        <div className="space-y-3">
          {items.map((cause, i) => {
            const s = severityColors[Math.min(i, severityColors.length - 1)]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
                className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-3.5 flex gap-3"
              >
                <div className="flex flex-col items-center gap-1.5 pt-0.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className="text-xs text-slate-600 font-mono">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.badge}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{cause}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
