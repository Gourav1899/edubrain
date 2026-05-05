import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store'

// Pages
import LandingPage      from './pages/Landing'
import LoginPage        from './pages/Login'
import RegisterPage     from './pages/Register'
import DashboardLayout  from './components/layout/DashboardLayout'

// Dashboard panels
import AdminDashboard   from './pages/dashboard/AdminDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import ParentDashboard  from './pages/dashboard/ParentDashboard'

// Feature pages
import StudentsPage     from './pages/Students'
import TeachersPage     from './pages/Teachers'
import AttendancePage   from './pages/Attendance'
import ResultsPage      from './pages/Results'
import FeesPage         from './pages/Fees'
import NoticesPage      from './pages/Notices'
import AiToolsPage      from './pages/AiTools'
import MLPredictions    from './pages/MLPredictions'
import ReportsPage      from './pages/Reports'
import SettingsPage     from './pages/Settings'
import TimetablePage    from './pages/Timetable'
import LibraryPage      from './pages/Library'
import TransportPage    from './pages/Transport'
import ProfilePage      from './pages/Profile'

// ─── PROTECTED ROUTE ──────────────────────────────────────────────────────────
function Protected({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isLoggedIn, user } = useAuthStore()
  if (!isLoggedIn()) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

// ─── REDIRECT TO ROLE DASHBOARD ───────────────────────────────────────────────
function DashboardRedirect() {
  const { dashboardPath } = useAuthStore()
  return <Navigate to={dashboardPath()} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '13px' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard redirect */}
        <Route path="/dashboard" element={<Protected><DashboardRedirect /></Protected>} />

        {/* Protected Dashboard Layout */}
        <Route path="/dashboard/*" element={<Protected><DashboardLayout /></Protected>}>
          {/* Role home panels */}
          <Route path="admin"   element={<AdminDashboard />} />
          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="parent"  element={<ParentDashboard />} />

          {/* Feature routes */}
          <Route path="students"   element={<StudentsPage />} />
          <Route path="teachers"   element={<TeachersPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="results"    element={<ResultsPage />} />
          <Route path="fees"       element={<FeesPage />} />
          <Route path="notices"    element={<NoticesPage />} />
          <Route path="ai"         element={<AiToolsPage />} />
          <Route path="ml"         element={<MLPredictions />} />
          <Route path="reports"    element={<ReportsPage />} />
          <Route path="timetable"  element={<TimetablePage />} />
          <Route path="library"    element={<LibraryPage />} />
          <Route path="transport"  element={<TransportPage />} />
          <Route path="profile"    element={<ProfilePage />} />
          <Route path="settings"   element={
            <Protected roles={['super_admin', 'admin']}><SettingsPage /></Protected>
          } />

          {/* Fallback */}
          <Route path="*" element={<DashboardRedirect />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
