import { useState } from 'react'
import { Library, Plus, RotateCcw } from 'lucide-react'
import { Card, CardHeader, Badge, StatCard, Button, Modal, Input } from '../components/ui'
import toast from 'react-hot-toast'

const BOOKS = [
  { id:'1', title:'Mathematics NCERT Class 10', author:'NCERT', isbn:'978-81-7450-1', category:'Textbook', total:5, available:3, issued_to:'Rohit Kumar' },
  { id:'2', title:'Wings of Fire',              author:'APJ Abdul Kalam', isbn:'978-81-7371-1', category:'Biography', total:3, available:1, issued_to:'Priya Sinha' },
  { id:'3', title:'Science NCERT Class 9',      author:'NCERT', isbn:'978-81-7450-2', category:'Textbook', total:8, available:6, issued_to:'' },
  { id:'4', title:'The Alchemist',              author:'Paulo Coelho', isbn:'978-00-6231-6', category:'Fiction', total:2, available:0, issued_to:'Aarav Singh' },
]

export default function LibraryPage() {
  const [addOpen, setAddOpen] = useState(false)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-800 text-2xl flex items-center gap-2"><Library className="w-6 h-6 text-accent-cyan" /> Library Management</h1></div>
        <Button variant="accent" size="md" icon={<Plus className="w-4 h-4" />} onClick={()=>setAddOpen(true)}>Add Book</Button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total Books"    value={BOOKS.reduce((s,b)=>s+b.total,0)}     color="text-primary-400" />
        <StatCard label="Available"      value={BOOKS.reduce((s,b)=>s+b.available,0)} color="text-accent-green" />
        <StatCard label="Issued"         value={BOOKS.filter(b=>b.available<b.total).length} color="text-accent-amber" />
        <StatCard label="Overdue"        value={2}                                     color="text-red-400" />
      </div>
      <Card>
        <CardHeader title="Book Catalogue" />
        <table className="data-table">
          <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>Available</th><th>Issued To</th><th>Action</th></tr></thead>
          <tbody>
            {BOOKS.map(b=>(
              <tr key={b.id}>
                <td className="font-500 text-sm">{b.title}</td>
                <td className="text-gray-400 text-sm">{b.author}</td>
                <td><Badge variant="blue">{b.category}</Badge></td>
                <td><span className={b.available===0?'text-red-400':'text-accent-green'}>{b.available}/{b.total}</span></td>
                <td className="text-gray-400 text-sm">{b.issued_to || '—'}</td>
                <td>
                  {b.available > 0
                    ? <button onClick={()=>toast.success(`${b.title} issued!`)} className="text-xs text-primary-400 hover:text-primary-300">Issue</button>
                    : <button onClick={()=>toast.success(`${b.title} returned!`)} className="text-xs text-accent-green hover:text-green-300 flex items-center gap-1"><RotateCcw className="w-3 h-3" />Return</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Add New Book" size="sm">
        <div className="space-y-3">
          <Input label="Book Title *" placeholder="Book title" />
          <Input label="Author *" placeholder="Author name" />
          <Input label="ISBN" placeholder="978-xxx-xxx-x" />
          <Input label="Total Copies" type="number" placeholder="5" />
          <Button variant="accent" onClick={()=>{setAddOpen(false);toast.success('Book added!')}} className="w-full">Add Book</Button>
        </div>
      </Modal>
    </div>
  )
}
