// Student Dashboard
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StatCard, Card, CardHeader, BarChart, ProgressRing, Button, QuickAction } from '../../components/ui'
import { useAuthStore } from '../../store'

const SUBJECTS = [
  { label: 'Maths',   value: 68, color: '#ef4444' },
  { label: 'Science', value: 82, color: '#f59e0b' },
  { label: 'English', value: 91, color: '#10b981' },
  { label: 'Hindi',   value: 75, color: '#f59e0b' },
  { label: 'SST',     value: 74, color: '#f59e0b' },
]

const TIMETABLE = [
  { time: '9:00',  sub: 'Maths',   teacher: 'Mr. Verma',  current: true  },
  { time: '10:00', sub: 'Science', teacher: 'Ms. Reddy',  current: false },
  { time: '11:00', sub: 'English', teacher: 'Mr. Das',    current: false },
  { time: '12:00', sub: 'Lunch Break', teacher: '',       current: false },
  { time: '1:00',  sub: 'History', teacher: 'Ms. Joshi',  current: false },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-800 text-2xl">My Dashboard 📚</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]}!</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Attendance"   value="91%"  color="text-accent-green" changeType="up"   change="32/35 days" />
        <StatCard label="Avg Marks"    value="78%"  color="text-accent-amber" />
        <StatCard label="Due Assignments" value={3} color="text-red-400"    changeType="down" change="this week" />
        <StatCard label="Fee Status"   value="Paid" color="text-accent-green" change="Next: May 30" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Subject Performance" />
          <div className="flex items-center gap-6 mb-4">
            <ProgressRing value={91} size={80} color="#10b981" />
            <div className="text-sm text-gray-400">Attendance — 91%<br /><span className="text-xs text-gray-600">32 present / 3 absent</span></div>
          </div>
          <BarChart data={SUBJECTS.map(s => ({ label: s.label, value: s.value, color: s.color }))} />
          <div className="mt-4">
            <Button variant="accent" size="sm" onClick={() => navigate('/dashboard/ai')} className="w-full">
              🤖 Get AI Study Plan for Weak Subjects
            </Button>
          </div>
        </Card>
        <Card>
          <CardHeader title="Today's Timetable" />
          <div className="space-y-1.5">
            {TIMETABLE.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${t.current ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-dark-700/30'}`}>
                <span className="text-xs text-gray-500 w-12 shrink-0">{t.time}</span>
                <span className={`font-500 flex-1 ${t.current ? 'text-primary-300' : 'text-gray-300'}`}>
                  {t.sub} {t.current && '← Now'}
                </span>
                <span className="text-xs text-gray-600">{t.teacher}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
