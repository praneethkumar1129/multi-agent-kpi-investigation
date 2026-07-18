import { MdAutoAwesome } from 'react-icons/md'
import { CardSkeleton } from './Skeletons'

export default function ExecutiveSummary({ summary, kpis, loading }) {
  if (loading) return <CardSkeleton rows={8} />

  const paragraphs = summary
    ? summary.split(/\n{2,}/).filter(Boolean)
    : []

  // Pull a few KPI highlights if available
  const highlights = kpis ? [
    { label: 'Revenue',    value: kpis.Total_Revenue      ?? kpis.total_revenue      ?? kpis.revenue      },
    { label: 'Orders',     value: kpis.Total_Orders       ?? kpis.total_orders       ?? kpis.orders       },
    { label: 'Customers',  value: kpis.Total_Customers    ?? kpis.total_customers    ?? kpis.customers    },
    { label: 'Avg Order',  value: kpis.Avg_Order_Value    ?? kpis.avg_order_value    ?? kpis.aov          },
  ].filter(h => h.value !== undefined && h.value !== null) : []

  return (
    <div
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4 h-full"
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-blue-600/15">
          <MdAutoAwesome size={14} className="text-blue-400" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Executive Summary
          </span>
          <p className="text-xs text-slate-500 mt-0.5">AI-generated · Gemini</p>
        </div>
      </div>

      {/* KPI highlights from live data */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {highlights.map(h => (
            <div
              key={h.label}
              className="rounded-xl bg-slate-800/60 border border-slate-700/40 px-3 py-2.5"
            >
              <p className="text-sm font-bold text-white truncate">
                {typeof h.value === 'number'
                  ? h.value > 1000
                    ? `$${(h.value / 1000).toFixed(1)}k`
                    : h.value.toLocaleString()
                  : h.value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{h.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Scrollable summary body */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-64">
        {paragraphs.length > 0 ? (
          paragraphs.map((para, i) => (
            <p key={i} className="text-xs text-slate-400 leading-relaxed">{para}</p>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">No summary available.</p>
        )}
      </div>
    </div>
  )
}
