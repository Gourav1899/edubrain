import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card, CardHeader, Badge, Avatar, Button, Modal, Input, Select } from '../components/ui'
import toast from 'react-hot-toast'

const TEACHERS = [
  { id:'1', name:'Mr. Ramesh Verma',  subject:'Mathematics', classes:['10-A','9-B','8-A'], empId:'TCH001', exp:8, status:'active' },
  { id:'2', name:'Ms. Sunita Reddy',  subject:'Science',     classes:['9-A','9-B'],         empId:'TCH002', exp:5, status:'active' },
  { id:'3', name:'Mr. Vijay Das',     subject:'English',     classes:['10-A','10-B'],       empId:'TCH003', exp:12, status:'active' },
  { id:'4', name:'Ms. Rekha Joshi',   subject:'History',     classes:['8-A','7-A'],         empId:'TCH004', exp:6, status:'active' },
  { id:'5', name:'Mr. Anil Kumar',    subject:'Physics',     classes:['11-A','12-A'],       empId:'TCH005', exp:9, status:'on_leave' },
]

export default function TeachersPage() {
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const filtered = TEACHERS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-800 text-2xl">Teacher Management</h1><p className="text-gray-500 text-sm">86 total teachers</p></div>
        <Button variant="accent" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>Add Teacher</Button>
      </div>
      <Card>
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or subject..." className="w-full input input-md pl-9" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Teacher</th><th>Subject</th><th>Classes</th><th>Emp ID</th><th>Experience</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(t=>(
                <tr key={t.id}>
                  <td><div className="flex items-center gap-2.5"><Avatar name={t.name} size="sm" color="from-emerald-600 to-cyan-700" /><span className="font-500 text-sm">{t.name}</span></div></td>
                  <td className="text-gray-300 text-sm">{t.subject}</td>
                  <td className="text-gray-400 text-sm">{t.classes.join(', ')}</td>
                  <td className="text-gray-500 text-sm font-mono">{t.empId}</td>
                  <td className="text-gray-400 text-sm">{t.exp} years</td>
                  <td><Badge variant={t.status==='active'?'green':'amber'} dot>{t.status.replace('_',' ')}</Badge></td>
                  <td><div className="flex gap-2 text-xs"><button className="text-primary-400 hover:text-primary-300">View</button><button className="text-gray-500 hover:text-gray-300">Edit</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Add New Teacher" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Name *" placeholder="Teacher name" />
          <Input label="Employee ID *" placeholder="TCH2024001" />
          <Input label="Email *" type="email" placeholder="teacher@school.com" />
          <Input label="Phone *" type="tel" placeholder="+91 98765 43210" />
          <Select label="Primary Subject *" options={['Mathematics','Science','English','Hindi','Social Science','Physics','Chemistry','Biology','Computer Science'].map(v=>({value:v,label:v}))} />
          <Input label="Qualification" placeholder="M.Sc Mathematics, B.Ed" />
          <Input label="Experience (years)" type="number" placeholder="5" />
          <Select label="Designation" options={['Teacher','Senior Teacher','Head of Department','Coordinator'].map(v=>({value:v,label:v}))} />
        </div>
        <div className="flex gap-3 mt-5"><Button variant="accent" onClick={()=>{setAddOpen(false);toast.success('Teacher added!')}} className="flex-1">Add Teacher</Button><Button variant="outline" onClick={()=>setAddOpen(false)}>Cancel</Button></div>
      </Modal>
    </div>
  )
}
