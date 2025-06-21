import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Settings as SettingsIcon, User, CircleHelp as HelpCircle, ChevronRight, LogIn, Palette, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const SettingItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showChevron = false
}: SettingItemProps) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <View style={styles.settingIcon}>
      {React.cloneElement(icon as React.ReactElement, {
        size: 20,
        strokeWidth: 2
      })}
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {showChevron && (
      <ChevronRight size={20} color="#9ca3af" strokeWidth={2} />
    )}
  </TouchableOpacity>
);

const SettingSection = ({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

export default function SettingsScreen() {
  const handleLoginRequired = () => {
    Alert.alert(
      'Giriş Gerekli',
      'Bu özelliği kullanmak için giriş yapmanız gerekiyor.',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Giriş Yap', onPress: () => router.push('/login') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <SettingsIcon size={32} color="#6366f1" strokeWidth={2} />
          </View>
          <Text style={styles.headerTitle}>Ayarlar</Text>
          <Text style={styles.headerSubtitle}>
            Uygulama tercihlerinizi yönetin
          </Text>
        </View>

        {/* Account Section */}
        <SettingSection title="Hesap">
          <SettingItem
            icon={<User size={20} color="#6b7280" strokeWidth={2} />}
            title="Misafir Kullanıcı"
            subtitle="Uygulamayı keşfetme modunda kullanıyorsunuz"
          />
          
          <SettingItem
            icon={<LogIn size={20} color="#10b981" strokeWidth={2} />}
            title="Giriş Yap"
            subtitle="Aboneliklerinizi kaydetmek için giriş yapın"
            onPress={() => router.push('/login')}
            showChevron
          />
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection title="Görünüm">
          <SettingItem
            icon={<Palette size={20} color="#f59e0b" strokeWidth={2} />}
            title="Tema"
            subtitle="Sistem teması kullanılıyor"
            onPress={() => {
              Alert.alert(
                'Tema Ayarları',
                'Tema ayarları cihazınızın sistem ayarlarından değiştirilebilir.',
                [{ text: 'Tamam' }]
              );
            }}
            showChevron
          />
        </SettingSection>

        {/* App Section */}
        <SettingSection title="Uygulama Bilgileri">
          <SettingItem
            icon={<Shield size={20} color="#f59e0b" strokeWidth={2} />}
            title="Gizlilik Politikası"
            subtitle="Verilerinizi nasıl koruduğumuzu öğrenin"
            onPress={() => {
              Alert.alert(
                'Gizlilik Politikası',
                'Bu uygulama tüm abonelik verilerinizi güvenli bir şekilde saklar. Kişisel bilgileriniz şifrelenir ve güvenli bir şekilde korunur.\n\n• Veriler güvenli sunucularında saklanır\n• Kişisel verileriniz şifrelenir\n• Üçüncü taraf veri paylaşımı yok\n• Veriler üzerinde tam kullanıcı kontrolü\n• Misafir modunda hiçbir veri saklanmaz'
              );
            }}
            showChevron
          />
          
          <SettingItem
            icon={<HelpCircle size={20} color="#6b7280" strokeWidth={2} />}
            title="Yardım ve Destek"
            subtitle="Uygulamayı kullanma konusunda yardım alın"
            onPress={() => {
              Alert.alert(
                'Yardım ve Destek',
                'Yardıma mı ihtiyacınız var? İşte bazı hızlı ipuçları:\n\n• Misafir modunda uygulamayı keşfedebilirsiniz\n• Giriş yaparak kendi aboneliklerinizi takip edin\n• Abonelik eklemek için + butonuna dokunun\n• Her abonelik için hatırlatma günü ayarlayın\n• Detayları görmek için herhangi bir aboneliğe dokunun\n• Harcama içgörüleri için Analiz sekmesini kullanın\n\nDaha fazla yardım için destek@aboneliktakipcisi.com adresine yazın'
              );
            }}
            showChevron
          />
        </SettingSection>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});