import axios, { AxiosError, AxiosInstance } from 'axios'
import type { ApiResponse, AttendanceMark, ChatMessage, User } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// ─── AXIOS INSTANCE ───────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edubrain_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiResponse>) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('edubrain_token')
      localStorage.removeItem('edubrain_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

const handle = async <T>(promise: Promise<any>): Promise<ApiResponse<T>> => {
  try {
    const res = await promise
    return res.data
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Something went wrong'
    throw new Error(msg)
  }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) =>
    handle<{ token: string; user: User }>(api.post('/auth/login', data)),

  faceLogin: (embedding: number[], instituteId: string, classId?: string, markAtt = false) =>
    handle(api.post('/auth/face-login', {
      face_embedding: embedding, institute_id: instituteId,
      class_id: classId, mark_attendance: markAtt,
    })),

  fingerprintLogin: (hash: string, instituteId: string, classId?: string, markAtt = false) =>
    handle(api.post('/auth/fingerprint-login', {
      fingerprint_hash: hash, institute_id: instituteId,
      class_id: classId, mark_attendance: markAtt,
    })),

  enrollFace: (userId: string, embedding: number[]) =>
    handle(api.post('/auth/enroll-face', { user_id: userId, face_embedding: embedding })),

  enrollFingerprint: (userId: string, hash: string) =>
    handle(api.post('/auth/enroll-fingerprint', { user_id: userId, fingerprint_hash: hash })),
}

// ─── INSTITUTE ────────────────────────────────────────────────────────────────
export const instituteApi = {
  register: (data: any) => handle(api.post('/institute/register', data)),
  getAll: () => handle(api.get('/institute/all')),
  getById: (id: string) => handle(api.get(`/institute/${id}`)),
  updateSettings: (id: string, settings: any) =>
    handle(api.put(`/institute/${id}/settings`, { settings })),
  toggle: (id: string, isActive: boolean) =>
    handle(api.patch(`/institute/${id}/toggle`, { is_active: isActive })),
}

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
export const studentApi = {
  add: (userData: any, studentData: any) =>
    handle(api.post('/student/add', { user: userData, student: studentData })),
  getByClass: (classId: string, sectionId?: string) =>
    handle(api.get(`/student/class/${classId}`, { params: { section_id: sectionId } })),
  getById: (id: string) => handle(api.get(`/student/${id}`)),
  update: (id: string, data: any) => handle(api.put(`/student/${id}`, data)),
  delete: (id: string) => handle(api.delete(`/student/${id}`)),
  bulkImport: (students: any[]) => handle(api.post('/student/bulk-import', { students })),
  getAll: (instituteId: string, params?: any) =>
    handle(api.get(`/student/institute/${instituteId}`, { params })),
}

// ─── TEACHERS ─────────────────────────────────────────────────────────────────
export const teacherApi = {
  add: (userData: any, teacherData: any) =>
    handle(api.post('/teacher/add', { user: userData, teacher: teacherData })),
  getAll: (instituteId: string) =>
    handle(api.get(`/teacher/institute/${instituteId}`)),
  getById: (id: string) => handle(api.get(`/teacher/${id}`)),
  update: (id: string, data: any) => handle(api.put(`/teacher/${id}`, data)),
}

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const attendanceApi = {
  markManual: (records: AttendanceMark[], classId: string, instituteId: string) =>
    handle(api.post('/attendance/mark-manual', { records, class_id: classId, institute_id: instituteId })),

  markFace: (studentId: string, classId: string, instituteId: string, confidence: number) =>
    handle(api.post('/attendance/mark-face', { student_id: studentId, class_id: classId, institute_id: instituteId, confidence })),

  getSummary: (studentId: string, month?: number, year?: number) =>
    handle(api.get(`/attendance/summary/${studentId}`, { params: { month, year } })),

  getToday: (classId: string) => handle(api.get(`/attendance/today/${classId}`)),

  getLowAttendance: (instituteId: string, threshold = 75) =>
    handle(api.get(`/attendance/low/${instituteId}`, { params: { threshold } })),

  getReport: (instituteId: string, month: number, year: number) =>
    handle(api.get(`/attendance/report/${instituteId}`, { params: { month, year } })),
}

// ─── EXAMS ────────────────────────────────────────────────────────────────────
export const examApi = {
  create: (data: any) => handle(api.post('/exam/create', data)),
  getAll: (instituteId: string) => handle(api.get(`/exam/institute/${instituteId}`)),
  publish: (examId: string) => handle(api.patch(`/exam/${examId}/publish`)),
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
export const resultApi = {
  extractMarks: (imageBase64: string, subject: string, maxMarks: number) =>
    handle(api.post('/result/extract-marks', { image_url: imageBase64, subject, max_marks: maxMarks })),

  save: (data: any) => handle(api.post('/result/save', data)),

  generateComment: (studentName: string, percentage: number, weakSubjects: string[]) =>
    handle(api.post('/result/generate-comment', { student_name: studentName, percentage, weak_subjects: weakSubjects })),

  publish: (examId: string, instituteId: string) =>
    handle(api.post(`/result/publish/${examId}`, { institute_id: instituteId })),

  getByStudent: (studentId: string) => handle(api.get(`/result/student/${studentId}`)),

  getByExam: (examId: string) => handle(api.get(`/result/exam/${examId}`)),
}

// ─── FEES ─────────────────────────────────────────────────────────────────────
export const feeApi = {
  create: (data: any) => handle(api.post('/fee/create', data)),
  collect: (feeId: string, amount: number, method: string, txnId?: string) =>
    handle(api.post('/fee/collect', { fee_id: feeId, amount, method, transaction_id: txnId })),
  getPending: (instituteId: string) => handle(api.get(`/fee/pending/${instituteId}`)),
  getRevenue: (instituteId: string) => handle(api.get(`/fee/revenue/${instituteId}`)),
  getByStudent: (studentId: string) => handle(api.get(`/fee/student/${studentId}`)),
  applyLateFee: (feeId: string, percent: number) =>
    handle(api.post('/fee/apply-late', { fee_id: feeId, percent })),
}

// ─── NOTICES ──────────────────────────────────────────────────────────────────
export const noticeApi = {
  create: (data: any) => handle(api.post('/notice/create', data)),
  getForRole: (instituteId: string, role: string, classId?: string) =>
    handle(api.get(`/notice/${instituteId}/${role}`, { params: { class_id: classId } })),
  delete: (id: string) => handle(api.delete(`/notice/${id}`)),
}

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiApi = {
  chat: (messages: ChatMessage[]) =>
    handle(api.post('/ai/chat', { messages })),

  solveDoubt: (question: string, subject?: string, cls?: string) =>
    handle(api.post('/ai/solve-doubt', { question, subject, class: cls })),

  generateQuestionPaper: (params: {
    class: string; subject: string; chapter: string
    marks: number; difficulty: string; types: string[]
  }) => handle(api.post('/ai/question-paper', params)),

  generateNotes: (params: { class: string; subject: string; chapter: string; topic: string }) =>
    handle(api.post('/ai/notes', params)),

  generateStudyPlan: (studentName: string, weakSubjects: string[], examDate: string) =>
    handle(api.post('/ai/study-plan', { student_name: studentName, weak_subjects: weakSubjects, exam_date: examDate })),

  generateLessonPlan: (cls: string, subject: string, chapter: string, periods: number) =>
    handle(api.post('/ai/lesson-plan', { class: cls, subject, chapter, periods })),

  generateParentMessage: (studentName: string, issue: string, teacherName: string) =>
    handle(api.post('/ai/parent-message', { student_name: studentName, issue, teacher_name: teacherName })),

  mlPrediction: (features: {
    attendance_pct: number; avg_marks: number; assignment_submission_rate: number
    fee_delay_days: number; login_frequency: number; subjects_failed: number
  }) => handle(api.post('/ai/ml-prediction', features)),
}

// ─── SUPER ADMIN ──────────────────────────────────────────────────────────────
export const superAdminApi = {
  getStats: () => handle(api.get('/super-admin/stats')),
  updateSettings: (instituteId: string, settings: any) =>
    handle(api.put(`/super-admin/institute/${instituteId}/settings`, { settings })),
  getInstitutes: () => handle(api.get('/institute/all')),
}

// ─── CLASSES ──────────────────────────────────────────────────────────────────
export const classApi = {
  getAll: (instituteId: string) => handle(api.get(`/class/institute/${instituteId}`)),
  create: (data: any) => handle(api.post('/class/create', data)),
  getSections: (classId: string) => handle(api.get(`/section/class/${classId}`)),
}

export default api
