"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketModel = exports.SupportTicket = exports.TransportRouteModel = exports.TransportRoute = exports.LibraryBookModel = exports.LibraryBook = exports.TimetableModel = exports.Timetable = exports.MlPredictionModel = exports.MlPrediction = exports.AiChatModel = exports.AiChat = exports.NoticeModel = exports.Notice = exports.AssignmentModel = exports.Assignment = exports.FeeModel = exports.Fee = exports.ResultModel = exports.Result = exports.ExamModel = exports.Exam = exports.AttendanceModel = exports.Attendance = exports.SubjectModel = exports.Subject = exports.SectionModel = exports.Section = exports.ClassModel = exports.Class = exports.TeacherModel = exports.Teacher = exports.StudentModel = exports.Student = exports.UserModel = exports.User = exports.InstituteModel = exports.Institute = exports.SuperAdminModel = exports.SuperAdmin = void 0;
const flusso_core_1 = require("flusso-core");
// ─── SUPER ADMIN ───────────────────────────────────────────────────────────────
class SuperAdmin extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            name: { type: String, required: true },
            email: { type: String, required: true, lowercase: true, trim: true },
            password: { type: String, required: true },
            role: { type: String, default: "super_admin" },
            permissions: { type: Object, default: {} }, // full editable config
            is_active: { type: Boolean, default: true },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.SuperAdmin = SuperAdmin;
class SuperAdminModel extends flusso_core_1.BaseModel {
    constructor() { super("super_admins", new SuperAdmin()); }
    static getInstance() {
        if (!SuperAdminModel.instance)
            SuperAdminModel.instance = new SuperAdminModel();
        return SuperAdminModel.instance;
    }
}
exports.SuperAdminModel = SuperAdminModel;
// ─── INSTITUTE ─────────────────────────────────────────────────────────────────
class Institute extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_name: { type: String, required: true },
            institute_type: { type: String, enum: ["school", "college", "coaching"], required: true },
            owner_name: { type: String, required: true },
            email: { type: String, required: true, lowercase: true },
            phone: { type: String, required: true },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            institute_code: { type: String, unique: true }, // auto-generated
            logo_url: { type: String },
            plan: { type: String, enum: ["free", "basic", "pro", "enterprise"], default: "free" },
            plan_expiry: { type: Date },
            is_active: { type: Boolean, default: true },
            settings: {
                type: Object,
                default: {
                    theme_color: "#6366f1",
                    allow_face_attendance: true,
                    allow_fingerprint: true,
                    allow_ai_results: true,
                    sms_enabled: false,
                    whatsapp_enabled: false,
                    late_fee_percent: 5,
                    attendance_threshold: 75,
                },
            },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Institute = Institute;
class InstituteModel extends flusso_core_1.BaseModel {
    constructor() { super("institutes", new Institute()); }
    static getInstance() {
        if (!InstituteModel.instance)
            InstituteModel.instance = new InstituteModel();
        return InstituteModel.instance;
    }
}
exports.InstituteModel = InstituteModel;
// ─── USER (base for all roles) ─────────────────────────────────────────────────
class User extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true, ref: "institutes" },
            name: { type: String, required: true },
            email: { type: String, lowercase: true, trim: true },
            phone: { type: String },
            password: { type: String, required: true },
            role: {
                type: String,
                enum: ["admin", "teacher", "student", "parent", "staff", "accountant", "librarian", "transport_manager"],
                required: true,
            },
            profile_photo: { type: String }, // Cloudinary URL
            face_embedding: { type: Array }, // facial recognition vector
            fingerprint_hash: { type: String }, // hashed fingerprint data
            is_active: { type: Boolean, default: true },
            fcm_token: { type: String }, // for push notifications
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.User = User;
class UserModel extends flusso_core_1.BaseModel {
    constructor() { super("users", new User()); }
    static getInstance() {
        if (!UserModel.instance)
            UserModel.instance = new UserModel();
        return UserModel.instance;
    }
}
exports.UserModel = UserModel;
// ─── STUDENT ───────────────────────────────────────────────────────────────────
class Student extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            user_id: { type: String, required: true, ref: "users" },
            institute_id: { type: String, required: true },
            admission_number: { type: String, required: true },
            class_id: { type: String, ref: "classes" },
            section_id: { type: String, ref: "sections" },
            roll_number: { type: Number },
            parent_id: { type: String, ref: "users" },
            dob: { type: Date },
            gender: { type: String, enum: ["male", "female", "other"] },
            blood_group: { type: String },
            address: { type: String },
            guardian_name: { type: String },
            guardian_phone: { type: String },
            transport_route_id: { type: String },
            hostel_room_id: { type: String },
            documents: { type: Array, default: [] },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Student = Student;
class StudentModel extends flusso_core_1.BaseModel {
    constructor() { super("students", new Student()); }
    static getInstance() {
        if (!StudentModel.instance)
            StudentModel.instance = new StudentModel();
        return StudentModel.instance;
    }
}
exports.StudentModel = StudentModel;
// ─── TEACHER ───────────────────────────────────────────────────────────────────
class Teacher extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            user_id: { type: String, required: true, ref: "users" },
            institute_id: { type: String, required: true },
            employee_id: { type: String, required: true },
            subjects: { type: Array, default: [] }, // subject IDs
            classes: { type: Array, default: [] }, // class IDs
            qualification: { type: String },
            experience_years: { type: Number, default: 0 },
            salary: { type: Number },
            joining_date: { type: Date },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Teacher = Teacher;
class TeacherModel extends flusso_core_1.BaseModel {
    constructor() { super("teachers", new Teacher()); }
    static getInstance() {
        if (!TeacherModel.instance)
            TeacherModel.instance = new TeacherModel();
        return TeacherModel.instance;
    }
}
exports.TeacherModel = TeacherModel;
// ─── CLASS & SECTION ───────────────────────────────────────────────────────────
class Class extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            name: { type: String, required: true }, // "Class 10"
            numeric_value: { type: Number },
            class_teacher_id: { type: String },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Class = Class;
class ClassModel extends flusso_core_1.BaseModel {
    constructor() { super("classes", new Class()); }
    static getInstance() {
        if (!ClassModel.instance)
            ClassModel.instance = new ClassModel();
        return ClassModel.instance;
    }
}
exports.ClassModel = ClassModel;
class Section extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            class_id: { type: String, required: true, ref: "classes" },
            name: { type: String, required: true }, // "A", "B", "C"
            capacity: { type: Number, default: 40 },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Section = Section;
class SectionModel extends flusso_core_1.BaseModel {
    constructor() { super("sections", new Section()); }
    static getInstance() {
        if (!SectionModel.instance)
            SectionModel.instance = new SectionModel();
        return SectionModel.instance;
    }
}
exports.SectionModel = SectionModel;
// ─── SUBJECT ───────────────────────────────────────────────────────────────────
class Subject extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            name: { type: String, required: true },
            code: { type: String },
            class_id: { type: String },
            teacher_id: { type: String },
            max_marks: { type: Number, default: 100 },
            pass_marks: { type: Number, default: 35 },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Subject = Subject;
class SubjectModel extends flusso_core_1.BaseModel {
    constructor() { super("subjects", new Subject()); }
    static getInstance() {
        if (!SubjectModel.instance)
            SubjectModel.instance = new SubjectModel();
        return SubjectModel.instance;
    }
}
exports.SubjectModel = SubjectModel;
// ─── ATTENDANCE ────────────────────────────────────────────────────────────────
class Attendance extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            class_id: { type: String, required: true },
            section_id: { type: String },
            student_id: { type: String, required: true },
            date: { type: Date, required: true },
            status: { type: String, enum: ["present", "absent", "late", "holiday"], required: true },
            method: { type: String, enum: ["manual", "face", "fingerprint", "qr"], default: "manual" },
            marked_by: { type: String }, // teacher user_id
            face_confidence: { type: Number }, // face recognition confidence %
            location: { type: Object }, // GPS if available
            parent_notified: { type: Boolean, default: false },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Attendance = Attendance;
class AttendanceModel extends flusso_core_1.BaseModel {
    constructor() { super("attendance", new Attendance()); }
    static getInstance() {
        if (!AttendanceModel.instance)
            AttendanceModel.instance = new AttendanceModel();
        return AttendanceModel.instance;
    }
}
exports.AttendanceModel = AttendanceModel;
// ─── EXAM ──────────────────────────────────────────────────────────────────────
class Exam extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            name: { type: String, required: true }, // "Mid Term 2026"
            exam_type: { type: String, enum: ["unit_test", "mid_term", "final", "practical"] },
            class_id: { type: String },
            start_date: { type: Date },
            end_date: { type: Date },
            is_published: { type: Boolean, default: false },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Exam = Exam;
class ExamModel extends flusso_core_1.BaseModel {
    constructor() { super("exams", new Exam()); }
    static getInstance() {
        if (!ExamModel.instance)
            ExamModel.instance = new ExamModel();
        return ExamModel.instance;
    }
}
exports.ExamModel = ExamModel;
// ─── RESULT / MARKS ────────────────────────────────────────────────────────────
class Result extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            exam_id: { type: String, required: true, ref: "exams" },
            student_id: { type: String, required: true, ref: "students" },
            class_id: { type: String },
            subject_marks: {
                type: Array,
                default: [],
                // [{subject_id, subject_name, max_marks, obtained_marks, grade, ai_autofilled, answer_sheet_url}]
            },
            total_marks: { type: Number },
            total_obtained: { type: Number },
            percentage: { type: Number },
            grade: { type: String },
            rank: { type: Number },
            ai_comment: { type: String }, // AI generated report card comment
            teacher_comment: { type: String },
            answer_sheet_photos: { type: Array, default: [] }, // Cloudinary URLs
            is_published: { type: Boolean, default: false },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Result = Result;
class ResultModel extends flusso_core_1.BaseModel {
    constructor() { super("results", new Result()); }
    static getInstance() {
        if (!ResultModel.instance)
            ResultModel.instance = new ResultModel();
        return ResultModel.instance;
    }
}
exports.ResultModel = ResultModel;
// ─── FEE ───────────────────────────────────────────────────────────────────────
class Fee extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            student_id: { type: String, required: true },
            fee_type: { type: String, enum: ["tuition", "transport", "hostel", "library", "exam", "other"] },
            amount: { type: Number, required: true },
            due_date: { type: Date },
            paid_amount: { type: Number, default: 0 },
            late_fee: { type: Number, default: 0 },
            discount: { type: Number, default: 0 },
            status: { type: String, enum: ["pending", "partial", "paid", "overdue"], default: "pending" },
            payment_method: { type: String, enum: ["cash", "online", "cheque", "upi"] },
            transaction_id: { type: String },
            receipt_url: { type: String },
            paid_at: { type: Date },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Fee = Fee;
class FeeModel extends flusso_core_1.BaseModel {
    constructor() { super("fees", new Fee()); }
    static getInstance() {
        if (!FeeModel.instance)
            FeeModel.instance = new FeeModel();
        return FeeModel.instance;
    }
}
exports.FeeModel = FeeModel;
// ─── ASSIGNMENT ────────────────────────────────────────────────────────────────
class Assignment extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            teacher_id: { type: String, required: true },
            class_id: { type: String, required: true },
            section_id: { type: String },
            subject_id: { type: String },
            title: { type: String, required: true },
            description: { type: String },
            file_url: { type: String },
            due_date: { type: Date },
            max_marks: { type: Number, default: 10 },
            submissions: { type: Array, default: [] },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Assignment = Assignment;
class AssignmentModel extends flusso_core_1.BaseModel {
    constructor() { super("assignments", new Assignment()); }
    static getInstance() {
        if (!AssignmentModel.instance)
            AssignmentModel.instance = new AssignmentModel();
        return AssignmentModel.instance;
    }
}
exports.AssignmentModel = AssignmentModel;
// ─── NOTICE ────────────────────────────────────────────────────────────────────
class Notice extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            title: { type: String, required: true },
            body: { type: String },
            category: { type: String, enum: ["general", "exam", "fee", "holiday", "event", "urgent"] },
            target_roles: { type: Array, default: ["student", "parent", "teacher"] },
            target_classes: { type: Array, default: [] },
            is_pinned: { type: Boolean, default: false },
            attachment_url: { type: String },
            created_by: { type: String },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Notice = Notice;
class NoticeModel extends flusso_core_1.BaseModel {
    constructor() { super("notices", new Notice()); }
    static getInstance() {
        if (!NoticeModel.instance)
            NoticeModel.instance = new NoticeModel();
        return NoticeModel.instance;
    }
}
exports.NoticeModel = NoticeModel;
// ─── AI CHAT LOG ───────────────────────────────────────────────────────────────
class AiChat extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            user_id: { type: String, required: true },
            role: { type: String },
            messages: { type: Array, default: [] }, // [{role, content, timestamp}]
            type: { type: String, enum: ["doubt_solver", "study_planner", "question_paper", "notes", "report_card"] },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.AiChat = AiChat;
class AiChatModel extends flusso_core_1.BaseModel {
    constructor() { super("ai_chats", new AiChat()); }
    static getInstance() {
        if (!AiChatModel.instance)
            AiChatModel.instance = new AiChatModel();
        return AiChatModel.instance;
    }
}
exports.AiChatModel = AiChatModel;
// ─── ML PREDICTION ─────────────────────────────────────────────────────────────
class MlPrediction extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            student_id: { type: String, required: true },
            risk_level: { type: String, enum: ["low", "medium", "high"] },
            fail_probability: { type: Number },
            dropout_probability: { type: Number },
            weak_subjects: { type: Array, default: [] },
            recommendation: { type: String },
            input_features: { type: Object },
            predicted_at: { type: Date, default: Date.now },
        });
    }
}
exports.MlPrediction = MlPrediction;
class MlPredictionModel extends flusso_core_1.BaseModel {
    constructor() { super("ml_predictions", new MlPrediction()); }
    static getInstance() {
        if (!MlPredictionModel.instance)
            MlPredictionModel.instance = new MlPredictionModel();
        return MlPredictionModel.instance;
    }
}
exports.MlPredictionModel = MlPredictionModel;
// ─── TIMETABLE ─────────────────────────────────────────────────────────────────
class Timetable extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            class_id: { type: String, required: true },
            section_id: { type: String },
            schedule: {
                type: Object,
                default: {},
                // { "monday": [{period:1, subject_id, teacher_id, start_time, end_time}] }
            },
            effective_from: { type: Date },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.Timetable = Timetable;
class TimetableModel extends flusso_core_1.BaseModel {
    constructor() { super("timetables", new Timetable()); }
    static getInstance() {
        if (!TimetableModel.instance)
            TimetableModel.instance = new TimetableModel();
        return TimetableModel.instance;
    }
}
exports.TimetableModel = TimetableModel;
// ─── LIBRARY ───────────────────────────────────────────────────────────────────
class LibraryBook extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            title: { type: String, required: true },
            author: { type: String },
            isbn: { type: String },
            category: { type: String },
            total_copies: { type: Number, default: 1 },
            available_copies: { type: Number, default: 1 },
            issued_to: { type: Array, default: [] }, // [{student_id, issue_date, due_date}]
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.LibraryBook = LibraryBook;
class LibraryBookModel extends flusso_core_1.BaseModel {
    constructor() { super("library_books", new LibraryBook()); }
    static getInstance() {
        if (!LibraryBookModel.instance)
            LibraryBookModel.instance = new LibraryBookModel();
        return LibraryBookModel.instance;
    }
}
exports.LibraryBookModel = LibraryBookModel;
// ─── TRANSPORT ─────────────────────────────────────────────────────────────────
class TransportRoute extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            route_name: { type: String, required: true },
            stops: { type: Array, default: [] },
            driver_name: { type: String },
            driver_phone: { type: String },
            vehicle_number: { type: String },
            capacity: { type: Number },
            fee_per_month: { type: Number },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.TransportRoute = TransportRoute;
class TransportRouteModel extends flusso_core_1.BaseModel {
    constructor() { super("transport_routes", new TransportRoute()); }
    static getInstance() {
        if (!TransportRouteModel.instance)
            TransportRouteModel.instance = new TransportRouteModel();
        return TransportRouteModel.instance;
    }
}
exports.TransportRouteModel = TransportRouteModel;
// ─── SUPPORT TICKET ────────────────────────────────────────────────────────────
class SupportTicket extends flusso_core_1.BaseSchemaModel {
    constructor() {
        super({
            institute_id: { type: String, required: true },
            raised_by: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String },
            status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
            priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
            responses: { type: Array, default: [] },
            created_at: { type: Date, default: Date.now },
        });
    }
}
exports.SupportTicket = SupportTicket;
class SupportTicketModel extends flusso_core_1.BaseModel {
    constructor() { super("support_tickets", new SupportTicket()); }
    static getInstance() {
        if (!SupportTicketModel.instance)
            SupportTicketModel.instance = new SupportTicketModel();
        return SupportTicketModel.instance;
    }
}
exports.SupportTicketModel = SupportTicketModel;
//# sourceMappingURL=models.js.map