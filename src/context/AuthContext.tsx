import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, getUserRole } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, user: User | null }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getActiveSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const role = await getUserRole();
        setUserRole(role);
      }
      
      setIsLoading(false);
    }
    
    getActiveSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        const role = await getUserRole();
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { 
          full_name: userData.fullName,
        }
      }
    });

    if (!error && data.user) {
      // Create profile with default 'user' role
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: userData.fullName,
        role: 'user',
        created_at: new Date().toISOString(),
      });
    }

    return { error, user: data.user };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      isLoading,
      signIn,
      signUp,
      signOut,
      forgotPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}