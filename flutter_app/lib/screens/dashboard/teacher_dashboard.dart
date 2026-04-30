import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class TeacherDashboard extends StatefulWidget {
  const TeacherDashboard({super.key});
  @override State<TeacherDashboard> createState() => _TeacherDashboardState();
}

class _TeacherDashboardState extends State<TeacherDashboard> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    return Scaffold(
      appBar: AppBar(
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Good morning, ${auth.name.split(' ').first}!', style: const TextStyle(fontSize: 16)),
          const Text('Teacher Dashboard', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
        ]),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
          IconButton(icon: const CircleAvatar(backgroundColor: Color(0xFF6366F1), radius: 16,
              child: Icon(Icons.person, color: Colors.white, size: 18)), onPressed: () {}),
          const SizedBox(width: 8),
        ],
      ),
      body: IndexedStack(
        index: _tab,
        children: const [_HomeTab(), _AttendanceTab(), _ResultTab(), _AiTab()],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.how_to_reg_outlined), selectedIcon: Icon(Icons.how_to_reg), label: 'Attendance'),
          NavigationDestination(icon: Icon(Icons.grade_outlined), selectedIcon: Icon(Icons.grade), label: 'Results'),
          NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI Tools'),
        ],
      ),
    );
  }
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
class _HomeTab extends StatelessWidget {
  const _HomeTab();
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Stats row
        Row(children: [
          _mini('My Classes', '5', Icons.class_, Colors.indigo),
          const SizedBox(width: 10),
          _mini('Students', '186', Icons.people, Colors.teal),
          const SizedBox(width: 10),
          _mini('Pending', '3', Icons.assignment_late, Colors.orange),
        ]),
        const SizedBox(height: 16),
        // Quick Actions
        const Text('Quick Actions', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 10),
        GridView.count(
          shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 3, crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 1,
          children: [
            _quickAction(context, Icons.face, 'Face\nAttendance', const Color(0xFF6366F1), '/attendance/face'),
            _quickAction(context, Icons.fingerprint, 'Fingerprint\nAttendance', const Color(0xFF0EA5E9), '/attendance/fingerprint'),
            _quickAction(context, Icons.checklist, 'Manual\nAttendance', const Color(0xFF10B981), '/attendance/manual'),
            _quickAction(context, Icons.grade, 'Enter\nResult', const Color(0xFFF59E0B), '/result/entry'),
            _quickAction(context, Icons.auto_awesome, 'AI\nAssistant', const Color(0xFF8B5CF6), '/ai/assistant'),
            _quickAction(context, Icons.assignment, 'Assignments', const Color(0xFFEC4899), null),
          ],
        ),
        const SizedBox(height: 16),
        // Recent activity
        const Text('Today\'s Classes', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 10),
        ...[
          _classCard('Class 10-A', 'Mathematics', '9:00 AM', true),
          _classCard('Class 9-B', 'Mathematics', '10:00 AM', false),
          _classCard('Class 8-A', 'Mathematics', '11:00 AM', false),
        ],
      ],
    );
  }

  Widget _mini(String label, String val, IconData icon, Color color) => Expanded(
    child: Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(14), border: Border.all(color: color.withOpacity(0.2))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 6),
        Text(val, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
      ]),
    ),
  );

  Widget _quickAction(BuildContext ctx, IconData icon, String label, Color color, String? route) => InkWell(
    onTap: () { if (route != null) Navigator.pushNamed(ctx, route); },
    borderRadius: BorderRadius.circular(14),
    child: Container(
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(14), border: Border.all(color: color.withOpacity(0.2))),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Icon(icon, color: color, size: 28),
        const SizedBox(height: 6),
        Text(label, textAlign: TextAlign.center, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
      ]),
    ),
  );

  Widget _classCard(String cls, String sub, String time, bool done) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    child: ListTile(
      leading: CircleAvatar(backgroundColor: const Color(0xFF6366F1).withOpacity(0.1),
          child: const Icon(Icons.class_, color: Color(0xFF6366F1), size: 20)),
      title: Text(cls, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text('$sub · $time'),
      trailing: done
          ? Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(20)),
              child: const Text('Done', style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.w600)))
          : Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(color: Colors.orange.shade50, borderRadius: BorderRadius.circular(20)),
              child: const Text('Pending', style: TextStyle(color: Colors.orange, fontSize: 12, fontWeight: FontWeight.w600))),
    ),
  );
}

// ── ATTENDANCE TAB ─────────────────────────────────────────────────────────────
class _AttendanceTab extends StatelessWidget {
  const _AttendanceTab();
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Mark Attendance', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          const Text('Choose attendance method', style: TextStyle(color: Color(0xFF64748B))),
          const SizedBox(height: 20),
          Expanded(
            child: GridView.count(
              crossAxisCount: 2, crossAxisSpacing: 14, mainAxisSpacing: 14,
              children: [
                _methodCard(context, Icons.face, 'Face Recognition', 'AI-powered face scan', const Color(0xFF6366F1), '/attendance/face'),
                _methodCard(context, Icons.fingerprint, 'Fingerprint', 'Biometric scan', const Color(0xFF0EA5E9), '/attendance/fingerprint'),
                _methodCard(context, Icons.qr_code_scanner, 'QR Scan', 'Student QR code', const Color(0xFF10B981), null),
                _methodCard(context, Icons.checklist, 'Manual', 'Mark one by one', const Color(0xFFF59E0B), '/attendance/manual'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _methodCard(BuildContext ctx, IconData icon, String title, String sub, Color color, String? route) => InkWell(
    onTap: () { if (route != null) Navigator.pushNamed(ctx, route); },
    borderRadius: BorderRadius.circular(18),
    child: Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(width: 60, height: 60, decoration: BoxDecoration(shape: BoxShape.circle, color: color.withOpacity(0.1)),
            child: Icon(icon, color: color, size: 30)),
        const SizedBox(height: 12),
        Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14), textAlign: TextAlign.center),
        const SizedBox(height: 4),
        Text(sub, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)), textAlign: TextAlign.center),
      ]),
    ),
  );
}

// ── RESULT TAB ─────────────────────────────────────────────────────────────────
class _ResultTab extends StatelessWidget {
  const _ResultTab();
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Result Management', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Enter Exam Results', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
              const SizedBox(height: 6),
              const Text('Click camera icon next to each subject to scan answer sheet — AI will auto-fill marks',
                  style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/result/entry',
                    arguments: {'student_name': 'Aarav Singh', 'exam_id': 'exam_001', 'student_id': 'stu_001', 'class_id': 'cls_10a'}),
                icon: const Icon(Icons.add),
                label: const Text('Enter Result'),
                style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(46)),
              ),
            ]),
          ),
        ),
        const SizedBox(height: 16),
        const Text('Recent Results', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 10),
        ...[
          _resultRow('Aarav Singh', '78%', 'B+', Colors.blue),
          _resultRow('Nisha Kapoor', '91%', 'A+', Colors.green),
          _resultRow('Rohit Kumar', '52%', 'C', Colors.orange),
        ],
      ],
    );
  }

  Widget _resultRow(String name, String pct, String grade, Color color) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    child: ListTile(
      leading: CircleAvatar(backgroundColor: color.withOpacity(0.1),
          child: Text(name[0], style: TextStyle(color: color, fontWeight: FontWeight.bold))),
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text('Percentage: $pct'),
      trailing: Container(
        width: 38, height: 38,
        decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
        child: Center(child: Text(grade, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13))),
      ),
    ),
  );
}

// ── AI TOOLS TAB ───────────────────────────────────────────────────────────────
class _AiTab extends StatelessWidget {
  const _AiTab();
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('AI Tools', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 6),
        const Text('Powered by Gemini AI', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
        const SizedBox(height: 16),
        ...[
          _aiTool(context, '🤖', 'AI Doubt Solver', 'Answer student questions instantly', () => Navigator.pushNamed(context, '/ai/assistant')),
          _aiTool(context, '📝', 'Question Paper Generator', 'Auto-generate papers with answer key', () {}),
          _aiTool(context, '📖', 'Notes Generator', 'Create chapter notes, MCQs & Q&A', () {}),
          _aiTool(context, '📅', 'Lesson Planner', 'AI-powered lesson plans', () {}),
          _aiTool(context, '💬', 'Parent Message', 'Generate parent communication', () {}),
          _aiTool(context, '📊', 'ML Risk Report', 'Identify at-risk students', () {}),
        ],
      ],
    );
  }

  Widget _aiTool(BuildContext ctx, String emoji, String title, String sub, VoidCallback onTap) => Card(
    margin: const EdgeInsets.only(bottom: 10),
    child: ListTile(
      onTap: onTap,
      leading: Container(width: 44, height: 44, decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(12)),
          child: Center(child: Text(emoji, style: const TextStyle(fontSize: 22)))),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      subtitle: Text(sub, style: const TextStyle(fontSize: 12)),
      trailing: const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
    ),
  );
}
