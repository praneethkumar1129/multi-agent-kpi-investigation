import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdDashboard,
  MdBarChart,
  MdChat,
  MdEmail,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md'

const NAV = [
  { to: '/',         icon: MdDashboard, label: 'Dashboard' },
  { to: '/reports',  icon: MdBarChart,  label: 'Reports'   },
  { to: '/chat',     icon: MdChat,      label: 'AI Chat'   },
  { to: '/email',    icon: MdEmail,     label: 'Email'     },
  { to: '/settings', icon: MdSettings,  label: 'Settings'  },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex flex-col shrink-0 overflow-hidden border-r border-slate-700/50"
      style={{ background: 'var(--bg-card)' }}
    >
      {/* Logo row */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/50">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-bold text-blue-400 whitespace-nowrap"
            >
              KPI System
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-auto"
        >
          {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
               ${isActive
                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                 : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'}`
            }
          >
            <Icon size={20} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  )
}
