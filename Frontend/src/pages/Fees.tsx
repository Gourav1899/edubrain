import { useState } from 'react'
import { DollarSign, Send, FileText, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, StatCard, Badge, Avatar, Button, Modal, Input, Select } from '../components/ui'
import toast from 'react-hot-toast'

const FEES = [
  { id:'1', name:'Aarav Singh',  cls:'10-A', amount:8500, paid:8500, due:'Apr 30', status:'paid',    method:'UPI' },
  { id:'2', name:'Nisha Kapoor', cls:'9-B',  amount:8500, paid:8500, due:'Apr 30', status:'paid',    method:'Online' },
  { id:'3', name:'Rohit Kumar',  cls:'8-A',  amount:7200, paid:0,    due:'Apr 15', status:'overdue', method:'' },
  { id:'4', name:'Vikram Gupta', cls:'7-A',  amount:7200, paid:3600, due:'Apr 20', status:'partial', method:'Cash' },
  { id:'5', name:'Priya Sinha',  cls:'9-B',  amount:8500, paid:0,    due:'Apr 30', status:'pending', method:'' },
]

export default function FeesPage() {
  const [collectOpen, setCollectOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState<any>(null)
  const collected = FEES.reduce((s,f) => s + f.paid, 0)
  const pending = FEES.reduce((s,f) => s + (f.amount - f.paid), 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-800 text-2xl">Fee Management</h1><p className="text-gray-500 text-sm">April 2026</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" icon={<Send className="w-4 h-4" />} onClick={() => toast.success('Reminders sent to 48 parents!')}>Send Reminders</Button>
          <Button variant="accent" size="md" icon={<FileText className="w-4 h-4" />} onClick={() => toast('PDF report coming soon!')}>Export Report</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Collected" value={'₹' + (collected/1000).toFixed(0) + 'K'} color="text-accent-green" changeType="up" change="This month" />
        <StatCard label="Pending"         value={'₹' + (pending/1000).toFixed(0) + 'K'} color="text-red-400" changeType="down" change="48 students" />
        <StatCard label="This Week"       value="₹48K" color="text-accent-amber" changeType="up" change="+12%" />
        <StatCard label="Defaulters"      value={FEES.filter(f=>f.status!=='paid').length} color="text-red-400" />
      </div>
      <Card>
        <CardHeader title="Fee Records" action={<button onClick={()=>toast.success('Late fee applied!')} className="text-xs text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/>Apply Late Fee</button>} />
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Class</th><th>Amount</th><th>Paid</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {FEES.map(f=>(
                <tr key={f.id}>
                  <td><div className="flex items-center gap-2.5"><Avatar name={f.name} size="sm" /><span className="font-500 text-sm">{f.name}</span></div></td>
                  <td className="text-gray-400 text-sm">Class {f.cls}</td>
                  <td className="font-700 text-sm">₹{f.amount.toLocaleString()}</td>
                  <td className={`font-700 text-sm ${f.paid===f.amount?'text-accent-green':f.paid>0?'text-amber-400':'text-red-400'}`}>₹{f.paid.toLocaleString()}</td>
                  <td className="text-gray-400 text-sm">{f.due}</td>
                  <td><Badge variant={f.status==='paid'?'green':f.status==='overdue'?'red':'amber'} dot>{f.status}</Badge></td>
                  <td>
                    {f.status!=='paid'
                      ? <Button variant="primary" size="sm" onClick={()=>{setSelectedFee(f);setCollectOpen(true)}}>Collect</Button>
                      : <button onClick={()=>toast.success('Receipt downloaded!')} className="text-xs text-gray-500 hover:text-gray-300">Receipt</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={collectOpen} onClose={()=>setCollectOpen(false)} title="Collect Fee" size="sm">
        {selectedFee && (
          <div className="space-y-4">
            <div className="p-3 bg-dark-700 rounded-xl text-sm">
              <div className="font-600">{selectedFee.name} — Class {selectedFee.cls}</div>
              <div className="text-gray-500 mt-1">Total: ₹{selectedFee.amount} | Paid: ₹{selectedFee.paid} | Due: ₹{selectedFee.amount - selectedFee.paid}</div>
            </div>
            <Input label="Amount to Collect (₹)" type="number" defaultValue={selectedFee.amount - selectedFee.paid} />
            <Select label="Payment Method" options={[{value:'cash',label:'Cash'},{value:'upi',label:'UPI'},{value:'online',label:'Online/NEFT'},{value:'cheque',label:'Cheque'}]} />
            <Input label="Transaction ID (optional)" placeholder="UPI/NEFT reference" />
            <div className="flex gap-3">
              <Button variant="accent" onClick={()=>{setCollectOpen(false);toast.success('Fee collected! Receipt generated.')}} className="flex-1">Collect & Generate Receipt</Button>
              <Button variant="outline" onClick={()=>setCollectOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
