// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

// Define the structure of your user profile data
interface UserProfile {
  id: string;
  role: 'admin' | 'restaurant' | 'customer'; // Example roles
  username?: string;
  full_name?: string;
  avatar_url?: string;
  // Add other profile fields as needed
}

// Define the context type including the profile and logout function
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null; // Add the profile property here
  loading: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Add the logout function signature here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null); // State for profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles') // Adjust table name if different
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } else if (data) {
          setProfile(data as UserProfile); // Set the fetched profile
        }
      } catch (e) {
        console.error('Exception fetching profile:', e);
        setProfile(null);
      }
    };

    const handleAuthStateChange = async (event: string, session: Session | null) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setProfile(null); // Reset profile on auth change initially

      if (currentUser) {
        await fetchProfile(currentUser.id); // Fetch profile if user exists
      }
      setLoading(false); // Ensure loading is set to false after session and profile checks
    };

    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      const initialUser = initialSession?.user ?? null;
      setUser(initialUser);
      if (initialUser) {
        await fetchProfile(initialUser.id);
      }
      setLoading(false); // Set loading false after initial check
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile, // Provide profile in context value
    loading,
    signOut,
    logout, // Add logout function to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};