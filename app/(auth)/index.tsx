import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';

export default function AuthIndex() {
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Only navigate after the root navigation state is ready
    if (rootNavigationState?.key) {
      router.replace('/(auth)/login');
    }
  }, [rootNavigationState?.key]);

  return null;
}