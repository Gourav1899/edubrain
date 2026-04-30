import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});
  @override State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  final List<Map<String, dynamic>> _messages = [];
  bool _loading = false;

  final List<String> _suggestions = [
    'Explain Photosynthesis', 'Solve: 2x + 5 = 15',
    'Create study plan for me', 'What is Newton\'s 2nd law?',
    'Notes on French Revolution', 'Help with Algebra',
  ];

  @override
  void initState() {
    super.initState();
    _messages.add({
      'role': 'assistant',
      'content': 'Namaste! Main EduBrain AI hun 🤖\n\nMain aapki help kar sakta hun:\n• Doubts solve karna\n• Notes generate karna\n• Study plan banana\n• Exam preparation\n\nKya poochna chahte hain?',
    });
  }

  Future<void> _sendMessage([String? text]) async {
    final msg = text ?? _ctrl.text.trim();
    if (msg.isEmpty || _loading) return;
    _ctrl.clear();

    setState(() {
      _messages.add({'role': 'user', 'content': msg});
      _loading = true;
    });
    _scrollDown();

    try {
      final api = context.read<ApiService>();
      final auth = context.read<AuthProvider>();

      // Build context from role
      final systemHint = 'You are EduBrain AI, a helpful educational assistant for ${auth.role}s in Indian schools/colleges. '
          'Answer in a mix of English and Hindi (Hinglish) to be more accessible. Be concise and helpful.';

      final history = _messages.map((m) => {'role': m['role'], 'content': m['content'] as String}).toList();
      final res = await api.aiChat(history);
      final reply = res['data']?['reply'] ?? 'Sorry, something went wrong.';

      setState(() { _messages.add({'role': 'assistant', 'content': reply}); _loading = false; });
      _scrollDown();
    } catch (e) {
      setState(() {
        _messages.add({'role': 'assistant', 'content': 'Sorry, error hua. Please try again.'});
        _loading = false;
      });
    }
  }

  void _scrollDown() => Future.delayed(const Duration(milliseconds: 100), () {
    if (_scroll.hasClients) _scroll.animateTo(_scroll.maxScrollExtent, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [
          CircleAvatar(backgroundColor: Color(0xFF6366F1), radius: 16, child: Text('AI', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold))),
          SizedBox(width: 10),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('EduBrain AI', style: TextStyle(fontSize: 15)),
            Text('Always online', style: TextStyle(fontSize: 11, color: Colors.green)),
          ]),
        ]),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_loading ? 1 : 0),
              itemBuilder: (_, i) {
                if (i == _messages.length) return _typingIndicator();
                final m = _messages[i];
                return _bubble(m['role'] == 'user', m['content']);
              },
            ),
          ),

          // Suggestions (only when fresh)
          if (_messages.length <= 1)
            SizedBox(
              height: 48,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _suggestions.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (_, i) => ActionChip(
                  label: Text(_suggestions[i], style: const TextStyle(fontSize: 12)),
                  onPressed: () => _sendMessage(_suggestions[i]),
                  backgroundColor: const Color(0xFFEEF2FF),
                  side: const BorderSide(color: Color(0xFF6366F1)),
                ),
              ),
            ),

          // Input row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Colors.grey.shade200)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _ctrl,
                    maxLines: null,
                    onSubmitted: (_) => _sendMessage(),
                    decoration: const InputDecoration(
                      hintText: 'Ask me anything...',
                      border: InputBorder.none,
                      filled: false,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                InkWell(
                  onTap: _loading ? null : () => _sendMessage(),
                  borderRadius: BorderRadius.circular(24),
                  child: Container(
                    width: 44, height: 44,
                    decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF6366F1)),
                    child: const Icon(Icons.send, color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _bubble(bool isUser, String text) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isUser ? const Color(0xFF6366F1) : Colors.grey.shade100,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16), topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isUser ? 16 : 4),
            bottomRight: Radius.circular(isUser ? 4 : 16),
          ),
        ),
        child: Text(text, style: TextStyle(
          color: isUser ? Colors.white : Colors.black87, fontSize: 14, height: 1.5,
        )),
      ),
    );
  }

  Widget _typingIndicator() => Align(
    alignment: Alignment.centerLeft,
    child: Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(16)),
      child: const Row(mainAxisSize: MainAxisSize.min, children: [
        _Dot(delay: 0), SizedBox(width: 4), _Dot(delay: 150), SizedBox(width: 4), _Dot(delay: 300),
      ]),
    ),
  );

  @override
  void dispose() { _ctrl.dispose(); _scroll.dispose(); super.dispose(); }
}

class _Dot extends StatefulWidget {
  final int delay;
  const _Dot({required this.delay});
  @override State<_Dot> createState() => _DotState();
}
class _DotState extends State<_Dot> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() {
    super.initState();
    _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 600))
      ..repeat(reverse: true);
    Future.delayed(Duration(milliseconds: widget.delay), () { if (mounted) _c.forward(); });
  }
  @override Widget build(BuildContext context) => AnimatedBuilder(
    animation: _c, builder: (_, __) => Transform.translate(
      offset: Offset(0, -4 * _c.value),
      child: Container(width: 8, height: 8, decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF6366F1))),
    ),
  );
  @override void dispose() { _c.dispose(); super.dispose(); }
}
