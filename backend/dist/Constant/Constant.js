"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS_TEMPLATES = exports.INDIAN_STATES = exports.RATE_LIMITS = exports.CLOUDINARY_FOLDERS = exports.GEMINI_BASE_URL = exports.GEMINI_VISION_MODEL = exports.GEMINI_MODEL = exports.EXAM_TYPES = exports.NOTICE_CATEGORIES = exports.ML_WEIGHTS = exports.ML_RISK = exports.GRADE_THRESHOLDS = exports.PAYMENT_METHODS = exports.FEE_TYPES = exports.FEE_STATUS = exports.FACE_EMBEDDING_SIZE = exports.FACE_RECOGNITION_THRESHOLD = exports.DEFAULT_ATTENDANCE_THRESHOLD = exports.ATTENDANCE_METHOD = exports.ATTENDANCE_STATUS = exports.PLAN_LIMITS = exports.PLANS = exports.ROLES = exports.OTP_EXPIRY_MINUTES = exports.JWT_EXPIRY = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.APP_VERSION = exports.APP_NAME = void 0;
// ─── APP CONSTANTS ────────────────────────────────────────────────────────────
exports.APP_NAME = "EduBrain AI";
exports.APP_VERSION = "1.0.0";
exports.DEFAULT_PAGE_SIZE = 20;
exports.MAX_PAGE_SIZE = 100;
exports.JWT_EXPIRY = "7d";
exports.OTP_EXPIRY_MINUTES = 10;
// ─── ROLES ────────────────────────────────────────────────────────────────────
exports.ROLES = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    TEACHER: "teacher",
    STUDENT: "student",
    PARENT: "parent",
    STAFF: "staff",
    ACCOUNTANT: "accountant",
    LIBRARIAN: "librarian",
    TRANSPORT_MANAGER: "transport_manager",
};
// ─── PLANS ────────────────────────────────────────────────────────────────────
exports.PLANS = {
    FREE: "free",
    BASIC: "basic",
    PRO: "pro",
    ENTERPRISE: "enterprise",
};
exports.PLAN_LIMITS = {
    free: { students: 100, ai_queries_per_day: 5, sms: false, face_attendance: false, fingerprint: false },
    basic: { students: 500, ai_queries_per_day: 50, sms: true, face_attendance: false, fingerprint: false },
    pro: { students: -1, ai_queries_per_day: -1, sms: true, face_attendance: true, fingerprint: true },
    enterprise: { students: -1, ai_queries_per_day: -1, sms: true, face_attendance: true, fingerprint: true },
};
// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
exports.ATTENDANCE_STATUS = {
    PRESENT: "present",
    ABSENT: "absent",
    LATE: "late",
    HOLIDAY: "holiday",
};
exports.ATTENDANCE_METHOD = {
    MANUAL: "manual",
    FACE: "face",
    FINGERPRINT: "fingerprint",
    QR: "qr",
};
exports.DEFAULT_ATTENDANCE_THRESHOLD = 75; // %
// ─── FACE RECOGNITION ────────────────────────────────────────────────────────
exports.FACE_RECOGNITION_THRESHOLD = 0.85; // cosine similarity threshold
exports.FACE_EMBEDDING_SIZE = 128;
// ─── FEE ─────────────────────────────────────────────────────────────────────
exports.FEE_STATUS = {
    PENDING: "pending",
    PARTIAL: "partial",
    PAID: "paid",
    OVERDUE: "overdue",
};
exports.FEE_TYPES = ["tuition", "transport", "hostel", "library", "exam", "other"];
exports.PAYMENT_METHODS = ["cash", "online", "cheque", "upi"];
// ─── GRADES ───────────────────────────────────────────────────────────────────
exports.GRADE_THRESHOLDS = [
    { min: 90, grade: "A+" },
    { min: 80, grade: "A" },
    { min: 70, grade: "B+" },
    { min: 60, grade: "B" },
    { min: 50, grade: "C" },
    { min: 35, grade: "D" },
    { min: 0, grade: "F" },
];
// ─── ML RISK ─────────────────────────────────────────────────────────────────
exports.ML_RISK = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
};
exports.ML_WEIGHTS = {
    attendance: 0.30,
    marks: 0.30,
    assignment_submission: 0.15,
    fee_delay: 0.10,
    subjects_failed: 0.15,
};
// ─── NOTICE CATEGORIES ───────────────────────────────────────────────────────
exports.NOTICE_CATEGORIES = ["general", "exam", "fee", "holiday", "event", "urgent"];
// ─── EXAM TYPES ──────────────────────────────────────────────────────────────
exports.EXAM_TYPES = ["unit_test", "mid_term", "final", "practical"];
// ─── AI MODELS ────────────────────────────────────────────────────────────────
exports.GEMINI_MODEL = "gemini-1.5-flash";
exports.GEMINI_VISION_MODEL = "gemini-1.5-flash";
exports.GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
// ─── CLOUDINARY FOLDERS ───────────────────────────────────────────────────────
exports.CLOUDINARY_FOLDERS = {
    PROFILE_PHOTOS: "edubrain/profiles",
    ANSWER_SHEETS: "edubrain/answer_sheets",
    DOCUMENTS: "edubrain/documents",
    INSTITUTE_LOGOS: "edubrain/logos",
    NOTICES: "edubrain/notices",
    ASSIGNMENTS: "edubrain/assignments",
};
// ─── API RATE LIMITS ──────────────────────────────────────────────────────────
exports.RATE_LIMITS = {
    general: { max: 200, windowMs: 60000 }, // 200 req/min
    auth: { max: 10, windowMs: 60000 }, // 10 req/min for login
    ai: { max: 30, windowMs: 60000 }, // 30 AI queries/min
    upload: { max: 20, windowMs: 60000 }, // 20 uploads/min
};
// ─── SUPPORTED STATES (India) ─────────────────────────────────────────────────
exports.INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal",
];
// ─── SMS TEMPLATES ────────────────────────────────────────────────────────────
exports.SMS_TEMPLATES = {
    ABSENT: (name) => `EduBrain: ${name} is marked ABSENT today. Contact school if this is an error.`,
    LATE: (name) => `EduBrain: ${name} marked LATE today. Punctuality is important.`,
    FEE_DUE: (name, amount, dueDate) => `EduBrain: Fee reminder for ${name}. Amount: Rs.${amount}. Due: ${dueDate}. Pay via app.`,
    FEE_PAID: (name, amount) => `EduBrain: Fee of Rs.${amount} received for ${name}. Thank you!`,
    RESULT: (name, pct, grade) => `EduBrain: ${name} scored ${pct}% (Grade: ${grade}) in recent exam. Check app for details.`,
    EXAM_REMINDER: (name, examName, date) => `EduBrain: Exam reminder for ${name}. ${examName} on ${date}. All the best!`,
};
//# sourceMappingURL=Constant.js.map