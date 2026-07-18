import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdAttachMoney, MdShoppingCart, MdPeople,
  MdInventory, MdReceipt, MdLocalOffer,
  MdPlayArrow, MdSettings,
} from 'react-icons/md'

import { useDashboard }    from '../hooks/useDashboard'
import { useReports }      from '../hooks/useReports'
import KPICard             from '../components/KPICard'
import ForecastChart       from '../components/ForecastChart'
import ExecutiveSummary    from '../components/ExecutiveSummary'
import AnalyticsCard       from '../components/AnalyticsCard'
import RootCauseCard       from '../components/RootCauseCard'
import RecommendationCard  from '../components/RecommendationCard'
import ErrorMessage        from '../components/ErrorMessage'
import { KPICardSkeleton } from '../components/Skeletons'

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtNum(v) {
  if (v === undefined || v === null) return '—'
  const n = Number(v)
  if (isNaN(n)) return String(v)
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}k`
  return n % 1 === 0 ? n.toLocaleString() : `$${n.toFixed(2)}`
}

function fmtPct(v) {
  if (v === undefined || v === null) return '—'
  const n = Number(v)
  return isNaN(n) ? String(v) : `${n.toFixed(1)}%`
}

function buildKPIs(kpis = {}) {
  const k = Object.fromEntries(
    Object.entries(kpis).map(([key, val]) => [key.toLowerCase().replace(/\s+/g, '_'), val])
  )
  return [
    { icon: MdAttachMoney, title: 'Total Revenue',   value: fmtNum(k.total_revenue ?? k.revenue),                                                    subtitle: 'Gross revenue this period',    color: 'blue'    },
    { icon: MdShoppingCart, title: 'Total Orders',   value: (k.total_orders ?? k.orders)?.toLocaleString() ?? '—',                                   subtitle: 'Orders placed this period',    color: 'emerald' },
    { icon: MdPeople,       title: 'Customers',      value: (k.total_customers ?? k.unique_customers ?? k.customers)?.toLocaleString() ?? '—',        subtitle: 'Unique customers',             color: 'violet'  },
    { icon: MdInventory,    title: 'Products Sold',  value: (k.total_products_sold ?? k.products_sold ?? k.total_quantity)?.toLocaleString() ?? '—',  subtitle: 'Units across all categories',  color: 'cyan'    },
    { icon: MdReceipt,      title: 'Avg Order Value',value: fmtNum(k.avg_order_value ?? k.average_order_value ?? k.aov),                              subtitle: 'Average per transaction',      color: 'amber'   },
    { icon: MdLocalOffer,   title: 'Discount Rate',  value: fmtPct(k.avg_discount_rate ?? k.discount_rate ?? k.avg_discount),                         subtitle: 'Average discount applied',     color: 'rose'    },
  ]
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function AnalyseModal({ onSubmit, onClose }) {
  const [form, setForm] = useState({
    project_id: import.meta.env.VITE_PROJECT_ID || '',
    dataset:    import.meta.env.VITE_BQ_DATASET  || '',
    table:      import.meta.env.VITE_BQ_TABLE    || '',
    user_query: import.meta.env.VITE_USER_QUERY  || 'Analyze business KPIs and provide insights.',
  })
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-2xl border border-slate-700 p-6 flex flex-col gap-5"
        style={{ background: 'var(--bg-card)' }}
      >
        <div>
          <h2 className="text-white font-semibold text-sm">Run Analysis</h2>
          <p className="text-slate-500 text-xs mt-0.5">Configure your BigQuery source</p>
        </div>
        {[
          { key: 'project_id', label: 'GCP Project ID',  placeholder: 'my-gcp-project' },
          { key: 'dataset',    label: 'BigQuery Dataset', placeholder: 'my_dataset'     },
          { key: 'table',      label: 'Table Name',       placeholder: 'sales_data'     },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400 font-medium">{label}</label>
            <input
              value={form[key]}
              onChange={set(key)}
              placeholder={placeholder}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        ))}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">User Query</label>
          <textarea
            value={form.user_query}
            onChange={set('user_query')}
            rows={2}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-700/50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSubmit(form); onClose() }}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <MdPlayArrow size={15} /> Run Analysis
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

export default function Dashboard() {
  const { addReport } = useReports()

  const onSuccess = useCallback((result, payload) => {
    addReport(result, payload)
  }, [addReport])

  const { data, loading, error, fetch } = useDashboard({ onSuccess })
  const [showModal, setShowModal] = useState(false)

  const kpis             = data?.kpis             ?? {}
  const analytics        = data?.analytics        ?? []
  const rootCauses       = data?.root_causes       ?? []
  const recommendations  = data?.recommendations   ?? []
  const executiveSummary = data?.executive_summary ?? data?.memory?.executive_summary ?? ''
  const forecast         = data?.forecast          ?? null
  const kpiCards         = buildKPIs(kpis)

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <AnalyseModal onSubmit={fetch} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

      <motion.div initial="hidden" animate="show" variants={container} className="flex flex-col gap-6">

        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-white">Business Overview</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {data ? 'Live data · AI-powered analysis' : 'Run an analysis to load your KPI data'}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
          >
            {loading
              ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Analysing…</>
              : <><MdSettings size={14} /> Configure & Run</>
            }
          </button>
        </motion.div>

        {error && (
          <motion.div variants={item}>
            <ErrorMessage message={error} onRetry={() => setShowModal(true)} />
          </motion.div>
        )}

        {/* KPI Cards */}
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <KPICardSkeleton key={i} />)
            : kpiCards.map(kpi => <KPICard key={kpi.title} {...kpi} />)
          }
        </motion.div>

        {/* Chart + Summary */}
        <motion.div variants={item} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2"><ForecastChart forecast={forecast} loading={loading} /></div>
          <div className="xl:col-span-1"><ExecutiveSummary summary={executiveSummary} kpis={kpis} loading={loading} /></div>
        </motion.div>

        {/* Bottom row */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AnalyticsCard      analytics={analytics}             loading={loading} />
          <RootCauseCard      rootCauses={rootCauses}           loading={loading} />
          <RecommendationCard recommendations={recommendations} loading={loading} />
        </motion.div>

      </motion.div>
    </>
  )
}
