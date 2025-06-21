import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ChartBar as BarChart3, LogIn } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AnalyticsScreen() {
  const handleLoginRequired = () => {
    Alert.alert(
      'Giriş Gerekli',
      'Harcama analizlerini görmek için giriş yapmanız gerekiyor.',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Giriş Yap', onPress: () => router.push('/login') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <BarChart3 size={64} color="#6366f1" strokeWidth={1.5} />
        </View>
        
        <Text style={styles.title}>Harcama Analizi</Text>
        <Text style={styles.description}>
          Abonelik harcamalarınızla ilgili detaylı analizler ve içgörüler için giriş yapın.
        </Text>
        
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginRequired}
          activeOpacity={0.8}
        >
          <LogIn size={20} color="#ffffff" strokeWidth={2} />
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
        
        <Text style={styles.helpText}>
          Giriş yaptıktan sonra aylık/yıllık harcama trendlerinizi, kategori bazlı dağılımları ve tasarruf önerilerini görebilirsiniz.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});