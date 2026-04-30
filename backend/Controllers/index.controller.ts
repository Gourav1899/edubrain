import { BaseController } from "flusso-core";
import { ResponseHandler } from "flusso-core";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  AuthService, InstituteService, StudentService, AttendanceService,
  ResultService, AiService, FeeService, NoticeService,
  LibraryService, SuperAdminService
} from "../Services/index.service";

// ─── AUTH CONTROLLER ───────────────────────────────────────────────────────────
export class AuthController extends BaseController<AuthService> {
  constructor() { super(new AuthService()); }

  async login(req: Request, res: Response) {
    try {
      const result = await this.service.login(req.body.email, req.body.password);
      ResponseHandler.success(res, result, "Login successful");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.UNAUTHORIZED); }
  }

  async register(req: Request, res: Response) {
    try {
      const result = await this.service.register(req.body);
      ResponseHandler.success(res, result, "Registered successfully", StatusCodes.CREATED);
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  // POST /auth/face-login - face recognition login & attendance
  async faceLogin(req: Request, res: Response) {
    try {
      const { face_embedding, institute_id, class_id, mark_attendance } = req.body;
      const result = await this.service.faceLogin(face_embedding, institute_id);
      if (mark_attendance && class_id) {
        const attService = new AttendanceService();
        await attService.markFaceAttendance(result.user._id, class_id, institute_id, result.confidence);
      }
      ResponseHandler.success(res, result, "Face recognized");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.UNAUTHORIZED); }
  }

  // POST /auth/fingerprint-login
  async fingerprintLogin(req: Request, res: Response) {
    try {
      const { fingerprint_hash, institute_id, class_id, mark_attendance } = req.body;
      const user = await this.service.fingerprintLogin(fingerprint_hash, institute_id);
      if (mark_attendance && class_id) {
        const attService = new AttendanceService();
        await attService.markFingerprintAttendance(user._id, class_id, institute_id);
      }
      ResponseHandler.success(res, { user }, "Fingerprint matched");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.UNAUTHORIZED); }
  }

  // POST /auth/enroll-face
  async enrollFace(req: Request, res: Response) {
    try {
      const { user_id, face_embedding } = req.body;
      await this.service.enrollFace(user_id, face_embedding);
      ResponseHandler.success(res, {}, "Face enrolled successfully");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  // POST /auth/enroll-fingerprint
  async enrollFingerprint(req: Request, res: Response) {
    try {
      const { user_id, fingerprint_hash } = req.body;
      await this.service.enrollFingerprint(user_id, fingerprint_hash);
      ResponseHandler.success(res, {}, "Fingerprint enrolled successfully");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }
}

// ─── INSTITUTE CONTROLLER ──────────────────────────────────────────────────────
export class InstituteController extends BaseController<InstituteService> {
  constructor() { super(new InstituteService()); }

  async register(req: Request, res: Response) {
    try {
      const result = await this.service.registerInstitute(req.body);
      ResponseHandler.success(res, result, "Institute registered", StatusCodes.CREATED);
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const result = await this.service.updateSettings(req.params.id, req.body.settings);
      ResponseHandler.success(res, result, "Settings updated");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.service.getAllInstitutes();
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async toggle(req: Request, res: Response) {
    try {
      const result = await this.service.toggleInstituteStatus(req.params.id, req.body.is_active);
      ResponseHandler.success(res, result, "Status updated");
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }
}

// ─── STUDENT CONTROLLER ────────────────────────────────────────────────────────
export class StudentController extends BaseController<StudentService> {
  constructor() { super(new StudentService()); }

  async add(req: Request, res: Response) {
    try {
      const result = await this.service.addStudent(req.body.user, req.body.student);
      ResponseHandler.success(res, result, "Student added", StatusCodes.CREATED);
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async getByClass(req: Request, res: Response) {
    try {
      const result = await this.service.getStudentsByClass(req.params.class_id, req.query.section_id as string);
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async bulkImport(req: Request, res: Response) {
    try {
      const result = await this.service.bulkImport(req.body.students);
      ResponseHandler.success(res, result, `${result.length} students imported`);
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }
}

// ─── ATTENDANCE CONTROLLER ────────────────────────────────────────────────────
export class AttendanceController extends BaseController<AttendanceService> {
  constructor() { super(new AttendanceService()); }

  async markManual(req: Request, res: Response) {
    try {
      const { records, class_id, institute_id } = req.body;
      const teacher_id = (req as any).user?.id;
      const result = await this.service.markManual(records, class_id, teacher_id, institute_id);
      ResponseHandler.success(res, result, "Attendance marked");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const { student_id } = req.params;
      const { month, year } = req.query;
      const result = await this.service.getStudentAttendanceSummary(student_id, Number(month), Number(year));
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async getLowAttendance(req: Request, res: Response) {
    try {
      const { institute_id } = req.params;
      const threshold = req.query.threshold ? Number(req.query.threshold) : 75;
      const result = await this.service.getLowAttendanceStudents(institute_id, threshold);
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async getToday(req: Request, res: Response) {
    try {
      const result = await this.service.getClassAttendanceToday(req.params.class_id);
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }
}

// ─── RESULT CONTROLLER ────────────────────────────────────────────────────────
export class ResultController extends BaseController<ResultService> {
  constructor() { super(new ResultService()); }

  // POST /results/extract-marks - AI scan answer sheet photo → marks
  async extractMarks(req: Request, res: Response) {
    try {
      const { image_url, subject, max_marks } = req.body;
      const marks = await this.service.extractMarksFromPhoto(image_url, subject, max_marks);
      ResponseHandler.success(res, { marks, ai_autofilled: marks >= 0 }, "Marks extracted");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async save(req: Request, res: Response) {
    try {
      const result = await this.service.saveResult(req.body);
      ResponseHandler.success(res, result, "Result saved", StatusCodes.CREATED);
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async generateComment(req: Request, res: Response) {
    try {
      const { student_name, percentage, weak_subjects } = req.body;
      const comment = await this.service.generateAiComment(student_name, percentage, weak_subjects);
      ResponseHandler.success(res, { comment }, "AI comment generated");
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async publish(req: Request, res: Response) {
    try {
      const result = await this.service.publishResults(req.params.exam_id, req.body.institute_id);
      ResponseHandler.success(res, result, "Results published");
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }
}

// ─── AI CONTROLLER ────────────────────────────────────────────────────────────
export class AiController extends BaseController<AiService> {
  constructor() { super(new AiService()); }

  async chat(req: Request, res: Response) {
    try {
      const { messages, system_prompt } = req.body;
      const reply = await this.service.chat(messages, system_prompt);
      ResponseHandler.success(res, { reply });
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async generateQuestionPaper(req: Request, res: Response) {
    try {
      const { class: cls, subject, chapter, marks, difficulty, types } = req.body;
      const result = await this.service.generateQuestionPaper(cls, subject, chapter, marks, difficulty, types);
      ResponseHandler.success(res, { question_paper: result });
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async generateNotes(req: Request, res: Response) {
    try {
      const { class: cls, subject, chapter, topic } = req.body;
      const result = await this.service.generateNotes(cls, subject, chapter, topic);
      ResponseHandler.success(res, { notes: result });
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async generateStudyPlan(req: Request, res: Response) {
    try {
      const { student_name, weak_subjects, exam_date } = req.body;
      const result = await this.service.generateStudyPlan(student_name, weak_subjects, exam_date);
      ResponseHandler.success(res, { plan: result });
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async generateLessonPlan(req: Request, res: Response) {
    try {
      const { class: cls, subject, chapter, periods } = req.body;
      const result = await this.service.generateLessonPlan(cls, subject, chapter, periods);
      ResponseHandler.success(res, { lesson_plan: result });
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async solveDoubt(req: Request, res: Response) {
    try {
      const { question, subject, class: cls } = req.body;
      const result = await this.service.solveDoubt(question, subject, cls);
      ResponseHandler.success(res, { answer: result });
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async mlPrediction(req: Request, res: Response) {
    try {
      const result = await this.service.mlRiskPrediction(req.body);
      ResponseHandler.success(res, result, "ML prediction complete");
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async generateParentMessage(req: Request, res: Response) {
    try {
      const { student_name, issue, teacher_name } = req.body;
      const msg = await this.service.generateParentMessage(student_name, issue, teacher_name);
      ResponseHandler.success(res, { message: msg });
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }
}

// ─── FEE CONTROLLER ───────────────────────────────────────────────────────────
export class FeeController extends BaseController<FeeService> {
  constructor() { super(new FeeService()); }

  async collect(req: Request, res: Response) {
    try {
      const { fee_id, amount, method, transaction_id } = req.body;
      const result = await this.service.collectFee(fee_id, amount, method, transaction_id);
      ResponseHandler.success(res, result, "Fee collected");
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async pending(req: Request, res: Response) {
    try {
      const result = await this.service.getPendingFees(req.params.institute_id);
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async revenue(req: Request, res: Response) {
    try {
      const result = await this.service.getRevenueSummary(req.params.institute_id);
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }
}

// ─── NOTICE CONTROLLER ───────────────────────────────────────────────────────
export class NoticeController extends BaseController<NoticeService> {
  constructor() { super(new NoticeService()); }

  async create(req: Request, res: Response) {
    try {
      const result = await this.service.createNotice({ ...req.body, created_by: (req as any).user?.id });
      ResponseHandler.success(res, result, "Notice created", StatusCodes.CREATED);
    } catch (e: any) { ResponseHandler.error(res, e.message, StatusCodes.BAD_REQUEST); }
  }

  async getForRole(req: Request, res: Response) {
    try {
      const result = await this.service.getNoticesForRole(req.params.institute_id, req.params.role, req.query.class_id as string);
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }
}

// ─── SUPER ADMIN CONTROLLER ───────────────────────────────────────────────────
export class SuperAdminController extends BaseController<SuperAdminService> {
  constructor() { super(new SuperAdminService()); }

  async dashboardStats(req: Request, res: Response) {
    try {
      const result = await this.service.getDashboardStats();
      ResponseHandler.success(res, result);
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }

  async updateInstituteSettings(req: Request, res: Response) {
    try {
      const result = await this.service.updateGlobalSettings(req.params.institute_id, req.body.settings);
      ResponseHandler.success(res, result, "Settings updated globally");
    } catch (e: any) { ResponseHandler.error(res, e.message); }
  }
}
