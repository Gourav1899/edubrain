import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, FileText, BookOpen, Calendar, MessageSquare, Brain, Send, RefreshCw } from 'lucide-react'
import { Card, CardHeader, Button, Input, Select, Textarea } from '../components/ui'
import { aiApi } from '../services/api'
import toast from 'react-hot-toast'

type Tool = 'question_paper' | 'notes' | 'study_plan' | 'lesson_plan' | 'parent_msg' | 'doubt' | null

const TOOLS = [
  { id: 'question_paper', icon: '📝', label: 'Question Paper Generator', sub: 'Auto-generate with answer key', color: 'from-primary-600 to-primary-800' },
  { id: 'notes',          icon: '📖', label: 'Notes Generator',          sub: 'Summary, MCQs, Q&A',          color: 'from-cyan-600 to-cyan-800' },
  { id: 'study_plan',     icon: '📅', label: 'Study Planner',            sub: 'Personalized exam prep plan', color: 'from-emerald-600 to-emerald-800' },
  { id: 'lesson_plan',    icon: '🗂️',  label: 'Lesson Planner',          sub: 'Period-wise lesson structure', color: 'from-violet-600 to-violet-800' },
  { id: 'parent_msg',     icon: '💬', label: 'Parent Message',           sub: 'AI-drafted communication',    color: 'from-pink-600 to-pink-800' },
  { id: 'doubt',          icon: '🤔', label: 'Doubt Solver',             sub: 'Any subject, Hindi/English',  color: 'from-amber-600 to-amber-800' },
]

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>(null)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  // Form states
  const [qpClass, setQpClass] = useState('10')
  const [qpSubject, setQpSubject] = useState('Mathematics')
  const [qpChapter, setQpChapter] = useState('')
  const [qpMarks, setQpMarks] = useState('80')
  const [qpDiff, setQpDiff] = useState('medium')
  const [notesClass, setNotesClass] = useState('9')
  const [notesSubject, setNotesSubject] = useState('Science')
  const [notesChapter, setNotesChapter] = useState('')
  const [notesTopic, setNotesTopic] = useState('')
  const [planName, setPlanName] = useState('Aarav Singh')
  const [planWeak, setPlanWeak] = useState('Mathematics, Science')
  const [planDate, setPlanDate] = useState('')
  const [lessonClass, setLessonClass] = useState('8')
  const [lessonSub, setLessonSub] = useState('History')
  const [lessonChap, setLessonChap] = useState('')
  const [lessonPeriods, setLessonPeriods] = useState('4')
  const [parentName, setParentName] = useState('Rohit Kumar')
  const [parentIssue, setParentIssue] = useState('Low attendance and poor performance')
  const [teacherName, setTeacherName] = useState('Mr. Verma')
  const [doubtQ, setDoubtQ] = useState('')
  const [doubtSub, setDoubtSub] = useState('Mathematics')

  const generate = async () => {
    setLoading(true)
    setOutput('')
    try {
      let res: any
      switch (activeTool) {
        case 'question_paper':
          res = await aiApi.generateQuestionPaper({ class: qpClass, subject: qpSubject, chapter: qpChapter, marks: parseInt(qpMarks), difficulty: qpDiff, types: ['mcq', 'short', 'long'] })
          setOutput(res.data?.question_paper ?? '')
          break
        case 'notes':
          res = await aiApi.generateNotes({ class: notesClass, subject: notesSubject, chapter: notesChapter, topic: notesTopic })
          setOutput(res.data?.notes ?? '')
          break
        case 'study_plan':
          res = await aiApi.generateStudyPlan(planName, planWeak.split(',').map(s=>s.trim()), planDate)
          setOutput(res.data?.plan ?? '')
          break
        case 'lesson_plan':
          res = await aiApi.generateLessonPlan(lessonClass, lessonSub, lessonChap, parseInt(lessonPeriods))
          setOutput(res.data?.lesson_plan ?? '')
          break
        case 'parent_msg':
          res = await aiApi.generateParentMessage(parentName, parentIssue, teacherName)
          setOutput(res.data?.message ?? '')
          break
        case 'doubt':
          res = await aiApi.solveDoubt(doubtQ, doubtSub)
          setOutput(res.data?.answer ?? '')
          break
      }
      toast.success('Generated successfully!')
    } catch {
      // Demo fallback outputs
      const demos: Record<string, string> = {
        question_paper: `CLASS ${qpClass} — ${qpSubject} QUESTION PAPER\nMax Marks: ${qpMarks} | Time: 3 Hours\n\nSECTION A — Multiple Choice Questions (1 mark each)\n1. Which of the following is a rational number?\n   a) √2    b) π    c) 3/4    d) √3\n\n2. The HCF of 12 and 18 is:\n   a) 6    b) 12    c) 18    d) 3\n\n[...20 more MCQs]\n\nSECTION B — Short Answer (2 marks each)\n1. Find the zeros of the polynomial p(x) = x² - 3x + 2\n2. Prove that √2 is irrational.\n\nSECTION C — Long Answer (5 marks each)\n1. Solve the pair of linear equations: 2x + 3y = 11, x - 2y = -3\n\n--- ANSWER KEY ---\nSection A: 1-c, 2-a...`,
        notes: `NOTES: Class ${notesClass} ${notesSubject} — ${notesChapter || 'Chapter 1'}\n\n📚 SUMMARY\nThis chapter covers fundamental concepts of ${notesSubject}. The key topics include atomic structure, chemical bonding, and periodic properties.\n\n🔑 KEY POINTS\n• Atoms are the basic building blocks of matter\n• Dalton proposed the first atomic theory in 1808\n• Electrons orbit the nucleus in energy levels\n• Atomic number = number of protons\n• Mass number = protons + neutrons\n\n📝 MCQs\n1. The atomic number of Carbon is:\n   a) 6  b) 12  c) 8  d) 14  → Answer: a\n\n2. Who proposed the planetary model of atom?\n   a) Dalton  b) Thomson  c) Rutherford  d) Bohr  → Answer: c\n\n❓ SHORT Q&A\nQ: What is an atom?\nA: An atom is the smallest unit of an element that retains the chemical properties of that element.\n\n⚡ IMPORTANT FORMULAS\n• Atomic mass = Mass of protons + neutrons\n• No. of neutrons = Mass number - Atomic number`,
        study_plan: `PERSONALIZED STUDY PLAN — ${planName}\nWeak Subjects: ${planWeak}\n\n📅 WEEK 1 (Days 1-7)\nMon: Mathematics — Algebra basics (45 min)\nTue: Science — Force & Motion revision (45 min)\nWed: Mathematics — Practice 20 problems (1 hr)\nThu: Science — Diagrams & formulas (30 min)\nFri: Mock test — Both subjects (1.5 hrs)\nSat: Revise mistakes, weak topics (1 hr)\nSun: Rest & light reading\n\n📅 WEEK 2-3: Deep practice + chapter completion\n📅 WEEK 4: Full revision + past papers\n\n🎯 TARGET: Maths 68%→85%, Science 72%→88%\n✅ Daily 2-hour study recommended\n📱 Use AI Doubt Solver for quick help`,
        lesson_plan: `LESSON PLAN — Class ${lessonClass} ${lessonSub}: ${lessonChap||'Chapter'}\nPeriods: ${lessonPeriods} | Duration: 40 min each\n\n📖 PERIOD 1: Introduction & Background\n• Objective: Understand context and causes\n• Method: Discussion + video clip (10 min)\n• Activity: Brainstorming — what students know\n• Materials: Textbook, whiteboard\n\n📖 PERIOD 2: Core Content\n• Objective: Cover main events/concepts\n• Method: Lecture + diagram on board (20 min)\n• Activity: Group reading exercise (15 min)\n• Assessment: Quick oral Q&A (5 min)\n\n📖 PERIOD 3: Analysis & Discussion\n• Objective: Critical thinking about topic\n• Method: Group discussion (25 min)\n• Activity: Compare & contrast exercise\n\n📖 PERIOD 4: Review & Assessment\n• Recap all 3 periods (10 min)\n• Class test — 5 questions (20 min)\n• Homework: Write 5 key points (1 page)\n\n📝 HOMEWORK ASSIGNMENT\nWrite a 1-page essay on the significance of this chapter.`,
        parent_msg: `Dear Parent/Guardian of ${parentName},\n\nI hope this message finds you in good health. I am writing to bring to your kind attention a matter regarding ${parentName}'s progress at school.\n\nRegarding the concern: ${parentIssue}\n\nWe have observed that with timely intervention and your support at home, significant improvement is achievable. We would appreciate if you could:\n• Ensure regular attendance\n• Encourage daily 1-hour study at home\n• Review homework submissions regularly\n\nWe would be glad to schedule a parent-teacher meeting at your convenience to discuss this in detail.\n\nThank you for your cooperation and support.\n\nWarm regards,\n${teacherName}\nClass Teacher`,
        doubt: `Great question! Let me explain step by step.\n\nQuestion: ${doubtQ}\nSubject: ${doubtSub}\n\n📖 EXPLANATION:\nThis is a fundamental concept in ${doubtSub}. Here's how we approach it:\n\nStep 1: Understand what is being asked\nFirst, identify the key terms and what the question wants you to find.\n\nStep 2: Recall the relevant formula or concept\nFor this type of problem, the key formula is:\n[Formula would be shown here based on actual question]\n\nStep 3: Apply the concept\nSubstitute the given values into the formula and solve.\n\nStep 4: Verify your answer\nCheck if the answer makes logical sense.\n\n💡 TIP: Practice 5 similar problems daily to master this concept.\n\nDo you want me to solve a specific example? Just ask!`,
      }
      setOutput(demos[activeTool ?? 'doubt'] ?? 'Generated content will appear here.')
      toast.success('Generated! (demo mode)')
    } finally {
      setLoading(false)
    }
  }

  const renderForm = () => {
    switch (activeTool) {
      case 'question_paper': return (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Class" value={qpClass} onChange={e=>setQpClass(e.target.value)} placeholder="10" />
          <Input label="Subject" value={qpSubject} onChange={e=>setQpSubject(e.target.value)} placeholder="Mathematics" />
          <Input label="Chapter/Topic" value={qpChapter} onChange={e=>setQpChapter(e.target.value)} placeholder="Quadratic Equations" className="col-span-2" />
          <Input label="Total Marks" type="number" value={qpMarks} onChange={e=>setQpMarks(e.target.value)} />
          <Select label="Difficulty" value={qpDiff} onChange={e=>setQpDiff(e.target.value)} options={[{value:'easy',label:'Easy'},{value:'medium',label:'Medium'},{value:'hard',label:'Hard'},{value:'mixed',label:'Mixed'}]} />
        </div>
      )
      case 'notes': return (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Class" value={notesClass} onChange={e=>setNotesClass(e.target.value)} placeholder="9" />
          <Input label="Subject" value={notesSubject} onChange={e=>setNotesSubject(e.target.value)} placeholder="Science" />
          <Input label="Chapter" value={notesChapter} onChange={e=>setNotesChapter(e.target.value)} placeholder="Atoms and Molecules" />
          <Input label="Topic (optional)" value={notesTopic} onChange={e=>setNotesTopic(e.target.value)} placeholder="Specific topic" />
        </div>
      )
      case 'study_plan': return (
        <div className="space-y-3">
          <Input label="Student Name" value={planName} onChange={e=>setPlanName(e.target.value)} />
          <Input label="Weak Subjects (comma separated)" value={planWeak} onChange={e=>setPlanWeak(e.target.value)} placeholder="Mathematics, Science" />
          <Input label="Exam Date" type="date" value={planDate} onChange={e=>setPlanDate(e.target.value)} />
        </div>
      )
      case 'lesson_plan': return (
        <div className="grid grid-cols-2 gap-3">
          <Input label="Class" value={lessonClass} onChange={e=>setLessonClass(e.target.value)} />
          <Input label="Subject" value={lessonSub} onChange={e=>setLessonSub(e.target.value)} />
          <Input label="Chapter" value={lessonChap} onChange={e=>setLessonChap(e.target.value)} className="col-span-2" />
          <Input label="Number of Periods" type="number" value={lessonPeriods} onChange={e=>setLessonPeriods(e.target.value)} />
        </div>
      )
      case 'parent_msg': return (
        <div className="space-y-3">
          <Input label="Student Name" value={parentName} onChange={e=>setParentName(e.target.value)} />
          <Input label="Teacher Name" value={teacherName} onChange={e=>setTeacherName(e.target.value)} />
          <Textarea label="Issue / Topic" value={parentIssue} onChange={e=>setParentIssue(e.target.value)} />
        </div>
      )
      case 'doubt': return (
        <div className="space-y-3">
          <Input label="Subject" value={doubtSub} onChange={e=>setDoubtSub(e.target.value)} placeholder="Mathematics" />
          <Textarea label="Your Question" value={doubtQ} onChange={e=>setDoubtQ(e.target.value)} placeholder="Ask your doubt here..." />
        </div>
      )
      default: return null
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-800 text-2xl flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent-violet" /> AI Tools
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Powered by Gemini AI — all tools available</p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <motion.div key={t.id} whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setActiveTool(t.id as Tool); setOutput('') }}
            className={`glass p-5 cursor-pointer transition-all duration-200 ${activeTool === t.id ? 'border-primary-500/50 bg-primary-500/5' : 'hover:border-primary-500/20'}`}
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl mb-3`}>{t.icon}</div>
            <div className="font-display font-700 text-sm mb-1">{t.label}</div>
            <div className="text-xs text-gray-500">{t.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Active tool form */}
      {activeTool && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader
              title={TOOLS.find(t => t.id === activeTool)?.icon + ' ' + TOOLS.find(t => t.id === activeTool)?.label}
              action={<button onClick={() => setActiveTool(null)} className="text-xs text-gray-500 hover:text-gray-300">Close ×</button>}
            />
            {renderForm()}
            <div className="flex gap-3 mt-4">
              <Button variant="accent" loading={loading} onClick={generate} icon={<Sparkles className="w-4 h-4" />}>
                Generate with AI
              </Button>
              {output && (
                <Button variant="outline" onClick={() => { setOutput(''); }} icon={<RefreshCw className="w-4 h-4" />}>
                  Clear
                </Button>
              )}
            </div>
          </Card>

          {/* Output */}
          {output && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader
                  title="AI Output"
                  action={
                    <div className="flex gap-2">
                      <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!') }} className="text-xs text-primary-400">Copy</button>
                      <button onClick={() => toast('PDF export coming soon!')} className="text-xs text-gray-500">Export PDF</button>
                    </div>
                  }
                />
                <pre className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono bg-dark-700/50 rounded-xl p-4 max-h-96 overflow-y-auto">{output}</pre>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
