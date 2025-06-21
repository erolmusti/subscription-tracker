import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useOnboarding } from '@/hooks/useOnboarding';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  
  const { hasSeenOnboarding, loading } = useOnboarding();

  // Show loading screen while checking onboarding status
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {!hasSeenOnboarding ? (
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});