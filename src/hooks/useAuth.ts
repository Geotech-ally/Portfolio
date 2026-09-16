import { useEffect, useState } from "react";
import { getCurrentProfile, getCurrentSession, onAuthStateChange } from "@/lib/auth";
import type { Profile } from "@/types/database";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: Profile | null;
}

/**
 * UI-only convenience for showing/hiding admin screens and nav items.
 * The database is the real authorization boundary via RLS — this hook
 * must never be treated as a security control on its own.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ isLoading: true, isAuthenticated: false, profile: null });

  useEffect(() => {
    let mounted = true;

    async function load() {
      const session = await getCurrentSession();
      const profile = session ? await getCurrentProfile() : null;
      if (mounted) setState({ isLoading: false, isAuthenticated: !!session, profile });
    }
    load();

    const unsubscribe = onAuthStateChange(async (isAuthenticated) => {
      const profile = isAuthenticated ? await getCurrentProfile() : null;
      if (mounted) setState({ isLoading: false, isAuthenticated, profile });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return state;
}
