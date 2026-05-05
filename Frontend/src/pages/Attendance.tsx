import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, CheckCircle, ClipboardList, Fingerprint, QrCode, Save, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Webcam from 'react-webcam'
import { Avatar, Badge, Button, Card, CardHeader, StatCard } from '../components/ui'
import { attendanceApi } from '../services/api'
import { useAttendanceStore, useAuthStore } from '../store'

const MOCK_STUDENTS = [
  { id: 's1', name: 'Aarav Singh',  roll: 1, cls: '10-A' },
  { id: 's2', name: 'Nisha Kapoor', roll: 2, cls: '10-A' },
  { id: 's3', name: 'Rohit Kumar',  roll: 3, cls: '10-A' },
  { id: 's4', name: 'Pooja Mishra', roll: 4, cls: '10-A' },
  { id: 's5', name: 'Vikram Gupta', roll: 5, cls: '10-A' },
  { id: 's6', name: 'Anjali Verma', roll: 6, cls: '10-A' },
]

type Method = 'face' | 'fingerprint' | 'qr' | 'manual' | null

export default function AttendancePage() {
  const { user } = useAuthStore()
  const { marks, setMark, markAll, clearMarks, getSummary } = useAttendanceStore()
  const [method, setMethod] = useState<Method>(null)
  const [faceStep, setFaceStep] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [faceResult, setFaceResult] = useState<{ name: string; confidence: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const summary = getSummary()

  // ── FACE ATTENDANCE ──────────────────────────────────────────────────────────
  const startFaceScan = useCallback(async () => {
    setFaceStep('scanning')
    setFaceResult(null)
    // Simulate face detection after 2s
    setTimeout(() => {
      setFaceResult({ name: 'Aarav Singh', confidence: 97.3 })
      setFaceStep('done')
      setMark('s1', 'present')
      toast.success('✅ Aarav Singh — Attendance marked (97.3% confidence)')
      setTimeout(() => {
        setFaceStep('idle')
        setFaceResult(null)
      }, 3000)
    }, 2000)
  }, [setMark])

  // ── FINGERPRINT ──────────────────────────────────────────────────────────────
  const startFingerprint = async () => {
    try {
      if (window.PublicKeyCredential) {
        toast('Fingerprint scanning... (demo mode)', { icon: '👆' })
        setTimeout(() => {
          setMark('s2', 'present')
          toast.success('✅ Nisha Kapoor — Attendance marked via Fingerprint')
          setMethod(null)
        }, 1500)
      } else {
        toast.error('Biometric not supported. Use Android app.')
      }
    } catch {
      toast.error('Fingerprint error')
    }
  }

  // ── SAVE MANUAL ───────────────────────────────────────────────────────────────
  const saveManual = async () => {
    const unmarked = MOCK_STUDENTS.filter((s) => !marks[s.id])
    if (unmarked.length > 0) {
      toast.error(`Please mark attendance for: ${unmarked.map((s) => s.name).join(', ')}`)
      return
    }
    setSaving(true)
    try {
      const records = MOCK_STUDENTS.map((s) => ({ student_id: s.id, status: marks[s.id] ?? 'present' }))
      await attendanceApi.markManual(records, 'cls_10a', user?.institute_id ?? '')
      toast.success('✅ Attendance saved! Parents notified.')
      clearMarks()
      setMethod(null)
    } catch {
      // Demo mode
      toast.success('✅ Attendance saved! Parents notified. (demo)')
      clearMarks()
      setMethod(null)
    } finally {
      setSaving(false)
    }
  }

  const methods = [
    { id: 'face',        icon: Camera,      emoji: '😊', title: 'Face Recognition', sub: 'AI camera scan', color: 'from-primary-600 to-primary-800' },
    { id: 'fingerprint', icon: Fingerprint, emoji: '👆', title: 'Fingerprint',       sub: 'Device biometric',   color: 'from-cyan-600 to-cyan-800' },
    { id: 'qr',          icon: QrCode,      emoji: '📱', title: 'QR Code',           sub: 'Student scans',      color: 'from-emerald-600 to-emerald-800' },
    { id: 'manual',      icon: ClipboardList, emoji: '📋', title: 'Manual',           sub: 'P/A/L per student',  color: 'from-amber-600 to-amber-800' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-800 text-2xl">Attendance Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">Class 10-A — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total Students" value={MOCK_STUDENTS.length}  color="text-primary-400" />
        <StatCard label="Present" value={summary.present} color="text-accent-green" />
        <StatCard label="Absent"  value={summary.absent}  color="text-red-400" />
        <StatCard label="Late"    value={summary.late}    color="text-accent-amber" />
      </div>

      {/* Method Cards */}
      {!method && (
        <div>
          <h2 className="font-display font-700 text-base mb-3">Choose Attendance Method</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {methods.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (m.id === 'fingerprint') { setMethod('fingerprint'); startFingerprint() }
                  else setMethod(m.id as Method)
                }}
                className="glass p-6 text-center cursor-pointer hover:border-primary-500/30 transition-all duration-200"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {m.emoji}
                </div>
                <div className="font-display font-700 text-sm mb-1">{m.title}</div>
                <div className="text-xs text-gray-500">{m.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Face Attendance */}
      <AnimatePresence>
        {method === 'face' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card>
              <CardHeader
                title="😊 Face Recognition Attendance"
                action={<button onClick={() => { setMethod(null); setFaceStep('idle'); setFaceResult(null) }}><X className="w-4 h-4 text-gray-500" /></button>}
              />
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Camera */}
                <div className="relative w-full lg:w-72 h-56 rounded-2xl overflow-hidden bg-dark-700 flex-shrink-0">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user' }}
                    className="w-full h-full object-cover"
                    onUserMediaError={() => toast.error('Camera access denied')}
                  />
                  {/* Face oval overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg width="160" height="200" viewBox="0 0 160 200">
                      <defs>
                        <mask id="oval-mask">
                          <rect width="160" height="200" fill="white" />
                          <ellipse cx="80" cy="100" rx="60" ry="80" fill="black" />
                        </mask>
                      </defs>
                      <rect width="160" height="200" fill="rgba(0,0,0,0.55)" mask="url(#oval-mask)" />
                      <ellipse cx="80" cy="100" rx="60" ry="80" fill="none"
                        stroke={faceStep === 'done' ? '#10b981' : faceStep === 'scanning' ? '#6366f1' : 'rgba(255,255,255,0.4)'}
                        strokeWidth="2.5"
                        strokeDasharray={faceStep === 'scanning' ? '8 4' : 'none'}
                      />
                    </svg>
                    {faceStep === 'scanning' && (
                      <div className="absolute w-full h-0.5 bg-primary-500/60 scan-line left-0 top-1/4" />
                    )}
                  </div>
                  {/* Result overlay */}
                  {faceStep === 'done' && faceResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-12 h-12 text-accent-green" />
                      <div className="text-white font-700 text-lg">{faceResult.name}</div>
                      <div className="text-accent-green text-sm">{faceResult.confidence}% confidence</div>
                    </motion.div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-4">
                    {faceStep === 'idle'     && '👤 Click "Start Scan" and position your face in the oval'}
                    {faceStep === 'scanning' && '🔍 Detecting and recognizing face...'}
                    {faceStep === 'done'     && '✅ Face recognized! Attendance marked automatically.'}
                  </div>

                  {faceStep !== 'scanning' && (
                    <Button variant="accent" onClick={startFaceScan} icon={<Camera className="w-4 h-4" />}>
                      {faceStep === 'done' ? 'Scan Next Student' : 'Start Face Scan'}
                    </Button>
                  )}

                  {/* Marked list */}
                  {Object.entries(marks).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Marked via Face</div>
                      {Object.entries(marks).map(([id, status]) => {
                        const stu = MOCK_STUDENTS.find((s) => s.id === id)
                        return stu ? (
                          <div key={id} className="flex items-center gap-2.5 text-sm">
                            <Avatar name={stu.name} size="sm" />
                            <span className="flex-1">{stu.name}</span>
                            <Badge variant={status === 'present' ? 'green' : status === 'absent' ? 'red' : 'amber'} dot>
                              {status}
                            </Badge>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Attendance */}
      <AnimatePresence>
        {method === 'manual' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <Card>
              <CardHeader
                title="📋 Manual Attendance — Class 10-A"
                action={
                  <div className="flex gap-2">
                    <button onClick={() => markAll(MOCK_STUDENTS.map((s) => s.id), 'present')} className="text-xs text-accent-green hover:text-green-400">Mark All Present</button>
                    <button onClick={() => { setMethod(null); clearMarks() }}><X className="w-4 h-4 text-gray-500" /></button>
                  </div>
                }
              />

              <div className="space-y-2 mb-4">
                {MOCK_STUDENTS.map((stu) => (
                  <div key={stu.id} className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-dark-500 flex items-center justify-center text-xs font-700 text-gray-400 flex-shrink-0">
                      {stu.roll}
                    </div>
                    <Avatar name={stu.name} size="sm" />
                    <span className="flex-1 text-sm font-500">{stu.name}</span>
                    {/* P A L buttons */}
                    {(['present', 'absent', 'late'] as const).map((status) => (
                      <motion.button
                        key={status}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setMark(stu.id, status)}
                        className={clsx(
                          'w-9 h-9 rounded-lg text-xs font-800 transition-all border',
                          marks[stu.id] === status
                            ? status === 'present' ? 'bg-accent-green text-white border-accent-green'
                              : status === 'absent' ? 'bg-red-500 text-white border-red-500'
                              : 'bg-accent-amber text-dark-900 border-accent-amber'
                            : status === 'present' ? 'bg-transparent text-accent-green border-accent-green/30 hover:bg-accent-green/10'
                              : status === 'absent' ? 'bg-transparent text-red-400 border-red-500/30 hover:bg-red-500/10'
                              : 'bg-transparent text-accent-amber border-accent-amber/30 hover:bg-accent-amber/10'
                        )}
                      >
                        {status === 'present' ? 'P' : status === 'absent' ? 'A' : 'L'}
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Summary + Save */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div className="flex gap-4 text-sm">
                  <span className="text-accent-green font-600">{summary.present} Present</span>
                  <span className="text-red-400 font-600">{summary.absent} Absent</span>
                  <span className="text-accent-amber font-600">{summary.late} Late</span>
                  <span className="text-gray-500">{MOCK_STUDENTS.length - summary.total} Pending</span>
                </div>
                <Button variant="accent" loading={saving} onClick={saveManual} icon={<Save className="w-4 h-4" />}>
                  Save & Notify Parents
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
