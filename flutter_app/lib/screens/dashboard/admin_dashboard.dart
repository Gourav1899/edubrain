// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});
  @override State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    return Scaffold(
      appBar: AppBar(
        title: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('EduBrain AI', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const Text('Admin Panel', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
        ]),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
          IconButton(icon: const Icon(Icons.settings_outlined), onPressed: () {}),
          const SizedBox(width: 8),
        ],
      ),
      body: IndexedStack(
        index: _tab,
        children: const [_AdminHomeTab(), _StudentsTab(), _FeesTab(), _ReportsTab()],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.people_outlined), selectedIcon: Icon(Icons.people), label: 'Students'),
          NavigationDestination(icon: Icon(Icons.payments_outlined), selectedIcon: Icon(Icons.payments), label: 'Fees'),
          NavigationDestination(icon: Icon(Icons.bar_chart_outlined), selectedIcon: Icon(Icons.bar_chart), label: 'Reports'),
        ],
      ),
    );
  }
}

class _AdminHomeTab extends StatelessWidget {
  const _AdminHomeTab();
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Stats grid
        GridView.count(
          shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 1.5,
          children: [
            _statCard('1,248', 'Total Students', Icons.people, const Color(0xFF6366F1)),
            _statCard('86', 'Teachers', Icons.school, const Color(0xFF0EA5E9)),
            _statCard('94%', 'Attendance Today', Icons.check_circle, const Color(0xFF10B981)),
            _statCard('₹4.2L', 'Fee Collected', Icons.currency_rupee, const Color(0xFFF59E0B)),
          ],
        ),
        const SizedBox(height: 20),
        // Alert section
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.red.shade100)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Row(children: [
              Icon(Icons.warning_amber, color: Colors.red, size: 18),
              SizedBox(width: 6),
              Text('Alerts', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.red, fontSize: 14)),
            ]),
            const SizedBox(height: 8),
            _alertRow('3 students below 75% attendance'),
            _alertRow('₹82,000 fee pending from 48 students'),
            _alertRow('2 students marked as high risk by AI'),
          ]),
        ),
        const SizedBox(height: 16),
        const Text('Quick Actions', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 10),
        Wrap(spacing: 8, runSpacing: 8, children: [
          _chip(context, 'Add Student', Icons.person_add, '/attendance/face'),
          _chip(context, 'Mark Attendance', Icons.how_to_reg, '/attendance/manual'),
          _chip(context, 'Collect Fee', Icons.payments, null),
          _chip(context, 'Notice Board', Icons.campaign, null),
          _chip(context, 'AI Tools', Icons.auto_awesome, '/ai/assistant'),
          _chip(context, 'Reports', Icons.bar_chart, null),
        ]),
        const SizedBox(height: 16),
        const Text('Low Attendance Students', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 10),
        ...[
          _lowAttRow('Rohit Kumar', 'Class 8-A', 67),
          _lowAttRow('Priya Sinha', 'Class 9-B', 73),
          _lowAttRow('Aryan Mehta', 'Class 7-C', 75),
        ],
      ],
    );
  }

  Widget _statCard(String val, String label, IconData icon, Color color) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: Colors.grey.shade100),
      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))],
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Container(width: 32, height: 32, decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Icon(icon, color: color, size: 18)),
        const Spacer(),
      ]),
      const SizedBox(height: 8),
      Text(val, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
      Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
    ]),
  );

  Widget _alertRow(String msg) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 3),
    child: Row(children: [
      Container(width: 6, height: 6, decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.red)),
      const SizedBox(width: 8),
      Expanded(child: Text(msg, style: const TextStyle(fontSize: 13))),
    ]),
  );

  Widget _chip(BuildContext ctx, String label, IconData icon, String? route) => ActionChip(
    avatar: Icon(icon, size: 16),
    label: Text(label, style: const TextStyle(fontSize: 12)),
    onPressed: () { if (route != null) Navigator.pushNamed(ctx, route); },
    backgroundColor: const Color(0xFFEEF2FF),
    side: const BorderSide(color: Color(0xFF6366F1), width: 0.5),
  );

  Widget _lowAttRow(String name, String cls, int pct) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    child: ListTile(
      leading: CircleAvatar(backgroundColor: Colors.red.shade50, child: Text(name[0], style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.bold))),
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(cls),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(20)),
        child: Text('$pct%', style: TextStyle(color: Colors.red.shade700, fontWeight: FontWeight.bold, fontSize: 13)),
      ),
    ),
  );
}

class _StudentsTab extends StatelessWidget {
  const _StudentsTab();
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            Expanded(child: TextField(decoration: const InputDecoration(prefixIcon: Icon(Icons.search), hintText: 'Search students...'))),
            const SizedBox(width: 10),
            ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.add, size: 18), label: const Text('Add')),
          ]),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 5,
            itemBuilder: (_, i) {
              final names = ['Aarav Singh', 'Nisha Kapoor', 'Rohit Kumar', 'Pooja Mishra', 'Vikram Gupta'];
              final classes = ['10-A', '9-B', '8-A', '10-B', '7-A'];
              final statuses = ['Active', 'Active', 'At Risk', 'Active', 'Fee Due'];
              final colors = [Colors.green, Colors.green, Colors.orange, Colors.green, Colors.red];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  leading: CircleAvatar(backgroundColor: const Color(0xFF6366F1).withOpacity(0.1),
                      child: Text(names[i][0], style: const TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold))),
                  title: Text(names[i], style: const TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text('Class ${classes[i]} · #100${i + 1}'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: colors[i].withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                    child: Text(statuses[i], style: TextStyle(color: colors[i], fontSize: 11, fontWeight: FontWeight.w600)),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _FeesTab extends StatelessWidget {
  const _FeesTab();
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(children: [
          _feeStat('₹4.2L', 'Collected', Colors.green),
          const SizedBox(width: 10),
          _feeStat('₹82K', 'Pending', Colors.red),
          const SizedBox(width: 10),
          _feeStat('48', 'Defaulters', Colors.orange),
        ]),
        const SizedBox(height: 16),
        const Text('Pending Fees', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 10),
        ...[
          _feeRow('Rohit Kumar', '8-A', '₹7,200', 'Overdue', Colors.red),
          _feeRow('Vikram Gupta', '7-A', '₹3,600', 'Partial', Colors.orange),
          _feeRow('Priya Sinha', '9-B', '₹8,500', 'Pending', Colors.orange),
        ],
      ],
    );
  }

  Widget _feeStat(String val, String label, Color color) => Expanded(
    child: Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(14), border: Border.all(color: color.withOpacity(0.2))),
      child: Column(children: [
        Text(val, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
      ]),
    ),
  );

  Widget _feeRow(String name, String cls, String amt, String status, Color color) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    child: ListTile(
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text('Class $cls · $amt'),
      trailing: Row(mainAxisSize: MainAxisSize.min, children: [
        Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
            child: Text(status, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w600))),
        const SizedBox(width: 6),
        const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
      ]),
    ),
  );
}

class _ReportsTab extends StatelessWidget {
  const _ReportsTab();
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Reports', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        ...[
          _reportCard('Attendance Report', 'Class & student-wise', Icons.calendar_today, Colors.indigo),
          _reportCard('Fee Report', 'Collection & pending', Icons.currency_rupee, Colors.teal),
          _reportCard('Result Report', 'Exam-wise performance', Icons.grade, Colors.orange),
          _reportCard('AI ML Risk Report', 'Fail & dropout prediction', Icons.psychology, Colors.purple),
          _reportCard('Notice Report', 'All communications', Icons.campaign, Colors.pink),
        ],
      ],
    );
  }

  Widget _reportCard(String title, String sub, IconData icon, Color color) => Card(
    margin: const EdgeInsets.only(bottom: 10),
    child: ListTile(
      leading: Container(width: 44, height: 44, decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: color, size: 22)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(sub, style: const TextStyle(fontSize: 12)),
      trailing: const Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(Icons.picture_as_pdf, color: Color(0xFF94A3B8), size: 18),
        SizedBox(width: 8),
        Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
      ]),
    ),
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
class StudentDashboard extends StatefulWidget {
  const StudentDashboard({super.key});
  @override State<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends State<StudentDashboard> {
  int _tab = 0;
  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    return Scaffold(
      appBar: AppBar(
        title: Text('Hi, ${auth.name.split(' ').first}! 👋'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
        ],
      ),
      body: IndexedStack(
        index: _tab,
        children: [
          _StudentHome(),
          const Center(child: Text('Timetable')),
          const AiAssistantPlaceholder(),
          const Center(child: Text('Profile')),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.calendar_today_outlined), selectedIcon: Icon(Icons.calendar_today), label: 'Timetable'),
          NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI Tutor'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class _StudentHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Attendance circle + stats
        Row(children: [
          _attCircle(91),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Current Semester', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
            const SizedBox(height: 8),
            _smallStat('Avg Marks', '78%'),
            _smallStat('Assignments Due', '3'),
            _smallStat('Fee Status', 'Paid ✅'),
          ])),
        ]),
        const SizedBox(height: 16),
        // Subject performance
        const Text('Subject Performance', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
        const SizedBox(height: 10),
        ...[
          _subBar('Mathematics', 68, Colors.red),
          _subBar('Science', 82, Colors.teal),
          _subBar('English', 91, Colors.green),
          _subBar('History', 75, Colors.orange),
        ],
        const SizedBox(height: 16),
        ElevatedButton.icon(
          onPressed: () => Navigator.pushNamed(context, '/ai/assistant'),
          icon: const Icon(Icons.auto_awesome),
          label: const Text('Get AI Study Plan'),
          style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
        ),
      ],
    );
  }

  Widget _attCircle(int pct) => SizedBox(
    width: 100, height: 100,
    child: Stack(alignment: Alignment.center, children: [
      CircularProgressIndicator(
        value: pct / 100, strokeWidth: 8,
        backgroundColor: Colors.grey.shade200,
        color: pct >= 85 ? Colors.green : pct >= 75 ? Colors.orange : Colors.red,
      ),
      Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Text('$pct%', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const Text('Attendance', style: TextStyle(fontSize: 9, color: Color(0xFF64748B))),
      ]),
    ]),
  );

  Widget _smallStat(String label, String val) => Padding(
    padding: const EdgeInsets.only(bottom: 4),
    child: Row(children: [
      Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
      const Spacer(),
      Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
    ]),
  );

  Widget _subBar(String name, int pct, Color color) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [
        Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
        const Spacer(),
        Text('$pct%', style: TextStyle(fontSize: 13, color: color, fontWeight: FontWeight.w600)),
      ]),
      const SizedBox(height: 4),
      LinearProgressIndicator(value: pct / 100, backgroundColor: Colors.grey.shade100, color: color, borderRadius: BorderRadius.circular(4), minHeight: 6),
    ]),
  );
}

class AiAssistantPlaceholder extends StatelessWidget {
  const AiAssistantPlaceholder({super.key});
  @override
  Widget build(BuildContext context) => Center(
    child: ElevatedButton(
      onPressed: () => Navigator.pushNamed(context, '/ai/assistant'),
      child: const Text('Open AI Tutor'),
    ),
  );
}

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
class ParentDashboard extends StatefulWidget {
  const ParentDashboard({super.key});
  @override State<ParentDashboard> createState() => _ParentDashboardState();
}

class _ParentDashboardState extends State<ParentDashboard> {
  int _tab = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Parent Dashboard')),
      body: IndexedStack(
        index: _tab,
        children: [_ParentHome(), const Center(child: Text('Fee History')), const Center(child: Text('Messages'))],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.child_care_outlined), selectedIcon: Icon(Icons.child_care), label: 'My Child'),
          NavigationDestination(icon: Icon(Icons.payments_outlined), selectedIcon: Icon(Icons.payments), label: 'Fees'),
          NavigationDestination(icon: Icon(Icons.message_outlined), selectedIcon: Icon(Icons.message), label: 'Messages'),
        ],
      ),
    );
  }
}

class _ParentHome extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Child info card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)]),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(children: [
            CircleAvatar(backgroundColor: Colors.white.withOpacity(0.2), radius: 28,
                child: const Text('AS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18))),
            const SizedBox(width: 14),
            const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Aarav Singh', style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)),
              Text('Class 10-A · Roll #1001', style: TextStyle(color: Colors.white70, fontSize: 13)),
              SizedBox(height: 6),
              Row(children: [
                Icon(Icons.circle, color: Colors.greenAccent, size: 10),
                SizedBox(width: 4),
                Text('Active Student', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ]),
            ]),
          ]),
        ),
        const SizedBox(height: 16),
        Row(children: [
          _childStat('91%', 'Attendance', Colors.green),
          const SizedBox(width: 10),
          _childStat('78%', 'Last Result', Colors.blue),
          const SizedBox(width: 10),
          _childStat('Paid', 'Fee Status', Colors.teal),
        ]),
        const SizedBox(height: 16),
        // AI Summary
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFEEF2FF),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Row(children: [
              Icon(Icons.auto_awesome, color: Color(0xFF6366F1), size: 18),
              SizedBox(width: 6),
              Text('AI Performance Summary', style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF6366F1), fontSize: 14)),
            ]),
            const SizedBox(height: 8),
            const Text(
              'Aarav is performing well with 91% attendance. He excels in English (91%) but needs focused attention in Maths (68%). Recommend extra practice sessions for Algebra. Science improved by 8% this month!',
              style: TextStyle(fontSize: 13, height: 1.6),
            ),
            const SizedBox(height: 10),
            OutlinedButton.icon(
              onPressed: () => Navigator.pushNamed(context, '/ai/assistant'),
              icon: const Icon(Icons.chat, size: 16),
              label: const Text('Ask AI Advisor', style: TextStyle(fontSize: 13)),
            ),
          ]),
        ),
      ],
    );
  }

  Widget _childStat(String val, String label, Color color) => Expanded(
    child: Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(14), border: Border.all(color: color.withOpacity(0.2))),
      child: Column(children: [
        Text(val, style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: color)),
        Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
      ]),
    ),
  );
}
