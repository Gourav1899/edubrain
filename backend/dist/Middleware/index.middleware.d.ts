import { Request, Response, NextFunction } from "express";
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const roleGuard: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const superAdminGuard: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const instituteGuard: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const rateLimiter: (maxRequests?: number, windowMs?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateFileUpload: (allowedTypes: string[], maxSizeMB?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=index.middleware.d.ts.map