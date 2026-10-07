import { useEffect, useState } from "react";
import { getCurrentProfile, getCurrentSession, onAuthStateChange } from "@/lib/auth";
import { SUPABASE_CLIENT_INITIALIZED } from "@/lib/supabase";
import type { Profile } from "@/types/database";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: Profile | null;
  error: Error | null;
  isAvailable: boolean;
}

const unavailableState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  profile: null,
  error: new Error("Supabase authentication is unavailable."),
  isAvailable: false,
};

function logAuthFailure(operation: string, error: unknown) {
  if (!import.meta.env.DEV) return;
  const details = error && typeof error === "object"
    ? error as { name?: unknown; message?: unknown; code?: unknown; status?: unknown; stack?: unknown }
    : { message: String(error) };
  console.error(`[Admin auth] ${operation} failed`, {
    name: details.name,
    message: details.message,
    code: details.code,
    status: details.status,
    stack: details.stack,
  });
}

/** UI-only admin session state; Supabase RLS remains the authorization boundary. */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(() => SUPABASE_CLIENT_INITIALIZED
    ? { ...unavailableState, isLoading: true, error: null, isAvailable: true }
    : unavailableState);

  useEffect(() => {
    let mounted = true;
    if (!SUPABASE_CLIENT_INITIALIZED) {
      setState(unavailableState);
      return;
    }

    async function syncSession() {
      try {
        const session = await getCurrentSession();
        const profile = session ? await getCurrentProfile() : null;
        if (mounted) {
          setState({ isLoading: false, isAuthenticated: Boolean(session), profile, error: null, isAvailable: true });
        }
      } catch (error) {
        logAuthFailure("session/profile initialization", error);
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: false,
            profile: null,
            error: error instanceof Error ? error : new Error("Unable to check the current session."),
            isAvailable: true,
          });
        }
      }
    }

    let unsubscribe: () => void = () => {};
    try {
      unsubscribe = onAuthStateChange((isAuthenticated) => {
        void syncSessionForAuthChange(isAuthenticated);
      });
    } catch (error) {
      logAuthFailure("auth listener initialization", error);
      if (mounted) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          profile: null,
          error: error instanceof Error ? error : new Error("Unable to initialize authentication."),
          isAvailable: true,
        });
      }
    }

    async function syncSessionForAuthChange(isAuthenticated: boolean) {
      try {
        const profile = isAuthenticated ? await getCurrentProfile() : null;
        if (mounted) setState({ isLoading: false, isAuthenticated, profile, error: null, isAvailable: true });
      } catch (error) {
        logAuthFailure("profile refresh", error);
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: false,
            profile: null,
            error: error instanceof Error ? error : new Error("Unable to load the admin profile."),
            isAvailable: true,
          });
        }
      }
    }

    void syncSession();
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return state;
}
