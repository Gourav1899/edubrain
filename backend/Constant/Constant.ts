// ─── APP CONSTANTS ────────────────────────────────────────────────────────────
export const APP_NAME = "EduBrain AI";
export const APP_VERSION = "1.0.0";
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const JWT_EXPIRY = "7d";
export const OTP_EXPIRY_MINUTES = 10;

// ─── ROLES ────────────────────────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
  STAFF: "staff",
  ACCOUNTANT: "accountant",
  LIBRARIAN: "librarian",
  TRANSPORT_MANAGER: "transport_manager",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// ─── PLANS ────────────────────────────────────────────────────────────────────
export const PLANS = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export const PLAN_LIMITS = {
  free: { students: 100, ai_queries_per_day: 5, sms: false, face_attendance: false, fingerprint: false },
  basic: { students: 500, ai_queries_per_day: 50, sms: true, face_attendance: false, fingerprint: false },
  pro: { students: -1, ai_queries_per_day: -1, sms: true, face_attendance: true, fingerprint: true },
  enterprise: { students: -1, ai_queries_per_day: -1, sms: true, face_attendance: true, fingerprint: true },
};

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  HOLIDAY: "holiday",
} as const;

export const ATTENDANCE_METHOD = {
  MANUAL: "manual",
  FACE: "face",
  FINGERPRINT: "fingerprint",
  QR: "qr",
} as const;

export const DEFAULT_ATTENDANCE_THRESHOLD = 75; // %

// ─── FACE RECOGNITION ────────────────────────────────────────────────────────
export const FACE_RECOGNITION_THRESHOLD = 0.85; // cosine similarity threshold
export const FACE_EMBEDDING_SIZE = 128;

// ─── FEE ─────────────────────────────────────────────────────────────────────
export const FEE_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
  OVERDUE: "overdue",
} as const;

export const FEE_TYPES = ["tuition", "transport", "hostel", "library", "exam", "other"] as const;
export const PAYMENT_METHODS = ["cash", "online", "cheque", "upi"] as const;

// ─── GRADES ───────────────────────────────────────────────────────────────────
export const GRADE_THRESHOLDS = [
  { min: 90, grade: "A+" },
  { min: 80, grade: "A" },
  { min: 70, grade: "B+" },
  { min: 60, grade: "B" },
  { min: 50, grade: "C" },
  { min: 35, grade: "D" },
  { min: 0, grade: "F" },
] as const;

// ─── ML RISK ─────────────────────────────────────────────────────────────────
export const ML_RISK = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const ML_WEIGHTS = {
  attendance: 0.30,
  marks: 0.30,
  assignment_submission: 0.15,
  fee_delay: 0.10,
  subjects_failed: 0.15,
};

// ─── NOTICE CATEGORIES ───────────────────────────────────────────────────────
export const NOTICE_CATEGORIES = ["general", "exam", "fee", "holiday", "event", "urgent"] as const;

// ─── EXAM TYPES ──────────────────────────────────────────────────────────────
export const EXAM_TYPES = ["unit_test", "mid_term", "final", "practical"] as const;

// ─── AI MODELS ────────────────────────────────────────────────────────────────
export const GEMINI_MODEL = "gemini-1.5-flash";
export const GEMINI_VISION_MODEL = "gemini-1.5-flash";
export const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// ─── CLOUDINARY FOLDERS ───────────────────────────────────────────────────────
export const CLOUDINARY_FOLDERS = {
  PROFILE_PHOTOS: "edubrain/profiles",
  ANSWER_SHEETS: "edubrain/answer_sheets",
  DOCUMENTS: "edubrain/documents",
  INSTITUTE_LOGOS: "edubrain/logos",
  NOTICES: "edubrain/notices",
  ASSIGNMENTS: "edubrain/assignments",
} as const;

// ─── API RATE LIMITS ──────────────────────────────────────────────────────────
export const RATE_LIMITS = {
  general: { max: 200, windowMs: 60000 },       // 200 req/min
  auth: { max: 10, windowMs: 60000 },            // 10 req/min for login
  ai: { max: 30, windowMs: 60000 },             // 30 AI queries/min
  upload: { max: 20, windowMs: 60000 },         // 20 uploads/min
} as const;

// ─── SUPPORTED STATES (India) ─────────────────────────────────────────────────
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
] as const;

// ─── SMS TEMPLATES ────────────────────────────────────────────────────────────
export const SMS_TEMPLATES = {
  ABSENT: (name: string) => `EduBrain: ${name} is marked ABSENT today. Contact school if this is an error.`,
  LATE: (name: string) => `EduBrain: ${name} marked LATE today. Punctuality is important.`,
  FEE_DUE: (name: string, amount: number, dueDate: string) =>
    `EduBrain: Fee reminder for ${name}. Amount: Rs.${amount}. Due: ${dueDate}. Pay via app.`,
  FEE_PAID: (name: string, amount: number) =>
    `EduBrain: Fee of Rs.${amount} received for ${name}. Thank you!`,
  RESULT: (name: string, pct: number, grade: string) =>
    `EduBrain: ${name} scored ${pct}% (Grade: ${grade}) in recent exam. Check app for details.`,
  EXAM_REMINDER: (name: string, examName: string, date: string) =>
    `EduBrain: Exam reminder for ${name}. ${examName} on ${date}. All the best!`,
};
