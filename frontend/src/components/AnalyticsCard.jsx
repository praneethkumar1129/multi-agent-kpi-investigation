import { MdBarChart, MdCircle } from 'react-icons/md'
import { motion } from 'framer-motion'
import { CardSkeleton } from './Skeletons'

const ACCENT_COLORS = [
  'text-blue-400',
  'text-emerald-400',
  'text-amber-400',
  'text-violet-400',
  'text-cyan-400',
  'text-rose-400',
]

export default function AnalyticsCard({ analytics, loading }) {
  if (loading) return <CardSkeleton rows={5} />

  const items = Array.isArray(analytics) ? analytics : []

  return (
    <div
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-600/15">
            <MdBarChart size={14} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Business Analytics</h2>
            <p className="text-slate-500 text-xs mt-0.5">AI-generated insights</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-600/20 text-emerald-300 font-medium border border-emerald-600/20">
          {items.length} Insights
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-4 text-center">No analytics data available.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((insight, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex gap-3 items-start"
            >
              <MdCircle
                size={7}
                className={`mt-1.5 shrink-0 ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`}
              />
              <p className="text-xs text-slate-300 leading-relaxed">{insight}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
