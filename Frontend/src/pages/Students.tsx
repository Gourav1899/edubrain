import { useState } from 'react'
import { Search, Plus, Download, Upload } from 'lucide-react'
import { Card, CardHeader, Badge, Avatar, Button, Modal, Input, Select, QuickAction } from '../components/ui'
import toast from 'react-hot-toast'

const STUDENTS = [
  { id: '1', name: 'Aarav Singh',  cls: '10-A', roll: 1, admNo: '#1001', att: 91, fee: 'paid',    status: 'active' },
  { id: '2', name: 'Nisha Kapoor', cls: '9-B',  roll: 2, admNo: '#1002', att: 88, fee: 'paid',    status: 'active' },
  { id: '3', name: 'Rohit Kumar',  cls: '8-A',  roll: 3, admNo: '#1003', att: 67, fee: 'overdue', status: 'risk'   },
  { id: '4', name: 'Pooja Mishra', cls: '10-B', roll: 4, admNo: '#1004', att: 94, fee: 'paid',    status: 'active' },
  { id: '5', name: 'Vikram Gupta', cls: '7-A',  roll: 5, admNo: '#1005', att: 79, fee: 'partial', status: 'fee_due'},
]

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const filtered = STUDENTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.cls.includes(search))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-800 text-2xl">Student Management</h1><p className="text-gray-500 text-sm">1,248 total students</p></div>
        <div className="flex gap-2">
          <QuickAction icon={<Upload className="w-3.5 h-3.5" />} label="Import CSV" onClick={() => toast('CSV import coming soon!')} />
          <Button variant="accent" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>Add Student</Button>
        </div>
      </div>
      <Card>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, class, roll..." className="w-full input input-md pl-9" />
          </div>
          <select className="input input-md w-40 appearance-none cursor-pointer"><option>All Classes</option><option>Class 10</option><option>Class 9</option><option>Class 8</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Class</th><th>Adm. No.</th><th>Attendance</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><div className="flex items-center gap-2.5"><Avatar name={s.name} size="sm" /><span className="font-500 text-sm">{s.name}</span></div></td>
                  <td className="text-gray-400 text-sm">Class {s.cls}</td>
                  <td className="text-gray-500 text-sm font-mono">{s.admNo}</td>
                  <td><span className={`font-700 text-sm ${s.att < 75 ? 'text-red-400' : s.att < 85 ? 'text-amber-400' : 'text-accent-green'}`}>{s.att}%</span></td>
                  <td><Badge variant={s.fee === 'paid' ? 'green' : s.fee === 'overdue' ? 'red' : 'amber'}>{s.fee}</Badge></td>
                  <td><Badge variant={s.status === 'active' ? 'green' : s.status === 'risk' ? 'red' : 'amber'} dot>{s.status.replace('_', ' ')}</Badge></td>
                  <td><div className="flex gap-2 text-xs"><button className="text-primary-400 hover:text-primary-300">View</button><button className="text-gray-500 hover:text-gray-300">Edit</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Student" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name *" placeholder="Student full name" />
          <Input label="Admission Number *" placeholder="ADM2024001" />
          <Select label="Class *" options={[{value:'',label:'Select'},{value:'10',label:'Class 10'},{value:'9',label:'Class 9'},{value:'8',label:'Class 8'}]} />
          <Select label="Section" options={[{value:'A',label:'A'},{value:'B',label:'B'},{value:'C',label:'C'}]} />
          <Input label="Email" type="email" placeholder="student@email.com" />
          <Input label="Parent Phone" type="tel" placeholder="+91 98765 43210" />
          <Input label="Date of Birth" type="date" />
          <Select label="Gender" options={[{value:'',label:'Select'},{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other'}]} />
        </div>
        <div className="flex gap-3 mt-5"><Button variant="accent" onClick={() => { setAddOpen(false); toast.success('Student added!') }} className="flex-1">Add Student</Button><Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button></div>
      </Modal>
    </div>
  )
}
