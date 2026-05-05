"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminRoute = exports.NoticeRoute = exports.FeeRoute = exports.AiRoute = exports.ResultRoute = exports.AttendanceRoute = exports.StudentRoute = exports.InstituteRoute = exports.AuthRoute = void 0;
const flusso_core_1 = require("flusso-core");
const index_controller_1 = require("../Controllers/index.controller");
// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
class AuthRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.AuthController(), "Auth");
        this.registerRoutes([
            { method: "post", path: "/login", handler: "login", middlewares: [] },
            { method: "post", path: "/register", handler: "register", middlewares: [] },
            { method: "post", path: "/face-login", handler: "faceLogin", middlewares: [] },
            { method: "post", path: "/fingerprint-login", handler: "fingerprintLogin", middlewares: [] },
            { method: "post", path: "/enroll-face", handler: "enrollFace", middlewares: ["auth"] },
            { method: "post", path: "/enroll-fingerprint", handler: "enrollFingerprint", middlewares: ["auth"] },
        ]);
    }
}
exports.AuthRoute = AuthRoute;
// ─── INSTITUTE ROUTES ────────────────────────────────────────────────────────
class InstituteRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.InstituteController(), "Institute");
        this.registerRoutes([
            { method: "post", path: "/register", handler: "register", middlewares: [] },
            { method: "get", path: "/all", handler: "getAll", middlewares: ["auth", "super_admin"] },
            { method: "put", path: "/:id/settings", handler: "updateSettings", middlewares: ["auth"] },
            { method: "patch", path: "/:id/toggle", handler: "toggle", middlewares: ["auth", "super_admin"] },
        ]);
    }
}
exports.InstituteRoute = InstituteRoute;
// ─── STUDENT ROUTES ───────────────────────────────────────────────────────────
class StudentRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.StudentController(), "Student");
        this.registerRoutes([
            { method: "post", path: "/add", handler: "add", middlewares: ["auth"] },
            { method: "get", path: "/class/:class_id", handler: "getByClass", middlewares: ["auth"] },
            { method: "post", path: "/bulk-import", handler: "bulkImport", middlewares: ["auth"] },
        ]);
    }
}
exports.StudentRoute = StudentRoute;
// ─── ATTENDANCE ROUTES ────────────────────────────────────────────────────────
class AttendanceRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.AttendanceController(), "Attendance");
        this.registerRoutes([
            { method: "post", path: "/mark-manual", handler: "markManual", middlewares: ["auth"] },
            { method: "get", path: "/summary/:student_id", handler: "getSummary", middlewares: ["auth"] },
            { method: "get", path: "/low/:institute_id", handler: "getLowAttendance", middlewares: ["auth"] },
            { method: "get", path: "/today/:class_id", handler: "getToday", middlewares: ["auth"] },
        ]);
    }
}
exports.AttendanceRoute = AttendanceRoute;
// ─── RESULT ROUTES ────────────────────────────────────────────────────────────
class ResultRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.ResultController(), "Result");
        this.registerRoutes([
            { method: "post", path: "/extract-marks", handler: "extractMarks", middlewares: ["auth"] },
            { method: "post", path: "/save", handler: "save", middlewares: ["auth"] },
            { method: "post", path: "/generate-comment", handler: "generateComment", middlewares: ["auth"] },
            { method: "post", path: "/publish/:exam_id", handler: "publish", middlewares: ["auth"] },
        ]);
    }
}
exports.ResultRoute = ResultRoute;
// ─── AI ROUTES ────────────────────────────────────────────────────────────────
class AiRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.AiController(), "Ai");
        this.registerRoutes([
            { method: "post", path: "/chat", handler: "chat", middlewares: ["auth"] },
            { method: "post", path: "/question-paper", handler: "generateQuestionPaper", middlewares: ["auth"] },
            { method: "post", path: "/notes", handler: "generateNotes", middlewares: ["auth"] },
            { method: "post", path: "/study-plan", handler: "generateStudyPlan", middlewares: ["auth"] },
            { method: "post", path: "/lesson-plan", handler: "generateLessonPlan", middlewares: ["auth"] },
            { method: "post", path: "/solve-doubt", handler: "solveDoubt", middlewares: ["auth"] },
            { method: "post", path: "/ml-prediction", handler: "mlPrediction", middlewares: ["auth"] },
            { method: "post", path: "/parent-message", handler: "generateParentMessage", middlewares: ["auth"] },
        ]);
    }
}
exports.AiRoute = AiRoute;
// ─── FEE ROUTES ───────────────────────────────────────────────────────────────
class FeeRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.FeeController(), "Fee");
        this.registerRoutes([
            { method: "post", path: "/collect", handler: "collect", middlewares: ["auth"] },
            { method: "get", path: "/pending/:institute_id", handler: "pending", middlewares: ["auth"] },
            { method: "get", path: "/revenue/:institute_id", handler: "revenue", middlewares: ["auth"] },
        ]);
    }
}
exports.FeeRoute = FeeRoute;
// ─── NOTICE ROUTES ────────────────────────────────────────────────────────────
class NoticeRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.NoticeController(), "Notice");
        this.registerRoutes([
            { method: "post", path: "/create", handler: "create", middlewares: ["auth"] },
            { method: "get", path: "/:institute_id/:role", handler: "getForRole", middlewares: ["auth"] },
        ]);
    }
}
exports.NoticeRoute = NoticeRoute;
// ─── SUPER ADMIN ROUTES ───────────────────────────────────────────────────────
class SuperAdminRoute extends flusso_core_1.BaseRoute {
    constructor() {
        super(new index_controller_1.SuperAdminController(), "SuperAdmin");
        this.registerRoutes([
            { method: "get", path: "/stats", handler: "dashboardStats", middlewares: ["auth", "super_admin"] },
            { method: "put", path: "/institute/:institute_id/settings", handler: "updateInstituteSettings", middlewares: ["auth", "super_admin"] },
        ]);
    }
}
exports.SuperAdminRoute = SuperAdminRoute;
//# sourceMappingURL=index.routes.js.map