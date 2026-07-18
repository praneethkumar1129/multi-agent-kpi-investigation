import { motion } from 'framer-motion'

const colorMap = {
  blue:    { bg: 'bg-blue-600/10',    border: 'border-blue-600/20',    icon: 'text-blue-400',    badge: 'bg-blue-600/20 text-blue-300'    },
  emerald: { bg: 'bg-emerald-600/10', border: 'border-emerald-600/20', icon: 'text-emerald-400', badge: 'bg-emerald-600/20 text-emerald-300' },
  violet:  { bg: 'bg-violet-600/10',  border: 'border-violet-600/20',  icon: 'text-violet-400',  badge: 'bg-violet-600/20 text-violet-300'  },
  amber:   { bg: 'bg-amber-600/10',   border: 'border-amber-600/20',   icon: 'text-amber-400',   badge: 'bg-amber-600/20 text-amber-300'   },
  rose:    { bg: 'bg-rose-600/10',    border: 'border-rose-600/20',    icon: 'text-rose-400',    badge: 'bg-rose-600/20 text-rose-300'    },
  cyan:    { bg: 'bg-cyan-600/10',    border: 'border-cyan-600/20',    icon: 'text-cyan-400',    badge: 'bg-cyan-600/20 text-cyan-300'    },
}

export default function KPICard({ icon: Icon, title, value, subtitle, trend, trendUp, color }) {
  const c = colorMap[color] ?? colorMap.blue

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border p-5 flex flex-col gap-4 cursor-default ${c.border}`}
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <Icon size={22} className={c.icon} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value ?? '—'}</p>
        <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wide">{title}</p>
      </div>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </motion.div>
  )
}
