# EduBrain AI — Complete Project Documentation

## Project Structure

```
edubrain/
├── backend/                    ← TypeScript (Flusso-core framework)
│   ├── Models/models.ts        ← All 20+ database schemas
│   ├── DAL/index.dal.ts        ← Data Access Layer for all models
│   ├── Services/index.service.ts ← Business logic (Auth, AI, Attendance, etc.)
│   ├── Controllers/index.controller.ts ← HTTP handlers
│   ├── Routes/index.routes.ts  ← API route definitions
│   ├── Config/index.ts         ← Environment config
│   ├── index.ts                ← App entry point
│   ├── package.json
│   └── tsconfig.json
│
└── flutter_app/                ← Flutter (Android APK)
    ├── pubspec.yaml            ← All dependencies
    └── lib/
        ├── main.dart           ← App entry, routes, theme
        ├── services/
        │   ├── api_service.dart    ← All backend API calls
        │   └── auth_service.dart   ← Auth provider + role routing
        └── screens/
            ├── splash_screen.dart
            ├── auth/login_screen.dart         ← Email + Face + Fingerprint login
            ├── dashboard/
            │   ├── admin_dashboard.dart        ← Admin + Student + Parent dashboards
            │   ├── teacher_dashboard.dart      ← Teacher panel
            │   ├── student_dashboard.dart
            │   └── parent_dashboard.dart
            ├── attendance/
            │   ├── face_attendance_screen.dart ← Camera + ML Kit face detection
            │   ├── fingerprint_screen.dart     ← local_auth biometric
            │   └── manual_attendance_screen.dart ← P/A/L per student
            ├── results/
            │   └── result_entry_screen.dart    ← Photo → AI marks extraction
            ├── ai/
            │   └── ai_assistant_screen.dart    ← Full chatbot (Gemini)
            └── settings/
                └── super_admin_settings.dart   ← All toggles editable by super admin
```

---

## Key Features Implemented

### 1. Face Attendance
- Flutter: Camera opens → google_mlkit_face_detection detects face
- 128-dimensional embedding extracted → sent to backend
- Backend: cosine similarity match against stored embeddings
- Confidence > 85% → attendance auto-marked
- `face_confidence` stored in attendance record

### 2. Fingerprint Attendance
- Flutter: local_auth → authenticate() → device biometric
- Device-bound SHA-256 hash → sent to backend
- Backend: hash match → student identified → attendance marked
- Works on Android (fingerprint sensor required)

### 3. Result Entry + AI Photo Scan
- Teacher taps camera icon next to subject
- Photo of answer sheet taken → base64 → sent to Gemini Vision API
- AI extracts total marks from photo → auto-fills in field
- Green "AI filled" badge shown
- Teacher can override manually
- AI comment generated for report card

### 4. Super Admin Control
- Every institute setting editable from super admin panel
- Face attendance on/off per institute
- Fingerprint on/off per institute
- AI features on/off
- SMS/WhatsApp/Email notifications toggle
- Late fee percentage slider
- Attendance threshold slider
- Plan management (free/basic/pro/enterprise)
- Activate/deactivate any institute

### 5. AI Chatbot (Gemini)
- Full conversation history maintained per session
- Role-aware (teacher/student/parent gets different context)
- Doubt solver, study planner, notes, question paper
- Hinglish support
- Typing indicator animation

---

## Backend API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Email/password login |
| POST | /api/auth/face-login | Face embedding → recognize + optionally mark attendance |
| POST | /api/auth/fingerprint-login | Hash match → identify student |
| POST | /api/auth/enroll-face | Store face embedding for user |
| POST | /api/auth/enroll-fingerprint | Store fingerprint hash |
| POST | /api/institute/register | New school/college registration |
| GET  | /api/institute/all | Super admin: all institutes |
| PUT  | /api/institute/:id/settings | Update institute settings |
| POST | /api/student/add | Add student with user account |
| POST | /api/student/bulk-import | CSV bulk import |
| POST | /api/attendance/mark-manual | Batch P/A/L |
| GET  | /api/attendance/summary/:student_id | Monthly summary |
| GET  | /api/attendance/low/:institute_id | Low attendance alert list |
| POST | /api/result/extract-marks | AI photo → marks |
| POST | /api/result/save | Save result with auto grade |
| POST | /api/result/generate-comment | AI report card comment |
| POST | /api/ai/chat | Gemini chat |
| POST | /api/ai/question-paper | Generate question paper |
| POST | /api/ai/notes | Generate chapter notes |
| POST | /api/ai/study-plan | Personalized study plan |
| POST | /api/ai/solve-doubt | Subject doubt solver |
| POST | /api/ai/ml-prediction | Risk level prediction |
| POST | /api/fee/collect | Record payment |
| GET  | /api/fee/pending/:institute_id | Pending fee list |
| POST | /api/notice/create | Post notice |
| GET  | /api/super-admin/stats | Platform-wide stats |

---

## Environment Variables (.env)

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY=...
RAZORPAY_SECRET=...
TWILIO_SID=...
TWILIO_TOKEN=...
FCM_SERVER_KEY=...
```

---

## Build Flutter APK

```bash
cd flutter_app
flutter pub get
flutter build apk --release --split-per-abi
# Output: build/app/outputs/flutter-apk/app-arm64-v8a-release.apk
```

---

## Deploy Backend

```bash
cd backend
npm install
npm run build
npm start
# Deploy on Railway/Render with MongoDB Atlas
```

---

## Database Models (20 schemas)

1. SuperAdmin — Platform owner
2. Institute — School/College with settings
3. User — Base for all roles (face_embedding, fingerprint_hash stored here)
4. Student — Student profile + class/section
5. Teacher — Employee details + subjects
6. Class — Grade definition
7. Section — A/B/C sections per class
8. Subject — Per class subject with max marks
9. Attendance — Date-wise with method (face/fingerprint/manual/qr)
10. Exam — Exam schedule
11. Result — Marks per subject, AI comment, ai_autofilled flag
12. Fee — Payment tracking with late fee
13. Assignment — Teacher uploads, student submissions
14. Notice — Noticeboard with role targeting
15. AiChat — Chat history log
16. MlPrediction — Risk scores per student
17. Timetable — Day-wise schedule
18. LibraryBook — Book issue/return
19. TransportRoute — Bus routes + drivers
20. SupportTicket — Help desk

---

## What to Build Next (Phase 2)

1. QR attendance — generate QR per class → students scan
2. Razorpay payment gateway for fee collection
3. PDF generation — report cards, admit cards, ID cards
4. WhatsApp Business API for auto-parent messages
5. Push notifications (FCM) for all alerts
6. Real ML model (Python scikit-learn) for risk prediction
7. TensorFlow Lite FaceNet model for accurate face embeddings (replace mock)
8. CSV import UI in Flutter
9. Offline attendance sync when no internet
10. Multi-language support (Hindi, Telugu, Tamil)
