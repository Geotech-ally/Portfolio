import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";

/**
 * Thin wrapper around Supabase Auth. There is no custom password hashing or
 * JWT signing here on purpose — Supabase Auth issues and verifies the
 * session token, and PostgreSQL RLS (not this file) is what actually
 * enforces who can read or write what. This module exists only to keep
 * auth calls out of UI components.
 */

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Looks up the caller's own profile (id = auth.uid()) to read their role.
 * This is a convenience for UI state (e.g. showing/hiding admin nav links)
 * — it must never be treated as the authorization boundary. Every
 * protected table has its own RLS policy that re-checks
 * profiles.role = 'admin' independently of what the client believes.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) return null;
  return data;
}

export function onAuthStateChange(callback: (isAuthenticated: boolean) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
  return () => subscription.unsubscribe();
}
