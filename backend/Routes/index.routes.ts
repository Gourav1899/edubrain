import { BaseRoute } from "flusso-core";
import {
  AuthController, InstituteController, StudentController, AttendanceController,
  ResultController, AiController, FeeController, NoticeController, SuperAdminController
} from "../Controllers/index.controller";

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
export class AuthRoute extends BaseRoute<AuthController> {
  constructor() {
    super(new AuthController(), "Auth");
    this.registerRoutes([
      { method: "post", path: "/login",                handler: "login",              middlewares: [] },
      { method: "post", path: "/register",             handler: "register",           middlewares: [] },
      { method: "post", path: "/face-login",           handler: "faceLogin",          middlewares: [] },
      { method: "post", path: "/fingerprint-login",    handler: "fingerprintLogin",   middlewares: [] },
      { method: "post", path: "/enroll-face",          handler: "enrollFace",         middlewares: ["auth"] },
      { method: "post", path: "/enroll-fingerprint",   handler: "enrollFingerprint",  middlewares: ["auth"] },
    ]);
  }
}

// ─── INSTITUTE ROUTES ────────────────────────────────────────────────────────
export class InstituteRoute extends BaseRoute<InstituteController> {
  constructor() {
    super(new InstituteController(), "Institute");
    this.registerRoutes([
      { method: "post",  path: "/register",          handler: "register",       middlewares: [] },
      { method: "get",   path: "/all",               handler: "getAll",         middlewares: ["auth", "super_admin"] },
      { method: "put",   path: "/:id/settings",      handler: "updateSettings", middlewares: ["auth"] },
      { method: "patch", path: "/:id/toggle",        handler: "toggle",         middlewares: ["auth", "super_admin"] },
    ]);
  }
}

// ─── STUDENT ROUTES ───────────────────────────────────────────────────────────
export class StudentRoute extends BaseRoute<StudentController> {
  constructor() {
    super(new StudentController(), "Student");
    this.registerRoutes([
      { method: "post", path: "/add",                     handler: "add",        middlewares: ["auth"] },
      { method: "get",  path: "/class/:class_id",         handler: "getByClass", middlewares: ["auth"] },
      { method: "post", path: "/bulk-import",             handler: "bulkImport", middlewares: ["auth"] },
    ]);
  }
}

// ─── ATTENDANCE ROUTES ────────────────────────────────────────────────────────
export class AttendanceRoute extends BaseRoute<AttendanceController> {
  constructor() {
    super(new AttendanceController(), "Attendance");
    this.registerRoutes([
      { method: "post", path: "/mark-manual",                      handler: "markManual",      middlewares: ["auth"] },
      { method: "get",  path: "/summary/:student_id",              handler: "getSummary",      middlewares: ["auth"] },
      { method: "get",  path: "/low/:institute_id",                handler: "getLowAttendance", middlewares: ["auth"] },
      { method: "get",  path: "/today/:class_id",                  handler: "getToday",        middlewares: ["auth"] },
    ]);
  }
}

// ─── RESULT ROUTES ────────────────────────────────────────────────────────────
export class ResultRoute extends BaseRoute<ResultController> {
  constructor() {
    super(new ResultController(), "Result");
    this.registerRoutes([
      { method: "post", path: "/extract-marks",          handler: "extractMarks",    middlewares: ["auth"] },
      { method: "post", path: "/save",                   handler: "save",            middlewares: ["auth"] },
      { method: "post", path: "/generate-comment",       handler: "generateComment", middlewares: ["auth"] },
      { method: "post", path: "/publish/:exam_id",       handler: "publish",         middlewares: ["auth"] },
    ]);
  }
}

// ─── AI ROUTES ────────────────────────────────────────────────────────────────
export class AiRoute extends BaseRoute<AiController> {
  constructor() {
    super(new AiController(), "Ai");
    this.registerRoutes([
      { method: "post", path: "/chat",                 handler: "chat",                 middlewares: ["auth"] },
      { method: "post", path: "/question-paper",       handler: "generateQuestionPaper",middlewares: ["auth"] },
      { method: "post", path: "/notes",                handler: "generateNotes",         middlewares: ["auth"] },
      { method: "post", path: "/study-plan",           handler: "generateStudyPlan",     middlewares: ["auth"] },
      { method: "post", path: "/lesson-plan",          handler: "generateLessonPlan",    middlewares: ["auth"] },
      { method: "post", path: "/solve-doubt",          handler: "solveDoubt",            middlewares: ["auth"] },
      { method: "post", path: "/ml-prediction",        handler: "mlPrediction",          middlewares: ["auth"] },
      { method: "post", path: "/parent-message",       handler: "generateParentMessage", middlewares: ["auth"] },
    ]);
  }
}

// ─── FEE ROUTES ───────────────────────────────────────────────────────────────
export class FeeRoute extends BaseRoute<FeeController> {
  constructor() {
    super(new FeeController(), "Fee");
    this.registerRoutes([
      { method: "post", path: "/collect",                     handler: "collect",  middlewares: ["auth"] },
      { method: "get",  path: "/pending/:institute_id",       handler: "pending",  middlewares: ["auth"] },
      { method: "get",  path: "/revenue/:institute_id",       handler: "revenue",  middlewares: ["auth"] },
    ]);
  }
}

// ─── NOTICE ROUTES ────────────────────────────────────────────────────────────
export class NoticeRoute extends BaseRoute<NoticeController> {
  constructor() {
    super(new NoticeController(), "Notice");
    this.registerRoutes([
      { method: "post", path: "/create",                           handler: "create",     middlewares: ["auth"] },
      { method: "get",  path: "/:institute_id/:role",              handler: "getForRole", middlewares: ["auth"] },
    ]);
  }
}

// ─── SUPER ADMIN ROUTES ───────────────────────────────────────────────────────
export class SuperAdminRoute extends BaseRoute<SuperAdminController> {
  constructor() {
    super(new SuperAdminController(), "SuperAdmin");
    this.registerRoutes([
      { method: "get",  path: "/stats",                            handler: "dashboardStats",          middlewares: ["auth", "super_admin"] },
      { method: "put",  path: "/institute/:institute_id/settings", handler: "updateInstituteSettings", middlewares: ["auth", "super_admin"] },
    ]);
  }
}
