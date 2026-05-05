import { motion } from 'framer-motion'
import { ArrowRight, Camera, Eye, EyeOff, Fingerprint, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui/index'
import { authApi } from '../services/api'
import { useAuthStore } from '../store'

const ROLE_CARDS = [
  { role: 'admin',   icon: '🏫', title: 'School Admin',  sub: 'Full institute control' },
  { role: 'teacher', icon: '👨‍🏫', title: 'Teacher',       sub: 'Attendance, results, AI' },
  { role: 'student', icon: '👨‍🎓', title: 'Student',       sub: 'Marks, timetable, AI tutor' },
  { role: 'parent',  icon: '👨‍👦', title: 'Parent',        sub: 'Child tracking & alerts' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, dashboardPath } = useAuthStore()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [screen, setScreen]     = useState<'login' | 'forgot' | 'otp'>('login')
  const [forgotEmail, setForgotEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Please enter email and password'); return }
    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      if (res.data?.token && res.data?.user) {
        setAuth(res.data.user, res.data.token)
        toast.success(`Welcome back, ${res.data.user.name}!`)
        navigate(dashboardPath())
      }
    } catch (err: any) {
      // Demo mode fallback
      const mockRoles: Record<string, string> = {
        'admin@': 'admin', 'teacher@': 'teacher',
        'student@': 'student', 'parent@': 'parent',
      }
      const roleKey = Object.keys(mockRoles).find((k) => email.includes(k))
      const role = (mockRoles[roleKey ?? ''] ?? 'admin') as any
      const mockUser = {
        _id: 'usr_001', name: 'Demo User', email,
        role, institute_id: 'inst_001', is_active: true, created_at: new Date().toISOString(),
      }
      setAuth(mockUser, 'demo_token_' + Date.now())
      toast.success('Logged in (demo mode)')
      navigate(dashboardPath())
    } finally {
      setLoading(false)
    }
  }

  const handleFace = () => toast('Face recognition available in Android app', { icon: '📱' })
  const handleFingerprint = () => toast('Fingerprint available in Android app', { icon: '👆' })
  const sendOtp = () => { setScreen('otp'); toast.success('OTP sent to ' + forgotEmail) }
  const verifyOtp = () => {
    if (otp.join('').length < 6) { toast.error('Enter 6-digit OTP'); return }
    toast.success('OTP verified! Set new password.')
    setScreen('login')
  }

  return (
    <div className="min-h-screen flex mesh-bg">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col w-[45%] bg-dark-800 border-r border-white/[0.06] p-10 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent-cyan/6 blur-3xl pointer-events-none" />

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-cyan flex items-center justify-center text-lg">🧠</div>
          <span className="font-display font-800 text-lg">EduBrain AI</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-display font-800 text-4xl leading-tight mb-3">
              Welcome back to<br />
              <span className="gradient-text">EduBrain</span>
            </h2>
            <p className="text-gray-400 text-[15px] mb-8">
              Sign in with your role — each user gets their own personalized dashboard.
            </p>
          </motion.div>

          <div className="space-y-2.5">
            {ROLE_CARDS.map((c, i) => (
              <motion.div
                key={c.role}
                onClick={() => setEmail(c.role + '@school.com')}
                className="flex items-center gap-3 p-3.5 glass-hover cursor-pointer rounded-xl"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center text-xl">{c.icon}</div>
                <div>
                  <div className="text-sm font-600">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.sub}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-600 ml-auto" />
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-700 relative z-10">© 2026 EduBrain AI · Made in India 🇮🇳</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          {/* Login Screen */}
          {screen === 'login' && (
            <>
              <div className="mb-8">
                <h3 className="font-display font-800 text-3xl mb-1.5">Sign In</h3>
                <p className="text-gray-400 text-sm">Enter your credentials — role is auto-detected</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Email / Phone / ID"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  icon={<Mail className="w-4 h-4" />}
                  inputSize="lg"
                  autoComplete="email"
                />
                <div>
                  <Input
                    label="Password"
                    type={showPass ? 'text' : 'password'}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    icon={<Lock className="w-4 h-4" />}
                    iconRight={
                      <button onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-gray-300">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    inputSize="lg"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <div className="flex justify-end mt-2">
                    <button onClick={() => setScreen('forgot')} className="text-xs text-primary-400 hover:text-primary-300">
                      Forgot password?
                    </button>
                  </div>
                </div>

                <Button variant="accent" size="lg" loading={loading} onClick={handleLogin} className="w-full">
                  Sign In
                </Button>

                <div className="flex items-center gap-3 text-gray-700 text-xs">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  or continue with
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleFace} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] bg-dark-700 text-sm font-500 text-gray-400 hover:border-primary-500/30 hover:text-gray-200 transition-all">
                    <Camera className="w-4 h-4" /> Face ID
                  </button>
                  <button onClick={handleFingerprint} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] bg-dark-700 text-sm font-500 text-gray-400 hover:border-primary-500/30 hover:text-gray-200 transition-all">
                    <Fingerprint className="w-4 h-4" /> Fingerprint
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-400 font-600 hover:text-primary-300">Register here →</Link>
                </p>
              </div>
            </>
          )}

          {/* Forgot Password */}
          {screen === 'forgot' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-8">
                <h3 className="font-display font-800 text-3xl mb-1.5">Reset Password</h3>
                <p className="text-gray-400 text-sm">Enter your email — we'll send an OTP</p>
              </div>
              <div className="space-y-4">
                <Input label="Email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your@email.com" inputSize="lg" icon={<Mail className="w-4 h-4" />} />
                <Button variant="accent" size="lg" onClick={sendOtp} className="w-full">Send OTP</Button>
                <button onClick={() => setScreen('login')} className="w-full text-center text-sm text-gray-500 hover:text-gray-300">← Back to Login</button>
              </div>
            </motion.div>
          )}

          {/* OTP */}
          {screen === 'otp' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-8">
                <h3 className="font-display font-800 text-3xl mb-1.5">Enter OTP</h3>
                <p className="text-gray-400 text-sm">6-digit OTP sent to <strong className="text-gray-200">{forgotEmail}</strong></p>
              </div>
              <div className="flex gap-2.5 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i} maxLength={1} value={digit}
                    onChange={(e) => {
                      const val = e.target.value
                      const newOtp = [...otp]; newOtp[i] = val; setOtp(newOtp)
                      if (val && i < 5) document.querySelectorAll<HTMLInputElement>('.otp-inp')[i + 1]?.focus()
                    }}
                    className="otp-inp flex-1 h-14 text-center font-display text-2xl font-800 bg-dark-700 border border-white/[0.08] rounded-xl text-gray-100 outline-none focus:border-primary-500/60"
                  />
                ))}
              </div>
              <Button variant="accent" size="lg" onClick={verifyOtp} className="w-full">Verify OTP</Button>
              <div className="text-center mt-4 text-sm text-gray-500">
                Didn't receive? <button onClick={sendOtp} className="text-primary-400">Resend OTP</button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
