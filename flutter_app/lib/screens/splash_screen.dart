import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale, _fade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200));
    _scale = CurvedAnimation(parent: _ctrl, curve: Curves.elasticOut);
    _fade = CurvedAnimation(parent: _ctrl, curve: const Interval(0.4, 1.0));
    _ctrl.forward();
    _navigate();
  }

  Future<void> _navigate() async {
    await Future.delayed(const Duration(milliseconds: 2200));
    if (!mounted) return;
    final auth = context.read<AuthProvider>();
    await auth.initialize();
    if (!mounted) return;
    Navigator.pushReplacementNamed(context, auth.isLoggedIn ? auth.dashboardRoute : '/login');
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF6366F1),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ScaleTransition(
              scale: _scale,
              child: Container(
                width: 90, height: 90,
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
                child: const Icon(Icons.school, color: Color(0xFF6366F1), size: 52),
              ),
            ),
            const SizedBox(height: 20),
            FadeTransition(
              opacity: _fade,
              child: const Column(children: [
                Text('EduBrain AI', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold, letterSpacing: -0.5)),
                SizedBox(height: 6),
                Text('Smart School Management', style: TextStyle(color: Colors.white70, fontSize: 14)),
              ]),
            ),
            const SizedBox(height: 60),
            const SizedBox(width: 28, height: 28, child: CircularProgressIndicator(color: Colors.white70, strokeWidth: 2)),
          ],
        ),
      ),
    );
  }
}
