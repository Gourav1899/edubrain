import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true, _loading = false;
  String? _error;

  Future<void> _login() async {
    setState(() { _loading = true; _error = null; });
    try {
      final api = context.read<ApiService>();
      final auth = context.read<AuthProvider>();
      final res = await api.login(_emailCtrl.text.trim(), _passCtrl.text);
      await auth.setAuth(res['data']['token'], res['data']['user']);
      if (mounted) Navigator.pushReplacementNamed(context, auth.dashboardRoute);
    } catch (e) {
      setState(() { _error = 'Invalid email or password'; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              // Logo
              Container(
                width: 56, height: 56,
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.school, color: Colors.white, size: 30),
              ),
              const SizedBox(height: 24),
              const Text('Welcome back', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
              const SizedBox(height: 6),
              const Text('Sign in to EduBrain AI', style: TextStyle(fontSize: 15, color: Color(0xFF64748B))),
              const SizedBox(height: 40),

              if (_error != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.red.shade200)),
                  child: Row(children: [
                    Icon(Icons.error_outline, color: Colors.red.shade700, size: 18),
                    const SizedBox(width: 8),
                    Text(_error!, style: TextStyle(color: Colors.red.shade700, fontSize: 13)),
                  ]),
                ),

              const Text('Email / Phone', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF374151))),
              const SizedBox(height: 6),
              TextField(controller: _emailCtrl, keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(prefixIcon: Icon(Icons.person_outline), hintText: 'Enter email or phone')),
              const SizedBox(height: 16),
              const Text('Password', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF374151))),
              const SizedBox(height: 6),
              TextField(
                controller: _passCtrl, obscureText: _obscure,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.lock_outline), hintText: 'Enter password',
                  suffixIcon: IconButton(icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility), onPressed: () => setState(() => _obscure = !_obscure)),
                ),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(onPressed: () {}, child: const Text('Forgot Password?')),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _login,
                  style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(52)),
                  child: _loading ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Sign In'),
                ),
              ),
              const SizedBox(height: 24),
              const Row(children: [Expanded(child: Divider()), Padding(padding: EdgeInsets.symmetric(horizontal: 12), child: Text('or', style: TextStyle(color: Color(0xFF94A3B8)))), Expanded(child: Divider())]),
              const SizedBox(height: 20),
              // Biometric options
              Row(
                children: [
                  Expanded(child: _biometricBtn(Icons.fingerprint, 'Fingerprint', () => Navigator.pushNamed(context, '/attendance/fingerprint'))),
                  const SizedBox(width: 12),
                  Expanded(child: _biometricBtn(Icons.face, 'Face ID', () => Navigator.pushNamed(context, '/attendance/face'))),
                ],
              ),
              const SizedBox(height: 32),
              Center(child: TextButton(
                onPressed: () {},
                child: const Text.rich(TextSpan(children: [
                  TextSpan(text: 'New institute? ', style: TextStyle(color: Color(0xFF64748B))),
                  TextSpan(text: 'Register here', style: TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.w600)),
                ])),
              )),
            ],
          ),
        ),
      ),
    );
  }

  Widget _biometricBtn(IconData icon, String label, VoidCallback onTap) => OutlinedButton.icon(
    onPressed: onTap,
    icon: Icon(icon, size: 20),
    label: Text(label, style: const TextStyle(fontSize: 13)),
    style: OutlinedButton.styleFrom(
      minimumSize: const Size.fromHeight(48),
      side: BorderSide(color: Colors.grey.shade300),
      foregroundColor: const Color(0xFF374151),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
  );

  @override
  void dispose() { _emailCtrl.dispose(); _passCtrl.dispose(); super.dispose(); }
}
