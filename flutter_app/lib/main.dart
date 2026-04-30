import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'services/api_service.dart';
import 'services/auth_service.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/dashboard/admin_dashboard.dart';
import 'screens/dashboard/teacher_dashboard.dart';
import 'screens/dashboard/student_dashboard.dart';
import 'screens/dashboard/parent_dashboard.dart';
import 'screens/attendance/face_attendance_screen.dart';
import 'screens/attendance/fingerprint_screen.dart';
import 'screens/attendance/manual_attendance_screen.dart';
import 'screens/results/result_entry_screen.dart';
import 'screens/ai/ai_assistant_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        Provider(create: (_) => ApiService()),
      ],
      child: const EduBrainApp(),
    ),
  );
}

class EduBrainApp extends StatelessWidget {
  const EduBrainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EduBrain AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Poppins',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
          brightness: Brightness.light,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF1E293B),
          elevation: 0,
          centerTitle: false,
          titleTextStyle: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Color(0xFF1E293B),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6366F1),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 24),
            textStyle: const TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.w600, fontSize: 15),
          ),
        ),
        cardTheme: CardTheme(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.shade200),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.grey.shade50,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade200)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF6366F1), width: 2)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
      initialRoute: '/splash',
      routes: {
        '/splash':              (_) => const SplashScreen(),
        '/login':               (_) => const LoginScreen(),
        '/dashboard/admin':     (_) => const AdminDashboard(),
        '/dashboard/teacher':   (_) => const TeacherDashboard(),
        '/dashboard/student':   (_) => const StudentDashboard(),
        '/dashboard/parent':    (_) => const ParentDashboard(),
        '/attendance/face':     (_) => const FaceAttendanceScreen(),
        '/attendance/fingerprint': (_) => const FingerprintScreen(),
        '/attendance/manual':   (_) => const ManualAttendanceScreen(),
        '/result/entry':        (_) => const ResultEntryScreen(),
        '/ai/assistant':        (_) => const AiAssistantScreen(),
      },
    );
  }
}
