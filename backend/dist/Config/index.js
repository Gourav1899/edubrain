"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EduBrainConfig = void 0;
const flusso_core_1 = require("flusso-core");
class EduBrainConfig extends flusso_core_1.ConfigDefinition {
    constructor() {
        super({
            port: process.env.PORT || 3000,
            db_uri: process.env.MONGO_URI || "mongodb://localhost:27017/edubrain",
            jwt_secret: process.env.JWT_SECRET || "edubrain_secret_2026",
            gemini_api_key: process.env.GEMINI_API_KEY || "",
            cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
            cloudinary_api_key: process.env.CLOUDINARY_API_KEY || "",
            cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET || "",
            smtp_host: process.env.SMTP_HOST || "",
            smtp_user: process.env.SMTP_USER || "",
            smtp_pass: process.env.SMTP_PASS || "",
            twilio_sid: process.env.TWILIO_SID || "",
            twilio_token: process.env.TWILIO_TOKEN || "",
            razorpay_key: process.env.RAZORPAY_KEY || "",
            razorpay_secret: process.env.RAZORPAY_SECRET || "",
            fcm_server_key: process.env.FCM_SERVER_KEY || "",
            cors_origins: process.env.CORS_ORIGINS || "*",
            rate_limit_window: 15, // minutes
            rate_limit_max: 500, // requests per window per IP
            max_upload_size: "10mb",
        });
    }
}
exports.EduBrainConfig = EduBrainConfig;
//# sourceMappingURL=index.js.map