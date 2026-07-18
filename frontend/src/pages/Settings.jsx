import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MdPerson, MdPalette, MdTune, MdCheckCircle, MdError,
  MdRefresh, MdCloudQueue, MdStorage, MdMemory,
  MdNotifications, MdDarkMode, MdLightMode, MdLanguage,
  MdSchedule, MdAutorenew, MdBarChart,
} from 'react-icons/md'
import { SiGooglegemini, SiMongodb, SiGooglecloud } from 'react-icons/si'

// ─── helpers ─────────────────────────────────────────────────────────────────

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } }

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-700/60 p-5 ${className}`}
      style={{ background: 'var(--bg-card)' }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-blue-400" />
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

function StatusBadge({ status }) {
  const map = {
    online:      { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400', label: 'Online' },
    degraded:    { color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',     dot: 'bg-amber-400',   label: 'Degraded' },
    offline:     { color: 'text-red-400',      bg: 'bg-red-500/10 border-red-500/20',         dot: 'bg-red-400',     label: 'Offline' },
    checking:    { color: 'text-slate-400',    bg: 'bg-slate-700/40 border-slate-600/30',     dot: 'bg-slate-500',   label: 'Checking…' },
  }
  const s = map[status] ?? map.checking
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${s.bg} ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'online' ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  )
}

const SERVICES = [
  { key: 'backend',   label: 'Backend API',    icon: MdStorage,      desc: 'FastAPI · Cloud Run'         },
  { key: 'gemini',    label: 'Gemini AI',       icon: SiGooglegemini, desc: 'Vertex AI · Gemini 1.5 Pro'  },
  { key: 'bigquery',  label: 'BigQuery',        icon: MdCloudQueue,   desc: 'Google BigQuery warehouse'   },
  { key: 'mongodb',   label: 'MongoDB',         icon: SiMongodb,      desc: 'Memory & session store'      },
  { key: 'cloudrun',  label: 'Cloud Run',       icon: SiGooglecloud,  desc: 'Serverless compute layer'    },
]

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese']
const TIMEZONES = ['UTC', 'US/Eastern', 'US/Pacific', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo']

// ─── Settings ────────────────────────────────────────────────────────────────

export default function Settings() {
  // theme
  const [theme, setTheme] = useState('dark')

  // profile
  const [profile, setProfile] = useState({ name: 'Praneeth Kumar', email: 'praneeth@example.com', role: 'Admin' })
  const [profileSaved, setProfileSaved] = useState(false)

  // service statuses
  const [statuses, setStatuses] = useState({
    backend: 'online', gemini: 'online', bigquery: 'online', mongodb: 'degraded', cloudrun: 'online',
  })
  const [refreshing, setRefreshing] = useState(false)

  // preferences
  const [prefs, setPrefs] = useState({
    darkMode: true, notifications: true, autoRefresh: false,
    forecastDays: 30, language: 'English', timezone: 'UTC',
  })
  const [prefsSaved, setPrefsSaved] = useState(false)

  function setPref(k) {
    return (v) => setPrefs(p => ({ ...p, [k]: v }))
  }

  function handleRefresh() {
    setRefreshing(true)
    const keys = Object.keys(statuses)
    setStatuses(Object.fromEntries(keys.map(k => [k, 'checking'])))
    setTimeout(() => {
      setStatuses({ backend: 'online', gemini: 'online', bigquery: 'online', mongodb: 'online', cloudrun: 'online' })
      setRefreshing(false)
    }, 1800)
  }

  function handleSaveProfile() {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  function handleSavePrefs() {
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2500)
  }

  const onlineCount = Object.values(statuses).filter(s => s === 'online').length

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="flex flex-col gap-6 max-w-5xl mx-auto">

      {/* Page header */}
      <motion.div variants={item}>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your profile, preferences and system status</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left column ── */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Theme */}
          <motion.div variants={item}>
            <Card>
              <SectionTitle icon={MdPalette} label="Theme" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark',   label: 'Dark',   preview: 'bg-slate-900' },
                  { id: 'light',  label: 'Light',  preview: 'bg-slate-100' },
                  { id: 'system', label: 'System', preview: 'bg-gradient-to-br from-slate-900 to-slate-100' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150
                      ${theme === t.id
                        ? 'border-blue-500 bg-blue-600/10 text-blue-400'
                        : 'border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white'}`}
                  >
                    <div className={`w-full h-10 rounded-lg border border-slate-700/60 ${t.preview}`} />
                    <span className="text-xs font-medium">{t.label}</span>
                    {theme === t.id && <MdCheckCircle size={14} className="text-blue-400" />}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Profile */}
          <motion.div variants={item}>
            <Card>
              <SectionTitle icon={MdPerson} label="Profile" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{profile.name}</p>
                  <p className="text-slate-400 text-xs">{profile.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium">
                    {profile.role}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name',  label: 'Full Name',  placeholder: 'Your name'  },
                  { key: 'email', label: 'Email',       placeholder: 'your@email.com' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400 font-medium">{label}</label>
                    <input
                      value={profile[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                {profileSaved
                  ? <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"><MdCheckCircle size={14} /> Saved</span>
                  : <span />
                }
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </Card>
          </motion.div>

          {/* API / Service Status */}
          <motion.div variants={item}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MdMemory size={16} className="text-blue-400" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">API Status</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{onlineCount}/{SERVICES.length} online</span>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <MdRefresh size={14} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {SERVICES.map(({ key, label, icon: Icon, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center text-slate-300 shrink-0">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                    <StatusBadge status={statuses[key]} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

        </div>

        {/* ── Right column: Preferences ── */}
        <motion.div variants={item} className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5">
            <SectionTitle icon={MdTune} label="Preferences" />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {prefs.darkMode ? <MdDarkMode size={16} className="text-slate-400" /> : <MdLightMode size={16} className="text-amber-400" />}
                <div>
                  <p className="text-sm text-white font-medium">Dark Mode</p>
                  <p className="text-xs text-slate-500">Interface appearance</p>
                </div>
              </div>
              <Toggle checked={prefs.darkMode} onChange={setPref('darkMode')} />
            </div>

            <div className="border-t border-slate-700/50" />

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MdNotifications size={16} className="text-slate-400" />
                <div>
                  <p className="text-sm text-white font-medium">Notifications</p>
                  <p className="text-xs text-slate-500">Alerts & updates</p>
                </div>
              </div>
              <Toggle checked={prefs.notifications} onChange={setPref('notifications')} />
            </div>

            <div className="border-t border-slate-700/50" />

            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MdAutorenew size={16} className="text-slate-400" />
                <div>
                  <p className="text-sm text-white font-medium">Auto Refresh</p>
                  <p className="text-xs text-slate-500">Refresh dashboard data</p>
                </div>
              </div>
              <Toggle checked={prefs.autoRefresh} onChange={setPref('autoRefresh')} />
            </div>

            <div className="border-t border-slate-700/50" />

            {/* Forecast Days */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MdBarChart size={16} className="text-slate-400" />
                  <p className="text-sm text-white font-medium">Forecast Days</p>
                </div>
                <span className="text-xs font-semibold text-blue-400 bg-blue-600/15 px-2 py-0.5 rounded-full">
                  {prefs.forecastDays}d
                </span>
              </div>
              <input
                type="range"
                min={7} max={90} step={1}
                value={prefs.forecastDays}
                onChange={e => setPref('forecastDays')(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>7d</span><span>30d</span><span>60d</span><span>90d</span>
              </div>
            </div>

            <div className="border-t border-slate-700/50" />

            {/* Language */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <MdLanguage size={16} className="text-slate-400" />
                <p className="text-sm text-white font-medium">Language</p>
              </div>
              <select
                value={prefs.language}
                onChange={e => setPref('language')(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Timezone */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <MdSchedule size={16} className="text-slate-400" />
                <p className="text-sm text-white font-medium">Timezone</p>
              </div>
              <select
                value={prefs.timezone}
                onChange={e => setPref('timezone')(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>

            {/* Save */}
            <div className="flex items-center justify-between pt-1">
              {prefsSaved
                ? <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium"><MdCheckCircle size={14} /> Saved</span>
                : <span />
              }
              <button
                onClick={handleSavePrefs}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  )
}
