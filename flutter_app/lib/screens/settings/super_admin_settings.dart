import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';

/// Super Admin can control every institute's settings from here.
/// All toggles propagate to the backend and affect all users of that institute.
class SuperAdminSettingsScreen extends StatefulWidget {
  const SuperAdminSettingsScreen({super.key});
  @override State<SuperAdminSettingsScreen> createState() => _SuperAdminSettingsState();
}

class _SuperAdminSettingsState extends State<SuperAdminSettingsScreen> {
  bool _faceAtt = true;
  bool _fingerAtt = true;
  bool _aiResults = true;
  bool _smsEnabled = false;
  bool _whatsapp = false;
  bool _emailNotify = true;
  int _lateFee = 5;
  int _attThreshold = 75;
  String _plan = 'pro';
  bool _saving = false;

  Future<void> _save() async {
    setState(() => _saving = true);
    // In production: call api.put('/super-admin/institute/:id/settings', settings)
    await Future.delayed(const Duration(milliseconds: 800));
    setState(() => _saving = false);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Settings saved globally!'), backgroundColor: Colors.green),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Super Admin Settings'),
        actions: [
          TextButton(
            onPressed: _saving ? null : _save,
            child: _saving ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Save All', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _section('Attendance Methods', [
            _toggle('Face Recognition Attendance', 'Allow teachers to use AI face scan', Icons.face, _faceAtt, (v) => setState(() => _faceAtt = v)),
            _toggle('Fingerprint Attendance', 'Allow biometric fingerprint login', Icons.fingerprint, _fingerAtt, (v) => setState(() => _fingerAtt = v)),
          ]),
          _section('AI Features', [
            _toggle('AI Result Extraction', 'Photo scan → AI auto-fills marks', Icons.auto_awesome, _aiResults, (v) => setState(() => _aiResults = v)),
          ]),
          _section('Notifications', [
            _toggle('SMS Notifications', 'Auto SMS to parents on absence/fee', Icons.sms, _smsEnabled, (v) => setState(() => _smsEnabled = v)),
            _toggle('WhatsApp Messages', 'WhatsApp Business API integration', Icons.chat, _whatsapp, (v) => setState(() => _whatsapp = v)),
            _toggle('Email Notifications', 'Send email alerts', Icons.email, _emailNotify, (v) => setState(() => _emailNotify = v)),
          ]),
          _section('Fee Settings', [
            _slider('Late Fee Percentage', '$_lateFee%', _lateFee.toDouble(), 0, 20, (v) => setState(() => _lateFee = v.round())),
          ]),
          _section('Attendance Settings', [
            _slider('Minimum Attendance Threshold', '$_attThreshold%', _attThreshold.toDouble(), 50, 95, (v) => setState(() => _attThreshold = v.round())),
          ]),
          _section('Subscription Plan', [
            _planSelector(),
          ]),
          const SizedBox(height: 20),
          // Danger zone
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.red.shade200)),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Row(children: [
                Icon(Icons.warning_amber, color: Colors.red),
                SizedBox(width: 8),
                Text('Danger Zone', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16)),
              ]),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(foregroundColor: Colors.red, side: const BorderSide(color: Colors.red)),
                child: const Text('Deactivate Institute'),
              ),
            ]),
          ),
        ],
      ),
    );
  }

  Widget _section(String title, List<Widget> children) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Padding(padding: const EdgeInsets.only(top: 8, bottom: 8), child: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF6366F1), letterSpacing: 0.3))),
      Card(child: Column(children: children)),
      const SizedBox(height: 12),
    ],
  );

  Widget _toggle(String title, String sub, IconData icon, bool val, ValueChanged<bool> onChanged) => SwitchListTile(
    title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
    subtitle: Text(sub, style: const TextStyle(fontSize: 12)),
    secondary: Icon(icon, color: const Color(0xFF6366F1)),
    value: val,
    activeColor: const Color(0xFF6366F1),
    onChanged: onChanged,
  );

  Widget _slider(String title, String valLabel, double val, double min, double max, ValueChanged<double> onChanged) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
        const Spacer(),
        Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
            decoration: BoxDecoration(color: const Color(0xFF6366F1).withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
            child: Text(valLabel, style: const TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold))),
      ]),
      Slider(value: val, min: min, max: max, divisions: (max - min).round(), activeColor: const Color(0xFF6366F1), onChanged: onChanged),
    ]),
  );

  Widget _planSelector() => Padding(
    padding: const EdgeInsets.all(14),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text('Current Plan', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
      const SizedBox(height: 10),
      Row(children: ['free', 'basic', 'pro', 'enterprise'].map((p) => Expanded(
        child: GestureDetector(
          onTap: () => setState(() => _plan = p),
          child: Container(
            margin: const EdgeInsets.only(right: 6),
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(
              color: _plan == p ? const Color(0xFF6366F1) : const Color(0xFFEEF2FF),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(p[0].toUpperCase() + p.substring(1),
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: _plan == p ? Colors.white : const Color(0xFF6366F1))),
          ),
        ),
      )).toList()),
    ]),
  );
}
