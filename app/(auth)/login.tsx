import React, { useState } from 'react'
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
} from 'react-native'
import { router } from 'expo-router'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react-native'
import { useAuth } from '@/hooks/useAuth'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'

export default function LoginScreen() {
  const { signIn, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi gerekli'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin'
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gerekli'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    const result = await signIn(formData.email, formData.password)
    
    if (!result.success) {
      Alert.alert('Giriş Hatası', result.error || 'Giriş yapılamadı')
    } else {
      router.replace('/(tabs)')
    }
  }

  const isFormValid = () => {
    return formData.email.trim() !== '' && 
           formData.password.length >= 6 &&
           /\S+@\S+\.\S+/.test(formData.email)
  }

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
            <FormField
              label="E-posta"
              value={formData.email}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, email: text }))
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }))
                }
              }}
              placeholder="ornek@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              required
              error={errors.email}
            />

            <View style={styles.passwordContainer}>
              <FormField
                label="Şifre"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, password: text }))
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }))
                  }
                }}
                placeholder="Şifrenizi girin"
                secureTextEntry={!showPassword}
                autoComplete="password"
                required
                error={errors.password}
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

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/forgot-password')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            <CustomButton
              title={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              onPress={handleLogin}
              disabled={!isFormValid() || loading}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
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
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 44,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
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
})