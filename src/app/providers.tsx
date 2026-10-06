import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/query-client";
import { ConfigError } from "@/components/shared/ConfigError";
import { ApplicationErrorPage } from "@/components/shared/AppErrorBoundary";

export function AppProviders({ children }: { children: ReactNode }) {
  const missing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  // Do not let missing build-time config escape into route rendering. Keep
  // diagnostics specific in development while production stays user-friendly.
  if (!import.meta.env.TEST && missing) {
    return import.meta.env.DEV ? <ConfigError /> : <ApplicationErrorPage />;
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
