export declare const APP_NAME = "EduBrain AI";
export declare const APP_VERSION = "1.0.0";
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const MAX_PAGE_SIZE = 100;
export declare const JWT_EXPIRY = "7d";
export declare const OTP_EXPIRY_MINUTES = 10;
export declare const ROLES: {
    readonly SUPER_ADMIN: "super_admin";
    readonly ADMIN: "admin";
    readonly TEACHER: "teacher";
    readonly STUDENT: "student";
    readonly PARENT: "parent";
    readonly STAFF: "staff";
    readonly ACCOUNTANT: "accountant";
    readonly LIBRARIAN: "librarian";
    readonly TRANSPORT_MANAGER: "transport_manager";
};
export type Role = typeof ROLES[keyof typeof ROLES];
export declare const PLANS: {
    readonly FREE: "free";
    readonly BASIC: "basic";
    readonly PRO: "pro";
    readonly ENTERPRISE: "enterprise";
};
export declare const PLAN_LIMITS: {
    free: {
        students: number;
        ai_queries_per_day: number;
        sms: boolean;
        face_attendance: boolean;
        fingerprint: boolean;
    };
    basic: {
        students: number;
        ai_queries_per_day: number;
        sms: boolean;
        face_attendance: boolean;
        fingerprint: boolean;
    };
    pro: {
        students: number;
        ai_queries_per_day: number;
        sms: boolean;
        face_attendance: boolean;
        fingerprint: boolean;
    };
    enterprise: {
        students: number;
        ai_queries_per_day: number;
        sms: boolean;
        face_attendance: boolean;
        fingerprint: boolean;
    };
};
export declare const ATTENDANCE_STATUS: {
    readonly PRESENT: "present";
    readonly ABSENT: "absent";
    readonly LATE: "late";
    readonly HOLIDAY: "holiday";
};
export declare const ATTENDANCE_METHOD: {
    readonly MANUAL: "manual";
    readonly FACE: "face";
    readonly FINGERPRINT: "fingerprint";
    readonly QR: "qr";
};
export declare const DEFAULT_ATTENDANCE_THRESHOLD = 75;
export declare const FACE_RECOGNITION_THRESHOLD = 0.85;
export declare const FACE_EMBEDDING_SIZE = 128;
export declare const FEE_STATUS: {
    readonly PENDING: "pending";
    readonly PARTIAL: "partial";
    readonly PAID: "paid";
    readonly OVERDUE: "overdue";
};
export declare const FEE_TYPES: readonly ["tuition", "transport", "hostel", "library", "exam", "other"];
export declare const PAYMENT_METHODS: readonly ["cash", "online", "cheque", "upi"];
export declare const GRADE_THRESHOLDS: readonly [{
    readonly min: 90;
    readonly grade: "A+";
}, {
    readonly min: 80;
    readonly grade: "A";
}, {
    readonly min: 70;
    readonly grade: "B+";
}, {
    readonly min: 60;
    readonly grade: "B";
}, {
    readonly min: 50;
    readonly grade: "C";
}, {
    readonly min: 35;
    readonly grade: "D";
}, {
    readonly min: 0;
    readonly grade: "F";
}];
export declare const ML_RISK: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
};
export declare const ML_WEIGHTS: {
    attendance: number;
    marks: number;
    assignment_submission: number;
    fee_delay: number;
    subjects_failed: number;
};
export declare const NOTICE_CATEGORIES: readonly ["general", "exam", "fee", "holiday", "event", "urgent"];
export declare const EXAM_TYPES: readonly ["unit_test", "mid_term", "final", "practical"];
export declare const GEMINI_MODEL = "gemini-1.5-flash";
export declare const GEMINI_VISION_MODEL = "gemini-1.5-flash";
export declare const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
export declare const CLOUDINARY_FOLDERS: {
    readonly PROFILE_PHOTOS: "edubrain/profiles";
    readonly ANSWER_SHEETS: "edubrain/answer_sheets";
    readonly DOCUMENTS: "edubrain/documents";
    readonly INSTITUTE_LOGOS: "edubrain/logos";
    readonly NOTICES: "edubrain/notices";
    readonly ASSIGNMENTS: "edubrain/assignments";
};
export declare const RATE_LIMITS: {
    readonly general: {
        readonly max: 200;
        readonly windowMs: 60000;
    };
    readonly auth: {
        readonly max: 10;
        readonly windowMs: 60000;
    };
    readonly ai: {
        readonly max: 30;
        readonly windowMs: 60000;
    };
    readonly upload: {
        readonly max: 20;
        readonly windowMs: 60000;
    };
};
export declare const INDIAN_STATES: readonly ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
export declare const SMS_TEMPLATES: {
    ABSENT: (name: string) => string;
    LATE: (name: string) => string;
    FEE_DUE: (name: string, amount: number, dueDate: string) => string;
    FEE_PAID: (name: string, amount: number) => string;
    RESULT: (name: string, pct: number, grade: string) => string;
    EXAM_REMINDER: (name: string, examName: string, date: string) => string;
};
//# sourceMappingURL=Constant.d.ts.map