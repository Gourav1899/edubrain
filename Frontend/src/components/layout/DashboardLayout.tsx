import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import {
    BarChart3,
    Bell, Bot,
    ChevronRight,
    ClipboardList,
    Clock,
    DollarSign,
    GraduationCap,
    LayoutDashboard,
    Library,
    LogOut, Menu,
    Search,
    Settings,
    TrendingUp,
    Truck,
    UserCheck,
    Users,
    X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { aiApi } from '../../services/api'
import { useAuthStore, useChatStore, useUiStore } from '../../store'
import { Avatar } from '../ui/index'

// ─── ROLE CONFIGS ─────────────────────────────────────────────────────────────
const NAV_CONFIGS: Record<string, Array<{ section?: string; id?: string; icon?: any; label?: string; badge?: string }>> = {
  admin: [
    { section: 'Overview' },
    { id: 'admin',      icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'students',   icon: GraduationCap,   label: 'Students' },
    { id: 'teachers',   icon: Users,           label: 'Teachers' },
    { id: 'attendance', icon: UserCheck,       label: 'Attendance' },
    { id: 'fees',       icon: DollarSign,      label: 'Fees', badge: '3' },
    { section: 'Academics' },
    { id: 'results',    icon: ClipboardList,   label: 'Results' },
    { id: 'timetable',  icon: Clock,           label: 'Timetable' },
    { id: 'notices',    icon: Bell,            label: 'Notices' },
    { section: 'AI & Analytics' },
    { id: 'ai',         icon: Bot,             label: 'AI Tools' },
    { id: 'ml',         icon: TrendingUp,      label: 'ML Predictions' },
    { id: 'reports',    icon: BarChart3,       label: 'Reports' },
    { section: 'More' },
    { id: 'library',    icon: Library,         label: 'Library' },
    { id: 'transport',  icon: Truck,           label: 'Transport' },
    { section: 'Admin' },
    { id: 'settings',   icon: Settings,        label: 'Super Admin' },
  ],
  teacher: [
    { section: 'My Work' },
    { id: 'teacher',    icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'attendance', icon: UserCheck,       label: 'Attendance' },
    { id: 'results',    icon: ClipboardList,   label: 'Results' },
    { id: 'students',   icon: GraduationCap,   label: 'My Students' },
    { id: 'notices',    icon: Bell,            label: 'Notices' },
    { section: 'AI Tools' },
    { id: 'ai',         icon: Bot,             label: 'AI Assistant' },
    { id: 'ml',         icon: TrendingUp,      label: 'Risk Predictions' },
  ],
  student: [
    { section: 'My Panel' },
    { id: 'student',    icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'attendance', icon: UserCheck,       label: 'My Attendance' },
    { id: 'results',    icon: ClipboardList,   label: 'My Results' },
    { id: 'timetable',  icon: Clock,           label: 'Timetable' },
    { id: 'fees',       icon: DollarSign,      label: 'Fee Status' },
    { id: 'notices',    icon: Bell,            label: 'Notices' },
    { section: 'Learn' },
    { id: 'ai',         icon: Bot,             label: 'AI Tutor' },
  ],
  parent: [
    { section: "My Child" },
    { id: 'parent',     icon: LayoutDashboard, label: "Child Dashboard" },
    { id: 'fees',       icon: DollarSign,      label: 'Fee & Payments' },
    { id: 'results',    icon: ClipboardList,   label: 'Results' },
    { id: 'notices',    icon: Bell,            label: 'Notices' },
    { id: 'ai',         icon: Bot,             label: 'AI Advisor' },
  ],
}

// ─── AI CHATBOT ───────────────────────────────────────────────────────────────
function AiChatbot() {
  const { chatOpen, toggleChat } = useUiStore()
  const { messages, isTyping, addMessage, setTyping } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 200)
  }, [chatOpen])

  const send = async (text?: string) => {
    const msg = text ?? input.trim()
    if (!msg) return
    setInput('')
    addMessage({ role: 'user', content: msg, timestamp: new Date().toISOString() })
    setTyping(true)
    try {
      const res = await aiApi.chat([...messages, { role: 'user', content: msg }])
      addMessage({ role: 'assistant', content: res.data?.reply ?? 'Sorry, try again.', timestamp: new Date().toISOString() })
    } catch {
      // Fallback offline replies
      const fallbacks: Record<string, string> = {
        'absent': 'Aaj 42 students absent hain — Class 7-A mein sabse zyada. Parents ko auto-notification bhej di.',
        'fee': '48 students ka fee pending ₹82,000. Rohit Kumar — ₹7,200 overdue. Reminder bhejun?',
        'weak': 'Maths weak students: Rohit Kumar 58%, Pooja 62%, Aryan 65%. Study plan generate karun?',
        'default': 'EduBrain AI ready hai! Attendance, fees, results, AI tools — kuch bhi poochho.',
      }
      const reply = Object.entries(fallbacks).find(([k]) => msg.toLowerCase().includes(k))?.[1] ?? fallbacks.default
      addMessage({ role: 'assistant', content: reply, timestamp: new Date().toISOString() })
    } finally {
      setTyping(false)
    }
  }

  const suggestions = ['Today absent students', 'Pending fees', 'Weak students', 'Generate notes']

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[400] w-13 h-13 rounded-full bg-gradient-to-br from-primary-600 to-accent-cyan text-white flex items-center justify-center shadow-glow-lg"
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}
        style={{ width: 52, height: 52 }}
      >
        <AnimatePresence mode="wait">
          {chatOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.div>
            : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Bot className="w-5 h-5" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-[400] w-80 flex flex-col glass overflow-hidden"
            style={{ maxHeight: 520 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-primary-600 to-accent-cyan">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🤖</div>
              <div>
                <div className="text-[13px] font-700 text-white">EduBrain AI</div>
                <div className="text-[10px] text-white/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block animate-pulse-slow" />
                  Always online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-[200px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={clsx('max-w-[88%] text-[12.5px] leading-relaxed px-3 py-2 rounded-2xl',
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white self-end rounded-br-sm msg-user-enter'
                      : 'bg-dark-700 text-gray-200 self-start rounded-bl-sm border border-white/[0.06] msg-bot-enter'
                  )}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.content}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-1.5 px-3 py-2.5 bg-dark-700 border border-white/[0.06] rounded-2xl rounded-bl-sm w-fit self-start">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-[11px] px-2.5 py-1 rounded-full border border-white/[0.08] bg-dark-700 text-gray-400 hover:border-primary-500/40 hover:text-primary-400 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-white/[0.06]">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything..."
                className="flex-1 bg-dark-700 border border-white/[0.08] rounded-xl px-3 py-2 text-[12.5px] text-gray-200 placeholder-gray-600 outline-none focus:border-primary-500/50"
              />
              <button
                onClick={() => send()}
                className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors flex-shrink-0 self-end"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { sidebarOpen } = useUiStore()
  const role = user?.role === 'super_admin' ? 'admin' : (user?.role ?? 'admin')
  const navItems = NAV_CONFIGS[role] ?? NAV_CONFIGS.admin

  const currentId = location.pathname.split('/dashboard/')[1]?.split('/')[0]

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-dark-800 border-r border-white/[0.06] flex flex-col z-[200] overflow-hidden"
      animate={{ width: sidebarOpen ? 248 : 0, opacity: sidebarOpen ? 1 : 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 p-4 border-b border-white/[0.06] shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center text-base shrink-0">🧠</div>
        <div>
          <div className="font-display font-800 text-[15px] leading-tight">EduBrain AI</div>
          <div className="text-[10px] text-gray-600">Management Platform</div>
        </div>
      </div>

      {/* Role switcher */}
      {(user?.role === 'super_admin' || user?.role === 'admin') && (
        <div className="p-2.5 border-b border-white/[0.06] shrink-0">
          <div className="grid grid-cols-4 gap-1 bg-dark-700 rounded-xl p-1">
            {['Admin', 'Teacher', 'Student', 'Parent'].map((r) => (
              <button
                key={r}
                onClick={() => navigate(`/dashboard/${r.toLowerCase()}`)}
                className={clsx(
                  'py-1.5 rounded-lg text-[10px] font-700 transition-all',
                  currentId === r.toLowerCase()
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item, i) => {
          if (item.section) {
            return <div key={i} className="px-2 pt-4 pb-1.5 text-[10px] font-700 text-gray-600 uppercase tracking-widest">{item.section}</div>
          }
          const Icon = item.icon
          const isActive = currentId === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/dashboard/${item.id}`)}
              className={clsx('nav-item', isActive && 'active')}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
          <Avatar name={user?.name ?? 'User'} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-600 truncate">{user?.name ?? 'User'}</div>
            <div className="text-[10px] text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleLogout() }} className="p-1 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-600 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function Topbar() {
  const { toggleSidebar, sidebarOpen } = useUiStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const panel = location.pathname.split('/dashboard/')[1]?.split('/')[0] ?? 'dashboard'

  const titles: Record<string, string> = {
    admin: 'Admin Dashboard', teacher: 'Teacher Dashboard',
    student: 'My Dashboard', parent: 'Child Dashboard',
    students: 'Student Management', teachers: 'Teacher Management',
    attendance: 'Attendance', fees: 'Fee Management',
    results: 'Result Management', notices: 'Notice Board',
    ai: 'AI Tools', ml: 'ML Predictions', reports: 'Reports',
    settings: 'Super Admin Settings', timetable: 'Timetable',
    library: 'Library', transport: 'Transport', profile: 'Profile',
  }

  return (
    <div className="h-14 flex items-center gap-3 px-5 bg-dark-800 border-b border-white/[0.06] sticky top-0 z-[100]">
      <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-gray-300 transition-colors">
        <Menu className="w-4.5 h-4.5 w-5 h-5" />
      </button>

      <div className="font-display font-700 text-[15px] flex-1">
        {titles[panel] ?? panel}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-dark-700 border border-white/[0.06] rounded-xl px-3 py-1.5 w-52">
        <Search className="w-3.5 h-3.5 text-gray-600" />
        <input placeholder="Search... (Ctrl+K)" className="bg-transparent text-[12.5px] text-gray-400 placeholder-gray-600 outline-none flex-1" />
      </div>

      <button onClick={() => navigate('/dashboard/notices')} className="relative p-1.5 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-gray-300 transition-colors">
        <Bell className="w-4.5 h-4.5 w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-dark-800" />
      </button>

      <button onClick={() => navigate('/dashboard/profile')}>
        <Avatar name={user?.name ?? 'U'} size="sm" />
      </button>
    </div>
  )
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const { sidebarOpen } = useUiStore()

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('.topbar-search-input')?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="flex min-h-screen mesh-bg">
      <Sidebar />
      <main
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 248 : 0 }}
      >
        <Topbar />
        <div className="flex-1 p-5 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
      <AiChatbot />
    </div>
  )
}
