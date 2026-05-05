// ─── VALIDATION HELPERS ───────────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
const passwordRegex = /^.{8,}$/;

export type ValidationResult = { valid: boolean; errors: string[] };

function validate(rules: { field: string; value: any; checks: ((v: any) => string | null)[] }[]): ValidationResult {
  const errors: string[] = [];
  rules.forEach(({ field, value, checks }) => {
    checks.forEach(check => {
      const err = check(value);
      if (err) errors.push(`${field}: ${err}`);
    });
  });
  return { valid: errors.length === 0, errors };
}

const required = (v: any) => (!v && v !== 0 ? "is required" : null);
const isEmail = (v: string) => (!emailRegex.test(v) ? "must be a valid email" : null);
const isPhone = (v: string) => (!phoneRegex.test(v?.replace(/\s/g, "")) ? "must be a valid Indian phone number" : null);
const isPassword = (v: string) => (!passwordRegex.test(v) ? "must be at least 8 characters" : null);
const minLen = (n: number) => (v: string) => (v?.length < n ? `must be at least ${n} characters` : null);
const maxLen = (n: number) => (v: string) => (v?.length > n ? `must be at most ${n} characters` : null);
const isEnum = (vals: string[]) => (v: string) => (!vals.includes(v) ? `must be one of: ${vals.join(", ")}` : null);
const isNumber = (v: any) => (isNaN(Number(v)) ? "must be a number" : null);
const inRange = (min: number, max: number) => (v: number) => (v < min || v > max ? `must be between ${min} and ${max}` : null);

// ─── AUTH VALIDATORS ──────────────────────────────────────────────────────────
export function validateLogin(body: any): ValidationResult {
  return validate([
    { field: "email", value: body.email, checks: [required] },
    { field: "password", value: body.password, checks: [required] },
  ]);
}

export function validateRegisterUser(body: any): ValidationResult {
  return validate([
    { field: "name", value: body.name, checks: [required, minLen(2), maxLen(100)] },
    { field: "email", value: body.email, checks: [required, isEmail] },
    { field: "password", value: body.password, checks: [required, isPassword] },
    { field: "role", value: body.role, checks: [required, isEnum(["admin","teacher","student","parent","staff","accountant","librarian","transport_manager"])] },
    { field: "institute_id", value: body.institute_id, checks: [required] },
  ]);
}

export function validateFaceLogin(body: any): ValidationResult {
  return validate([
    { field: "face_embedding", value: body.face_embedding, checks: [(v) => (!Array.isArray(v) || v.length < 10 ? "must be a valid face embedding array" : null)] },
    { field: "institute_id", value: body.institute_id, checks: [required] },
  ]);
}

export function validateFingerprintLogin(body: any): ValidationResult {
  return validate([
    { field: "fingerprint_hash", value: body.fingerprint_hash, checks: [required, minLen(32)] },
    { field: "institute_id", value: body.institute_id, checks: [required] },
  ]);
}

// ─── INSTITUTE VALIDATORS ─────────────────────────────────────────────────────
export function validateInstituteRegister(body: any): ValidationResult {
  return validate([
    { field: "institute_name", value: body.institute_name, checks: [required, minLen(2), maxLen(200)] },
    { field: "institute_type", value: body.institute_type, checks: [required, isEnum(["school","college","coaching"])] },
    { field: "owner_name", value: body.owner_name, checks: [required] },
    { field: "email", value: body.email, checks: [required, isEmail] },
    { field: "phone", value: body.phone, checks: [required] },
  ]);
}

// ─── STUDENT VALIDATORS ───────────────────────────────────────────────────────
export function validateAddStudent(body: any): ValidationResult {
  const userRules = [
    { field: "user.name", value: body.user?.name, checks: [required] },
    { field: "user.institute_id", value: body.user?.institute_id, checks: [required] },
  ];
  const studentRules = [
    { field: "student.admission_number", value: body.student?.admission_number, checks: [required] },
    { field: "student.class_id", value: body.student?.class_id, checks: [required] },
  ];
  return validate([...userRules, ...studentRules]);
}

// ─── ATTENDANCE VALIDATORS ────────────────────────────────────────────────────
export function validateMarkAttendance(body: any): ValidationResult {
  return validate([
    { field: "records", value: body.records, checks: [(v) => (!Array.isArray(v) || v.length === 0 ? "must be a non-empty array of {student_id, status}" : null)] },
    { field: "class_id", value: body.class_id, checks: [required] },
    { field: "institute_id", value: body.institute_id, checks: [required] },
  ]);
}

// ─── RESULT VALIDATORS ────────────────────────────────────────────────────────
export function validateExtractMarks(body: any): ValidationResult {
  return validate([
    { field: "image_url", value: body.image_url, checks: [required] },
    { field: "subject", value: body.subject, checks: [required] },
    { field: "max_marks", value: body.max_marks, checks: [required, isNumber, inRange(1, 1000)] },
  ]);
}

export function validateSaveResult(body: any): ValidationResult {
  return validate([
    { field: "exam_id", value: body.exam_id, checks: [required] },
    { field: "student_id", value: body.student_id, checks: [required] },
    { field: "institute_id", value: body.institute_id, checks: [required] },
    { field: "subject_marks", value: body.subject_marks, checks: [(v) => (!Array.isArray(v) ? "must be array" : null)] },
  ]);
}

// ─── AI VALIDATORS ────────────────────────────────────────────────────────────
export function validateAiChat(body: any): ValidationResult {
  return validate([
    { field: "messages", value: body.messages, checks: [(v) => (!Array.isArray(v) || v.length === 0 ? "must be a non-empty messages array" : null)] },
  ]);
}

export function validateQuestionPaper(body: any): ValidationResult {
  return validate([
    { field: "class", value: body.class, checks: [required] },
    { field: "subject", value: body.subject, checks: [required] },
    { field: "marks", value: body.marks, checks: [required, isNumber, inRange(10, 500)] },
    { field: "difficulty", value: body.difficulty, checks: [required, isEnum(["easy","medium","hard","mixed"])] },
  ]);
}

// ─── FEE VALIDATORS ───────────────────────────────────────────────────────────
export function validateCollectFee(body: any): ValidationResult {
  return validate([
    { field: "fee_id", value: body.fee_id, checks: [required] },
    { field: "amount", value: body.amount, checks: [required, isNumber, (v) => (v <= 0 ? "must be > 0" : null)] },
    { field: "method", value: body.method, checks: [required, isEnum(["cash","online","cheque","upi"])] },
  ]);
}

// ─── NOTICE VALIDATORS ────────────────────────────────────────────────────────
export function validateCreateNotice(body: any): ValidationResult {
  return validate([
    { field: "title", value: body.title, checks: [required, minLen(3), maxLen(200)] },
    { field: "institute_id", value: body.institute_id, checks: [required] },
    { field: "category", value: body.category, checks: [isEnum(["general","exam","fee","holiday","event","urgent"])] },
  ]);
}
