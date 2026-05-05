"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminService = exports.LibraryService = exports.NoticeService = exports.FeeService = exports.AiService = exports.ResultService = exports.AttendanceService = exports.StudentService = exports.InstituteService = exports.AuthService = void 0;
const flusso_core_1 = require("flusso-core");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const index_dal_1 = require("../DAL/index.dal");
const JWT_SECRET = process.env.JWT_SECRET || "edubrain_secret_2026";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD_NAME || "";
// ─── AUTH SERVICE ──────────────────────────────────────────────────────────────
class AuthService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.UserDal()); }
    async login(email, password) {
        const user = await this.dal.findOne({ email });
        if (!user)
            throw new Error("User not found");
        if (!user.is_active)
            throw new Error("Account is inactive");
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            throw new Error("Invalid password");
        const token = jwt.sign({ id: user._id, role: user.role, institute_id: user.institute_id }, JWT_SECRET, { expiresIn: "7d" });
        return { token, user: { ...user, password: undefined } };
    }
    async register(data) {
        data.password = await bcrypt.hash(data.password, 12);
        return this.dal.create(data);
    }
    // Face recognition attendance
    async faceLogin(faceEmbedding, institute_id) {
        const users = await this.dal.find({ institute_id, face_embedding: { $exists: true } });
        let bestMatch = null, bestSimilarity = 0;
        for (const u of users) {
            const sim = this.cosineSimilarity(faceEmbedding, u.face_embedding);
            if (sim > bestSimilarity) {
                bestSimilarity = sim;
                bestMatch = u;
            }
        }
        if (bestSimilarity > 0.85)
            return { user: bestMatch, confidence: bestSimilarity };
        throw new Error("Face not recognized");
    }
    cosineSimilarity(a, b) {
        if (!a || !b || a.length !== b.length)
            return 0;
        const dot = a.reduce((s, ai, i) => s + ai * b[i], 0);
        const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
        const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
        return dot / (magA * magB);
    }
    async enrollFace(user_id, embedding) {
        return this.dal.update({ _id: user_id }, { face_embedding: embedding });
    }
    async enrollFingerprint(user_id, fingerprintHash) {
        return this.dal.update({ _id: user_id }, { fingerprint_hash: fingerprintHash });
    }
    async fingerprintLogin(fingerprintHash, institute_id) {
        const user = await this.dal.findOne({ institute_id, fingerprint_hash: fingerprintHash });
        if (!user)
            throw new Error("Fingerprint not matched");
        return user;
    }
}
exports.AuthService = AuthService;
// ─── INSTITUTE SERVICE ─────────────────────────────────────────────────────────
class InstituteService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.InstituteDal()); }
    async registerInstitute(data) {
        const code = "EDU" + Math.random().toString(36).substring(2, 8).toUpperCase();
        return this.dal.create({ ...data, institute_code: code });
    }
    async updateSettings(institute_id, settings) {
        return this.dal.update({ _id: institute_id }, { settings });
    }
    async getAllInstitutes() {
        return this.dal.find({});
    }
    async toggleInstituteStatus(institute_id, is_active) {
        return this.dal.update({ _id: institute_id }, { is_active });
    }
}
exports.InstituteService = InstituteService;
// ─── STUDENT SERVICE ───────────────────────────────────────────────────────────
class StudentService extends flusso_core_1.BaseService {
    constructor() {
        super(new index_dal_1.StudentDal());
        this.userDal = new index_dal_1.UserDal();
    }
    async addStudent(userData, studentData) {
        userData.password = await bcrypt.hash(userData.password || "Student@123", 12);
        userData.role = "student";
        const user = await this.userDal.create(userData);
        const student = await this.dal.create({ ...studentData, user_id: user._id });
        return { user, student };
    }
    async getStudentsByClass(class_id, section_id) {
        const filter = { class_id };
        if (section_id)
            filter.section_id = section_id;
        return this.dal.find(filter);
    }
    async bulkImport(students) {
        return Promise.all(students.map(s => this.addStudent(s.user, s.student)));
    }
    async generateAdmitCard(student_id, exam_id) {
        // Returns data to generate PDF admit card
        const student = await this.dal.findOne({ _id: student_id });
        return { student, exam_id, generated_at: new Date() };
    }
}
exports.StudentService = StudentService;
// ─── ATTENDANCE SERVICE ────────────────────────────────────────────────────────
class AttendanceService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.AttendanceDal()); }
    async markManual(records, class_id, teacher_id, institute_id) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const entries = records.map(r => ({
            institute_id, class_id, student_id: r.student_id,
            date, status: r.status, method: "manual", marked_by: teacher_id
        }));
        return Promise.all(entries.map(e => this.dal.create(e)));
    }
    async markFaceAttendance(student_id, class_id, institute_id, confidence) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return this.dal.create({
            institute_id, class_id, student_id,
            date, status: "present", method: "face",
            face_confidence: Math.round(confidence * 100)
        });
    }
    async markFingerprintAttendance(student_id, class_id, institute_id) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return this.dal.create({
            institute_id, class_id, student_id,
            date, status: "present", method: "fingerprint"
        });
    }
    async getStudentAttendanceSummary(student_id, month, year) {
        const filter = { student_id };
        if (month && year) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0);
            filter.date = { $gte: start, $lte: end };
        }
        const records = await this.dal.find(filter);
        const total = records.length;
        const present = records.filter(r => r.status === "present").length;
        const absent = records.filter(r => r.status === "absent").length;
        const late = records.filter(r => r.status === "late").length;
        return { total, present, absent, late, percentage: total ? Math.round((present / total) * 100) : 0 };
    }
    async getClassAttendanceToday(class_id) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.dal.find({ class_id, date: { $gte: today } });
    }
    async getLowAttendanceStudents(institute_id, threshold = 75) {
        // Returns students below threshold %
        const records = await this.dal.find({ institute_id });
        const byStudent = {};
        records.forEach(r => {
            if (!byStudent[r.student_id])
                byStudent[r.student_id] = [];
            byStudent[r.student_id].push(r);
        });
        const lowAtt = [];
        for (const [sid, recs] of Object.entries(byStudent)) {
            const pct = Math.round((recs.filter(r => r.status === "present").length / recs.length) * 100);
            if (pct < threshold)
                lowAtt.push({ student_id: sid, percentage: pct, total_days: recs.length });
        }
        return lowAtt;
    }
}
exports.AttendanceService = AttendanceService;
// ─── RESULT SERVICE ────────────────────────────────────────────────────────────
class ResultService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.ResultDal()); }
    // AI-powered OCR to extract marks from answer sheet photo
    async extractMarksFromPhoto(imageUrl, subject, maxMarks) {
        try {
            const prompt = `You are an exam evaluator. Look at this answer sheet photo for subject: ${subject} (max marks: ${maxMarks}).
      Extract the total marks obtained. Return ONLY a number, nothing else. If unclear, return -1.`;
            const resp = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [
                            { text: prompt },
                            { inline_data: { mime_type: "image/jpeg", data: imageUrl.split(",")[1] || imageUrl } }
                        ] }]
            });
            const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            const marks = parseFloat(text);
            return isNaN(marks) ? -1 : Math.min(marks, maxMarks);
        }
        catch {
            return -1;
        }
    }
    async saveResult(resultData) {
        // Auto-calculate total, percentage, grade
        const subjects = resultData.subject_marks || [];
        const totalMax = subjects.reduce((s, m) => s + (m.max_marks || 0), 0);
        const totalObtained = subjects.reduce((s, m) => s + (m.obtained_marks || 0), 0);
        const percentage = totalMax ? Math.round((totalObtained / totalMax) * 100) : 0;
        const grade = this.calculateGrade(percentage);
        return this.dal.create({ ...resultData, total_marks: totalMax, total_obtained: totalObtained, percentage, grade });
    }
    calculateGrade(pct) {
        if (pct >= 90)
            return "A+";
        if (pct >= 80)
            return "A";
        if (pct >= 70)
            return "B+";
        if (pct >= 60)
            return "B";
        if (pct >= 50)
            return "C";
        if (pct >= 35)
            return "D";
        return "F";
    }
    async generateAiComment(student_name, percentage, weak_subjects) {
        const prompt = `Generate a professional, encouraging report card comment for a student named ${student_name} 
    who scored ${percentage}% overall. Weak subjects: ${weak_subjects.join(", ") || "none"}.
    Keep it under 80 words, parent-friendly, in English. Only the comment, nothing else.`;
        const resp = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, { contents: [{ parts: [{ text: prompt }] }] });
        return resp.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    }
    async publishResults(exam_id, institute_id) {
        // Calculate ranks and publish
        const results = await this.dal.find({ exam_id, institute_id });
        const sorted = [...results].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
        await Promise.all(sorted.map((r, i) => this.dal.update({ _id: r._id }, { rank: i + 1, is_published: true })));
        return sorted;
    }
}
exports.ResultService = ResultService;
// ─── AI SERVICE ────────────────────────────────────────────────────────────────
class AiService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.AiChatDal()); }
    async chat(messages, systemPrompt) {
        const contents = messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
        if (systemPrompt)
            contents.unshift({ role: "user", parts: [{ text: systemPrompt }] });
        const resp = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, { contents });
        return resp.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, unable to process.";
    }
    async generateQuestionPaper(className, subject, chapter, marks, difficulty, types) {
        const prompt = `Generate a ${marks}-mark question paper for Class ${className}, Subject: ${subject}, Chapter: ${chapter}.
    Difficulty: ${difficulty}. Include these types: ${types.join(", ")}.
    Format as: Section A: MCQs, Section B: Short Answers, Section C: Long Answers.
    Include answer key at the end. Use proper numbering.`;
        return this.chat([{ role: "user", content: prompt }]);
    }
    async generateNotes(className, subject, chapter, topic) {
        const prompt = `Generate comprehensive study notes for Class ${className}, Subject: ${subject}, Chapter: ${chapter}, Topic: ${topic}.
    Include: 1) Summary (300 words), 2) Key Points (10 bullets), 3) 10 MCQs with answers, 4) 5 Short Q&A, 5) Important formulas/dates.
    Format clearly with headings.`;
        return this.chat([{ role: "user", content: prompt }]);
    }
    async generateStudyPlan(studentName, weakSubjects, examDate) {
        const prompt = `Create a personalized study plan for ${studentName} for upcoming exams on ${examDate}.
    Weak subjects: ${weakSubjects.join(", ")}. 
    Create a day-wise plan for remaining days, prioritizing weak subjects. Include daily study hours, topics, revision days, and mock test days.`;
        return this.chat([{ role: "user", content: prompt }]);
    }
    async generateLessonPlan(className, subject, chapter, periods) {
        const prompt = `Create a detailed lesson plan for Class ${className}, Subject: ${subject}, Chapter: ${chapter} for ${periods} periods.
    Include: Period objectives, teaching methods, activities, materials needed, homework, assessment.`;
        return this.chat([{ role: "user", content: prompt }]);
    }
    async solveDoubt(question, subject, className) {
        const prompt = `You are a helpful teacher. Answer this student's doubt clearly and simply.
    ${subject ? `Subject: ${subject}` : ""} ${className ? `Class: ${className}` : ""}
    Question: ${question}
    Give a clear explanation with examples if needed. Use simple language.`;
        return this.chat([{ role: "user", content: prompt }]);
    }
    async generateParentMessage(studentName, issue, teacherName) {
        const prompt = `Write a professional, polite message from teacher ${teacherName} to parents of ${studentName}.
    Issue/Topic: ${issue}. Keep it under 100 words. Be positive and constructive.`;
        return this.chat([{ role: "user", content: prompt }]);
    }
    async mlRiskPrediction(data) {
        const score = ((100 - data.attendance_pct) * 0.3 +
            (100 - data.avg_marks) * 0.3 +
            (100 - data.assignment_submission_rate) * 0.15 +
            (data.fee_delay_days > 0 ? 10 : 0) * 0.1 +
            data.subjects_failed * 5 * 0.15);
        let risk_level;
        if (score < 25)
            risk_level = "low";
        else if (score < 55)
            risk_level = "medium";
        else
            risk_level = "high";
        const prompt = `A student has: ${data.attendance_pct}% attendance, ${data.avg_marks}% avg marks, 
    ${data.assignment_submission_rate}% assignment completion, ${data.subjects_failed} subjects failed.
    Give a 2-sentence actionable recommendation for teachers/admin. Be specific.`;
        const recommendation = await this.chat([{ role: "user", content: prompt }]);
        return {
            risk_level,
            fail_probability: Math.min(score, 100),
            dropout_probability: Math.min(score * 0.7, 100),
            recommendation,
            input_features: data
        };
    }
}
exports.AiService = AiService;
// ─── FEE SERVICE ───────────────────────────────────────────────────────────────
class FeeService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.FeeDal()); }
    async collectFee(fee_id, amount, method, transaction_id) {
        const fee = await this.dal.findOne({ _id: fee_id });
        if (!fee)
            throw new Error("Fee record not found");
        const newPaid = (fee.paid_amount || 0) + amount;
        const total = (fee.amount || 0) + (fee.late_fee || 0) - (fee.discount || 0);
        const status = newPaid >= total ? "paid" : newPaid > 0 ? "partial" : "pending";
        return this.dal.update({ _id: fee_id }, {
            paid_amount: newPaid, status, payment_method: method,
            transaction_id, paid_at: status === "paid" ? new Date() : undefined
        });
    }
    async applyLateFee(fee_id, percent) {
        const fee = await this.dal.findOne({ _id: fee_id });
        if (!fee || fee.status === "paid")
            return;
        const lateFee = Math.round((fee.amount || 0) * (percent / 100));
        return this.dal.update({ _id: fee_id }, { late_fee: lateFee, status: "overdue" });
    }
    async getPendingFees(institute_id) {
        return this.dal.find({ institute_id, status: { $in: ["pending", "overdue", "partial"] } });
    }
    async getRevenueSummary(institute_id) {
        const all = await this.dal.find({ institute_id });
        const collected = all.reduce((s, f) => s + (f.paid_amount || 0), 0);
        const pending = all.filter(f => f.status !== "paid").reduce((s, f) => s + ((f.amount || 0) - (f.paid_amount || 0)), 0);
        return { collected, pending, total_records: all.length };
    }
}
exports.FeeService = FeeService;
// ─── NOTICE SERVICE ────────────────────────────────────────────────────────────
class NoticeService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.NoticeDal()); }
    async createNotice(data) { return this.dal.create(data); }
    async getNoticesForRole(institute_id, role, class_id) {
        const filter = { institute_id, target_roles: { $in: [role] } };
        if (class_id)
            filter.$or = [{ target_classes: { $size: 0 } }, { target_classes: { $in: [class_id] } }];
        return this.dal.find(filter);
    }
}
exports.NoticeService = NoticeService;
// ─── LIBRARY SERVICE ───────────────────────────────────────────────────────────
class LibraryService extends flusso_core_1.BaseService {
    constructor() { super(new index_dal_1.LibraryBookDal()); }
    async issueBook(book_id, student_id, due_date) {
        const book = await this.dal.findOne({ _id: book_id });
        if (!book || (book.available_copies || 0) <= 0)
            throw new Error("Book not available");
        const issued = [...(book.issued_to || []), { student_id, issue_date: new Date(), due_date }];
        return this.dal.update({ _id: book_id }, { issued_to: issued, available_copies: (book.available_copies || 1) - 1 });
    }
    async returnBook(book_id, student_id) {
        const book = await this.dal.findOne({ _id: book_id });
        if (!book)
            throw new Error("Book not found");
        const issued = (book.issued_to || []).filter((i) => i.student_id !== student_id);
        return this.dal.update({ _id: book_id }, { issued_to: issued, available_copies: (book.available_copies || 0) + 1 });
    }
}
exports.LibraryService = LibraryService;
// ─── SUPER ADMIN SERVICE ───────────────────────────────────────────────────────
class SuperAdminService extends flusso_core_1.BaseService {
    constructor() {
        super(new index_dal_1.SuperAdminDal());
        this.instituteDal = new index_dal_1.InstituteDal();
    }
    async getDashboardStats() {
        const institutes = await this.instituteDal.find({});
        const active = institutes.filter(i => i.is_active).length;
        return {
            total_institutes: institutes.length,
            active_institutes: active,
            inactive_institutes: institutes.length - active,
            by_plan: institutes.reduce((acc, i) => { acc[i.plan || "free"] = (acc[i.plan || "free"] || 0) + 1; return acc; }, {})
        };
    }
    async updateGlobalSettings(institute_id, settings) {
        return this.instituteDal.update({ _id: institute_id }, { settings });
    }
}
exports.SuperAdminService = SuperAdminService;
//# sourceMappingURL=index.service.js.map