import { useState } from 'react'
import { Camera, Save, LogOut } from 'lucide-react'
import { Card, CardHeader, Input, Select, Button, Avatar, Badge } from '../components/ui'
import { useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')

  const save = () => toast.success('Profile updated successfully!')
  const handleLogout = () => { logout(); navigate('/login'); toast.success('Logged out') }

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="font-display font-800 text-2xl">My Profile</h1>
      <Card>
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="relative">
            <Avatar name={user?.name ?? 'U'} size="lg" />
            <button onClick={() => toast('Photo upload coming soon!')} className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <div className="font-display font-700 text-lg">{user?.name}</div>
            <div className="text-gray-500 text-sm capitalize">{user?.role?.replace('_',' ')}</div>
            <Badge variant="green" dot className="mt-1">Active</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Full Name" value={name} onChange={e=>setName(e.target.value)} /></div>
          <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input label="Phone" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98765 43210" />
          <Input label="Role" value={user?.role?.replace('_',' ') ?? ''} disabled />
          <Input label="Institute ID" value={user?.institute_id ?? ''} disabled />
        </div>
        <div className="flex gap-3 mt-5">
          <Button variant="accent" icon={<Save className="w-4 h-4" />} onClick={save}>Save Changes</Button>
          <Button variant="danger" icon={<LogOut className="w-4 h-4" />} onClick={handleLogout}>Logout</Button>
        </div>
      </Card>
    </div>
  )
}
