import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, CheckCircle, Brain } from 'lucide-react'
import { StatCard, Card, CardHeader, Badge, Avatar, Button } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const PREDICTIONS = [
  { id:'1', name:'Rohit Kumar',  cls:'8-A', att:67, marks:58, assignment:40, risk:'high',   fail:82, drop:58, recommendation:'Contact parents immediately. Schedule counselling session. Assign peer tutor for Maths.' },
  { id:'2', name:'Aryan Mehta',  cls:'7-C', att:75, marks:62, assignment:55, risk:'medium', fail:54, drop:38, recommendation:'Extra coaching for Science needed. Monitor attendance weekly. Engage parents.' },
  { id:'3', name:'Priya Sinha',  cls:'9-B', att:73, marks:65, assignment:80, risk:'medium', fail:48, drop:30, recommendation:'Attendance counselling required. Performance is improving — encourage more.' },
  { id:'4', name:'Aarav Singh',  cls:'10-A', att:91, marks:78, assignment:90, risk:'low',   fail:8,  drop:4,  recommendation:'Student is performing well. Continue monitoring.' },
  { id:'5', name:'Nisha Kapoor', cls:'9-B', att:88, marks:82, assignment:85, risk:'low',   fail:6,  drop:3,  recommendation:'Excellent student. On track for top grades.' },
]

const riskColor: Record<string, any> = { high: 'red', medium: 'amber', low: 'green' }

export default function MLPredictions() {
  const navigate = useNavigate()
  const high = PREDICTIONS.filter(p=>p.risk==='high').length
  const medium = PREDICTIONS.filter(p=>p.risk==='medium').length
  const low = PREDICTIONS.filter(p=>p.risk==='low').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl flex items-center gap-2"><Brain className="w-6 h-6 text-accent-violet" /> ML Risk Predictions</h1>
          <p className="text-gray-500 text-sm mt-0.5">AI analyzes attendance, marks & behavior to predict at-risk students</p>
        </div>
        <Button variant="outline" size="md" onClick={() => toast('Full ML report PDF coming soon!')}>Export Report</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="High Risk"   value={high}   color="text-red-400"       changeType="down" change="Immediate action" />
        <StatCard label="Medium Risk" value={medium} color="text-accent-amber"  change="Monitor closely" />
        <StatCard label="Low Risk"    value={low}    color="text-accent-green"  changeType="up"   change="All good" />
      </div>

      <Card>
        <CardHeader title="At-Risk Students — Detailed Analysis" action={<button onClick={() => navigate('/dashboard/ai')} className="text-xs text-primary-400">AI Tools →</button>} />
        <div className="space-y-4">
          {PREDICTIONS.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
              className="p-4 bg-dark-700/40 rounded-xl border border-white/[0.04]"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={p.name} size="sm" color={p.risk==='high'?'from-red-600 to-red-800':p.risk==='medium'?'from-amber-500 to-orange-600':'from-emerald-600 to-emerald-800'} />
                <div className="flex-1">
                  <div className="font-600 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">Class {p.cls}</div>
                </div>
                <Badge variant={riskColor[p.risk]} dot>{p.risk === 'high' ? '🔴 High Risk' : p.risk === 'medium' ? '🟡 Medium Risk' : '🟢 Low Risk'}</Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                {[['Attendance', p.att+'%', p.att<75?'text-red-400':p.att<85?'text-amber-400':'text-accent-green'],['Avg Marks', p.marks+'%', p.marks<60?'text-red-400':p.marks<75?'text-amber-400':'text-accent-green'],['Assignments', p.assignment+'%', p.assignment<60?'text-red-400':p.assignment<75?'text-amber-400':'text-accent-green']].map(([l,v,c])=>(
                  <div key={l as string} className="bg-dark-700 rounded-lg py-2 px-3">
                    <div className="text-[10px] text-gray-600 uppercase">{l}</div>
                    <div className={`font-display font-800 text-base ${c}`}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Risk bars */}
              <div className="space-y-1.5 mb-3">
                {[['Fail Probability', p.fail, '#ef4444'],['Dropout Probability', p.drop, '#f59e0b']].map(([label, val, col]) => (
                  <div key={label as string} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-600 w-32">{label as string}</span>
                    <div className="flex-1 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{background: col as string}} initial={{width:0}} animate={{width:`${val}%`}} transition={{delay:0.3, duration:0.8}} />
                    </div>
                    <span className="font-700 w-8" style={{color: col as string}}>{val}%</span>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="flex items-start gap-2 p-2.5 bg-primary-500/[0.06] border border-primary-500/15 rounded-lg">
                <Brain className="w-3.5 h-3.5 text-primary-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">{p.recommendation}</p>
              </div>
              {p.risk !== 'low' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => toast.success(`SMS sent to ${p.name}'s parent`)} className="text-xs text-primary-400 hover:text-primary-300">Notify Parent</button>
                  <button onClick={() => toast.success('Counselling session scheduled')} className="text-xs text-gray-500 hover:text-gray-300">Schedule Counselling</button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
