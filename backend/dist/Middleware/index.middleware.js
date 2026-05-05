"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileUpload = exports.requestLogger = exports.rateLimiter = exports.instituteGuard = exports.superAdminGuard = exports.roleGuard = exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const JWT_SECRET = process.env.JWT_SECRET || "edubrain_secret_2026";
// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "No token provided" });
    }
    try {
        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
// ─── ROLE GUARD ───────────────────────────────────────────────────────────────
const roleGuard = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ success: false, message: "Access denied: insufficient role" });
        }
        next();
    };
};
exports.roleGuard = roleGuard;
// ─── SUPER ADMIN GUARD ────────────────────────────────────────────────────────
const superAdminGuard = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "super_admin") {
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ success: false, message: "Super Admin access required" });
    }
    next();
};
exports.superAdminGuard = superAdminGuard;
// ─── INSTITUTE GUARD ──────────────────────────────────────────────────────────
// Ensures user belongs to the institute they're accessing
const instituteGuard = (req, res, next) => {
    const user = req.user;
    const instituteId = req.params.institute_id || req.body.institute_id || req.query.institute_id;
    if (user.role === "super_admin")
        return next(); // super admin can access all
    if (instituteId && user.institute_id !== instituteId) {
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ success: false, message: "Access denied: wrong institute" });
    }
    next();
};
exports.instituteGuard = instituteGuard;
// ─── RATE LIMITER ─────────────────────────────────────────────────────────────
const requestCounts = new Map();
const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const key = req.ip || "unknown";
        const now = Date.now();
        const record = requestCounts.get(key);
        if (!record || now > record.resetAt) {
            requestCounts.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }
        if (record.count >= maxRequests) {
            return res.status(http_status_codes_1.StatusCodes.TOO_MANY_REQUESTS).json({
                success: false,
                message: `Too many requests. Try again in ${Math.ceil((record.resetAt - now) / 1000)}s`,
            });
        }
        record.count++;
        next();
    };
};
exports.rateLimiter = rateLimiter;
// ─── REQUEST LOGGER ───────────────────────────────────────────────────────────
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const color = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
        console.log(`${color}[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms\x1b[0m`);
    });
    next();
};
exports.requestLogger = requestLogger;
// ─── FILE UPLOAD VALIDATOR ────────────────────────────────────────────────────
const validateFileUpload = (allowedTypes, maxSizeMB = 10) => {
    return (req, res, next) => {
        const file = req.file;
        if (!file)
            return next();
        const ext = file.originalname.split(".").pop()?.toLowerCase();
        if (!allowedTypes.includes(ext || "")) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: `File type .${ext} not allowed. Allowed: ${allowedTypes.join(", ")}`,
            });
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: `File too large. Max size: ${maxSizeMB}MB`,
            });
        }
        next();
    };
};
exports.validateFileUpload = validateFileUpload;
//# sourceMappingURL=index.middleware.js.map