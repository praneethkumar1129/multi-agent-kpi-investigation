import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import { CardSkeleton } from './Skeletons'

const fmt = v => `$${(v / 1000).toFixed(1)}k`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-700 p-3 text-xs" style={{ background: '#0F172A' }}>
      <p className="text-slate-300 font-semibold mb-1">{label}</p>
      <p style={{ color: '#10B981' }}>
        Forecast: ${(payload[0]?.value / 1000).toFixed(2)}k
      </p>
    </div>
  )
}

export default function ForecastChart({ forecast, loading }) {
  if (loading) return <CardSkeleton rows={6} />

  const days   = forecast?.next_7_days ?? []
  const method = forecast?.method ?? '7-Day Moving Average'
  const status = forecast?.status

  const chartData = days.map(d => ({
    date:    d.date?.slice(0, 10) ?? d.date,
    revenue: d.predicted_revenue,
  }))

  const avg = days.length
    ? (days.reduce((s, d) => s + d.predicted_revenue, 0) / days.length)
    : null

  return (
    <div
      className="rounded-2xl border border-slate-700/50 p-5 flex flex-col gap-4"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-white font-semibold text-sm">Revenue Forecast</h2>
          <p className="text-slate-500 text-xs mt-0.5">{method} · Next 7 Days</p>
        </div>
        {avg && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-600/20 text-emerald-300 font-medium border border-emerald-600/20">
            Avg ${(avg / 1000).toFixed(2)}k / day
          </span>
        )}
      </div>

      {status && status !== 'success' ? (
        <p className="text-xs text-slate-400 py-8 text-center">{status}</p>
      ) : chartData.length === 0 ? (
        <p className="text-xs text-slate-400 py-8 text-center">No forecast data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#10B981" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => v.slice(5)}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            {avg && (
              <ReferenceLine
                y={avg}
                stroke="#F59E0B"
                strokeDasharray="4 3"
                label={{ value: 'Avg', fill: '#F59E0B', fontSize: 10, position: 'insideTopRight' }}
              />
            )}
            <Line
              type="monotone"
              dataKey="revenue"
              name="Forecast"
              stroke="url(#lineGlow)"
              strokeWidth={2.5}
              dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
