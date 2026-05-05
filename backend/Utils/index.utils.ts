import * as nodemailer from "nodemailer";
import * as cloudinary from "cloudinary";
import axios from "axios";

// ─── CLOUDINARY ───────────────────────────────────────────────────────────────
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(base64Data: string, folder: string = "edubrain"): Promise<string> {
  const result = await cloudinary.v2.uploader.upload(base64Data, {
    folder,
    resource_type: "auto",
    quality: "auto",
    fetch_format: "auto",
  });
  return result.secure_url;
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.v2.uploader.destroy(publicId);
}

// ─── EMAIL SERVICE ────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"EduBrain AI" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (e) {
    console.error("Email error:", e);
    return false;
  }
}

// Email templates
export function attendanceAlertEmail(studentName: string, date: string, status: string, instituteName: string): string {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:12px">
      <div style="background:#4F46E5;padding:20px;border-radius:8px;text-align:center;margin-bottom:20px">
        <h1 style="color:#fff;font-size:20px;margin:0">🧠 EduBrain AI</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">Attendance Notification</p>
      </div>
      <p style="color:#1e293b">Dear Parent,</p>
      <p style="color:#475569">This is to inform you that <strong>${studentName}</strong> was marked <strong style="color:${status === 'absent' ? '#ef4444' : '#f59e0b'}">${status.toUpperCase()}</strong> on <strong>${date}</strong>.</p>
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0;color:#64748b;font-size:13px">Institute: ${instituteName}</p>
        <p style="margin:8px 0 0;color:#64748b;font-size:13px">Please contact the school if this was an error.</p>
      </div>
      <p style="color:#64748b;font-size:12px">— EduBrain AI Automated System</p>
    </div>
  `;
}

export function feeReminderEmail(studentName: string, amount: number, dueDate: string, instituteName: string): string {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:12px">
      <div style="background:#4F46E5;padding:20px;border-radius:8px;text-align:center;margin-bottom:20px">
        <h1 style="color:#fff;font-size:20px;margin:0">🧠 EduBrain AI</h1>
        <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">Fee Payment Reminder</p>
      </div>
      <p style="color:#1e293b">Dear Parent of ${studentName},</p>
      <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0;font-weight:600;color:#92400e">⚠️ Fee Payment Due</p>
        <p style="margin:8px 0 0;color:#78350f">Amount: ₹${amount.toLocaleString()}</p>
        <p style="margin:4px 0 0;color:#78350f">Due Date: ${dueDate}</p>
      </div>
      <p style="color:#475569">Please pay your fees at the earliest to avoid late charges. You can pay online via the EduBrain app.</p>
      <p style="color:#64748b;font-size:12px">— ${instituteName} via EduBrain AI</p>
    </div>
  `;
}

// ─── SMS SERVICE (Twilio) ─────────────────────────────────────────────────────
export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    const { TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM } = process.env;
    if (!TWILIO_SID || !TWILIO_TOKEN) return false;
    await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      new URLSearchParams({ To: to, From: TWILIO_FROM || "", Body: message }),
      { auth: { username: TWILIO_SID, password: TWILIO_TOKEN } }
    );
    return true;
  } catch (e) {
    console.error("SMS error:", e);
    return false;
  }
}

// ─── WHATSAPP (WhatsApp Business API) ────────────────────────────────────────
export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  try {
    const { WA_TOKEN, WA_PHONE_ID } = process.env;
    if (!WA_TOKEN || !WA_PHONE_ID) return false;
    const phone = to.replace(/\D/g, "").replace(/^0/, "91");
    await axios.post(
      `https://graph.facebook.com/v18.0/${WA_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${WA_TOKEN}`, "Content-Type": "application/json" } }
    );
    return true;
  } catch (e) {
    console.error("WhatsApp error:", e);
    return false;
  }
}

// ─── FCM PUSH NOTIFICATION ────────────────────────────────────────────────────
export async function sendPushNotification(fcmToken: string, title: string, body: string, data?: any): Promise<boolean> {
  try {
    const { FCM_SERVER_KEY } = process.env;
    if (!FCM_SERVER_KEY || !fcmToken) return false;
    await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      { to: fcmToken, notification: { title, body }, data },
      { headers: { Authorization: `key=${FCM_SERVER_KEY}`, "Content-Type": "application/json" } }
    );
    return true;
  } catch (e) {
    console.error("Push notification error:", e);
    return false;
  }
}

// ─── NOTIFICATION DISPATCHER ──────────────────────────────────────────────────
// Sends notification via all enabled channels
export async function notifyParent(opts: {
  phone?: string; email?: string; fcmToken?: string;
  studentName: string; type: "absent" | "late" | "fee_reminder" | "result" | "notice";
  message: string; settings: any;
  instituteName?: string; amount?: number; dueDate?: string; date?: string;
}): Promise<void> {
  const { phone, email, fcmToken, message, settings, type, studentName, instituteName } = opts;

  const promises: Promise<any>[] = [];

  // SMS
  if (settings.sms_enabled && phone) {
    promises.push(sendSMS(phone, `EduBrain: ${message}`));
  }

  // WhatsApp
  if (settings.whatsapp_enabled && phone) {
    promises.push(sendWhatsApp(phone, `*EduBrain AI*\n\n${message}`));
  }

  // Email
  if (settings.email_enabled !== false && email) {
    let html = "";
    if (type === "absent" || type === "late") {
      html = attendanceAlertEmail(studentName, opts.date || "today", type, instituteName || "Your School");
    } else if (type === "fee_reminder") {
      html = feeReminderEmail(studentName, opts.amount || 0, opts.dueDate || "", instituteName || "Your School");
    } else {
      html = `<p>${message}</p>`;
    }
    promises.push(sendEmail(email, `EduBrain: ${message.substring(0, 60)}`, html));
  }

  // Push notification
  if (fcmToken) {
    promises.push(sendPushNotification(fcmToken, "EduBrain AI", message));
  }

  await Promise.allSettled(promises);
}

// ─── INSTITUTE CODE GENERATOR ─────────────────────────────────────────────────
export function generateInstituteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "EDU";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ─── GRADE CALCULATOR ─────────────────────────────────────────────────────────
export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 35) return "D";
  return "F";
}

// ─── LATE FEE CALCULATOR ─────────────────────────────────────────────────────
export function calculateLateFee(amount: number, dueDateStr: string, lateFeePct: number): number {
  const dueDate = new Date(dueDateStr);
  const today = new Date();
  if (today <= dueDate) return 0;
  const daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  const lateFee = Math.round(amount * (lateFeePct / 100));
  return daysLate > 0 ? lateFee : 0;
}

// ─── PAGINATION HELPER ────────────────────────────────────────────────────────
export function paginate(page: number = 1, limit: number = 20): { skip: number; limit: number } {
  const skip = (Math.max(1, page) - 1) * limit;
  return { skip, limit: Math.min(limit, 100) };
}

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
export function getTodayStart(): Date {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d;
}
export function getMonthRange(month: number, year: number): { start: Date; end: Date } {
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 0, 23, 59, 59),
  };
}

// ─── RESPONSE STANDARDIZER ────────────────────────────────────────────────────
export function successResponse(data: any, message: string = "Success", meta?: any) {
  return { success: true, message, data, ...(meta ? { meta } : {}) };
}
export function errorResponse(message: string, errors?: any) {
  return { success: false, message, ...(errors ? { errors } : {}) };
}
