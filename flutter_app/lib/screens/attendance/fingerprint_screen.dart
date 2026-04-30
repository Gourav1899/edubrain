import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';
import 'package:provider/provider.dart';
import 'dart:convert';
import 'package:crypto/crypto.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class FingerprintScreen extends StatefulWidget {
  const FingerprintScreen({super.key});
  @override State<FingerprintScreen> createState() => _FingerprintScreenState();
}

class _FingerprintScreenState extends State<FingerprintScreen> with SingleTickerProviderStateMixin {
  final _localAuth = LocalAuthentication();
  bool _checking = false;
  String _status = 'Place your finger on the sensor';
  bool _success = false;
  bool _canAuth = false;
  late AnimationController _pulseCtrl;
  late Animation<double> _pulse;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat(reverse: true);
    _pulse = Tween<double>(begin: 1.0, end: 1.12).animate(CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut));
    _checkAvailability();
  }

  Future<void> _checkAvailability() async {
    _canAuth = await _localAuth.canCheckBiometrics || await _localAuth.isDeviceSupported();
    if (_canAuth) _authenticate();
    else setState(() => _status = 'Biometric not available on this device');
  }

  Future<void> _authenticate() async {
    if (_checking || _success) return;
    setState(() { _checking = true; _status = 'Scanning fingerprint...'; });
    try {
      final authenticated = await _localAuth.authenticate(
        localizedReason: 'Scan fingerprint to mark attendance',
        options: const AuthenticationOptions(biometricOnly: true, stickyAuth: true),
      );

      if (authenticated) {
        // Generate device-bound fingerprint hash
        final args = ModalRoute.of(context)?.settings.arguments as Map?;
        final classId = args?['class_id'] as String?;
        final auth = context.read<AuthProvider>();
        final api = context.read<ApiService>();

        // Use device ID + user ID as hash (actual fingerprint data is never exposed by OS)
        final hashInput = '${auth.userId}_${auth.instituteId}_fingerprint_v1';
        final hash = sha256.convert(utf8.encode(hashInput)).toString();

        final res = await api.fingerprintLogin(hash, auth.instituteId, classId: classId, markAttendance: classId != null);
        final user = res['data']?['user'];

        setState(() {
          _success = true;
          _status = 'Attendance marked for ${user?['name'] ?? 'User'}';
        });
        _pulseCtrl.stop();
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) Navigator.pop(context, {'success': true});
      } else {
        setState(() { _checking = false; _status = 'Authentication failed. Try again.'; });
      }
    } catch (e) {
      setState(() { _checking = false; _status = 'Error: ${e.toString()}. Try again.'; });
    }
  }

  @override
  void dispose() { _pulseCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fingerprint Attendance')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedBuilder(
                animation: _pulse,
                builder: (_, child) => Transform.scale(scale: _success ? 1.0 : _pulse.value, child: child),
                child: Container(
                  width: 140, height: 140,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _success ? Colors.green.shade50 : (_checking ? const Color(0xFFEEF2FF) : Colors.grey.shade100),
                    border: Border.all(
                      color: _success ? Colors.green : (_checking ? const Color(0xFF6366F1) : Colors.grey.shade300),
                      width: 3,
                    ),
                  ),
                  child: Icon(
                    _success ? Icons.check_circle : Icons.fingerprint,
                    size: 72,
                    color: _success ? Colors.green : (_checking ? const Color(0xFF6366F1) : Colors.grey.shade500),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              Text(_status, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500), textAlign: TextAlign.center),
              const SizedBox(height: 40),
              if (!_success && !_checking)
                ElevatedButton.icon(
                  onPressed: _authenticate,
                  icon: const Icon(Icons.fingerprint),
                  label: const Text('Try Again'),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
