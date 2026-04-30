import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const String BASE_URL = 'https://api.edubrain.in/api'; // Change in production

class ApiService {
  late Dio _dio;
  final _storage = const FlutterSecureStorage();

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: BASE_URL,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));

    // Auth interceptor - auto attach JWT token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'auth_token');
        if (token != null) options.headers['Authorization'] = 'Bearer $token';
        handler.next(options);
      },
      onError: (e, handler) {
        if (e.response?.statusCode == 401) {
          // Auto-logout on token expiry
          _storage.delete(key: 'auth_token');
        }
        handler.next(e);
      },
    ));
  }

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) async {
    final res = await _dio.post(path, data: body);
    return res.data;
  }

  Future<Map<String, dynamic>> get(String path, {Map<String, dynamic>? params}) async {
    final res = await _dio.get(path, queryParameters: params);
    return res.data;
  }

  Future<Map<String, dynamic>> put(String path, Map<String, dynamic> body) async {
    final res = await _dio.put(path, data: body);
    return res.data;
  }

  Future<Map<String, dynamic>> delete(String path) async {
    final res = await _dio.delete(path);
    return res.data;
  }

  // Upload file (photo/document)
  Future<Map<String, dynamic>> uploadFile(String path, String filePath, String fieldName) async {
    final formData = FormData.fromMap({
      fieldName: await MultipartFile.fromFile(filePath, filename: filePath.split('/').last),
    });
    final res = await _dio.post(path, data: formData);
    return res.data;
  }

  // ─── AUTH ───────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> login(String email, String password) =>
      post('/auth/login', {'email': email, 'password': password});

  Future<Map<String, dynamic>> faceLogin(List<double> embedding, String instituteId, {String? classId, bool markAttendance = false}) =>
      post('/auth/face-login', {
        'face_embedding': embedding,
        'institute_id': instituteId,
        if (classId != null) 'class_id': classId,
        'mark_attendance': markAttendance,
      });

  Future<Map<String, dynamic>> fingerprintLogin(String hash, String instituteId, {String? classId, bool markAttendance = false}) =>
      post('/auth/fingerprint-login', {
        'fingerprint_hash': hash,
        'institute_id': instituteId,
        if (classId != null) 'class_id': classId,
        'mark_attendance': markAttendance,
      });

  Future<void> enrollFace(String userId, List<double> embedding) =>
      post('/auth/enroll-face', {'user_id': userId, 'face_embedding': embedding});

  Future<void> enrollFingerprint(String userId, String hash) =>
      post('/auth/enroll-fingerprint', {'user_id': userId, 'fingerprint_hash': hash});

  // ─── ATTENDANCE ──────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> markManualAttendance(List<Map<String, dynamic>> records, String classId, String instituteId) =>
      post('/attendance/mark-manual', {'records': records, 'class_id': classId, 'institute_id': instituteId});

  Future<Map<String, dynamic>> getAttendanceSummary(String studentId, {int? month, int? year}) =>
      get('/attendance/summary/$studentId', params: {'month': month, 'year': year});

  Future<Map<String, dynamic>> getLowAttendance(String instituteId, {int threshold = 75}) =>
      get('/attendance/low/$instituteId', params: {'threshold': threshold});

  Future<Map<String, dynamic>> getTodayAttendance(String classId) =>
      get('/attendance/today/$classId');

  // ─── RESULTS ────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> extractMarksFromPhoto(String imageUrl, String subject, int maxMarks) =>
      post('/result/extract-marks', {'image_url': imageUrl, 'subject': subject, 'max_marks': maxMarks});

  Future<Map<String, dynamic>> saveResult(Map<String, dynamic> data) =>
      post('/result/save', data);

  Future<Map<String, dynamic>> generateAiComment(String name, double pct, List<String> weak) =>
      post('/result/generate-comment', {'student_name': name, 'percentage': pct, 'weak_subjects': weak});

  // ─── AI ─────────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> aiChat(List<Map<String, dynamic>> messages) =>
      post('/ai/chat', {'messages': messages});

  Future<Map<String, dynamic>> generateQuestionPaper(Map<String, dynamic> params) =>
      post('/ai/question-paper', params);

  Future<Map<String, dynamic>> generateNotes(Map<String, dynamic> params) =>
      post('/ai/notes', params);

  Future<Map<String, dynamic>> generateStudyPlan(String name, List<String> weak, String examDate) =>
      post('/ai/study-plan', {'student_name': name, 'weak_subjects': weak, 'exam_date': examDate});

  Future<Map<String, dynamic>> solveDoubt(String question, {String? subject, String? cls}) =>
      post('/ai/solve-doubt', {'question': question, if (subject != null) 'subject': subject, if (cls != null) 'class': cls});

  Future<Map<String, dynamic>> mlPrediction(Map<String, dynamic> features) =>
      post('/ai/ml-prediction', features);

  // ─── STUDENTS ───────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> getStudentsByClass(String classId, {String? sectionId}) =>
      get('/student/class/$classId', params: sectionId != null ? {'section_id': sectionId} : null);

  // ─── FEES ───────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> collectFee(String feeId, double amount, String method) =>
      post('/fee/collect', {'fee_id': feeId, 'amount': amount, 'method': method});

  Future<Map<String, dynamic>> getPendingFees(String instituteId) =>
      get('/fee/pending/$instituteId');

  // ─── NOTICES ────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> getNotices(String instituteId, String role) =>
      get('/notice/$instituteId/$role');
}
