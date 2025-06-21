import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

export function useAuthGuard() {
  const { user } = useAuth();

  const requireAuth = (action?: () => void) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/(auth)/login');
      return false;
    }
    
    // Execute the action if authenticated
    if (action) {
      action();
    }
    return true;
  };

  return {
    user,
    isAuthenticated: !!user,
    requireAuth,
  };
}