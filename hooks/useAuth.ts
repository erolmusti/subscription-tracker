import { useEffect, useState } from 'react'
import { Session, User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Auth session error:', error)
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        } else {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session?.user ?? null,
            loading: false,
            error: null,
          }))
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setAuthState(prev => ({ ...prev, error: err.message, loading: false }))
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('Auth state changed:', event, session?.user?.email)
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
        error: null,
      }))
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signOut()

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred' }
    }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!authState.user,
  }
}