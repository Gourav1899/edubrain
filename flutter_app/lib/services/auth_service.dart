import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class AuthProvider extends ChangeNotifier {
  final _storage = const FlutterSecureStorage();

  Map<String, dynamic>? _user;
  String? _token;
  bool _isLoading = false;

  Map<String, dynamic>? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _token != null && _user != null;
  String get role => _user?['role'] ?? '';
  String get instituteId => _user?['institute_id'] ?? '';
  String get userId => _user?['_id'] ?? '';
  String get name => _user?['name'] ?? 'User';

  Future<void> initialize() async {
    _token = await _storage.read(key: 'auth_token');
    final userStr = await _storage.read(key: 'user_data');
    if (userStr != null) _user = jsonDecode(userStr);
    notifyListeners();
  }

  Future<void> setAuth(String token, Map<String, dynamic> user) async {
    _token = token;
    _user = user;
    await _storage.write(key: 'auth_token', value: token);
    await _storage.write(key: 'user_data', value: jsonEncode(user));
    notifyListeners();
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    await _storage.deleteAll();
    notifyListeners();
  }

  void setLoading(bool v) { _isLoading = v; notifyListeners(); }

  // Routing based on role
  String get dashboardRoute {
    switch (role) {
      case 'admin': case 'super_admin': return '/dashboard/admin';
      case 'teacher': return '/dashboard/teacher';
      case 'student': return '/dashboard/student';
      case 'parent': return '/dashboard/parent';
      default: return '/login';
    }
  }
}
