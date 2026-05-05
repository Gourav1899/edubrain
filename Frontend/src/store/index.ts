import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Institute, ChatMessage } from '../types'

// ─── AUTH STORE ───────────────────────────────────────────────────────────────
interface AuthStore {
  user: User | null
  token: string | null
  institute: Institute | null
  setAuth: (user: User, token: string) => void
  setInstitute: (institute: Institute) => void
  logout: () => void
  isLoggedIn: () => boolean
  dashboardPath: () => string
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      institute: null,

      setAuth: (user, token) => {
        localStorage.setItem('edubrain_token', token)
        set({ user, token })
      },

      setInstitute: (institute) => set({ institute }),

      logout: () => {
        localStorage.removeItem('edubrain_token')
        set({ user: null, token: null, institute: null })
      },

      isLoggedIn: () => !!get().token && !!get().user,

      dashboardPath: () => {
        const role = get().user?.role
        switch (role) {
          case 'super_admin': return '/dashboard/admin'
          case 'admin':       return '/dashboard/admin'
          case 'teacher':     return '/dashboard/teacher'
          case 'student':     return '/dashboard/student'
          case 'parent':      return '/dashboard/parent'
          default:            return '/login'
        }
      },
    }),
    {
      name: 'edubrain-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

// ─── UI STORE ─────────────────────────────────────────────────────────────────
interface UiStore {
  sidebarOpen: boolean
  chatOpen: boolean
  currentPanel: string
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
  toggleChat: () => void
  setChatOpen: (v: boolean) => void
  setPanel: (panel: string) => void
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  chatOpen: false,
  currentPanel: 'dashboard',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  setChatOpen: (v) => set({ chatOpen: v }),
  setPanel: (panel) => set({ currentPanel: panel }),
}))

// ─── CHAT STORE ───────────────────────────────────────────────────────────────
interface ChatStore {
  messages: ChatMessage[]
  isTyping: boolean
  addMessage: (msg: ChatMessage) => void
  setTyping: (v: boolean) => void
  clearMessages: () => void
}

const INITIAL_MSG: ChatMessage = {
  role: 'assistant',
  content: 'Namaste! 🙏 Main EduBrain AI hun.\n\nMain help kar sakta hun:\n• Attendance & Results\n• Fee queries\n• AI Tools (notes, Q-paper)\n• Student doubts\n• ML predictions\n\nKya poochna hai?',
  timestamp: new Date().toISOString(),
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [INITIAL_MSG],
  isTyping: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setTyping: (v) => set({ isTyping: v }),
  clearMessages: () => set({ messages: [INITIAL_MSG] }),
}))

// ─── ATTENDANCE STORE ─────────────────────────────────────────────────────────
interface AttendanceStore {
  marks: Record<string, 'present' | 'absent' | 'late'>
  setMark: (studentId: string, status: 'present' | 'absent' | 'late') => void
  markAll: (studentIds: string[], status: 'present' | 'absent' | 'late') => void
  clearMarks: () => void
  getSummary: () => { present: number; absent: number; late: number; total: number }
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  marks: {},
  setMark: (id, status) => set((s) => ({ marks: { ...s.marks, [id]: status } })),
  markAll: (ids, status) => {
    const marks: Record<string, any> = {}
    ids.forEach((id) => { marks[id] = status })
    set({ marks })
  },
  clearMarks: () => set({ marks: {} }),
  getSummary: () => {
    const marks = Object.values(get().marks)
    return {
      present: marks.filter((m) => m === 'present').length,
      absent: marks.filter((m) => m === 'absent').length,
      late: marks.filter((m) => m === 'late').length,
      total: marks.length,
    }
  },
}))

// ─── RESULT STORE ─────────────────────────────────────────────────────────────
interface SubjectEntry {
  name: string
  max_marks: number
  obtained_marks: number | null
  ai_autofilled: boolean
  photo_url?: string
}

interface ResultStore {
  subjects: SubjectEntry[]
  aiComment: string
  setSubjects: (subjects: SubjectEntry[]) => void
  updateMark: (index: number, marks: number, aiAutofilled?: boolean) => void
  setAiComment: (comment: string) => void
  getTotal: () => { obtained: number; max: number; percentage: number; grade: string }
  resetResult: () => void
}

const defaultSubjects: SubjectEntry[] = [
  { name: 'Mathematics',    max_marks: 100, obtained_marks: null, ai_autofilled: false },
  { name: 'Science',        max_marks: 100, obtained_marks: null, ai_autofilled: false },
  { name: 'English',        max_marks: 100, obtained_marks: null, ai_autofilled: false },
  { name: 'Hindi',          max_marks: 100, obtained_marks: null, ai_autofilled: false },
  { name: 'Social Science', max_marks: 100, obtained_marks: null, ai_autofilled: false },
]

const calcGrade = (pct: number) => {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B+'
  if (pct >= 60) return 'B'
  if (pct >= 50) return 'C'
  if (pct >= 35) return 'D'
  return 'F'
}

export const useResultStore = create<ResultStore>((set, get) => ({
  subjects: [...defaultSubjects],
  aiComment: '',
  setSubjects: (subjects) => set({ subjects }),
  updateMark: (index, marks, aiAutofilled = false) =>
    set((s) => {
      const subjects = [...s.subjects]
      subjects[index] = { ...subjects[index], obtained_marks: marks, ai_autofilled: aiAutofilled }
      return { subjects }
    }),
  setAiComment: (aiComment) => set({ aiComment }),
  getTotal: () => {
    const subjects = get().subjects
    const obtained = subjects.reduce((s, m) => s + (m.obtained_marks ?? 0), 0)
    const max = subjects.reduce((s, m) => s + m.max_marks, 0)
    const pct = max > 0 ? Math.round((obtained / max) * 100) : 0
    return { obtained, max, percentage: pct, grade: calcGrade(pct) }
  },
  resetResult: () => set({ subjects: [...defaultSubjects], aiComment: '' }),
}))
