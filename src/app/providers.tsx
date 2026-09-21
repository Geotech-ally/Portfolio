import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/query-client";
import { ConfigError } from "@/components/shared/ConfigError";

export function AppProviders({ children }: { children: ReactNode }) {
  const missing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  // In development (but not during tests), show a clear config error instead
  // of letting the application fail with a module-level exception. Tests
  // need the QueryClientProvider to render components that use React Query.
  if (import.meta.env.DEV && !import.meta.env.TEST && missing) {
    return <ConfigError />;
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
