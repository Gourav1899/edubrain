"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketDal = exports.TransportRouteDal = exports.LibraryBookDal = exports.TimetableDal = exports.MlPredictionDal = exports.AiChatDal = exports.NoticeDal = exports.AssignmentDal = exports.FeeDal = exports.ResultDal = exports.ExamDal = exports.AttendanceDal = exports.SubjectDal = exports.SectionDal = exports.ClassDal = exports.TeacherDal = exports.StudentDal = exports.UserDal = exports.InstituteDal = exports.SuperAdminDal = void 0;
const flusso_core_1 = require("flusso-core");
const models_1 = require("../Models/models");
class SuperAdminDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.SuperAdminModel.getInstance()); }
}
exports.SuperAdminDal = SuperAdminDal;
class InstituteDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.InstituteModel.getInstance()); }
}
exports.InstituteDal = InstituteDal;
class UserDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.UserModel.getInstance()); }
}
exports.UserDal = UserDal;
class StudentDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.StudentModel.getInstance()); }
}
exports.StudentDal = StudentDal;
class TeacherDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.TeacherModel.getInstance()); }
}
exports.TeacherDal = TeacherDal;
class ClassDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.ClassModel.getInstance()); }
}
exports.ClassDal = ClassDal;
class SectionDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.SectionModel.getInstance()); }
}
exports.SectionDal = SectionDal;
class SubjectDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.SubjectModel.getInstance()); }
}
exports.SubjectDal = SubjectDal;
class AttendanceDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.AttendanceModel.getInstance()); }
}
exports.AttendanceDal = AttendanceDal;
class ExamDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.ExamModel.getInstance()); }
}
exports.ExamDal = ExamDal;
class ResultDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.ResultModel.getInstance()); }
}
exports.ResultDal = ResultDal;
class FeeDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.FeeModel.getInstance()); }
}
exports.FeeDal = FeeDal;
class AssignmentDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.AssignmentModel.getInstance()); }
}
exports.AssignmentDal = AssignmentDal;
class NoticeDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.NoticeModel.getInstance()); }
}
exports.NoticeDal = NoticeDal;
class AiChatDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.AiChatModel.getInstance()); }
}
exports.AiChatDal = AiChatDal;
class MlPredictionDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.MlPredictionModel.getInstance()); }
}
exports.MlPredictionDal = MlPredictionDal;
class TimetableDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.TimetableModel.getInstance()); }
}
exports.TimetableDal = TimetableDal;
class LibraryBookDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.LibraryBookModel.getInstance()); }
}
exports.LibraryBookDal = LibraryBookDal;
class TransportRouteDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.TransportRouteModel.getInstance()); }
}
exports.TransportRouteDal = TransportRouteDal;
class SupportTicketDal extends flusso_core_1.BaseDAL {
    constructor() { super(models_1.SupportTicketModel.getInstance()); }
}
exports.SupportTicketDal = SupportTicketDal;
//# sourceMappingURL=index.dal.js.map