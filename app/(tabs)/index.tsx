import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Plus, Calendar, TrendingUp, CircleAlert as AlertCircle, User, LogIn } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const formatCurrency = (amount: number) => {
  return `₺${amount.toFixed(2)}`;
};

const getDaysUntilPayment = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const paymentDate = new Date(date);
  paymentDate.setHours(0, 0, 0, 0);
  
  const diffTime = paymentDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Yarın';
  if (diffDays < 0) return `${Math.abs(diffDays)} gün gecikmiş`;
  if (diffDays <= 7) return `${diffDays} gün sonra`;
  
  return new Date(date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
};

// Mock data for demonstration
const mockSubscriptions = [
  {
    id: 'mock-1',
    name: 'Netflix',
    category: 'Eğlence',
    amount: 63.99,
    frequency: 'Monthly',
    next_payment: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    color: '#e50914',
    is_active: true,
  },
  {
    id: 'mock-2',
    name: 'Spotify',
    category: 'Müzik',
    amount: 17.99,
    frequency: 'Monthly',
    next_payment: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    color: '#1db954',
    is_active: true,
  },
  {
    id: 'mock-3',
    name: 'Adobe Creative Cloud',
    category: 'Yazılım',
    amount: 239.99,
    frequency: 'Monthly',
    next_payment: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    color: '#ff0000',
    is_active: true,
  },
];

const SubscriptionCard = ({ subscription }: { subscription: any }) => {
  const daysUntil = getDaysUntilPayment(subscription.next_payment);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const paymentDate = new Date(subscription.next_payment);
  paymentDate.setHours(0, 0, 0, 0);
  
  const isOverdue = paymentDate < today;
  const isUrgent = !isOverdue && (paymentDate.getTime() - today.getTime()) <= 2 * 24 * 60 * 60 * 1000;

  const handlePress = () => {
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
    <TouchableOpacity 
      style={[
        styles.subscriptionCard, 
        isOverdue && styles.overdueCard,
        isUrgent && styles.urgentCard
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.serviceIcon, { backgroundColor: subscription.color }]}>
          <Text style={styles.serviceIconText}>
            {subscription.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.serviceName}>{subscription.name}</Text>
          <Text style={styles.serviceCategory}>{subscription.category}</Text>
        </View>
        <View style={styles.cardAmount}>
          <Text style={styles.amount}>{formatCurrency(subscription.amount)}</Text>
          <Text style={styles.frequency}>
            {subscription.frequency === 'Weekly' ? 'Haftalık' : 
             subscription.frequency === 'Monthly' ? 'Aylık' : 'Yıllık'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.nextPayment}>
          <Calendar size={14} color="#6b7280" strokeWidth={2} />
          <Text style={[
            styles.paymentDate, 
            isOverdue && styles.overdueText,
            isUrgent && styles.urgentText
          ]}>
            Sonraki ödeme {daysUntil}
          </Text>
        </View>
        {(isUrgent || isOverdue) && (
          <View style={[styles.urgentBadge, isOverdue && styles.overdueBadge]}>
            <AlertCircle size={12} color={isOverdue ? "#dc2626" : "#ef4444"} strokeWidth={2} />
            <Text style={[styles.urgentBadgeText, isOverdue && styles.overdueBadgeText]}>
              {isOverdue ? 'Gecikmiş' : 'Yakında'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [isGuest] = useState(true); // Always guest mode for now
  
  const mockStats = {
    active: mockSubscriptions.length,
    monthlyTotal: mockSubscriptions.reduce((sum, sub) => sum + sub.amount, 0),
  };

  const upcomingPayments = mockSubscriptions.filter(sub => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const paymentDate = new Date(sub.next_payment);
    paymentDate.setHours(0, 0, 0, 0);
    return paymentDate >= today && paymentDate <= nextWeek;
  });

  const handleAuthAction = () => {
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
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Abonelik Takipçisi</Text>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => router.push('/login')}
              activeOpacity={0.7}
            >
              <LogIn size={20} color="#6366f1" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerText}>
              👋 Uygulamayı keşfedin! Giriş yaparak kendi aboneliklerinizi takip edebilirsiniz.
            </Text>
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Örnek Aylık Toplam</Text>
            <Text style={styles.totalAmount}>{formatCurrency(mockStats.monthlyTotal)}</Text>
            <Text style={styles.totalSubtext}>
              {mockStats.active} örnek abonelik
            </Text>
          </View>
        </View>

        {/* Stats Strip */}
        <View style={styles.statsContainer}>
          <View style={styles.upcomingStrip}>
            <View style={styles.upcomingHeader}>
              <TrendingUp size={20} color="#6366f1" strokeWidth={2} />
              <Text style={styles.upcomingTitle}>Yaklaşan Ödemeler</Text>
            </View>
            <Text style={styles.upcomingText}>
              Bu hafta {upcomingPayments.length} abonelik ödemesi var
            </Text>
          </View>
        </View>

        {/* Active Subscriptions List */}
        <View style={styles.subscriptionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Örnek Abonelikler</Text>
            <Text style={styles.subscriptionCount}>{mockStats.active}</Text>
          </View>
          
          <View style={styles.subscriptionsList}>
            {mockSubscriptions
              .sort((a, b) => new Date(a.next_payment).getTime() - new Date(b.next_payment).getTime())
              .map((subscription) => (
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription} 
                />
              ))}
          </View>
        </View>

        {/* Bottom spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAuthAction}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  authButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  guestBanner: {
    backgroundColor: '#eef2ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  guestBannerText: {
    fontSize: 14,
    color: '#4338ca',
    fontWeight: '500',
    lineHeight: 20,
  },
  totalContainer: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  upcomingStrip: {
    padding: 16,
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4338ca',
    marginLeft: 8,
  },
  upcomingText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  subscriptionsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  subscriptionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionsList: {
    gap: 12,
  },
  subscriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  urgentCard: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  overdueCard: {
    borderColor: '#fca5a5',
    backgroundColor: '#fee2e2',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIconText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  serviceCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  cardAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  frequency: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextPayment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDate: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  urgentText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  overdueText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  overdueBadge: {
    backgroundColor: '#fecaca',
  },
  urgentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 4,
  },
  overdueBadgeText: {
    color: '#b91c1c',
  },
  bottomSpacing: {
    height: 100,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});