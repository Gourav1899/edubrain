export declare function uploadToCloudinary(base64Data: string, folder?: string): Promise<string>;
export declare function deleteFromCloudinary(publicId: string): Promise<void>;
export declare function sendEmail(to: string, subject: string, html: string): Promise<boolean>;
export declare function attendanceAlertEmail(studentName: string, date: string, status: string, instituteName: string): string;
export declare function feeReminderEmail(studentName: string, amount: number, dueDate: string, instituteName: string): string;
export declare function sendSMS(to: string, message: string): Promise<boolean>;
export declare function sendWhatsApp(to: string, message: string): Promise<boolean>;
export declare function sendPushNotification(fcmToken: string, title: string, body: string, data?: any): Promise<boolean>;
export declare function notifyParent(opts: {
    phone?: string;
    email?: string;
    fcmToken?: string;
    studentName: string;
    type: "absent" | "late" | "fee_reminder" | "result" | "notice";
    message: string;
    settings: any;
    instituteName?: string;
    amount?: number;
    dueDate?: string;
    date?: string;
}): Promise<void>;
export declare function generateInstituteCode(): string;
export declare function calculateGrade(percentage: number): string;
export declare function calculateLateFee(amount: number, dueDateStr: string, lateFeePct: number): number;
export declare function paginate(page?: number, limit?: number): {
    skip: number;
    limit: number;
};
export declare function getTodayStart(): Date;
export declare function getMonthRange(month: number, year: number): {
    start: Date;
    end: Date;
};
export declare function successResponse(data: any, message?: string, meta?: any): {
    meta?: any;
    success: boolean;
    message: string;
    data: any;
};
export declare function errorResponse(message: string, errors?: any): {
    errors?: any;
    success: boolean;
    message: string;
};
//# sourceMappingURL=index.utils.d.ts.map