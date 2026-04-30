import { BaseDAL } from "flusso-core";
import {
  SuperAdmin, SuperAdminModel,
  Institute, InstituteModel,
  User, UserModel,
  Student, StudentModel,
  Teacher, TeacherModel,
  Class, ClassModel,
  Section, SectionModel,
  Subject, SubjectModel,
  Attendance, AttendanceModel,
  Exam, ExamModel,
  Result, ResultModel,
  Fee, FeeModel,
  Assignment, AssignmentModel,
  Notice, NoticeModel,
  AiChat, AiChatModel,
  MlPrediction, MlPredictionModel,
  Timetable, TimetableModel,
  LibraryBook, LibraryBookModel,
  TransportRoute, TransportRouteModel,
  SupportTicket, SupportTicketModel,
} from "../Models/models";

export class SuperAdminDal extends BaseDAL<SuperAdmin> {
  constructor() { super(SuperAdminModel.getInstance()); }
}
export class InstituteDal extends BaseDAL<Institute> {
  constructor() { super(InstituteModel.getInstance()); }
}
export class UserDal extends BaseDAL<User> {
  constructor() { super(UserModel.getInstance()); }
}
export class StudentDal extends BaseDAL<Student> {
  constructor() { super(StudentModel.getInstance()); }
}
export class TeacherDal extends BaseDAL<Teacher> {
  constructor() { super(TeacherModel.getInstance()); }
}
export class ClassDal extends BaseDAL<Class> {
  constructor() { super(ClassModel.getInstance()); }
}
export class SectionDal extends BaseDAL<Section> {
  constructor() { super(SectionModel.getInstance()); }
}
export class SubjectDal extends BaseDAL<Subject> {
  constructor() { super(SubjectModel.getInstance()); }
}
export class AttendanceDal extends BaseDAL<Attendance> {
  constructor() { super(AttendanceModel.getInstance()); }
}
export class ExamDal extends BaseDAL<Exam> {
  constructor() { super(ExamModel.getInstance()); }
}
export class ResultDal extends BaseDAL<Result> {
  constructor() { super(ResultModel.getInstance()); }
}
export class FeeDal extends BaseDAL<Fee> {
  constructor() { super(FeeModel.getInstance()); }
}
export class AssignmentDal extends BaseDAL<Assignment> {
  constructor() { super(AssignmentModel.getInstance()); }
}
export class NoticeDal extends BaseDAL<Notice> {
  constructor() { super(NoticeModel.getInstance()); }
}
export class AiChatDal extends BaseDAL<AiChat> {
  constructor() { super(AiChatModel.getInstance()); }
}
export class MlPredictionDal extends BaseDAL<MlPrediction> {
  constructor() { super(MlPredictionModel.getInstance()); }
}
export class TimetableDal extends BaseDAL<Timetable> {
  constructor() { super(TimetableModel.getInstance()); }
}
export class LibraryBookDal extends BaseDAL<LibraryBook> {
  constructor() { super(LibraryBookModel.getInstance()); }
}
export class TransportRouteDal extends BaseDAL<TransportRoute> {
  constructor() { super(TransportRouteModel.getInstance()); }
}
export class SupportTicketDal extends BaseDAL<SupportTicket> {
  constructor() { super(SupportTicketModel.getInstance()); }
}
