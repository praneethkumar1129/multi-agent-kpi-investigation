import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdCheckCircle, MdError, MdInfo, MdClose } from 'react-icons/md'

const ICONS = { success: MdCheckCircle, error: MdError, info: MdInfo }
const COLORS = {
  success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  error:   'text-red-400 bg-red-400/10 border-red-400/20',
  info:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
}

export default function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} remove={remove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, remove }) {
  const Icon = ICONS[toast.type] ?? MdInfo

  useEffect(() => {
    const timer = setTimeout(() => remove(toast.id), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, remove])

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-sm min-w-[260px] max-w-xs ${COLORS[toast.type]}`}
      style={{ background: 'var(--bg-card)' }}
    >
      <Icon size={18} className="shrink-0" />
      <span className="text-sm text-slate-200 flex-1">{toast.message}</span>
      <button onClick={() => remove(toast.id)} className="text-slate-500 hover:text-slate-300 transition-colors">
        <MdClose size={16} />
      </button>
    </motion.div>
  )
}
