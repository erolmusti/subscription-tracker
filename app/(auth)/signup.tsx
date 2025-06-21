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
import { UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react-native'
import { useAuth } from '@/hooks/useAuth'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'

export default function SignupScreen() {
  const { signUp, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gerekli'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async () => {
    if (!validateForm()) return

    const result = await signUp(formData.email, formData.password)
    
    if (!result.success) {
      Alert.alert('Kayıt Hatası', result.error || 'Kayıt oluşturulamadı')
    } else {
      Alert.alert(
        'Kayıt Başarılı',
        'E-posta adresinizi doğrulamak için gelen kutunuzu kontrol edin.',
        [
          {
            text: 'Tamam',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      )
    }
  }

  const isFormValid = () => {
    return formData.email.trim() !== '' && 
           formData.password.length >= 6 &&
           formData.confirmPassword === formData.password &&
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
              <UserPlus size={48} color="#6366f1" strokeWidth={2} />
            </View>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              Aboneliklerinizi takip etmeye başlamak için kayıt olun
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
                placeholder="En az 6 karakter"
                secureTextEntry={!showPassword}
                autoComplete="new-password"
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

            <View style={styles.passwordContainer}>
              <FormField
                label="Şifre Tekrarı"
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, confirmPassword: text }))
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: '' }))
                  }
                }}
                placeholder="Şifrenizi tekrar girin"
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                required
                error={errors.confirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6b7280" strokeWidth={2} />
                ) : (
                  <Eye size={20} color="#6b7280" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            <CustomButton
              title={loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
              onPress={handleSignup}
              disabled={!isFormValid() || loading}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>Giriş Yap</Text>
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