import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Chat from './pages/Chat'
import Email from './pages/Email'
import Settings from './pages/Settings'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar dark={dark} setDark={setDark} />
        <main className="flex-1 overflow-hidden flex flex-col">
          <Routes>
            <Route path="/" element={<div className="flex-1 overflow-y-auto p-6"><Dashboard /></div>} />
            <Route path="/reports" element={<div className="flex-1 overflow-y-auto p-6"><Reports /></div>} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/email" element={<div className="flex-1 overflow-y-auto p-6"><Email /></div>} />
            <Route path="/settings" element={<div className="flex-1 overflow-y-auto p-6"><Settings /></div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
