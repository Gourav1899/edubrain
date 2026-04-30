import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class ResultEntryScreen extends StatefulWidget {
  const ResultEntryScreen({super.key});
  @override State<ResultEntryScreen> createState() => _ResultEntryScreenState();
}

class _ResultEntryScreenState extends State<ResultEntryScreen> {
  final _picker = ImagePicker();
  bool _loading = false;
  String? _aiComment;

  // Mock subjects for demo
  final List<Map<String, dynamic>> _subjects = [
    {'name': 'Mathematics', 'max_marks': 100, 'obtained_marks': null, 'photo': null, 'ai_autofilled': false},
    {'name': 'Science', 'max_marks': 100, 'obtained_marks': null, 'photo': null, 'ai_autofilled': false},
    {'name': 'English', 'max_marks': 100, 'obtained_marks': null, 'photo': null, 'ai_autofilled': false},
    {'name': 'Hindi', 'max_marks': 100, 'obtained_marks': null, 'photo': null, 'ai_autofilled': false},
    {'name': 'Social Science', 'max_marks': 100, 'obtained_marks': null, 'photo': null, 'ai_autofilled': false},
  ];

  String _grade(double pct) {
    if (pct >= 90) return 'A+'; if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+'; if (pct >= 60) return 'B';
    if (pct >= 50) return 'C'; if (pct >= 35) return 'D'; return 'F';
  }

  double get _totalObtained => _subjects.fold(0, (s, m) => s + ((m['obtained_marks'] as num?) ?? 0));
  double get _totalMax => _subjects.fold(0, (s, m) => s + ((m['max_marks'] as num?) ?? 0));
  double get _percentage => _totalMax > 0 ? (_totalObtained / _totalMax * 100) : 0;

  // Scan answer sheet photo with AI → auto-extract marks
  Future<void> _scanAnswerSheet(int index) async {
    final picked = await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
    if (picked == null) return;

    setState(() { _subjects[index]['photo'] = picked.path; _loading = true; });

    try {
      final api = context.read<ApiService>();
      final bytes = await File(picked.path).readAsBytes();
      final base64Image = 'data:image/jpeg;base64,${base64Encode(bytes)}';

      final res = await api.extractMarksFromPhoto(
        base64Image,
        _subjects[index]['name'],
        _subjects[index]['max_marks'],
      );

      final marks = res['data']?['marks'];
      final aiDone = res['data']?['ai_autofilled'] == true;

      setState(() {
        _subjects[index]['obtained_marks'] = marks >= 0 ? marks.toDouble() : null;
        _subjects[index]['ai_autofilled'] = aiDone && marks >= 0;
        _loading = false;
      });

      if (marks < 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not extract marks — please enter manually'), backgroundColor: Colors.orange),
        );
      }
    } catch (e) {
      setState(() { _loading = false; });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
      );
    }
  }

  Future<void> _generateAiComment() async {
    setState(() => _loading = true);
    try {
      final api = context.read<ApiService>();
      final args = ModalRoute.of(context)?.settings.arguments as Map?;
      final studentName = args?['student_name'] ?? 'Student';
      final weakSubs = _subjects.where((s) {
        final m = s['obtained_marks'] as double?;
        return m != null && (m / (s['max_marks'] as int)) < 0.6;
      }).map((s) => s['name'] as String).toList();

      final res = await api.generateAiComment(studentName, _percentage, weakSubs);
      setState(() { _aiComment = res['data']?['comment']; _loading = false; });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  Future<void> _saveResult() async {
    if (_subjects.any((s) => s['obtained_marks'] == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter marks for all subjects')),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final api = context.read<ApiService>();
      final auth = context.read<AuthProvider>();
      final args = ModalRoute.of(context)?.settings.arguments as Map?;

      await api.saveResult({
        'institute_id': auth.instituteId,
        'exam_id': args?['exam_id'] ?? '',
        'student_id': args?['student_id'] ?? '',
        'class_id': args?['class_id'] ?? '',
        'subject_marks': _subjects.map((s) => {
          'subject_name': s['name'],
          'max_marks': s['max_marks'],
          'obtained_marks': s['obtained_marks'],
          'ai_autofilled': s['ai_autofilled'],
        }).toList(),
        'ai_comment': _aiComment,
      });

      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Result saved successfully!'), backgroundColor: Colors.green),
      );
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enter Result'),
        actions: [
          if (_loading) const Padding(padding: EdgeInsets.all(16), child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))),
        ],
      ),
      body: Column(
        children: [
          // Summary bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            color: const Color(0xFF6366F1),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _stat('${_totalObtained.toStringAsFixed(0)}/${_totalMax.toStringAsFixed(0)}', 'Total Marks'),
                _stat('${_percentage.toStringAsFixed(1)}%', 'Percentage'),
                _stat(_grade(_percentage), 'Grade'),
              ],
            ),
          ),

          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Subject rows
                ..._subjects.asMap().entries.map((e) => _subjectCard(e.key, e.value)),
                const SizedBox(height: 12),

                // AI Comment section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.auto_awesome, color: Color(0xFF6366F1), size: 20),
                            const SizedBox(width: 8),
                            const Text('AI Report Card Comment', style: TextStyle(fontWeight: FontWeight.w600)),
                            const Spacer(),
                            TextButton.icon(
                              onPressed: _generateAiComment,
                              icon: const Icon(Icons.refresh, size: 16),
                              label: const Text('Generate'),
                            ),
                          ],
                        ),
                        if (_aiComment != null) ...[
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEEF2FF),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(_aiComment!, style: const TextStyle(fontSize: 13, height: 1.6)),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 80),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: ElevatedButton.icon(
          onPressed: _saveResult,
          icon: const Icon(Icons.save),
          label: const Text('Save Result'),
          style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(52)),
        ),
      ),
    );
  }

  Widget _stat(String val, String label) => Column(
    children: [
      Text(val, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)),
    ],
  );

  Widget _subjectCard(int index, Map<String, dynamic> sub) {
    final ctrl = TextEditingController(text: sub['obtained_marks']?.toString() ?? '');
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(sub['name'], style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15))),
                if (sub['ai_autofilled'] == true)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(20)),
                    child: const Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(Icons.auto_awesome, size: 12, color: Colors.green),
                      SizedBox(width: 4),
                      Text('AI filled', style: TextStyle(fontSize: 11, color: Colors.green, fontWeight: FontWeight.w600)),
                    ]),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                // Marks input
                Expanded(
                  child: TextField(
                    controller: ctrl,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Marks / ${sub['max_marks']}',
                      prefixIcon: const Icon(Icons.grade_outlined),
                    ),
                    onChanged: (v) {
                      final marks = double.tryParse(v);
                      setState(() {
                        _subjects[index]['obtained_marks'] = marks != null && marks <= sub['max_marks'] ? marks : null;
                        _subjects[index]['ai_autofilled'] = false;
                      });
                    },
                  ),
                ),
                const SizedBox(width: 10),
                // Camera button for AI scan
                InkWell(
                  onTap: () => _scanAnswerSheet(index),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    width: 52, height: 52,
                    decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xFF6366F1)),
                      borderRadius: BorderRadius.circular(12),
                      color: const Color(0xFFEEF2FF),
                    ),
                    child: sub['photo'] != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(11),
                            child: Image.file(File(sub['photo']), fit: BoxFit.cover),
                          )
                        : const Icon(Icons.camera_alt, color: Color(0xFF6366F1)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text('Tap camera to scan answer sheet — AI will auto-fill marks',
                style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
          ],
        ),
      ),
    );
  }
}
