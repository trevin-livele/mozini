'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/lib/store';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export function AuthProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const syncCart = useStore((s) => s.syncCart);
  const syncWishlist = useStore((s) => s.syncWishlist);

  const checkAdminRole = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    setIsAdmin(data?.role === 'admin');
  };

  useEffect(() => {
    // Initial sync if user is already logged in
    if (initialUser) {
      syncCart();
      syncWishlist();
      checkAdminRole(initialUser.id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const supabase = createClient();

    // Check current session immediately (handles page refresh / SSR mismatch)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        syncCart();
        syncWishlist();
        checkAdminRole(currentUser.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      setLoading(false);

      // Sync store when auth changes
      if (newUser) {
        syncCart();
        syncWishlist();
        checkAdminRole(newUser.id);
      } else {
        // Clear store on logout
        useStore.setState({ cart: [], wishlist: [] });
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
