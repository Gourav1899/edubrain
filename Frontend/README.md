# EduBrain AI — React + Vite Frontend

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
# Opens at http://localhost:5173
```

## Build for Production
```bash
npm run build
# Output in /dist folder
```

## Pages
- `/` — Landing page with all sections
- `/login` — Login + Face ID + Fingerprint options
- `/register` — 4-role registration (Institute/Student/Teacher/Parent)
- `/dashboard/admin` — Admin dashboard
- `/dashboard/teacher` — Teacher dashboard
- `/dashboard/student` — Student dashboard
- `/dashboard/parent` — Parent dashboard
- `/dashboard/attendance` — Face + Fingerprint + QR + Manual attendance
- `/dashboard/results` — AI photo scan → marks autofill
- `/dashboard/fees` — Fee collection + reminders
- `/dashboard/ai` — All AI tools (Q-paper, Notes, Study Plan, Doubt Solver)
- `/dashboard/ml` — ML risk predictions
- `/dashboard/settings` — Super Admin settings with all toggles
- And more...

## Connect to Backend
Set `VITE_API_URL` in `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Zustand (state management)
- Axios (API calls)
- React Router v6
- Recharts (charts)
- React Webcam (face attendance)
- React Hot Toast
