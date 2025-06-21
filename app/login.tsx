import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Yakında Gelecek',
        'Giriş yapma özelliği yakında eklenecek. Şimdilik misafir modunda uygulamayı keşfedebilirsiniz.',
        [
          {
            text: 'Tamam',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1000);
  };

  const isFormValid = () => {
    return formData.email.trim() !== '' && formData.password.length >= 6;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <LogIn size={48} color="#6366f1" strokeWidth={2} />
            </View>
            <Text style={styles.title}>Hoş Geldiniz</Text>
            <Text style={styles.subtitle}>
              Aboneliklerinizi takip etmeye devam etmek için giriş yapın
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="ornek@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  placeholder="Şifrenizi girin"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#6b7280" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, (!isFormValid() || loading) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!isFormValid() || loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.loginButtonText, (!isFormValid() || loading) && styles.loginButtonTextDisabled]}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#f3f4f6',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonTextDisabled: {
    color: '#9ca3af',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
  },
  footerLink: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
});