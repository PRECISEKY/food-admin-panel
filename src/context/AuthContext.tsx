import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

// REMOVED Profile interface for now

// Updated Context Type (NO PROFILE)
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  // profile: Profile | null; // REMOVED
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  // const [profile, setProfile] = useState<Profile | null>(null); // REMOVED
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchInitialSession = async () => {
      console.log('[AuthContext - NoProfile] useEffect: Starting initial session fetch...');
      if (!mounted) return;
      setLoading(true);

      try {
        console.log('[AuthContext - NoProfile] Calling getSession...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('[AuthContext - NoProfile] getSession result:', { session, sessionError });

        if (!mounted) return;

        if (sessionError) {
          console.error('[AuthContext - NoProfile] Error getting session:', sessionError);
        }
        // Set session and user based on result
        setSession(session);
        setUser(session?.user ?? null);

      } catch (e) {
        console.error("[AuthContext - NoProfile] Unexpected error in fetchInitialSession:", e);
      } finally {
        if (mounted) {
          console.log('[AuthContext - NoProfile] Initial session check complete. Setting loading false.');
          setLoading(false); // Loading only depends on session check now
        }
      }
    };

    fetchInitialSession();

    // Setup listener - ONLY updates session/user
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('[AuthContext - NoProfile] onAuthStateChange triggered:', { _event, session });
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          // Ensure loading is false after auth change too
          setLoading(false);
        }
      }
    );

    // Cleanup
    return () => {
      console.log('[AuthContext - NoProfile] useEffect cleanup.');
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    console.log('[AuthContext - NoProfile] Logging out...');
    await supabase.auth.signOut();
    // State updates handled by listener
  };

  // Update value (NO PROFILE)
  const value = { session, user, loading, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Update useAuth hook (return type changes slightly)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};