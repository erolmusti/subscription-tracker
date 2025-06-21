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
import { ArrowLeft, Mail, RotateCcw } from 'lucide-react-native'
import { useAuth } from '@/hooks/useAuth'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('E-posta adresi gerekli')
      return
    }

    if (!validateEmail(email)) {
      setError('Geçerli bir e-posta adresi girin')
      return
    }

    setLoading(true)
    setError('')

    const result = await resetPassword(email)
    
    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Şifre sıfırlama e-postası gönderilemedi')
    } else {
      Alert.alert(
        'E-posta Gönderildi',
        'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Gelen kutunuzu kontrol edin.',
        [
          {
            text: 'Tamam',
            onPress: () => router.back(),
          },
        ]
      )
    }
  }

  const isFormValid = () => {
    return email.trim() !== '' && validateEmail(email)
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <RotateCcw size={48} color="#6366f1" strokeWidth={2} />
            </View>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FormField
              label="E-posta"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (error) {
                  setError('')
                }
              }}
              placeholder="ornek@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              required
              error={error}
            />

            <CustomButton
              title={loading ? "Gönderiliyor..." : "Şifre Sıfırlama E-postası Gönder"}
              onPress={handleResetPassword}
              disabled={!isFormValid() || loading}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Şifrenizi hatırladınız mı? </Text>
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