import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class ManualAttendanceScreen extends StatefulWidget {
  const ManualAttendanceScreen({super.key});
  @override State<ManualAttendanceScreen> createState() => _ManualAttendanceScreenState();
}

class _ManualAttendanceScreenState extends State<ManualAttendanceScreen> {
  final Map<String, String> _status = {};
  bool _saving = false;
  bool _saved = false;

  // Mock student list – in production fetched from API
  final List<Map<String, String>> _students = [
    {'id': 's1', 'name': 'Aarav Singh', 'roll': '1'},
    {'id': 's2', 'name': 'Nisha Kapoor', 'roll': '2'},
    {'id': 's3', 'name': 'Rohit Kumar', 'roll': '3'},
    {'id': 's4', 'name': 'Pooja Mishra', 'roll': '4'},
    {'id': 's5', 'name': 'Vikram Gupta', 'roll': '5'},
    {'id': 's6', 'name': 'Anjali Verma', 'roll': '6'},
    {'id': 's7', 'name': 'Raj Sharma', 'roll': '7'},
    {'id': 's8', 'name': 'Sneha Patel', 'roll': '8'},
  ];

  void _markAll(String status) => setState(() {
    for (final s in _students) _status[s['id']!] = status;
  });

  int get _present => _status.values.where((v) => v == 'P').length;
  int get _absent => _status.values.where((v) => v == 'A').length;
  int get _late => _status.values.where((v) => v == 'L').length;

  Future<void> _save() async {
    if (_status.length < _students.length) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please mark attendance for all students')),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      final api = context.read<ApiService>();
      final auth = context.read<AuthProvider>();
      final records = _students.map((s) => {
        'student_id': s['id']!,
        'status': _status[s['id']!] == 'P' ? 'present' : _status[s['id']!] == 'A' ? 'absent' : 'late',
      }).toList();
      await api.markManualAttendance(records, 'cls_10a', auth.instituteId);
      setState(() { _saving = false; _saved = true; });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Attendance saved! Parents notified.'), backgroundColor: Colors.green),
      );
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      setState(() => _saving = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manual Attendance'),
        subtitle: const Text('Class 10-A · Today'),
        actions: [
          TextButton(onPressed: () => _markAll('P'), child: const Text('All P', style: TextStyle(color: Colors.green))),
          const SizedBox(width: 4),
        ],
      ),
      body: Column(
        children: [
          // Summary bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            color: const Color(0xFF6366F1).withOpacity(0.08),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _summaryChip('Present', _present, Colors.green),
                _summaryChip('Absent', _absent, Colors.red),
                _summaryChip('Late', _late, Colors.orange),
                _summaryChip('Pending', _students.length - _status.length, Colors.grey),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _students.length,
              itemBuilder: (_, i) {
                final s = _students[i];
                final st = _status[s['id']];
                return Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: const Color(0xFF6366F1).withOpacity(0.1), radius: 18,
                          child: Text(s['roll']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF6366F1))),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Text(s['name']!, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14))),
                        // P / A / L buttons
                        _attBtn('P', st, Colors.green, () => setState(() => _status[s['id']!] = 'P')),
                        const SizedBox(width: 6),
                        _attBtn('A', st, Colors.red, () => setState(() => _status[s['id']!] = 'A')),
                        const SizedBox(width: 6),
                        _attBtn('L', st, Colors.orange, () => setState(() => _status[s['id']!] = 'L')),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: ElevatedButton.icon(
          onPressed: _saving ? null : _save,
          icon: _saving ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.save),
          label: Text(_saving ? 'Saving...' : 'Save & Notify Parents'),
          style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(52)),
        ),
      ),
    );
  }

  Widget _summaryChip(String label, int count, Color color) => Column(
    children: [
      Text('$count', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
      Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
    ],
  );

  Widget _attBtn(String label, String? current, Color color, VoidCallback onTap) => GestureDetector(
    onTap: onTap,
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      width: 36, height: 36,
      decoration: BoxDecoration(
        color: current == label ? color : color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Center(
        child: Text(label, style: TextStyle(
          fontWeight: FontWeight.bold, fontSize: 14,
          color: current == label ? Colors.white : color,
        )),
      ),
    ),
  );
}
