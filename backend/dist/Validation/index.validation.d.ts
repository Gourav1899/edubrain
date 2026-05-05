export type ValidationResult = {
    valid: boolean;
    errors: string[];
};
export declare function validateLogin(body: any): ValidationResult;
export declare function validateRegisterUser(body: any): ValidationResult;
export declare function validateFaceLogin(body: any): ValidationResult;
export declare function validateFingerprintLogin(body: any): ValidationResult;
export declare function validateInstituteRegister(body: any): ValidationResult;
export declare function validateAddStudent(body: any): ValidationResult;
export declare function validateMarkAttendance(body: any): ValidationResult;
export declare function validateExtractMarks(body: any): ValidationResult;
export declare function validateSaveResult(body: any): ValidationResult;
export declare function validateAiChat(body: any): ValidationResult;
export declare function validateQuestionPaper(body: any): ValidationResult;
export declare function validateCollectFee(body: any): ValidationResult;
export declare function validateCreateNotice(body: any): ValidationResult;
//# sourceMappingURL=index.validation.d.ts.map