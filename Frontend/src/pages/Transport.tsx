import { Truck, Plus, MapPin, Phone } from 'lucide-react'
import { Card, CardHeader, StatCard, Button, Badge } from '../components/ui'
import toast from 'react-hot-toast'

const ROUTES = [
  { id:'1', name:'Route A — Dwarka',        driver:'Ram Singh',    phone:'+91 98765 11111', vehicle:'DL1AB1234', students:42, capacity:50, fee:1200 },
  { id:'2', name:'Route B — Rohini',        driver:'Suresh Kumar', phone:'+91 98765 22222', vehicle:'DL1AB5678', students:38, capacity:45, fee:1500 },
  { id:'3', name:'Route C — Gurgaon',       driver:'Mohan Lal',   phone:'+91 98765 33333', vehicle:'DL1AB9012', students:31, capacity:40, fee:2000 },
  { id:'4', name:'Route D — Faridabad',     driver:'Anil Sharma',  phone:'+91 98765 44444', vehicle:'DL1AB3456', students:28, capacity:40, fee:1800 },
]

export default function TransportPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-800 text-2xl flex items-center gap-2"><Truck className="w-6 h-6 text-accent-amber" /> Transport Management</h1></div>
        <Button variant="accent" size="md" icon={<Plus className="w-4 h-4" />} onClick={()=>toast('Add route coming soon!')}>Add Route</Button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total Routes"    value={ROUTES.length} color="text-primary-400" />
        <StatCard label="Total Students"  value={ROUTES.reduce((s,r)=>s+r.students,0)} color="text-accent-cyan" />
        <StatCard label="Fleet Size"      value={ROUTES.length} color="text-accent-amber" />
        <StatCard label="Route Revenue"   value={'₹' + (ROUTES.reduce((s,r)=>s+r.students*r.fee,0)/1000).toFixed(0)+'K'} color="text-accent-green" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROUTES.map((r,i)=>(
          <Card key={r.id} hover>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl">🚌</div>
                <div>
                  <div className="font-display font-700 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.vehicle}</div>
                </div>
              </div>
              <Badge variant={r.students/r.capacity > 0.8 ? 'amber' : 'green'}>{r.students}/{r.capacity} seats</Badge>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-gray-400"><span>👤</span><span>{r.driver}</span></div>
              <div className="flex items-center gap-2 text-gray-400"><Phone className="w-3.5 h-3.5" /><span>{r.phone}</span></div>
              <div className="flex items-center gap-2 text-gray-400"><span>💰</span><span>₹{r.fee}/month per student</span></div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>toast('GPS tracking coming soon!')} className="text-xs text-primary-400">Track Bus</button>
              <button onClick={()=>toast('Students list loading...')} className="text-xs text-gray-500">View Students</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
