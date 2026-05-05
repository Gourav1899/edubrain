# 🧠 EduBrain AI — Complete Setup & Deployment Guide

## Project Structure

```
edubrain/
├── backend/                    ← TypeScript API (Flusso-core)
│   ├── Models/models.ts        ← 20+ MongoDB schemas
│   ├── DAL/index.dal.ts        ← Data Access Layer
│   ├── Services/index.service.ts ← Business logic
│   ├── Controllers/index.controller.ts
│   ├── Routes/index.routes.ts
│   ├── Middleware/index.middleware.ts ← JWT, rate limit, role guard
│   ├── Validation/index.validation.ts ← Request validators
│   ├── Utils/index.utils.ts    ← Email, SMS, WhatsApp, Cloudinary
│   ├── Constant/Constant.ts    ← All app constants
│   ├── Config/index.ts
│   ├── Dockerfile
│   ├── .env.example
│   └── index.ts
│
├── edubrain_web/               ← Static Website (4 pages)
│   ├── index.html              ← Landing page (full sections)
│   ├── login.html              ← Login + biometric options
│   ├── register.html           ← 4 role registration flows
│   └── dashboard.html          ← Unified dashboard (all 4 roles)
│
├── flutter_app/                ← Android APK (Flutter)
│   ├── pubspec.yaml
│   ├── android/app/
│   │   ├── AndroidManifest.xml ← All permissions
│   │   └── build.gradle        ← APK split by ABI
│   └── lib/
│       ├── main.dart
│       ├── services/
│       │   ├── api_service.dart
│       │   └── auth_service.dart
│       └── screens/
│           ├── splash_screen.dart
│           ├── auth/login_screen.dart
│           ├── dashboard/
│           │   ├── admin_dashboard.dart
│           │   ├── teacher_dashboard.dart
│           │   ├── student_dashboard.dart
│           │   └── parent_dashboard.dart
│           ├── attendance/
│           │   ├── face_attendance_screen.dart ← Camera + ML Kit
│           │   ├── fingerprint_screen.dart     ← local_auth biometric
│           │   └── manual_attendance_screen.dart
│           ├── results/
│           │   └── result_entry_screen.dart    ← AI photo → marks
│           ├── ai/
│           │   └── ai_assistant_screen.dart    ← Full chatbot
│           └── settings/
│               └── super_admin_settings.dart
│
├── docker-compose.yml          ← Full stack with MongoDB + Nginx
└── nginx.conf                  ← Production nginx config
```

---

## ⚡ Quick Start (Development)

### 1. Backend

```bash
cd edubrain/backend
cp .env.example .env
# Edit .env with your API keys

npm install
npm run dev
# API running at http://localhost:3000
```

### 2. Website

```bash
# Just open the HTML files directly in browser, OR
# Serve with any static server:
cd edubrain_web
npx serve .
# Website at http://localhost:3000
```

### 3. Flutter App

```bash
cd edubrain/flutter_app

# Install dependencies
flutter pub get

# Run on device/emulator
flutter run

# Build APK (debug)
flutter build apk --debug

# Build APK (release - smaller file)
flutter build apk --release --split-per-abi
# Output: build/app/outputs/flutter-apk/
#   app-arm64-v8a-release.apk   ← Modern phones (recommended)
#   app-armeabi-v7a-release.apk ← Older phones
#   app-x86_64-release.apk      ← Emulators
#   app-release.apk             ← Universal (all devices, ~30MB larger)
```

---

## 🚀 Production Deployment

### Option A: Docker (Recommended)

```bash
# Clone repo
git clone https://github.com/your/edubrain.git
cd edubrain

# Create .env from example
cp backend/.env.example backend/.env
nano backend/.env  # Fill in all values

# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Services running:
# API: http://localhost:3000
# Website: http://localhost:80
# MongoDB: localhost:27017
```

### Option B: Railway / Render (Backend)

```bash
# 1. Push code to GitHub
# 2. Connect to Railway/Render
# 3. Set environment variables in dashboard
# 4. Deploy — auto-build from Dockerfile
```

### Option C: Vercel (Website)

```bash
# Just drag & drop edubrain_web/ folder to Vercel
# Or use CLI:
npm i -g vercel
cd edubrain_web
vercel --prod
```

---

## 🔑 API Keys Setup

### Gemini API (AI Features)
1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Add to .env: `GEMINI_API_KEY=AIza...`

### Cloudinary (Image Storage)
1. Sign up at https://cloudinary.com (free tier available)
2. Dashboard → Copy cloud name, API key, API secret
3. Add to .env

### Twilio (SMS)
1. Sign up at https://twilio.com
2. Get Account SID, Auth Token, Phone Number
3. Add to .env

### Firebase (Push Notifications)
1. Create project at https://console.firebase.google.com
2. Add Android app → Download `google-services.json`
3. Place in `flutter_app/android/app/google-services.json`
4. Get Server Key from Project Settings → Cloud Messaging
5. Add to .env: `FCM_SERVER_KEY=...`

### Razorpay (Fee Payment)
1. Sign up at https://razorpay.com
2. Settings → API Keys → Generate
3. Add to .env

---

## 📱 APK Signing (for Play Store)

```bash
# Generate keystore
keytool -genkey -v -keystore edubrain.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias edubrain

# Place keystore in flutter_app/android/app/keystore/

# Build signed release APK
cd flutter_app
flutter build apk --release

# Build App Bundle for Play Store
flutter build appbundle --release
```

---

## 🌐 Complete API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Email/password login |
| POST | `/api/auth/face-login` | No | Face embedding → identify + attendance |
| POST | `/api/auth/fingerprint-login` | No | Fingerprint hash → identify |
| POST | `/api/auth/enroll-face` | Yes | Store face embedding |
| POST | `/api/auth/enroll-fingerprint` | Yes | Store fingerprint hash |
| POST | `/api/institute/register` | No | Register new school |
| GET | `/api/institute/all` | Super Admin | All institutes |
| PUT | `/api/institute/:id/settings` | Admin | Update settings |
| PATCH | `/api/institute/:id/toggle` | Super Admin | Activate/deactivate |
| POST | `/api/student/add` | Admin | Add student |
| GET | `/api/student/class/:id` | Teacher | Students in class |
| POST | `/api/student/bulk-import` | Admin | CSV import |
| POST | `/api/attendance/mark-manual` | Teacher | Batch P/A/L |
| POST | `/api/auth/face-login` (markAttendance=true) | No | Face attendance |
| GET | `/api/attendance/summary/:student_id` | Any | Monthly summary |
| GET | `/api/attendance/low/:institute_id` | Admin | Low attendance list |
| POST | `/api/result/extract-marks` | Teacher | AI photo → marks |
| POST | `/api/result/save` | Teacher | Save result |
| POST | `/api/result/generate-comment` | Teacher | AI report card comment |
| POST | `/api/result/publish/:exam_id` | Admin | Publish + rank results |
| POST | `/api/ai/chat` | Any | Gemini chatbot |
| POST | `/api/ai/question-paper` | Teacher | Generate paper |
| POST | `/api/ai/notes` | Any | Generate notes |
| POST | `/api/ai/study-plan` | Any | Study plan |
| POST | `/api/ai/lesson-plan` | Teacher | Lesson plan |
| POST | `/api/ai/solve-doubt` | Student | Doubt solver |
| POST | `/api/ai/ml-prediction` | Admin/Teacher | Risk prediction |
| POST | `/api/ai/parent-message` | Teacher | Draft parent message |
| POST | `/api/fee/collect` | Accountant | Record payment |
| GET | `/api/fee/pending/:institute_id` | Admin | Pending fees |
| GET | `/api/fee/revenue/:institute_id` | Admin | Revenue summary |
| POST | `/api/notice/create` | Admin/Teacher | Post notice |
| GET | `/api/notice/:institute_id/:role` | Any | Role-filtered notices |
| GET | `/api/super-admin/stats` | Super Admin | Platform stats |
| PUT | `/api/super-admin/institute/:id/settings` | Super Admin | Global settings |

---

## 🔮 Phase 2 Features (Next)

1. **QR Attendance** — Dynamic daily QR per class, students scan to mark
2. **Razorpay Integration** — Online fee payment in app + web
3. **PDF Generation** — Report cards, admit cards, ID cards, certificates
4. **WhatsApp Auto Messages** — Absence → immediate parent WhatsApp
5. **Real TFLite FaceNet** — Replace mock face embeddings with real ML model
6. **Offline Sync** — Attendance marked offline → sync when internet returns
7. **Multi-language** — Hindi, Telugu, Tamil, Marathi interface
8. **iOS App** — Flutter iOS build
9. **Web App (PWA)** — Progressive Web App from Flutter web
10. **Analytics Dashboard** — Advanced charts with Recharts

---

## 📊 Database (20 Collections)

`super_admins` `institutes` `users` `students` `teachers`
`classes` `sections` `subjects` `attendance` `exams`
`results` `fees` `assignments` `notices` `ai_chats`
`ml_predictions` `timetables` `library_books` `transport_routes` `support_tickets`

---

## 🛡️ Security Features

- JWT tokens with 7-day expiry
- bcrypt password hashing (12 rounds)
- Face embeddings encrypted at rest
- Fingerprint: only SHA-256 hash stored (biometric data never leaves device)
- Role-based access control (RBAC)
- Institute-level data isolation
- Rate limiting per IP (200 req/min general, 10/min auth)
- Request validation on all endpoints
- HTTPS enforced via Nginx
- CORS restricted to production domains
- MongoDB injection prevention via Mongoose

---

Made with ❤️ in India 🇮🇳 | EduBrain AI © 2026
