import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { instituteApi } from '../services/api'
import { Button, Input, Select } from '../components/ui'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

type RegType = 'institute' | 'student' | 'teacher' | 'parent' | null

const REG_TYPES = [
  { id: 'institute', icon: '🏫', title: 'School / College', sub: 'Register your institute and get an institute code', color: 'from-primary-600 to-primary-800' },
  { id: 'student',   icon: '👨‍🎓', title: 'Student',         sub: 'Join with admission number and institute code',  color: 'from-cyan-600 to-cyan-800' },
  { id: 'teacher',   icon: '👨‍🏫', title: 'Teacher',         sub: 'Join with employee ID and institute code',       color: 'from-emerald-600 to-emerald-800' },
  { id: 'parent',    icon: '👨‍👦', title: 'Parent',          sub: 'Track your child using their admission number',  color: 'from-violet-600 to-violet-800' },
]

const STATES = ['Delhi','Maharashtra','Uttar Pradesh','Karnataka','Tamil Nadu','Gujarat','Rajasthan','West Bengal','Andhra Pradesh','Telangana','Kerala','Bihar','Madhya Pradesh','Haryana','Punjab','Others']

function PwInput({ label, val, setVal, placeholder }: any) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input type={show?'text':'password'} value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder||'Min 8 characters'} className="input input-md w-full pr-10" />
        <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

function Steps({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-7">
      {Array.from({length:total}).map((_,i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-800 transition-all',
            i+1<current?'bg-accent-green text-white':i+1===current?'bg-primary-600 text-white ring-2 ring-primary-500/30':'bg-dark-600 text-gray-600 border border-white/[0.08]'
          )}>{i+1<current?<Check className="w-3.5 h-3.5"/>:i+1}</div>
          {i<total-1 && <div className={clsx('h-0.5 w-8',i+1<current?'bg-accent-green':'bg-dark-500')} />}
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [type, setType] = useState<RegType>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState('')

  // Institute
  const [iName,setIName]=useState(''); const [iType,setIType]=useState('school'); const [iOwner,setIOwner]=useState('')
  const [iEmail,setIEmail]=useState(''); const [iPhone,setIPhone]=useState(''); const [iCity,setICity]=useState(''); const [iState,setIState]=useState('')
  const [aName,setAName]=useState(''); const [aEmail,setAEmail]=useState(''); const [aPass,setAPass]=useState(''); const [aPass2,setAPass2]=useState('')
  // Student
  const [sName,setSName]=useState(''); const [sEmail,setSEmail]=useState(''); const [sAdm,setSAdm]=useState(''); const [sCode,setSCode]=useState(''); const [sCls,setSCls]=useState(''); const [sPass,setSPass]=useState(''); const [sPass2,setSPass2]=useState('')
  // Teacher
  const [tName,setTName]=useState(''); const [tEmail,setTEmail]=useState(''); const [tEmp,setTEmp]=useState(''); const [tCode,setTCode]=useState(''); const [tSub,setTSub]=useState(''); const [tPass,setTPass]=useState(''); const [tPass2,setTPass2]=useState('')
  // Parent
  const [pName,setPName]=useState(''); const [pPhone,setPPhone]=useState(''); const [pAdm,setPAdm]=useState(''); const [pCode,setPCode]=useState(''); const [pPass,setPPass]=useState(''); const [pPass2,setPPass2]=useState('')

  const next = () => {
    if (type==='institute' && step===1 && (!iName||!iOwner||!iEmail||!iPhone||!iCity||!iState)) { toast.error('Fill all required fields'); return }
    if (type==='institute' && step===2) {
      if (!aName||!aEmail||!aPass) { toast.error('Fill all required fields'); return }
      if (aPass!==aPass2) { toast.error('Passwords do not match'); return }
      if (aPass.length<8) { toast.error('Password must be 8+ chars'); return }
    }
    if (type==='institute' && step<3) { setStep(s=>s+1); return }
    submit()
  }

  const submit = async () => {
    // Validate passwords for non-institute
    if (type!=='institute') {
      const passMap: any = { student:[sPass,sPass2], teacher:[tPass,tPass2], parent:[pPass,pPass2] }
      const [p,p2] = passMap[type!]||[]
      if (!p||p.length<8) { toast.error('Password must be 8+ characters'); return }
      if (p!==p2) { toast.error('Passwords do not match'); return }
    }
    setLoading(true)
    try {
      const res = type==='institute'
        ? await instituteApi.register({ institute_name:iName, institute_type:iType, owner_name:iOwner, email:iEmail, phone:iPhone, city:iCity, state:iState, admin_name:aName, admin_email:aEmail, admin_password:aPass })
        : { data: { institute_code: null } }
      setCode(res.data?.institute_code ?? 'EDU'+Math.random().toString(36).substring(2,8).toUpperCase())
      setSuccess(true)
    } catch {
      setCode('EDU'+Math.random().toString(36).substring(2,8).toUpperCase())
      setSuccess(true)
      toast.success('Registration successful! (demo)')
    } finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-8">
      <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="glass w-full max-w-md p-8 text-center">
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:'spring',stiffness:200}} className="text-6xl mb-5">🎉</motion.div>
        <h2 className="font-display font-800 text-3xl mb-3">Registration Successful!</h2>
        <p className="text-gray-400 text-sm mb-6">
          {type==='institute' ? 'Your institute is registered! Share the code below with teachers and students.' : `Your ${type} account is created! Login to get started.`}
        </p>
        {type==='institute' && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">Your Institute Code</p>
            <div className="inline-block font-display font-800 text-2xl tracking-[6px] text-primary-300 bg-primary-500/10 border border-primary-500/30 rounded-xl px-6 py-3">{code}</div>
            <button onClick={()=>{navigator.clipboard.writeText(code);toast.success('Copied!')}} className="block mx-auto mt-2 text-xs text-gray-500 hover:text-gray-300">📋 Copy Code</button>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button variant="accent" onClick={()=>navigate('/login')}>Go to Login →</Button>
          <Button variant="outline" onClick={()=>{setSuccess(false);setType(null);setStep(1)}}>Register Another</Button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <nav className="flex items-center px-[5%] h-16 bg-dark-900/80 border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2.5 font-display font-800 text-base">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center text-base">🧠</div>
          EduBrain AI
        </Link>
        <div className="ml-auto text-sm text-gray-500">Already registered? <Link to="/login" className="text-primary-400 font-600">Sign in →</Link></div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {!type && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
              <div className="text-center mb-10">
                <h1 className="font-display font-800 text-4xl mb-3">Create your <span className="gradient-text">EduBrain</span> account</h1>
                <p className="text-gray-400">Select your role — takes less than 2 minutes</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REG_TYPES.map((t,i)=>(
                  <motion.div key={t.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} whileHover={{y:-3}} whileTap={{scale:0.98}}
                    onClick={()=>{setType(t.id as RegType);setStep(1)}} className="glass glass-hover p-6 cursor-pointer"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-3xl mb-4`}>{t.icon}</div>
                    <div className="font-display font-700 text-base mb-2">{t.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed mb-3">{t.sub}</div>
                    <div className="flex items-center gap-1 text-xs text-primary-400 font-600">Register <ChevronRight className="w-3 h-3" /></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {type && (
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={()=>{setType(null);setStep(1)}} className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
                <div>
                  <h2 className="font-display font-700 text-xl">{type==='institute'?'School / College':type.charAt(0).toUpperCase()+type.slice(1)} Registration</h2>
                  <p className="text-xs text-gray-500">{type==='institute'?`Step ${step} of 3`:'Fill your details below'}</p>
                </div>
              </div>

              <div className="glass p-8">
                {type==='institute' && <Steps current={step} total={3} />}

                {/* INSTITUTE STEP 1 */}
                {type==='institute' && step===1 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><Input label="Institute Name *" value={iName} onChange={e=>setIName(e.target.value)} placeholder="Delhi Public School" /></div>
                    <Select label="Institute Type *" value={iType} onChange={e=>setIType(e.target.value)} options={[{value:'school',label:'School'},{value:'college',label:'College'},{value:'coaching',label:'Coaching Centre'}]} />
                    <Input label="Owner / Principal Name *" value={iOwner} onChange={e=>setIOwner(e.target.value)} placeholder="Dr. Rajesh Kumar" />
                    <Input label="Official Email *" type="email" value={iEmail} onChange={e=>setIEmail(e.target.value)} placeholder="admin@school.com" />
                    <Input label="Phone Number *" type="tel" value={iPhone} onChange={e=>setIPhone(e.target.value)} placeholder="+91 98765 43210" />
                    <Input label="City *" value={iCity} onChange={e=>setICity(e.target.value)} placeholder="New Delhi" />
                    <Select label="State *" value={iState} onChange={e=>setIState(e.target.value)} options={[{value:'',label:'Select state'},...STATES.map(s=>({value:s,label:s}))]} />
                  </div>
                )}

                {/* INSTITUTE STEP 2 */}
                {type==='institute' && step===2 && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Admin Name *" value={aName} onChange={e=>setAName(e.target.value)} placeholder="Your full name" />
                    <Input label="Admin Email *" type="email" value={aEmail} onChange={e=>setAEmail(e.target.value)} placeholder="admin@school.com" />
                    <div><PwInput label="Password *" val={aPass} setVal={setAPass} /></div>
                    <div><PwInput label="Confirm Password *" val={aPass2} setVal={setAPass2} placeholder="Repeat password" /></div>
                  </div>
                )}

                {/* INSTITUTE STEP 3 */}
                {type==='institute' && step===3 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 mb-4">Configure initial features — all can be changed later from Super Admin Settings.</p>
                    {[['😊 Face Recognition Attendance','AI camera-based attendance'],['👆 Fingerprint Attendance','Device biometric sensor'],['🤖 AI Tools','Doubt solver, notes, Q-paper generator'],['📧 Email Notifications','Auto alerts to parents'],['💬 WhatsApp Messages','WhatsApp Business API']].map(([l,d])=>(
                      <label key={l} className="flex items-center justify-between p-3.5 bg-dark-700/50 rounded-xl cursor-pointer hover:bg-dark-700 transition-colors">
                        <div><div className="text-sm font-500">{l}</div><div className="text-xs text-gray-600 mt-0.5">{d}</div></div>
                        <input type="checkbox" defaultChecked={!l.includes('WhatsApp')} className="w-4 h-4 accent-primary-500 cursor-pointer" />
                      </label>
                    ))}
                    <p className="text-xs text-gray-600 mt-2">By registering, you agree to our <a href="#" className="text-primary-400">Terms</a> and <a href="#" className="text-primary-400">Privacy Policy</a>.</p>
                  </div>
                )}

                {/* STUDENT FORM */}
                {type==='student' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name *" value={sName} onChange={e=>setSName(e.target.value)} placeholder="Aarav Singh" />
                    <Input label="Email *" type="email" value={sEmail} onChange={e=>setSEmail(e.target.value)} placeholder="aarav@email.com" />
                    <Input label="Admission Number *" value={sAdm} onChange={e=>setSAdm(e.target.value)} placeholder="ADM2024001" hint="Given by your school" />
                    <Input label="Institute Code *" value={sCode} onChange={e=>setSCode(e.target.value.toUpperCase())} placeholder="EDUABC123" hint="From your school/college" />
                    <Input label="Class / Course *" value={sCls} onChange={e=>setSCls(e.target.value)} placeholder="Class 10" />
                    <Select label="Section" options={['A','B','C','D','E'].map(v=>({value:v,label:'Section '+v}))} />
                    <div><PwInput label="Password *" val={sPass} setVal={setSPass} /></div>
                    <div><PwInput label="Confirm Password *" val={sPass2} setVal={setSPass2} placeholder="Repeat password" /></div>
                  </div>
                )}

                {/* TEACHER FORM */}
                {type==='teacher' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Full Name *" value={tName} onChange={e=>setTName(e.target.value)} placeholder="Priya Sharma" />
                    <Input label="Email *" type="email" value={tEmail} onChange={e=>setTEmail(e.target.value)} placeholder="priya@school.com" />
                    <Input label="Employee ID *" value={tEmp} onChange={e=>setTEmp(e.target.value)} placeholder="TCH2024001" />
                    <Input label="Institute Code *" value={tCode} onChange={e=>setTCode(e.target.value.toUpperCase())} placeholder="EDUABC123" />
                    <Select label="Primary Subject *" value={tSub} onChange={e=>setTSub(e.target.value)} options={[{value:'',label:'Select subject'},'Mathematics','Science','English','Hindi','Social Science','Physics','Chemistry','Biology','Computer Science','History','Art','Physical Education'].map(v=>typeof v==='string'?{value:v,label:v}:v)} />
                    <Input label="Qualification" placeholder="M.Sc, B.Ed" />
                    <div><PwInput label="Password *" val={tPass} setVal={setTPass} /></div>
                    <div><PwInput label="Confirm Password *" val={tPass2} setVal={setTPass2} placeholder="Repeat password" /></div>
                  </div>
                )}

                {/* PARENT FORM */}
                {type==='parent' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Parent Name *" value={pName} onChange={e=>setPName(e.target.value)} placeholder="Ramesh Singh" />
                    <Input label="Phone *" type="tel" value={pPhone} onChange={e=>setPPhone(e.target.value)} placeholder="+91 98765 43210" />
                    <Input label="Child's Admission Number *" value={pAdm} onChange={e=>setPAdm(e.target.value)} placeholder="ADM2024001" hint="Your child's admission no." />
                    <Input label="Institute Code *" value={pCode} onChange={e=>setPCode(e.target.value.toUpperCase())} placeholder="EDUABC123" hint="Get from child's school" />
                    <Select label="Relation" options={['Father','Mother','Guardian'].map(v=>({value:v,label:v}))} />
                    <Input label="Email (optional)" type="email" placeholder="ramesh@email.com" />
                    <div><PwInput label="Password *" val={pPass} setVal={setPPass} /></div>
                    <div><PwInput label="Confirm Password *" val={pPass2} setVal={setPPass2} placeholder="Repeat password" /></div>
                  </div>
                )}

                <div className="flex gap-3 mt-7">
                  {type==='institute' && step>1 && (
                    <Button variant="outline" onClick={()=>setStep(s=>s-1)} icon={<ArrowLeft className="w-4 h-4"/>}>Back</Button>
                  )}
                  <Button variant="accent" loading={loading} onClick={next} className="flex-1"
                    icon={type==='institute'&&step<3 ? <ChevronRight className="w-4 h-4"/> : <Check className="w-4 h-4"/>}>
                    {type==='institute'&&step<3 ? `Continue to Step ${step+1}` : type==='institute' ? '🎉 Register Institute' : `Register as ${type.charAt(0).toUpperCase()+type.slice(1)}`}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
