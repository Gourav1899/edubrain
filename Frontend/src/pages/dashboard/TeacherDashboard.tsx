// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Fingerprint, ClipboardList, Bot, BookOpen, TrendingUp } from 'lucide-react'
import { StatCard, Card, CardHeader, Badge, QuickAction } from '../../components/ui'
import { useAuthStore } from '../../store'

const TODAY_CLASSES = [
  { cls: '10-A', sub: 'Mathematics', time: '9:00 AM',  done: true  },
  { cls: '9-B',  sub: 'Mathematics', time: '10:00 AM', done: false },
  { cls: '8-A',  sub: 'Mathematics', time: '11:00 AM', done: false },
]

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-800 text-2xl">Good morning, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 text-sm mt-0.5">Teacher Dashboard</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="My Classes"     value={5}   color="text-primary-400" />
        <StatCard label="My Students"    value={186} color="text-accent-cyan" />
        <StatCard label="Pending Assign" value={3}   color="text-accent-amber" changeType="down" change="due today" />
        <StatCard label="Results Due"    value={12}  color="text-red-400" changeType="down" change="not entered" />
      </div>

      {/* Attendance Methods */}
      <Card>
        <CardHeader title="Mark Attendance" subtitle="Choose your method for today" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { emoji: '😊', label: 'Face Recognition', sub: 'AI camera scan',     path: '/dashboard/attendance', gradient: 'from-primary-600 to-primary-800' },
            { emoji: '👆', label: 'Fingerprint',       sub: 'Device biometric',   path: '/dashboard/attendance', gradient: 'from-cyan-600 to-cyan-800' },
            { emoji: '📱', label: 'QR Code',           sub: 'Students scan code', path: '/dashboard/attendance', gradient: 'from-emerald-600 to-emerald-800' },
            { emoji: '📋', label: 'Manual',            sub: 'P/A/L marking',      path: '/dashboard/attendance', gradient: 'from-amber-600 to-amber-800' },
          ].map((m) => (
            <motion.div key={m.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(m.path)}
              className="glass p-4 text-center cursor-pointer hover:border-primary-500/25 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-2xl mx-auto mb-3`}>{m.emoji}</div>
              <div className="text-sm font-700">{m.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{m.sub}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's classes */}
        <Card>
          <CardHeader title="Today's Classes" />
          <div className="space-y-2">
            {TODAY_CLASSES.map((c) => (
              <div key={c.cls + c.time} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-xl flex-shrink-0">📚</div>
                <div className="flex-1">
                  <div className="text-sm font-600">Class {c.cls} — {c.sub}</div>
                  <div className="text-xs text-gray-500">{c.time}</div>
                </div>
                <Badge variant={c.done ? 'green' : 'amber'}>{c.done ? 'Done' : 'Upcoming'}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Quick Actions */}
        <Card>
          <CardHeader title="AI Tools" />
          <div className="space-y-2">
            {[
              { icon: '📝', label: 'Generate Question Paper', path: '/dashboard/ai' },
              { icon: '📖', label: 'Generate Chapter Notes',  path: '/dashboard/ai' },
              { icon: '📸', label: 'Enter Result (AI Scan)',   path: '/dashboard/results' },
              { icon: '💬', label: 'Generate Parent Message',  path: '/dashboard/ai' },
              { icon: '🔮', label: 'ML Risk Report',           path: '/dashboard/ml' },
            ].map((a) => (
              <button key={a.label} onClick={() => navigate(a.path)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-dark-700/50 transition-colors text-left"
              >
                <span className="text-lg">{a.icon}</span>
                <span className="text-sm text-gray-300">{a.label}</span>
                <span className="ml-auto text-gray-600">→</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
