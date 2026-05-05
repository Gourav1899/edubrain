// ─── AUTH & USER ──────────────────────────────────────────────────────────────
export type Role =
  | 'super_admin' | 'admin' | 'teacher'
  | 'student' | 'parent' | 'staff'
  | 'accountant' | 'librarian' | 'transport_manager'

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: Role
  institute_id: string
  profile_photo?: string
  is_active: boolean
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isLoggedIn: boolean
}

// ─── INSTITUTE ────────────────────────────────────────────────────────────────
export interface InstituteSettings {
  theme_color: string
  allow_face_attendance: boolean
  allow_fingerprint: boolean
  allow_ai_results: boolean
  sms_enabled: boolean
  whatsapp_enabled: boolean
  email_enabled: boolean
  late_fee_percent: number
  attendance_threshold: number
}

export interface Institute {
  _id: string
  institute_name: string
  institute_type: 'school' | 'college' | 'coaching'
  owner_name: string
  email: string
  phone: string
  city: string
  state: string
  institute_code: string
  logo_url?: string
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  plan_expiry?: string
  is_active: boolean
  settings: InstituteSettings
  created_at: string
}

// ─── STUDENT ──────────────────────────────────────────────────────────────────
export interface Student {
  _id: string
  user_id: string
  institute_id: string
  admission_number: string
  class_id: string
  section_id?: string
  roll_number?: number
  parent_id?: string
  dob?: string
  gender?: 'male' | 'female' | 'other'
  blood_group?: string
  address?: string
  guardian_name?: string
  guardian_phone?: string
  user?: User
  class_name?: string
  section_name?: string
  created_at: string
}

// ─── TEACHER ──────────────────────────────────────────────────────────────────
export interface Teacher {
  _id: string
  user_id: string
  institute_id: string
  employee_id: string
  subjects: string[]
  classes: string[]
  qualification?: string
  experience_years: number
  joining_date?: string
  user?: User
  created_at: string
}

// ─── CLASS & SECTION ──────────────────────────────────────────────────────────
export interface Class {
  _id: string
  institute_id: string
  name: string
  numeric_value?: number
  class_teacher_id?: string
}

export interface Section {
  _id: string
  institute_id: string
  class_id: string
  name: string
  capacity: number
}

// ─── SUBJECT ──────────────────────────────────────────────────────────────────
export interface Subject {
  _id: string
  institute_id: string
  name: string
  code?: string
  class_id?: string
  teacher_id?: string
  max_marks: number
  pass_marks: number
}

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday'
export type AttendanceMethod = 'manual' | 'face' | 'fingerprint' | 'qr'

export interface AttendanceRecord {
  _id: string
  institute_id: string
  class_id: string
  section_id?: string
  student_id: string
  date: string
  status: AttendanceStatus
  method: AttendanceMethod
  marked_by?: string
  face_confidence?: number
  parent_notified: boolean
}

export interface AttendanceSummary {
  total: number
  present: number
  absent: number
  late: number
  percentage: number
}

export interface AttendanceMark {
  student_id: string
  status: AttendanceStatus
}

// ─── EXAM & RESULT ────────────────────────────────────────────────────────────
export interface Exam {
  _id: string
  institute_id: string
  name: string
  exam_type: 'unit_test' | 'mid_term' | 'final' | 'practical'
  class_id?: string
  start_date?: string
  end_date?: string
  is_published: boolean
}

export interface SubjectMark {
  subject_id?: string
  subject_name: string
  max_marks: number
  obtained_marks: number
  grade?: string
  ai_autofilled?: boolean
  answer_sheet_url?: string
}

export interface Result {
  _id: string
  institute_id: string
  exam_id: string
  student_id: string
  class_id?: string
  subject_marks: SubjectMark[]
  total_marks: number
  total_obtained: number
  percentage: number
  grade: string
  rank?: number
  ai_comment?: string
  teacher_comment?: string
  is_published: boolean
  created_at: string
}

// ─── FEE ──────────────────────────────────────────────────────────────────────
export type FeeStatus = 'pending' | 'partial' | 'paid' | 'overdue'
export type PaymentMethod = 'cash' | 'online' | 'cheque' | 'upi'

export interface Fee {
  _id: string
  institute_id: string
  student_id: string
  fee_type: string
  amount: number
  due_date?: string
  paid_amount: number
  late_fee: number
  discount: number
  status: FeeStatus
  payment_method?: PaymentMethod
  transaction_id?: string
  receipt_url?: string
  paid_at?: string
  student?: Student
  created_at: string
}

// ─── NOTICE ───────────────────────────────────────────────────────────────────
export type NoticeCategory = 'general' | 'exam' | 'fee' | 'holiday' | 'event' | 'urgent'

export interface Notice {
  _id: string
  institute_id: string
  title: string
  body?: string
  category: NoticeCategory
  target_roles: Role[]
  target_classes: string[]
  is_pinned: boolean
  attachment_url?: string
  created_by?: string
  created_at: string
}

// ─── AI / ML ──────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface MlPrediction {
  _id: string
  student_id: string
  risk_level: 'low' | 'medium' | 'high'
  fail_probability: number
  dropout_probability: number
  weak_subjects: string[]
  recommendation: string
  input_features: Record<string, number>
  predicted_at: string
  student?: Student
}

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
export interface AdminStats {
  total_students: number
  total_teachers: number
  today_attendance_pct: number
  fee_collected: number
  pending_fees: number
  ai_queries_today: number
  new_admissions: number
  low_attendance_count: number
}

export interface SuperAdminStats {
  total_institutes: number
  active_institutes: number
  inactive_institutes: number
  by_plan: Record<string, number>
  total_students: number
  total_revenue: number
}

// ─── API RESPONSE ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
  errors?: string[]
}

// ─── FORM TYPES ───────────────────────────────────────────────────────────────
export interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export interface RegisterInstituteForm {
  institute_name: string
  institute_type: string
  owner_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  password: string
  confirm_password: string
}

export interface AddStudentForm {
  name: string
  email: string
  phone: string
  admission_number: string
  class_id: string
  section_id: string
  roll_number: number
  dob: string
  gender: string
  guardian_name: string
  guardian_phone: string
}
