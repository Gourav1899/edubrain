import { Card, CardHeader, Badge } from '../components/ui'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const PERIODS = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00']
const SCHEDULE: Record<string, string[]> = {
  Monday:    ['Mathematics','Science','English','Lunch','History','Computer'],
  Tuesday:   ['Hindi','Mathematics','Science','Lunch','English','Art'],
  Wednesday: ['Science','History','Mathematics','Lunch','Hindi','Physical Ed'],
  Thursday:  ['English','Mathematics','Hindi','Lunch','Science','Computer'],
  Friday:    ['History','Science','English','Lunch','Mathematics','Assembly'],
  Saturday:  ['Mathematics','Hindi','Science','Lunch','English',''],
}
const subjectColors: Record<string, string> = {
  Mathematics:'from-primary-600 to-primary-800', Science:'from-cyan-600 to-cyan-800',
  English:'from-emerald-600 to-emerald-800', Hindi:'from-amber-600 to-amber-800',
  History:'from-violet-600 to-violet-800', Computer:'from-pink-600 to-pink-800',
  'Physical Ed':'from-green-600 to-green-800', Art:'from-orange-600 to-orange-800',
  Assembly:'from-slate-600 to-slate-800',
}
const today = DAYS[new Date().getDay() - 1] ?? 'Monday'

export default function TimetablePage() {
  return (
    <div className="space-y-5">
      <div><h1 className="font-display font-800 text-2xl">Timetable — Class 10-A</h1><p className="text-gray-500 text-sm">Academic Year 2025-26</p></div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-700 text-gray-600 uppercase tracking-wider border-b border-white/[0.06] w-20">Period</th>
              {DAYS.map(d=><th key={d} className={`p-3 text-left text-xs font-700 uppercase tracking-wider border-b border-white/[0.06] ${d===today?'text-primary-400':'text-gray-600'}`}>{d}{d===today&&' ✦'}</th>)}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((time, pi)=>(
              <tr key={time}>
                <td className="p-3 text-xs text-gray-600 border-b border-white/[0.04] font-mono">{time}</td>
                {DAYS.map(day=>{
                  const sub = SCHEDULE[day]?.[pi] ?? ''
                  if (sub === 'Lunch') return <td key={day} className="p-2 border-b border-white/[0.04]"><div className="bg-dark-700/40 rounded-lg py-2 text-center text-xs text-gray-600">🍱 Lunch</div></td>
                  if (!sub) return <td key={day} className="p-2 border-b border-white/[0.04]" />
                  const isNow = day === today && pi === new Date().getHours() - 9
                  const gradient = subjectColors[sub] ?? 'from-slate-600 to-slate-800'
                  return (
                    <td key={day} className="p-2 border-b border-white/[0.04]">
                      <div className={`rounded-lg p-2 ${isNow?'ring-2 ring-primary-500/50':''}`} style={{background: isNow ? 'rgba(79,70,229,0.15)' : 'rgba(255,255,255,0.03)'}}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient} mb-1`} />
                        <div className={`text-xs font-600 ${isNow?'text-primary-300':'text-gray-300'}`}>{sub}</div>
                        {isNow && <div className="text-[10px] text-primary-400 font-600 mt-0.5">NOW</div>}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
