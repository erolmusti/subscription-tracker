import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, CreditCard as Edit3, Trash2, Calendar, DollarSign, Bell, FileText, CreditCard, Clock, Archive, RotateCcw } from 'lucide-react-native';
import { useSupabaseSubscriptions } from '@/hooks/useSupabaseSubscriptions';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const formatCurrency = (amount: number) => {
  return `₺${amount.toFixed(2)}`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getDaysUntilPayment = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const paymentDate = new Date(date);
  paymentDate.setHours(0, 0, 0, 0);
  
  const diffTime = paymentDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'bugün';
  if (diffDays === 1) return 'yarın';
  if (diffDays < 0) return `${Math.abs(diffDays)} gün gecikmiş`;
  return `${diffDays} gün sonra`;
};

const InfoCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color = '#6366f1' 
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}) => (
  <View style={styles.infoCard}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
      {React.cloneElement(icon as React.ReactElement, { 
        size: 20, 
        color: color,
        strokeWidth: 2 
      })}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      {subtitle && <Text style={styles.infoSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);

const ConfirmationModal = ({ 
  visible, 
  onConfirm, 
  onCancel, 
  title, 
  message,
  confirmText = 'Onayla',
  confirmColor = '#ef4444'
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        
        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: confirmColor }]}
            onPress={onConfirm}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

function SubscriptionDetailContent() {
  const { id } = useLocalSearchParams();
  const { 
    getSubscriptionById, 
    deleteSubscription,
    archiveSubscription,
    reactivateSubscription 
  } = useSupabaseSubscriptions();
  const { requireAuth } = useAuthGuard();
  
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);

  // Check auth and redirect if needed
  useEffect(() => {
    if (!requireAuth()) {
      return;
    }
  }, []);

  // Load subscription data
  useEffect(() => {
    const loadSubscription = async () => {
      if (typeof id === 'string') {
        setIsLoading(true);
        const sub = await getSubscriptionById(id);
        setSubscription(sub);
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, [id, getSubscriptionById]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Abonelik Bulunamadı</Text>
          <Text style={styles.errorMessage}>
            Aradığınız abonelik mevcut değil.
          </Text>
          <TouchableOpacity
            style={styles.backToHomeButton}
            onPress={() => router.push('/')}
            activeOpacity={0.7}
          >
            <Text style={styles.backToHomeText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    requireAuth(() => router.push(`/add?editId=${subscription.id}`));
  };

  const handleDelete = () => {
    requireAuth(() => setShowDeleteModal(true));
  };

  const handleArchive = () => {
    requireAuth(() => setShowArchiveModal(true));
  };

  const handleReactivate = () => {
    requireAuth(() => setShowReactivateModal(true));
  };

  const confirmDelete = async () => {
    try {
      await deleteSubscription(subscription.id);
      setShowDeleteModal(false);
      Alert.alert(
        'Silindi',
        `${subscription.name} kalıcı olarak kaldırıldı.`,
        [
          {
            text: 'Tamam',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Abonelik silinemedi. Lütfen tekrar deneyin.');
    }
  };

  const confirmArchive = async () => {
    try {
      await archiveSubscription(subscription.id);
      setShowArchiveModal(false);
      Alert.alert(
        'Arşivlendi',
        `${subscription.name} arşivlendi ve artık hatırlatma göndermeyecek.`,
        [
          {
            text: 'Tamam',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Abonelik arşivlenemedi. Lütfen tekrar deneyin.');
    }
  };

  const confirmReactivate = async () => {
    try {
      await reactivateSubscription(subscription.id);
      setShowReactivateModal(false);
      // Refresh subscription data
      const updatedSub = await getSubscriptionById(subscription.id);
      setSubscription(updatedSub);
      Alert.alert('Başarılı', `${subscription.name} yeniden etkinleştirildi!`);
    } catch (error) {
      Alert.alert('Hata', 'Abonelik yeniden etkinleştirilemedi. Lütfen tekrar deneyin.');
    }
  };

  const daysUntil = getDaysUntilPayment(subscription.next_payment);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const paymentDate = new Date(subscription.next_payment);
  paymentDate.setHours(0, 0, 0, 0);
  const isOverdue = paymentDate < today;

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'Weekly': return 'Haftalık';
      case 'Monthly': return 'Aylık';
      case 'Yearly': return 'Yıllık';
      default: return frequency;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={styles.subscriptionName}>{subscription.name}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.subscriptionCategory}>{subscription.category}</Text>
            {!subscription.is_active && (
              <View style={styles.archivedBadge}>
                <Archive size={12} color="#8b5cf6" strokeWidth={2} />
                <Text style={styles.archivedBadgeText}>Arşivlenmiş</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            activeOpacity={0.7}
          >
            <Edit3 size={20} color="#6366f1" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color="#ef4444" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Icon & Status */}
        <View style={styles.serviceSection}>
          <View style={[
            styles.serviceIcon, 
            { 
              backgroundColor: subscription.color,
              opacity: subscription.is_active ? 1 : 0.6
            }
          ]}>
            <Text style={styles.serviceIconText}>
              {subscription.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Durum</Text>
              <View style={styles.statusValue}>
                <Text style={[
                  styles.statusText,
                  subscription.is_active ? styles.activeText : styles.inactiveText
                ]}>
                  {subscription.is_active ? 'Aktif' : 'Arşivlenmiş'}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            {subscription.is_active ? (
              <TouchableOpacity
                style={styles.archiveButton}
                onPress={handleArchive}
                activeOpacity={0.7}
              >
                <Archive size={18} color="#8b5cf6" strokeWidth={2} />
                <Text style={styles.archiveButtonText}>Aboneliği Arşivle</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.reactivateButton}
                onPress={handleReactivate}
                activeOpacity={0.7}
              >
                <RotateCcw size={18} color="#10b981" strokeWidth={2} />
                <Text style={styles.reactivateButtonText}>Aboneliği Yeniden Etkinleştir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme Bilgileri</Text>
          
          <InfoCard
            icon={<DollarSign />}
            title="Tutar ve Sıklık"
            value={`${formatCurrency(subscription.amount)} / ${getFrequencyText(subscription.frequency)}`}
            color={subscription.color}
          />
          
          <InfoCard
            icon={<Calendar />}
            title="İlk Ödeme Tarihi"
            value={formatDate(subscription.first_payment_date)}
            color="#10b981"
          />
          
          {subscription.is_active && (
            <InfoCard
              icon={<CreditCard />}
              title="Sonraki Ödeme"
              value={formatDate(subscription.next_payment)}
              subtitle={`Ödeme ${daysUntil}`}
              color={isOverdue ? '#dc2626' : '#f59e0b'}
            />
          )}
        </View>

        {/* Settings */}
        {subscription.is_active && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ayarlar</Text>
            
            <InfoCard
              icon={<Bell />}
              title="Hatırlatma"
              value={`Ödemeden ${subscription.reminder_days} gün önce`}
              subtitle={subscription.reminder_days === 0 ? 'Aynı gün bildirimi' : 'Önceden bildirim al'}
              color="#8b5cf6"
            />
          </View>
        )}

        {/* Note */}
        {subscription.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Not</Text>
            
            <View style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <FileText size={18} color="#6b7280" strokeWidth={2} />
                <Text style={styles.noteTitle}>Ek Bilgiler</Text>
              </View>
              <Text style={styles.noteText}>{subscription.note}</Text>
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İstatistikler</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Clock size={20} color="#6366f1" strokeWidth={2} />
              <Text style={styles.statValue}>
                {Math.floor((new Date().getTime() - new Date(subscription.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30))}
              </Text>
              <Text style={styles.statLabel}>Ay Takip Ediliyor</Text>
            </View>
            
            <View style={styles.statCard}>
              <DollarSign size={20} color="#10b981" strokeWidth={2} />
              <Text style={styles.statValue}>
                {formatCurrency(
                  subscription.frequency === 'Weekly' ? subscription.amount * 52 :
                  subscription.frequency === 'Monthly' ? subscription.amount * 12 :
                  subscription.amount
                )}
              </Text>
              <Text style={styles.statLabel}>Yıllık Maliyet</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <ConfirmationModal
        visible={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        title="Aboneliği Sil"
        message={`${subscription.name} aboneliğini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        confirmColor="#ef4444"
      />

      <ConfirmationModal
        visible={showArchiveModal}
        onConfirm={confirmArchive}
        onCancel={() => setShowArchiveModal(false)}
        title="Aboneliği Arşivle"
        message={`${subscription.name} aboneliğini arşivlemek istediğinizden emin misiniz? Aktif aboneliklerinizden hariç tutulacak ve hatırlatma göndermeyecek.`}
        confirmText="Arşivle"
        confirmColor="#8b5cf6"
      />

      <ConfirmationModal
        visible={showReactivateModal}
        onConfirm={confirmReactivate}
        onCancel={() => setShowReactivateModal(false)}
        title="Aboneliği Yeniden Etkinleştir"
        message={`${subscription.name} aboneliğini yeniden etkinleştirmek istediğinizden emin misiniz? Aktif aboneliklerinize dahil edilecek ve hatırlatma göndermeye devam edecek.`}
        confirmText="Yeniden Etkinleştir"
        confirmColor="#10b981"
      />
    </SafeAreaView>
  );
}

export default function SubscriptionDetailScreen() {
  return <SubscriptionDetailContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
  },
  subscriptionName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subscriptionCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginRight: 8,
  },
  archivedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  archivedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8b5cf6',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  serviceSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIconText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700',
  },
  statusContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#10b981',
  },
  inactiveText: {
    color: '#8b5cf6',
  },
  actionButtonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f3f0ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  archiveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b5cf6',
    marginLeft: 8,
  },
  reactivateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  reactivateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  infoSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 2,
  },
  noteCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  noteText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backToHomeButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToHomeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});