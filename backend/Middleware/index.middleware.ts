import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

const JWT_SECRET = process.env.JWT_SECRET || "edubrain_secret_2026";

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "No token provided" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; institute_id: string };
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
  }
};

// ─── ROLE GUARD ───────────────────────────────────────────────────────────────
export const roleGuard = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Access denied: insufficient role" });
    }
    next();
  };
};

// ─── SUPER ADMIN GUARD ────────────────────────────────────────────────────────
export const superAdminGuard = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== "super_admin") {
    return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Super Admin access required" });
  }
  next();
};

// ─── INSTITUTE GUARD ──────────────────────────────────────────────────────────
// Ensures user belongs to the institute they're accessing
export const instituteGuard = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const instituteId = req.params.institute_id || req.body.institute_id || req.query.institute_id;
  if (user.role === "super_admin") return next(); // super admin can access all
  if (instituteId && user.institute_id !== instituteId) {
    return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Access denied: wrong institute" });
  }
  next();
};

// ─── RATE LIMITER ─────────────────────────────────────────────────────────────
const requestCounts: Map<string, { count: number; resetAt: number }> = new Map();

export const rateLimiter = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const record = requestCounts.get(key);

    if (!record || now > record.resetAt) {
      requestCounts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        success: false,
        message: `Too many requests. Try again in ${Math.ceil((record.resetAt - now) / 1000)}s`,
      });
    }

    record.count++;
    next();
  };
};

// ─── REQUEST LOGGER ───────────────────────────────────────────────────────────
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const color = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
    console.log(`${color}[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms\x1b[0m`);
  });
  next();
};

// ─── FILE UPLOAD VALIDATOR ────────────────────────────────────────────────────
export const validateFileUpload = (allowedTypes: string[], maxSizeMB: number = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file;
    if (!file) return next();
    const ext = file.originalname.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(ext || "")) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `File type .${ext} not allowed. Allowed: ${allowedTypes.join(", ")}`,
      });
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `File too large. Max size: ${maxSizeMB}MB`,
      });
    }
    next();
  };
};
