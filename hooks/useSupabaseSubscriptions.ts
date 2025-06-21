import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/lib/supabase';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

export function useSupabaseSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [inactiveSubscriptions, setInactiveSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate next payment date
  const calculateNextPaymentDate = (firstPaymentDate: string, frequency: string): string => {
    try {
      const nextPayment = new Date(firstPaymentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // If first payment is in the future, return it
      if (nextPayment > today) {
        return nextPayment.toISOString().split('T')[0];
      }
      
      // Calculate next payment after today
      while (nextPayment <= today) {
        switch (frequency) {
          case 'Weekly':
            nextPayment.setDate(nextPayment.getDate() + 7);
            break;
          case 'Monthly':
            nextPayment.setMonth(nextPayment.getMonth() + 1);
            break;
          case 'Yearly':
            nextPayment.setFullYear(nextPayment.getFullYear() + 1);
            break;
        }
      }
      
      return nextPayment.toISOString().split('T')[0];
    } catch (err) {
      console.error('Error calculating next payment date:', err);
      return firstPaymentDate;
    }
  };

  // Load all subscriptions
  const loadSubscriptions = useCallback(async () => {
    if (!user) {
      setSubscriptions([]);
      setActiveSubscriptions([]);
      setInactiveSubscriptions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const allSubs = data || [];
      const active = allSubs.filter(sub => sub.is_active);
      const inactive = allSubs.filter(sub => !sub.is_active);

      setSubscriptions(allSubs);
      setActiveSubscriptions(active);
      setInactiveSubscriptions(inactive);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load subscriptions';
      setError(errorMessage);
      console.error('Error loading subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save subscription (create or update)
  const saveSubscription = useCallback(async (subscription: Omit<SubscriptionInsert, 'user_id'> & { id?: string }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      
      // Calculate next payment date
      const nextPayment = calculateNextPaymentDate(
        subscription.first_payment_date,
        subscription.frequency
      );

      const subscriptionData: SubscriptionInsert = {
        ...subscription,
        user_id: user.id,
        next_payment: nextPayment,
        updated_at: new Date().toISOString(),
      };

      let result;
      
      if (subscription.id) {
        // Update existing subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('id', subscription.id)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .insert({
            ...subscriptionData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      await loadSubscriptions();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save subscription';
      setError(errorMessage);
      console.error('Error saving subscription:', err);
      throw new Error(errorMessage);
    }
  }, [user, loadSubscriptions]);

  // Update subscription status (active/inactive)
  const updateSubscriptionStatus = useCallback(async (id: string, isActive: boolean) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      
      // Get current subscription to recalculate next payment if reactivating
      const { data: currentSub, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const updateData: SubscriptionUpdate = {
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };

      // Recalculate next payment when reactivating
      if (isActive && currentSub) {
        updateData.next_payment = calculateNextPaymentDate(
          currentSub.first_payment_date,
          currentSub.frequency
        );
      }

      const { error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadSubscriptions();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update subscription status';
      setError(errorMessage);
      console.error('Error updating subscription status:', err);
      throw new Error(errorMessage);
    }
  }, [user, loadSubscriptions]);

  // Archive subscription
  const archiveSubscription = useCallback(async (id: string) => {
    await updateSubscriptionStatus(id, false);
  }, [updateSubscriptionStatus]);

  // Reactivate subscription
  const reactivateSubscription = useCallback(async (id: string) => {
    await updateSubscriptionStatus(id, true);
  }, [updateSubscriptionStatus]);

  // Delete subscription permanently
  const deleteSubscription = useCallback(async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadSubscriptions();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete subscription';
      setError(errorMessage);
      console.error('Error deleting subscription:', err);
      throw new Error(errorMessage);
    }
  }, [user, loadSubscriptions]);

  // Get subscription by ID
  const getSubscriptionById = useCallback(async (id: string): Promise<Subscription | null> => {
    if (!user) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error getting subscription by ID:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting subscription by ID:', err);
      return null;
    }
  }, [user]);

  // Get subscription statistics
  const getStats = useCallback(async () => {
    try {
      const active = activeSubscriptions;
      
      let monthlyTotal = 0;
      active.forEach(sub => {
        switch (sub.frequency) {
          case 'Weekly':
            monthlyTotal += sub.amount * 4.33; // Average weeks per month
            break;
          case 'Monthly':
            monthlyTotal += sub.amount;
            break;
          case 'Yearly':
            monthlyTotal += sub.amount / 12;
            break;
        }
      });

      return {
        total: subscriptions.length,
        active: active.length,
        inactive: inactiveSubscriptions.length,
        monthlyTotal,
        yearlyTotal: monthlyTotal * 12,
      };
    } catch (err) {
      console.error('Error calculating stats:', err);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        monthlyTotal: 0,
        yearlyTotal: 0,
      };
    }
  }, [subscriptions, activeSubscriptions, inactiveSubscriptions]);

  // Load subscriptions when user changes
  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  return {
    // Data
    subscriptions,
    activeSubscriptions,
    inactiveSubscriptions,
    isLoading,
    error,
    
    // Actions
    loadSubscriptions,
    saveSubscription,
    updateSubscriptionStatus,
    archiveSubscription,
    reactivateSubscription,
    deleteSubscription,
    getSubscriptionById,
    getStats,
  };
}