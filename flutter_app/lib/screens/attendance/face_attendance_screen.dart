import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:google_mlkit_face_detection/google_mlkit_face_detection.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';

class FaceAttendanceScreen extends StatefulWidget {
  const FaceAttendanceScreen({super.key});
  @override State<FaceAttendanceScreen> createState() => _FaceAttendanceScreenState();
}

class _FaceAttendanceScreenState extends State<FaceAttendanceScreen> {
  CameraController? _cam;
  FaceDetector? _detector;
  bool _isDetecting = false;
  bool _faceDetected = false;
  String _status = 'Position your face in the frame';
  String? _recognizedName;
  double _confidence = 0;
  bool _success = false;

  @override
  void initState() {
    super.initState();
    _initCamera();
    _detector = FaceDetector(options: FaceDetectorOptions(
      enableContours: true, enableLandmarks: true, enableClassification: true,
      performanceMode: FaceDetectorMode.accurate,
    ));
  }

  Future<void> _initCamera() async {
    final cameras = await availableCameras();
    final front = cameras.firstWhere((c) => c.lensDirection == CameraLensDirection.front, orElse: () => cameras.first);
    _cam = CameraController(front, ResolutionPreset.high, enableAudio: false);
    await _cam!.initialize();
    _cam!.startImageStream(_processCameraImage);
    setState(() {});
  }

  void _processCameraImage(CameraImage image) async {
    if (_isDetecting || _success) return;
    _isDetecting = true;
    try {
      final inputImage = _cameraImageToInputImage(image);
      final faces = await _detector!.processImage(inputImage);
      if (faces.isNotEmpty) {
        setState(() { _faceDetected = true; _status = 'Face detected! Recognizing...'; });
        // Extract face embedding (in production use face_net or similar)
        final embedding = _extractMockEmbedding(faces.first);
        _recognizeFace(embedding);
      } else {
        setState(() { _faceDetected = false; _status = 'Position your face in the frame'; });
      }
    } catch (_) {}
    _isDetecting = false;
  }

  // Mock embedding - in production use TensorFlow Lite FaceNet model
  List<double> _extractMockEmbedding(Face face) {
    final b = face.boundingBox;
    return List.generate(128, (i) => (b.left + b.top + b.width + i) % 1.0);
  }

  InputImage _cameraImageToInputImage(CameraImage image) {
    // Simplified - actual implementation requires proper plane handling
    return InputImage.fromBytes(
      bytes: image.planes.first.bytes,
      metadata: InputImageMetadata(
        size: Size(image.width.toDouble(), image.height.toDouble()),
        rotation: InputImageRotation.rotation0deg,
        format: InputImageFormat.bgra8888,
        bytesPerRow: image.planes.first.bytesPerRow,
      ),
    );
  }

  Future<void> _recognizeFace(List<double> embedding) async {
    if (_success) return;
    try {
      final auth = context.read<AuthProvider>();
      final api = context.read<ApiService>();
      final args = ModalRoute.of(context)?.settings.arguments as Map?;
      final classId = args?['class_id'] as String?;

      final res = await api.faceLogin(
        embedding, auth.instituteId,
        classId: classId, markAttendance: classId != null,
      );
      final user = res['data']?['user'];
      final conf = (res['data']?['confidence'] ?? 0) * 100;

      setState(() {
        _success = true;
        _recognizedName = user?['name'] ?? 'Unknown';
        _confidence = conf.toDouble();
        _status = 'Attendance marked!';
      });
      _cam?.stopImageStream();

      await Future.delayed(const Duration(seconds: 2));
      if (mounted) Navigator.pop(context, {'success': true, 'name': _recognizedName});
    } catch (e) {
      setState(() { _status = 'Not recognized. Try again.'; _faceDetected = false; });
    }
  }

  @override
  void dispose() {
    _cam?.dispose();
    _detector?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: const Text('Face Attendance', style: TextStyle(color: Colors.white)),
      ),
      body: Stack(
        fit: StackFit.expand,
        children: [
          if (_cam != null && _cam!.value.isInitialized)
            CameraPreview(_cam!),

          // Face oval overlay
          CustomPaint(painter: _FaceOvalPainter(detected: _faceDetected, success: _success)),

          // Status overlay
          Positioned(
            bottom: 80,
            left: 20, right: 20,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.7),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_success) ...[
                    const Icon(Icons.check_circle, color: Colors.green, size: 48),
                    const SizedBox(height: 8),
                    Text(_recognizedName ?? '', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                    Text('${_confidence.toStringAsFixed(1)}% confidence', style: const TextStyle(color: Colors.green)),
                  ] else ...[
                    Icon(_faceDetected ? Icons.face : Icons.face_retouching_off,
                        color: _faceDetected ? Colors.green : Colors.white70, size: 40),
                    const SizedBox(height: 8),
                    Text(_status, style: const TextStyle(color: Colors.white, fontSize: 16), textAlign: TextAlign.center),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FaceOvalPainter extends CustomPainter {
  final bool detected, success;
  _FaceOvalPainter({required this.detected, required this.success});

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2, cy = size.height * 0.42;
    final rx = size.width * 0.38, ry = size.height * 0.3;

    // Dark overlay outside oval
    final bg = Paint()..color = Colors.black.withOpacity(0.55);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), bg);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy), width: rx * 2, height: ry * 2),
        Paint()..blendMode = BlendMode.clear);

    // Oval border
    final border = Paint()
      ..color = success ? Colors.green : (detected ? const Color(0xFF6366F1) : Colors.white60)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;
    canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy), width: rx * 2, height: ry * 2), border);
  }

  @override
  bool shouldRepaint(_FaceOvalPainter old) => old.detected != detected || old.success != success;
}
