import { BaseService } from "flusso-core";
import { SuperAdminDal, InstituteDal, UserDal, StudentDal, AttendanceDal, ResultDal, FeeDal, NoticeDal, AiChatDal, LibraryBookDal } from "../DAL/index.dal";
export declare class AuthService extends BaseService<UserDal> {
    constructor();
    login(email: string, password: string): Promise<{
        token: string;
        user: any;
    }>;
    register(data: any): Promise<any>;
    faceLogin(faceEmbedding: number[], institute_id: string): Promise<{
        user: any;
        confidence: number;
    }>;
    cosineSimilarity(a: number[], b: number[]): number;
    enrollFace(user_id: string, embedding: number[]): Promise<any>;
    enrollFingerprint(user_id: string, fingerprintHash: string): Promise<any>;
    fingerprintLogin(fingerprintHash: string, institute_id: string): Promise<any>;
}
export declare class InstituteService extends BaseService<InstituteDal> {
    constructor();
    registerInstitute(data: any): Promise<any>;
    updateSettings(institute_id: string, settings: any): Promise<any>;
    getAllInstitutes(): Promise<any>;
    toggleInstituteStatus(institute_id: string, is_active: boolean): Promise<any>;
}
export declare class StudentService extends BaseService<StudentDal> {
    userDal: UserDal;
    constructor();
    addStudent(userData: any, studentData: any): Promise<{
        user: any;
        student: any;
    }>;
    getStudentsByClass(class_id: string, section_id?: string): Promise<any>;
    bulkImport(students: any[]): Promise<{
        user: any;
        student: any;
    }[]>;
    generateAdmitCard(student_id: string, exam_id: string): Promise<{
        student: any;
        exam_id: string;
        generated_at: Date;
    }>;
}
export declare class AttendanceService extends BaseService<AttendanceDal> {
    constructor();
    markManual(records: {
        student_id: string;
        status: string;
    }[], class_id: string, teacher_id: string, institute_id: string): Promise<any>;
    markFaceAttendance(student_id: string, class_id: string, institute_id: string, confidence: number): Promise<any>;
    markFingerprintAttendance(student_id: string, class_id: string, institute_id: string): Promise<any>;
    getStudentAttendanceSummary(student_id: string, month?: number, year?: number): Promise<{
        total: any;
        present: any;
        absent: any;
        late: any;
        percentage: number;
    }>;
    getClassAttendanceToday(class_id: string): Promise<any>;
    getLowAttendanceStudents(institute_id: string, threshold?: number): Promise<{
        student_id: string;
        percentage: number;
        total_days: number;
    }[]>;
}
export declare class ResultService extends BaseService<ResultDal> {
    constructor();
    extractMarksFromPhoto(imageUrl: string, subject: string, maxMarks: number): Promise<number>;
    saveResult(resultData: any): Promise<any>;
    calculateGrade(pct: number): "A+" | "A" | "B+" | "B" | "C" | "D" | "F";
    generateAiComment(student_name: string, percentage: number, weak_subjects: string[]): Promise<any>;
    publishResults(exam_id: string, institute_id: string): Promise<any[]>;
}
export declare class AiService extends BaseService<AiChatDal> {
    constructor();
    chat(messages: any[], systemPrompt?: string): Promise<any>;
    generateQuestionPaper(className: string, subject: string, chapter: string, marks: number, difficulty: string, types: string[]): Promise<any>;
    generateNotes(className: string, subject: string, chapter: string, topic: string): Promise<any>;
    generateStudyPlan(studentName: string, weakSubjects: string[], examDate: string): Promise<any>;
    generateLessonPlan(className: string, subject: string, chapter: string, periods: number): Promise<any>;
    solveDoubt(question: string, subject?: string, className?: string): Promise<any>;
    generateParentMessage(studentName: string, issue: string, teacherName: string): Promise<any>;
    mlRiskPrediction(data: {
        attendance_pct: number;
        avg_marks: number;
        assignment_submission_rate: number;
        fee_delay_days: number;
        login_frequency: number;
        subjects_failed: number;
    }): Promise<{
        risk_level: string;
        fail_probability: number;
        dropout_probability: number;
        recommendation: any;
        input_features: {
            attendance_pct: number;
            avg_marks: number;
            assignment_submission_rate: number;
            fee_delay_days: number;
            login_frequency: number;
            subjects_failed: number;
        };
    }>;
}
export declare class FeeService extends BaseService<FeeDal> {
    constructor();
    collectFee(fee_id: string, amount: number, method: string, transaction_id?: string): Promise<any>;
    applyLateFee(fee_id: string, percent: number): Promise<any>;
    getPendingFees(institute_id: string): Promise<any>;
    getRevenueSummary(institute_id: string): Promise<{
        collected: any;
        pending: any;
        total_records: any;
    }>;
}
export declare class NoticeService extends BaseService<NoticeDal> {
    constructor();
    createNotice(data: any): Promise<any>;
    getNoticesForRole(institute_id: string, role: string, class_id?: string): Promise<any>;
}
export declare class LibraryService extends BaseService<LibraryBookDal> {
    constructor();
    issueBook(book_id: string, student_id: string, due_date: Date): Promise<any>;
    returnBook(book_id: string, student_id: string): Promise<any>;
}
export declare class SuperAdminService extends BaseService<SuperAdminDal> {
    instituteDal: InstituteDal;
    constructor();
    getDashboardStats(): Promise<{
        total_institutes: any;
        active_institutes: any;
        inactive_institutes: number;
        by_plan: any;
    }>;
    updateGlobalSettings(institute_id: string, settings: any): Promise<any>;
}
//# sourceMappingURL=index.service.d.ts.map