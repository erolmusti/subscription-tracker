import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Bell, ChartBar as BarChart3, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useOnboarding } from '@/hooks/useOnboarding';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string[];
  image: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Aboneliklerinizi Takip Edin',
    description: 'Tüm aboneliklerinizi tek yerden yönetin. Netflix, Spotify, Adobe ve daha fazlası için ödeme tarihlerini asla kaçırmayın.',
    icon: <CreditCard size={80} color="#ffffff" strokeWidth={1.5} />,
    gradient: ['#667eea', '#764ba2'],
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Akıllı Hatırlatmalar',
    description: 'Ödemelerinizden önce zamanında bildirim alın. Gecikme ücretlerinden kaçının ve bütçenizi kontrol altında tutun.',
    icon: <Bell size={80} color="#ffffff" strokeWidth={1.5} />,
    gradient: ['#f093fb', '#f5576c'],
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Harcama Analizi',
    description: 'Detaylı raporlar ve grafiklerle harcama alışkanlıklarınızı analiz edin. Tasarruf fırsatlarını keşfedin.',
    icon: <BarChart3 size={80} color="#ffffff" strokeWidth={1.5} />,
    gradient: ['#4facfe', '#00f2fe'],
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { completeOnboarding } = useOnboarding();

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      pagerRef.current?.setPage(nextPage);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      pagerRef.current?.setPage(prevPage);
    }
  };

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const goToSlide = (index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  };

  const renderSlide = (slide: OnboardingSlide) => (
    <View key={slide.id} style={styles.slide}>
      <LinearGradient
        colors={slide.gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Skip Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Geç</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: slide.image }}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={styles.iconOverlay}>
                {slide.icon}
              </View>
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomContainer}>
            {/* Page Indicators */}
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentPage && styles.paginationDotActive,
                  ]}
                  onPress={() => goToSlide(index)}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              {/* Previous Button */}
              <View style={styles.navButtonContainer}>
                {currentPage > 0 ? (
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={handlePrevious}
                    activeOpacity={0.7}
                  >
                    <ChevronLeft size={24} color="#ffffff" strokeWidth={2} />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.navButtonPlaceholder} />
                )}
              </View>

              {/* Center Content */}
              <View style={styles.centerContent}>
                <Text style={styles.slideCounter}>
                  {currentPage + 1} / {slides.length}
                </Text>
              </View>

              {/* Next/Get Started Button */}
              <View style={styles.navButtonContainer}>
                {currentPage < slides.length - 1 ? (
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={handleNext}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={24} color="#ffffff" strokeWidth={2} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.getStartedText}>Başlayalım</Text>
                    <ArrowRight size={20} color="#ffffff" strokeWidth={2} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {slides.map((slide) => renderSlide(slide))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    marginBottom: 40,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.7) / 2,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: (width * 0.7) / 2,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 32,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ scaleY: 1.2 }],
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButtonContainer: {
    width: 80,
    alignItems: 'center',
  },
  navButtonPlaceholder: {
    width: 56,
    height: 56,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
  },
  slideCounter: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});