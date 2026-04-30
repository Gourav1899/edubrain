import { BaseModel, BaseSchemaModel } from "flusso-core";

// ─── SUPER ADMIN ───────────────────────────────────────────────────────────────
export class SuperAdmin extends BaseSchemaModel {
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
export class SuperAdminModel extends BaseModel<SuperAdmin> {
  private static instance: SuperAdminModel;
  constructor() { super("super_admins", new SuperAdmin()); }
  public static getInstance() {
    if (!SuperAdminModel.instance) SuperAdminModel.instance = new SuperAdminModel();
    return SuperAdminModel.instance;
  }
}

// ─── INSTITUTE ─────────────────────────────────────────────────────────────────
export class Institute extends BaseSchemaModel {
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
export class InstituteModel extends BaseModel<Institute> {
  private static instance: InstituteModel;
  constructor() { super("institutes", new Institute()); }
  public static getInstance() {
    if (!InstituteModel.instance) InstituteModel.instance = new InstituteModel();
    return InstituteModel.instance;
  }
}

// ─── USER (base for all roles) ─────────────────────────────────────────────────
export class User extends BaseSchemaModel {
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
      face_embedding: { type: Array },   // facial recognition vector
      fingerprint_hash: { type: String }, // hashed fingerprint data
      is_active: { type: Boolean, default: true },
      fcm_token: { type: String },        // for push notifications
      created_at: { type: Date, default: Date.now },
    });
  }
}
export class UserModel extends BaseModel<User> {
  private static instance: UserModel;
  constructor() { super("users", new User()); }
  public static getInstance() {
    if (!UserModel.instance) UserModel.instance = new UserModel();
    return UserModel.instance;
  }
}

// ─── STUDENT ───────────────────────────────────────────────────────────────────
export class Student extends BaseSchemaModel {
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
export class StudentModel extends BaseModel<Student> {
  private static instance: StudentModel;
  constructor() { super("students", new Student()); }
  public static getInstance() {
    if (!StudentModel.instance) StudentModel.instance = new StudentModel();
    return StudentModel.instance;
  }
}

// ─── TEACHER ───────────────────────────────────────────────────────────────────
export class Teacher extends BaseSchemaModel {
  constructor() {
    super({
      user_id: { type: String, required: true, ref: "users" },
      institute_id: { type: String, required: true },
      employee_id: { type: String, required: true },
      subjects: { type: Array, default: [] },     // subject IDs
      classes: { type: Array, default: [] },       // class IDs
      qualification: { type: String },
      experience_years: { type: Number, default: 0 },
      salary: { type: Number },
      joining_date: { type: Date },
      created_at: { type: Date, default: Date.now },
    });
  }
}
export class TeacherModel extends BaseModel<Teacher> {
  private static instance: TeacherModel;
  constructor() { super("teachers", new Teacher()); }
  public static getInstance() {
    if (!TeacherModel.instance) TeacherModel.instance = new TeacherModel();
    return TeacherModel.instance;
  }
}

// ─── CLASS & SECTION ───────────────────────────────────────────────────────────
export class Class extends BaseSchemaModel {
  constructor() {
    super({
      institute_id: { type: String, required: true },
      name: { type: String, required: true },         // "Class 10"
      numeric_value: { type: Number },
      class_teacher_id: { type: String },
      created_at: { type: Date, default: Date.now },
    });
  }
}
export class ClassModel extends BaseModel<Class> {
  private static instance: ClassModel;
  constructor() { super("classes", new Class()); }
  public static getInstance() {
    if (!ClassModel.instance) ClassModel.instance = new ClassModel();
    return ClassModel.instance;
  }
}

export class Section extends BaseSchemaModel {
  constructor() {
    super({
      institute_id: { type: String, required: true },
      class_id: { type: String, required: true, ref: "classes" },
      name: { type: String, required: true },         // "A", "B", "C"
      capacity: { type: Number, default: 40 },
      created_at: { type: Date, default: Date.now },
    });
  }
}
export class SectionModel extends BaseModel<Section> {
  private static instance: SectionModel;
  constructor() { super("sections", new Section()); }
  public static getInstance() {
    if (!SectionModel.instance) SectionModel.instance = new SectionModel();
    return SectionModel.instance;
  }
}

// ─── SUBJECT ───────────────────────────────────────────────────────────────────
export class Subject extends BaseSchemaModel {
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
export class SubjectModel extends BaseModel<Subject> {
  private static instance: SubjectModel;
  constructor() { super("subjects", new Subject()); }
  public static getInstance() {
    if (!SubjectModel.instance) SubjectModel.instance = new SubjectModel();
    return SubjectModel.instance;
  }
}

// ─── ATTENDANCE ────────────────────────────────────────────────────────────────
export class Attendance extends BaseSchemaModel {
  constructor() {
    super({
      institute_id: { type: String, required: true },
      class_id: { type: String, required: true },
      section_id: { type: String },
      student_id: { type: String, required: true },
      date: { type: Date, required: true },
      status: { type: String, enum: ["present", "absent", "late", "holiday"], required: true },
      method: { type: String, enum: ["manual", "face", "fingerprint", "qr"], default: "manual" },
      marked_by: { type: String },   // teacher user_id
      face_confidence: { type: Number },  // face recognition confidence %
      location: { type: Object },    // GPS if available
      parent_notified: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
    });
  }
}
export class AttendanceModel extends BaseModel<Attendance> {
  private static instance: AttendanceModel;
  constructor() { super("attendance", new Attendance()); }
  public static getInstance() {
    if (!AttendanceModel.instance) AttendanceModel.instance = new AttendanceModel();
    return AttendanceModel.instance;
  }
}

// ─── EXAM ──────────────────────────────────────────────────────────────────────
export class Exam extends BaseSchemaModel {
  constructor() {
    super({
      institute_id: { type: String, required: true },
      name: { type: String, required: true },       // "Mid Term 2026"
      exam_type: { type: String, enum: ["unit_test", "mid_term", "final", "practical"] },
      class_id: { type: String },
      start_date: { type: Date },
      end_date: { type: Date },
      is_published: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
    });
  }
}
export class ExamModel extends BaseModel<Exam> {
  private static instance: ExamModel;
  constructor() { super("exams", new Exam()); }
  public static getInstance() {
    if (!ExamModel.instance) ExamModel.instance = new ExamModel();
    return ExamModel.instance;
  }
}

// ─── RESULT / MARKS ────────────────────────────────────────────────────────────
export class Result extends BaseSchemaModel {
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
      ai_comment: { type: String },    // AI generated report card comment
      teacher_comment: { type: String },
      answer_sheet_photos: { type: Array, default: [] }, // Cloudinary URLs
      is_published: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
    });
  }
}
export class ResultModel extends BaseModel<Result> {
  private static instance: ResultModel;
  constructor() { super("results", new Result()); }
  public static getInstance() {
    if (!ResultModel.instance) ResultModel.instance = new ResultModel();
    return ResultModel.instance;
  }
}

// ─── FEE ───────────────────────────────────────────────────────────────────────
export class Fee extends BaseSchemaModel {
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
export class FeeModel extends BaseModel<Fee> {
  private static instance: FeeModel;
  constructor() { super("fees", new Fee()); }
  public static getInstance() {
    if (!FeeModel.instance) FeeModel.instance = new FeeModel();
    return FeeModel.instance;
  }
}

// ─── ASSIGNMENT ────────────────────────────────────────────────────────────────
export class Assignment extends BaseSchemaModel {
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
export class AssignmentModel extends BaseModel<Assignment> {
  private static instance: AssignmentModel;
  constructor() { super("assignments", new Assignment()); }
  public static getInstance() {
    if (!AssignmentModel.instance) AssignmentModel.instance = new AssignmentModel();
    return AssignmentModel.instance;
  }
}

// ─── NOTICE ────────────────────────────────────────────────────────────────────
export class Notice extends BaseSchemaModel {
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
export class NoticeModel extends BaseModel<Notice> {
  private static instance: NoticeModel;
  constructor() { super("notices", new Notice()); }
  public static getInstance() {
    if (!NoticeModel.instance) NoticeModel.instance = new NoticeModel();
    return NoticeModel.instance;
  }
}

// ─── AI CHAT LOG ───────────────────────────────────────────────────────────────
export class AiChat extends BaseSchemaModel {
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
export class AiChatModel extends BaseModel<AiChat> {
  private static instance: AiChatModel;
  constructor() { super("ai_chats", new AiChat()); }
  public static getInstance() {
    if (!AiChatModel.instance) AiChatModel.instance = new AiChatModel();
    return AiChatModel.instance;
  }
}

// ─── ML PREDICTION ─────────────────────────────────────────────────────────────
export class MlPrediction extends BaseSchemaModel {
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
export class MlPredictionModel extends BaseModel<MlPrediction> {
  private static instance: MlPredictionModel;
  constructor() { super("ml_predictions", new MlPrediction()); }
  public static getInstance() {
    if (!MlPredictionModel.instance) MlPredictionModel.instance = new MlPredictionModel();
    return MlPredictionModel.instance;
  }
}

// ─── TIMETABLE ─────────────────────────────────────────────────────────────────
export class Timetable extends BaseSchemaModel {
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
export class TimetableModel extends BaseModel<Timetable> {
  private static instance: TimetableModel;
  constructor() { super("timetables", new Timetable()); }
  public static getInstance() {
    if (!TimetableModel.instance) TimetableModel.instance = new TimetableModel();
    return TimetableModel.instance;
  }
}

// ─── LIBRARY ───────────────────────────────────────────────────────────────────
export class LibraryBook extends BaseSchemaModel {
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
export class LibraryBookModel extends BaseModel<LibraryBook> {
  private static instance: LibraryBookModel;
  constructor() { super("library_books", new LibraryBook()); }
  public static getInstance() {
    if (!LibraryBookModel.instance) LibraryBookModel.instance = new LibraryBookModel();
    return LibraryBookModel.instance;
  }
}

// ─── TRANSPORT ─────────────────────────────────────────────────────────────────
export class TransportRoute extends BaseSchemaModel {
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
export class TransportRouteModel extends BaseModel<TransportRoute> {
  private static instance: TransportRouteModel;
  constructor() { super("transport_routes", new TransportRoute()); }
  public static getInstance() {
    if (!TransportRouteModel.instance) TransportRouteModel.instance = new TransportRouteModel();
    return TransportRouteModel.instance;
  }
}

// ─── SUPPORT TICKET ────────────────────────────────────────────────────────────
export class SupportTicket extends BaseSchemaModel {
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
export class SupportTicketModel extends BaseModel<SupportTicket> {
  private static instance: SupportTicketModel;
  constructor() { super("support_tickets", new SupportTicket()); }
  public static getInstance() {
    if (!SupportTicketModel.instance) SupportTicketModel.instance = new SupportTicketModel();
    return SupportTicketModel.instance;
  }
}
