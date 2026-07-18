import { useState } from 'react'
import { MdLightbulb, MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'
import { motion } from 'framer-motion'
import { CardSkeleton } from './Skeletons'

const priorityStyles = [
  'bg-rose-600/20 text-rose-300 border-rose-600/25',
  'bg-amber-600/20 text-amber-300 border-amber-600/25',
  'bg-blue-600/20 text-blue-300 border-blue-600/25',
  'bg-slate-600/20 text-slate-400 border-slate-600/25',
]

const priorityLabels = ['P1', 'P2', 'P3', 'P4']

export default function RecommendationCard({ recommendations, loading }) {
  const [checked, setChecked] = useState({})

  if (loading) return <CardSkeleton rows={5} />

  const items = Array.isArray(recommendations) ? recommendations : []
  const doneCount = Object.values(checked).filter(Boolean).length

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }))

  return (
    <div
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-600/15">
            <MdLightbulb size={14} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Recommendations</h2>
            <p className="text-slate-500 text-xs mt-0.5">AI-generated action plan</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 font-medium border border-violet-600/20">
          {items.length - doneCount} Open
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-500 italic py-4 text-center">No recommendations available.</p>
      ) : (
        <div className="space-y-3">
          {items.map((rec, i) => {
            const done = !!checked[i]
            const pStyle = priorityStyles[Math.min(i, priorityStyles.length - 1)]
            const pLabel = priorityLabels[Math.min(i, priorityLabels.length - 1)]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
                onClick={() => toggle(i)}
                className={`rounded-xl border border-slate-700/40 p-3.5 flex gap-3 cursor-pointer
                  transition-all duration-200 hover:border-slate-600/60
                  ${done ? 'opacity-50' : ''}`}
                style={{ background: 'rgba(30,41,59,0.5)' }}
              >
                <div className="mt-0.5 shrink-0">
                  {done
                    ? <MdCheckCircle size={16} className="text-emerald-400" />
                    : <MdRadioButtonUnchecked size={16} className="text-slate-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-bold ${pStyle}`}>
                      {pLabel}
                    </span>
                  </div>
                  <p className={`text-xs text-slate-300 leading-relaxed ${done ? 'line-through text-slate-500' : ''}`}>
                    {rec}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Progress bar */}
      {items.length > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress</span>
            <span>{doneCount}/{items.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / items.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
