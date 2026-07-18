import { MdErrorOutline, MdRefresh } from 'react-icons/md'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-600/30 bg-rose-600/10 p-6 flex flex-col items-center gap-4 text-center">
      <div className="p-3 rounded-full bg-rose-600/20">
        <MdErrorOutline size={28} className="text-rose-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Analysis Failed</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
        >
          <MdRefresh size={15} />
          Retry
        </button>
      )}
    </div>
  )
}
