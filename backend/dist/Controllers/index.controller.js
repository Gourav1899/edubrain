"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminController = exports.NoticeController = exports.FeeController = exports.AiController = exports.ResultController = exports.AttendanceController = exports.StudentController = exports.InstituteController = exports.AuthController = void 0;
const flusso_core_1 = require("flusso-core");
const flusso_core_2 = require("flusso-core");
const http_status_codes_1 = require("http-status-codes");
const index_service_1 = require("../Services/index.service");
// ─── AUTH CONTROLLER ───────────────────────────────────────────────────────────
class AuthController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.AuthService()); }
    async login(req, res) {
        try {
            const result = await this.service.login(req.body.email, req.body.password);
            flusso_core_2.ResponseHandler.success(res, result, "Login successful");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
    }
    async register(req, res) {
        try {
            const result = await this.service.register(req.body);
            flusso_core_2.ResponseHandler.success(res, result, "Registered successfully", http_status_codes_1.StatusCodes.CREATED);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    // POST /auth/face-login - face recognition login & attendance
    async faceLogin(req, res) {
        try {
            const { face_embedding, institute_id, class_id, mark_attendance } = req.body;
            const result = await this.service.faceLogin(face_embedding, institute_id);
            if (mark_attendance && class_id) {
                const attService = new index_service_1.AttendanceService();
                await attService.markFaceAttendance(result.user._id, class_id, institute_id, result.confidence);
            }
            flusso_core_2.ResponseHandler.success(res, result, "Face recognized");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
    }
    // POST /auth/fingerprint-login
    async fingerprintLogin(req, res) {
        try {
            const { fingerprint_hash, institute_id, class_id, mark_attendance } = req.body;
            const user = await this.service.fingerprintLogin(fingerprint_hash, institute_id);
            if (mark_attendance && class_id) {
                const attService = new index_service_1.AttendanceService();
                await attService.markFingerprintAttendance(user._id, class_id, institute_id);
            }
            flusso_core_2.ResponseHandler.success(res, { user }, "Fingerprint matched");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
    }
    // POST /auth/enroll-face
    async enrollFace(req, res) {
        try {
            const { user_id, face_embedding } = req.body;
            await this.service.enrollFace(user_id, face_embedding);
            flusso_core_2.ResponseHandler.success(res, {}, "Face enrolled successfully");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    // POST /auth/enroll-fingerprint
    async enrollFingerprint(req, res) {
        try {
            const { user_id, fingerprint_hash } = req.body;
            await this.service.enrollFingerprint(user_id, fingerprint_hash);
            flusso_core_2.ResponseHandler.success(res, {}, "Fingerprint enrolled successfully");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
}
exports.AuthController = AuthController;
// ─── INSTITUTE CONTROLLER ──────────────────────────────────────────────────────
class InstituteController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.InstituteService()); }
    async register(req, res) {
        try {
            const result = await this.service.registerInstitute(req.body);
            flusso_core_2.ResponseHandler.success(res, result, "Institute registered", http_status_codes_1.StatusCodes.CREATED);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async updateSettings(req, res) {
        try {
            const result = await this.service.updateSettings(req.params.id, req.body.settings);
            flusso_core_2.ResponseHandler.success(res, result, "Settings updated");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async getAll(req, res) {
        try {
            const result = await this.service.getAllInstitutes();
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async toggle(req, res) {
        try {
            const result = await this.service.toggleInstituteStatus(req.params.id, req.body.is_active);
            flusso_core_2.ResponseHandler.success(res, result, "Status updated");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
}
exports.InstituteController = InstituteController;
// ─── STUDENT CONTROLLER ────────────────────────────────────────────────────────
class StudentController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.StudentService()); }
    async add(req, res) {
        try {
            const result = await this.service.addStudent(req.body.user, req.body.student);
            flusso_core_2.ResponseHandler.success(res, result, "Student added", http_status_codes_1.StatusCodes.CREATED);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async getByClass(req, res) {
        try {
            const result = await this.service.getStudentsByClass(req.params.class_id, req.query.section_id);
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async bulkImport(req, res) {
        try {
            const result = await this.service.bulkImport(req.body.students);
            flusso_core_2.ResponseHandler.success(res, result, `${result.length} students imported`);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
}
exports.StudentController = StudentController;
// ─── ATTENDANCE CONTROLLER ────────────────────────────────────────────────────
class AttendanceController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.AttendanceService()); }
    async markManual(req, res) {
        try {
            const { records, class_id, institute_id } = req.body;
            const teacher_id = req.user?.id;
            const result = await this.service.markManual(records, class_id, teacher_id, institute_id);
            flusso_core_2.ResponseHandler.success(res, result, "Attendance marked");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async getSummary(req, res) {
        try {
            const { student_id } = req.params;
            const { month, year } = req.query;
            const result = await this.service.getStudentAttendanceSummary(student_id, Number(month), Number(year));
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async getLowAttendance(req, res) {
        try {
            const { institute_id } = req.params;
            const threshold = req.query.threshold ? Number(req.query.threshold) : 75;
            const result = await this.service.getLowAttendanceStudents(institute_id, threshold);
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async getToday(req, res) {
        try {
            const result = await this.service.getClassAttendanceToday(req.params.class_id);
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
}
exports.AttendanceController = AttendanceController;
// ─── RESULT CONTROLLER ────────────────────────────────────────────────────────
class ResultController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.ResultService()); }
    // POST /results/extract-marks - AI scan answer sheet photo → marks
    async extractMarks(req, res) {
        try {
            const { image_url, subject, max_marks } = req.body;
            const marks = await this.service.extractMarksFromPhoto(image_url, subject, max_marks);
            flusso_core_2.ResponseHandler.success(res, { marks, ai_autofilled: marks >= 0 }, "Marks extracted");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async save(req, res) {
        try {
            const result = await this.service.saveResult(req.body);
            flusso_core_2.ResponseHandler.success(res, result, "Result saved", http_status_codes_1.StatusCodes.CREATED);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async generateComment(req, res) {
        try {
            const { student_name, percentage, weak_subjects } = req.body;
            const comment = await this.service.generateAiComment(student_name, percentage, weak_subjects);
            flusso_core_2.ResponseHandler.success(res, { comment }, "AI comment generated");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async publish(req, res) {
        try {
            const result = await this.service.publishResults(req.params.exam_id, req.body.institute_id);
            flusso_core_2.ResponseHandler.success(res, result, "Results published");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
}
exports.ResultController = ResultController;
// ─── AI CONTROLLER ────────────────────────────────────────────────────────────
class AiController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.AiService()); }
    async chat(req, res) {
        try {
            const { messages, system_prompt } = req.body;
            const reply = await this.service.chat(messages, system_prompt);
            flusso_core_2.ResponseHandler.success(res, { reply });
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async generateQuestionPaper(req, res) {
        try {
            const { class: cls, subject, chapter, marks, difficulty, types } = req.body;
            const result = await this.service.generateQuestionPaper(cls, subject, chapter, marks, difficulty, types);
            flusso_core_2.ResponseHandler.success(res, { question_paper: result });
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async generateNotes(req, res) {
        try {
            const { class: cls, subject, chapter, topic } = req.body;
            const result = await this.service.generateNotes(cls, subject, chapter, topic);
            flusso_core_2.ResponseHandler.success(res, { notes: result });
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async generateStudyPlan(req, res) {
        try {
            const { student_name, weak_subjects, exam_date } = req.body;
            const result = await this.service.generateStudyPlan(student_name, weak_subjects, exam_date);
            flusso_core_2.ResponseHandler.success(res, { plan: result });
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async generateLessonPlan(req, res) {
        try {
            const { class: cls, subject, chapter, periods } = req.body;
            const result = await this.service.generateLessonPlan(cls, subject, chapter, periods);
            flusso_core_2.ResponseHandler.success(res, { lesson_plan: result });
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async solveDoubt(req, res) {
        try {
            const { question, subject, class: cls } = req.body;
            const result = await this.service.solveDoubt(question, subject, cls);
            flusso_core_2.ResponseHandler.success(res, { answer: result });
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async mlPrediction(req, res) {
        try {
            const result = await this.service.mlRiskPrediction(req.body);
            flusso_core_2.ResponseHandler.success(res, result, "ML prediction complete");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async generateParentMessage(req, res) {
        try {
            const { student_name, issue, teacher_name } = req.body;
            const msg = await this.service.generateParentMessage(student_name, issue, teacher_name);
            flusso_core_2.ResponseHandler.success(res, { message: msg });
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
}
exports.AiController = AiController;
// ─── FEE CONTROLLER ───────────────────────────────────────────────────────────
class FeeController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.FeeService()); }
    async collect(req, res) {
        try {
            const { fee_id, amount, method, transaction_id } = req.body;
            const result = await this.service.collectFee(fee_id, amount, method, transaction_id);
            flusso_core_2.ResponseHandler.success(res, result, "Fee collected");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async pending(req, res) {
        try {
            const result = await this.service.getPendingFees(req.params.institute_id);
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async revenue(req, res) {
        try {
            const result = await this.service.getRevenueSummary(req.params.institute_id);
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
}
exports.FeeController = FeeController;
// ─── NOTICE CONTROLLER ───────────────────────────────────────────────────────
class NoticeController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.NoticeService()); }
    async create(req, res) {
        try {
            const result = await this.service.createNotice({ ...req.body, created_by: req.user?.id });
            flusso_core_2.ResponseHandler.success(res, result, "Notice created", http_status_codes_1.StatusCodes.CREATED);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    async getForRole(req, res) {
        try {
            const result = await this.service.getNoticesForRole(req.params.institute_id, req.params.role, req.query.class_id);
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
}
exports.NoticeController = NoticeController;
// ─── SUPER ADMIN CONTROLLER ───────────────────────────────────────────────────
class SuperAdminController extends flusso_core_1.BaseController {
    constructor() { super(new index_service_1.SuperAdminService()); }
    async dashboardStats(req, res) {
        try {
            const result = await this.service.getDashboardStats();
            flusso_core_2.ResponseHandler.success(res, result);
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
    async updateInstituteSettings(req, res) {
        try {
            const result = await this.service.updateGlobalSettings(req.params.institute_id, req.body.settings);
            flusso_core_2.ResponseHandler.success(res, result, "Settings updated globally");
        }
        catch (e) {
            flusso_core_2.ResponseHandler.error(res, e.message);
        }
    }
}
exports.SuperAdminController = SuperAdminController;
//# sourceMappingURL=index.controller.js.map