import { MdSearch, MdNotifications, MdLightMode, MdDarkMode } from 'react-icons/md'

export default function Navbar({ dark, setDark }) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3 border-b border-slate-700/50"
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Logo + Name */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          KPI
        </div>
        <span className="font-semibold text-white text-sm whitespace-nowrap hidden sm:block">
          KPI Intelligence
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-slate-800 text-slate-300 placeholder-slate-500 text-sm rounded-lg pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <MdNotifications size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark(d => !d)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {dark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          PK
        </div>
      </div>
    </header>
  )
}
