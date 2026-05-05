import { motion } from 'framer-motion'
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react'
import { Card, CardHeader, BarChart, StatCard, Button, QuickAction } from '../components/ui'
import toast from 'react-hot-toast'

const REPORT_TYPES = [
  { icon:'📊', title:'Attendance Report', sub:'Month/class/student-wise', color:'from-primary-600 to-primary-800' },
  { icon:'💰', title:'Fee Report',        sub:'Collection & pending',      color:'from-emerald-600 to-emerald-800' },
  { icon:'📝', title:'Result Report',     sub:'Exam performance analysis', color:'from-cyan-600 to-cyan-800' },
  { icon:'🔮', title:'ML Risk Report',    sub:'Fail & dropout predictions', color:'from-violet-600 to-violet-800' },
  { icon:'👨‍🏫', title:'Teacher Report',   sub:'Performance & attendance', color:'from-amber-600 to-amber-800' },
  { icon:'📚', title:'Library Report',    sub:'Issue/return & fines',      color:'from-pink-600 to-pink-800' },
]

const MONTHLY_ATT = [
  { label: 'Jan', value: 89 }, { label: 'Feb', value: 91 }, { label: 'Mar', value: 88 },
  { label: 'Apr', value: 94 }, { label: 'May', value: 87 },
]

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl flex items-center gap-2"><BarChart3 className="w-6 h-6 text-accent-cyan" /> Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Generate detailed reports for any time period</p>
        </div>
        <div className="flex gap-2">
          <select className="input input-sm appearance-none cursor-pointer w-28 text-xs"><option>April 2026</option><option>March 2026</option><option>Feb 2026</option></select>
          <Button variant="accent" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={() => toast.success('Report exported as PDF!')}>Export All</Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Overall Attendance" value="91.4%" color="text-accent-green" changeType="up" change="+2.3% vs last month" />
        <StatCard label="Fee Collection"     value="₹4.2L" color="text-accent-amber" changeType="up" change="+₹48K this week" />
        <StatCard label="Exam Pass Rate"     value="94.2%" color="text-primary-400" changeType="up" change="+1.8%" />
        <StatCard label="AI Queries"         value="2,847" color="text-accent-violet" change="This month" />
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((r, i) => (
          <motion.div key={r.title} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
            className="glass glass-hover p-5 cursor-pointer" onClick={() => toast.success(`${r.title} generating... PDF will download shortly`)}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-xl mb-3`}>{r.icon}</div>
            <div className="font-display font-700 text-sm mb-1">{r.title}</div>
            <div className="text-xs text-gray-500 mb-3">{r.sub}</div>
            <div className="flex items-center gap-2 text-xs text-primary-400 font-600">
              <FileText className="w-3 h-3" /> Generate PDF
            </div>
          </motion.div>
        ))}
      </div>

      {/* Monthly attendance trend */}
      <Card>
        <CardHeader title="Monthly Attendance Trend — 2026" action={<button onClick={() => toast.success('Chart exported!')} className="text-xs text-primary-400">Export</button>} />
        <BarChart data={MONTHLY_ATT} />
      </Card>
    </div>
  )
}
