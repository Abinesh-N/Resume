'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getCurrentUser } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user on mount
    getCurrentUser()
      .then((user) => {
        if (user) {
          setUser({ id: user.id, email: user.email || '' });
        } else {
          setUser(null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Subscribe to auth changes
    const { data: listener } = onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      } else {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { signIn: authSignIn } = await import('@/lib/supabase/auth');
      const response = await authSignIn(email, password);
      
      // Immediately update local state after sign in
      if (response.user) {
        setUser({ id: response.user.id, email: response.user.email || '' });
      }
      
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { signUp: authSignUp } = await import('@/lib/supabase/auth');
      const response = await authSignUp(email, password);
      
      // Immediately update local state after sign up
      if (response.user) {
        setUser({ id: response.user.id, email: response.user.email || '' });
      }
      
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { signOut: authSignOut } = await import('@/lib/supabase/auth');
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
