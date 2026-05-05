import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Camera, CheckCircle, RefreshCw, Save, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Badge, Button, Card, CardHeader, StatCard } from '../components/ui'
import { resultApi } from '../services/api'
import { useAuthStore, useResultStore } from '../store'

export default function ResultsPage() {
  const { user } = useAuthStore()
  const { subjects, aiComment, updateMark, setAiComment, getTotal, resetResult } = useResultStore()
  const [scanningIdx, setScanningIdx] = useState<number | null>(null)
  const [generatingComment, setGeneratingComment] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])
  const total = getTotal()

  // AI photo scan → extract marks
  const scanAnswerSheet = async (index: number, file: File) => {
    setScanningIdx(index)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        try {
          const res = await resultApi.extractMarks(base64, subjects[index].name, subjects[index].max_marks)
          const marks = res.data?.marks ?? -1
          if (marks >= 0) {
            updateMark(index, marks, true)
            toast.success(`✅ ${subjects[index].name}: ${marks} marks extracted by AI`)
          } else {
            toast.error('Could not extract marks clearly. Please enter manually.')
          }
        } catch {
          // Demo mode fallback
          const demoMarks: Record<string, number> = {
            'Mathematics': 68, 'Science': 82, 'English': 91, 'Hindi': 75, 'Social Science': 74
          }
          const m = demoMarks[subjects[index].name] ?? Math.floor(60 + Math.random() * 30)
          updateMark(index, m, true)
          toast.success(`✅ ${subjects[index].name}: ${m} marks extracted by AI (demo)`)
        } finally {
          setScanningIdx(null)
        }
      }
      reader.readAsDataURL(file)
    } catch {
      setScanningIdx(null)
      toast.error('Error reading file')
    }
  }

  const generateComment = async () => {
    setGeneratingComment(true)
    const weakSubs = subjects.filter((s) => s.obtained_marks !== null && s.obtained_marks < s.max_marks * 0.6).map((s) => s.name)
    try {
      const res = await resultApi.generateComment('Aarav Singh', total.percentage, weakSubs)
      setAiComment(res.data?.comment ?? '')
      toast.success('AI comment generated!')
    } catch {
      setAiComment(`Aarav has shown consistent effort this term. While his performance in English is commendable (91%), we encourage him to dedicate more time to Mathematics. With focused practice, we are confident he will achieve excellent results.`)
      toast.success('AI comment generated! (demo)')
    } finally {
      setGeneratingComment(false)
    }
  }

  const saveResult = async () => {
    const incomplete = subjects.filter((s) => s.obtained_marks === null)
    if (incomplete.length > 0) {
      toast.error(`Please enter marks for: ${incomplete.map((s) => s.name).join(', ')}`)
      return
    }
    setSaving(true)
    try {
      await resultApi.save({
        institute_id: user?.institute_id,
        exam_id: 'exam_midterm_2026',
        student_id: 'stu_001',
        subject_marks: subjects.map((s) => ({
          subject_name: s.name, max_marks: s.max_marks,
          obtained_marks: s.obtained_marks, ai_autofilled: s.ai_autofilled,
        })),
        ai_comment: aiComment,
      })
      toast.success('✅ Result saved successfully!')
      resetResult()
    } catch {
      toast.success('✅ Result saved! (demo)')
      resetResult()
    } finally {
      setSaving(false)
    }
  }

  const gradeColor = (pct: number) => {
    if (pct >= 85) return 'text-accent-green'
    if (pct >= 70) return 'text-accent-amber'
    if (pct >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl">Result Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Enter exam results — click 📷 to scan answer sheet with AI</p>
        </div>
        <button onClick={resetResult} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Marks"  value={`${total.obtained}/${total.max}`} color="text-primary-400" />
        <StatCard label="Percentage"   value={total.percentage + '%'} color={gradeColor(total.percentage)} />
        <StatCard label="Grade"        value={total.grade}            color={gradeColor(total.percentage)} />
      </div>

      {/* Subject rows */}
      <Card>
        <CardHeader
          title="📝 Enter Marks — Aarav Singh (Class 10-A)"
          subtitle="Click the camera icon to auto-extract marks from answer sheet photo"
        />

        <div className="space-y-3">
          {subjects.map((sub, i) => (
            <motion.div
              key={sub.name}
              className="flex items-center gap-3 p-3.5 bg-dark-700/50 rounded-xl"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              {/* Subject name */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-600 flex items-center gap-2">
                  {sub.name}
                  {sub.ai_autofilled && (
                    <Badge variant="green" className="text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" /> AI filled
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">Max marks: {sub.max_marks}</div>
              </div>

              {/* Marks input */}
              <div className="relative w-28">
                <input
                  type="number"
                  min={0} max={sub.max_marks}
                  value={sub.obtained_marks ?? ''}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value)
                    if (!isNaN(v) && v >= 0 && v <= sub.max_marks) updateMark(i, v, false)
                  }}
                  placeholder={`/ ${sub.max_marks}`}
                  className="w-full bg-dark-600 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-center font-700 outline-none focus:border-primary-500/60 [appearance:textfield]"
                />
                {sub.obtained_marks !== null && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <CheckCircle className={clsx('w-3.5 h-3.5', sub.obtained_marks >= sub.max_marks * 0.6 ? 'text-accent-green' : 'text-red-400')} />
                  </div>
                )}
              </div>

              {/* Camera button */}
              <div className="relative">
                <input
                  ref={(el) => { fileRefs.current[i] = el }}
                  type="file" accept="image/*" capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) scanAnswerSheet(i, file)
                    e.target.value = ''
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => fileRefs.current[i]?.click()}
                  disabled={scanningIdx !== null}
                  className={clsx(
                    'w-10 h-10 rounded-xl border flex items-center justify-center transition-all',
                    scanningIdx === i
                      ? 'bg-primary-600/20 border-primary-500/40 animate-pulse'
                      : 'bg-dark-600 border-white/[0.08] hover:bg-primary-600/15 hover:border-primary-500/40'
                  )}
                  title="Scan answer sheet photo — AI will extract marks"
                >
                  {scanningIdx === i
                    ? <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-4 h-4 text-primary-400" />
                  }
                </motion.button>
              </div>

              {/* % indicator */}
              {sub.obtained_marks !== null && (
                <div className={clsx('text-xs font-700 w-10 text-right', gradeColor(Math.round((sub.obtained_marks / sub.max_marks) * 100)))}>
                  {Math.round((sub.obtained_marks / sub.max_marks) * 100)}%
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-xs text-gray-600 mt-3 flex items-center gap-1.5">
          <Camera className="w-3 h-3" />
          Click camera icon → select answer sheet photo → Gemini AI extracts marks automatically
        </div>
      </Card>

      {/* AI Comment */}
      <Card>
        <CardHeader
          title={<span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent-violet" /> AI Report Card Comment</span>}
          action={
            <Button variant="ghost" size="sm" loading={generatingComment} onClick={generateComment} icon={<Sparkles className="w-3.5 h-3.5" />}>
              {aiComment ? 'Regenerate' : 'Generate'}
            </Button>
          }
        />
        {aiComment ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary-500/[0.06] border border-primary-500/20 rounded-xl text-sm text-gray-300 leading-relaxed"
          >
            {aiComment}
          </motion.div>
        ) : (
          <div className="text-sm text-gray-600 italic">
            Click "Generate" to create an AI-powered parent-friendly report card comment based on marks.
          </div>
        )}
      </Card>

      {/* Save button */}
      <div className="flex gap-3">
        <Button variant="accent" size="lg" loading={saving} onClick={saveResult} icon={<Save className="w-4 h-4" />}>
          Save Result
        </Button>
        <Button variant="outline" size="lg" onClick={() => toast('PDF export coming soon!')}>
          Export PDF
        </Button>
      </div>
    </div>
  )
}
