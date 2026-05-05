import { useState } from 'react'
import { Bell, Plus, Pin } from 'lucide-react'
import { Card, CardHeader, Badge, Button, Modal, Input, Select, Textarea } from '../components/ui'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const NOTICES = [
  { id:'1', title:'⚠️ Fee Payment Deadline — April 30', body:'All pending fees must be cleared by April 30. Late fee of 5% will be applied after deadline.', category:'fee', pinned:true, date:'3 days ago', target:'All students & parents' },
  { id:'2', title:'🏆 Annual Sports Day — May 5, 2026', body:'Annual Sports Day will be held on May 5. All students must participate. Wear sports uniform.', category:'event', pinned:false, date:'2 hours ago', target:'All students' },
  { id:'3', title:'📋 Mid-term Exam Schedule Released', body:'Mid-term examinations will begin from May 10. Detailed schedule available in the app.', category:'exam', pinned:false, date:'Yesterday', target:'Class 9 & 10' },
  { id:'4', title:'📚 Holiday on May 1 — Labour Day', body:'The institute will remain closed on May 1, 2026 on account of International Labour Day.', category:'holiday', pinned:false, date:'4 days ago', target:'All' },
]

const catColor: Record<string, any> = { fee:'red', event:'green', exam:'amber', holiday:'blue', general:'gray', urgent:'red' }

export default function NoticesPage() {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-800 text-2xl">Notice Board</h1><p className="text-gray-500 text-sm">{NOTICES.length} active notices</p></div>
        <Button variant="accent" size="md" icon={<Plus className="w-4 h-4" />} onClick={()=>setAddOpen(true)}>Create Notice</Button>
      </div>
      <div className="space-y-3">
        {NOTICES.map((n,i)=>(
          <motion.div key={n.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
            <Card hover>
              <div className="flex items-start gap-3">
                {n.pinned && <Pin className="w-3.5 h-3.5 text-primary-400 mt-0.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-display font-700 text-sm">{n.title}</span>
                    <Badge variant={catColor[n.category]??'blue'}>{n.category}</Badge>
                    {n.pinned && <Badge variant="violet">Pinned</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{n.body}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span>📅 {n.date}</span>
                    <span>👥 {n.target}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={()=>toast.success('Notice sent via SMS/WhatsApp!')} className="text-xs text-primary-400 hover:text-primary-300">Send Alert</button>
                  <button onClick={()=>toast.success('Notice deleted')} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Create Notice" size="md">
        <div className="space-y-4">
          <Input label="Title *" placeholder="Notice title" />
          <Select label="Category" options={['general','exam','fee','holiday','event','urgent'].map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)}))} />
          <Select label="Target Audience" options={[{value:'all',label:'Everyone'},{value:'students',label:'Students only'},{value:'parents',label:'Parents only'},{value:'teachers',label:'Teachers only'}]} />
          <Textarea label="Message" placeholder="Notice content..." />
          <div className="flex gap-3">
            <Button variant="accent" onClick={()=>{setAddOpen(false);toast.success('Notice posted and notifications sent!')}} className="flex-1">Post Notice</Button>
            <Button variant="outline" onClick={()=>setAddOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
