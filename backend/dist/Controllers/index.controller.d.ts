import { BaseController } from "flusso-core";
import { Request, Response } from "express";
import { AuthService, InstituteService, StudentService, AttendanceService, ResultService, AiService, FeeService, NoticeService, SuperAdminService } from "../Services/index.service";
export declare class AuthController extends BaseController<AuthService> {
    constructor();
    login(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
    faceLogin(req: Request, res: Response): Promise<void>;
    fingerprintLogin(req: Request, res: Response): Promise<void>;
    enrollFace(req: Request, res: Response): Promise<void>;
    enrollFingerprint(req: Request, res: Response): Promise<void>;
}
export declare class InstituteController extends BaseController<InstituteService> {
    constructor();
    register(req: Request, res: Response): Promise<void>;
    updateSettings(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    toggle(req: Request, res: Response): Promise<void>;
}
export declare class StudentController extends BaseController<StudentService> {
    constructor();
    add(req: Request, res: Response): Promise<void>;
    getByClass(req: Request, res: Response): Promise<void>;
    bulkImport(req: Request, res: Response): Promise<void>;
}
export declare class AttendanceController extends BaseController<AttendanceService> {
    constructor();
    markManual(req: Request, res: Response): Promise<void>;
    getSummary(req: Request, res: Response): Promise<void>;
    getLowAttendance(req: Request, res: Response): Promise<void>;
    getToday(req: Request, res: Response): Promise<void>;
}
export declare class ResultController extends BaseController<ResultService> {
    constructor();
    extractMarks(req: Request, res: Response): Promise<void>;
    save(req: Request, res: Response): Promise<void>;
    generateComment(req: Request, res: Response): Promise<void>;
    publish(req: Request, res: Response): Promise<void>;
}
export declare class AiController extends BaseController<AiService> {
    constructor();
    chat(req: Request, res: Response): Promise<void>;
    generateQuestionPaper(req: Request, res: Response): Promise<void>;
    generateNotes(req: Request, res: Response): Promise<void>;
    generateStudyPlan(req: Request, res: Response): Promise<void>;
    generateLessonPlan(req: Request, res: Response): Promise<void>;
    solveDoubt(req: Request, res: Response): Promise<void>;
    mlPrediction(req: Request, res: Response): Promise<void>;
    generateParentMessage(req: Request, res: Response): Promise<void>;
}
export declare class FeeController extends BaseController<FeeService> {
    constructor();
    collect(req: Request, res: Response): Promise<void>;
    pending(req: Request, res: Response): Promise<void>;
    revenue(req: Request, res: Response): Promise<void>;
}
export declare class NoticeController extends BaseController<NoticeService> {
    constructor();
    create(req: Request, res: Response): Promise<void>;
    getForRole(req: Request, res: Response): Promise<void>;
}
export declare class SuperAdminController extends BaseController<SuperAdminService> {
    constructor();
    dashboardStats(req: Request, res: Response): Promise<void>;
    updateInstituteSettings(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=index.controller.d.ts.map