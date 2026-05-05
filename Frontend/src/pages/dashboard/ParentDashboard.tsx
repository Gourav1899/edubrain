import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StatCard, Card, CardHeader, Badge, Button, BarChart } from '../../components/ui'

export default function ParentDashboard() {
  const navigate = useNavigate()
  return (
    <div className="space-y-5">
      <h1 className="font-display font-800 text-2xl">My Child's Dashboard 👶</h1>
      {/* Child card */}
      <div className="flex items-center gap-4 p-5 glass rounded-xl border-gradient">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center text-2xl font-800">AS</div>
        <div className="flex-1">
          <div className="font-display font-700 text-lg">Aarav Singh</div>
          <div className="text-gray-500 text-sm">Class 10-A · Roll #1001</div>
        </div>
        <Badge variant="green" dot>Active Student</Badge>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Attendance" value="91%" color="text-accent-green" />
        <StatCard label="Last Result" value="78%" color="text-accent-amber" />
        <StatCard label="Fee Status" value="Paid" color="text-accent-green" />
      </div>
      <Card>
        <CardHeader title="🤖 AI Performance Summary" action={<button onClick={() => navigate('/dashboard/ai')} className="text-xs text-primary-400">Ask AI →</button>} />
        <div className="p-4 bg-primary-500/[0.06] border border-primary-500/20 rounded-xl text-sm text-gray-300 leading-relaxed">
          Aarav is performing well with 91% attendance. He excels in English (91%) but needs focused attention in Maths (68%). We recommend additional practice sessions for Algebra. His Science score improved by 8% this month — great progress! 🎉
        </div>
      </Card>
      <Card>
        <CardHeader title="Subject Performance" />
        <BarChart data={[
          { label: 'Maths', value: 68, color: '#ef4444' }, { label: 'Science', value: 82, color: '#f59e0b' },
          { label: 'English', value: 91, color: '#10b981' }, { label: 'Hindi', value: 75, color: '#f59e0b' },
        ]} />
      </Card>
    </div>
  )
}
