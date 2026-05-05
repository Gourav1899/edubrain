import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, GraduationCap, UserCheck, DollarSign, Bot, TrendingUp, Bell, AlertTriangle } from 'lucide-react'
import { StatCard, Card, CardHeader, BarChart, Badge, Avatar, QuickAction, SkeletonCard } from '../../components/ui'
import { attendanceApi, feeApi, studentApi } from '../../services/api'
import { useAuthStore } from '../../store'
import toast from 'react-hot-toast'

const MOCK_STATS = {
  total_students: 1248, total_teachers: 86,
  today_attendance_pct: 94, fee_collected: 420000,
  pending_fees: 82000, ai_queries_today: 342,
  new_admissions: 12, low_attendance_count: 3,
}

const MOCK_CLASS_ATT = [
  { label: 'Class 10', value: 96 }, { label: 'Class 9', value: 91 },
  { label: 'Class 8', value: 79 }, { label: 'Class 7', value: 94 },
  { label: 'Class 6', value: 88 },
]

const MOCK_NOTICES = [
  { id: '1', title: '🏆 Annual Sports Day — May 5', date: '2h ago', category: 'event', color: '#10b981' },
  { id: '2', title: '📋 Mid-term Exam Schedule Released', date: 'Yesterday', category: 'exam', color: '#f59e0b' },
  { id: '3', title: '⚠️ Fee Deadline: April 30', date: '3 days ago', category: 'fee', color: '#ef4444' },
  { id: '4', title: '📚 Library closed on May 1', date: '4 days ago', category: 'holiday', color: '#818cf8' },
]

const MOCK_LOW_ATT = [
  { id: '1', name: 'Rohit Kumar',  cls: '8-A', pct: 67, risk: 'high' },
  { id: '2', name: 'Priya Sinha',  cls: '9-B', pct: 73, risk: 'medium' },
  { id: '3', name: 'Aryan Mehta',  cls: '7-C', pct: 75, risk: 'medium' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(MOCK_STATS)

  useEffect(() => {
    // Simulate API fetch — replace with real calls
    setTimeout(() => setLoading(false), 800)
  }, [])

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl">{greet()}, {user?.name?.split(' ')[0] ?? 'Admin'}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening at your institute today</p>
        </div>
        <div className="flex gap-2">
          <QuickAction icon="📢" label="Post Notice" onClick={() => navigate('/dashboard/notices')} />
          <QuickAction icon="➕" label="Add Student" onClick={() => navigate('/dashboard/students')} variant="primary" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Students"    value={stats.total_students.toLocaleString()} change="+12 this month" changeType="up"   color="text-primary-400" icon={<GraduationCap className="w-4 h-4" />} onClick={() => navigate('/dashboard/students')} />
            <StatCard label="Teachers"          value={stats.total_teachers}                  change="+3 new"         changeType="up"   color="text-accent-cyan"  icon={<Users className="w-4 h-4" />}         onClick={() => navigate('/dashboard/teachers')} />
            <StatCard label="Today Attendance"  value={stats.today_attendance_pct + '%'}      change="-2% vs yesterday" changeType="down" color="text-accent-green" icon={<UserCheck className="w-4 h-4" />}      onClick={() => navigate('/dashboard/attendance')} />
            <StatCard label="Fee Collected"     value={'₹' + (stats.fee_collected / 100000).toFixed(1) + 'L'} change="This month" changeType="up" color="text-accent-amber" icon={<DollarSign className="w-4 h-4" />}     onClick={() => navigate('/dashboard/fees')} />
            <StatCard label="Pending Fees"      value={'₹' + (stats.pending_fees / 1000).toFixed(0) + 'K'} change="48 students" changeType="down" color="text-red-400" icon={<DollarSign className="w-4 h-4" />} onClick={() => navigate('/dashboard/fees')} />
            <StatCard label="AI Queries Today"  value={stats.ai_queries_today}                change="+18%"           changeType="up"   color="text-accent-violet" icon={<Bot className="w-4 h-4" />}             onClick={() => navigate('/dashboard/ai')} />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Class Attendance */}
        <Card>
          <CardHeader
            title="Class-wise Attendance"
            action={<button onClick={() => navigate('/dashboard/attendance')} className="text-xs text-primary-400 hover:text-primary-300">View all →</button>}
          />
          <BarChart data={MOCK_CLASS_ATT} />
        </Card>

        {/* Notice Board */}
        <Card>
          <CardHeader
            title="Notice Board"
            action={<button onClick={() => navigate('/dashboard/notices')} className="text-xs text-primary-400 hover:text-primary-300">+ Add notice</button>}
          />
          <div className="space-y-2">
            {MOCK_NOTICES.map((n) => (
              <motion.div key={n.id} whileHover={{ x: 2 }} className="flex items-start gap-3 p-2.5 bg-dark-700/50 rounded-xl cursor-pointer hover:bg-dark-700 transition-colors">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-500 truncate">{n.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{n.date}</div>
                </div>
                <Badge variant={n.category === 'event' ? 'green' : n.category === 'exam' ? 'amber' : n.category === 'fee' ? 'red' : 'blue'}>
                  {n.category}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Low Attendance Alert */}
      <Card>
        <CardHeader
          title={<span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Low Attendance Alert</span>}
          action={
            <button onClick={() => toast.success('Notifications sent to parents!')} className="text-xs text-primary-400 hover:text-primary-300">
              Notify All Parents →
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Attendance</th>
                <th>Risk Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOW_ATT.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} size="sm" color={s.risk === 'high' ? 'from-red-600 to-red-800' : 'from-amber-500 to-orange-600'} />
                      <span className="font-500">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-400">Class {s.cls}</td>
                  <td>
                    <span className={`font-700 ${s.pct < 70 ? 'text-red-400' : 'text-amber-400'}`}>{s.pct}%</span>
                  </td>
                  <td>
                    <Badge variant={s.risk === 'high' ? 'red' : 'amber'} dot>
                      {s.risk === 'high' ? 'High Risk' : 'Medium Risk'}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => toast.success(`SMS sent to ${s.name}'s parent`)} className="text-xs text-primary-400 hover:text-primary-300">
                        Notify Parent
                      </button>
                      <button onClick={() => navigate('/dashboard/ml')} className="text-xs text-accent-violet hover:text-purple-300">
                        View ML Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <div className="flex flex-wrap gap-2">
          {[
            { icon: '😊', label: 'Face Attendance',    path: '/dashboard/attendance' },
            { icon: '📝', label: 'Enter Results',       path: '/dashboard/results' },
            { icon: '💰', label: 'Collect Fee',         path: '/dashboard/fees' },
            { icon: '📖', label: 'Generate Notes',      path: '/dashboard/ai' },
            { icon: '📋', label: 'Question Paper',      path: '/dashboard/ai' },
            { icon: '🔮', label: 'ML Predictions',      path: '/dashboard/ml' },
            { icon: '📊', label: 'Reports',             path: '/dashboard/reports' },
            { icon: '⚙️', label: 'Settings',            path: '/dashboard/settings' },
          ].map((a) => (
            <QuickAction key={a.label} icon={a.icon} label={a.label} onClick={() => navigate(a.path)} />
          ))}
        </div>
      </Card>
    </div>
  )
}
