import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/query-client";

export function AppProviders({ children }: { children: ReactNode }) {
  // Supabase failures are contained by the data-owning route or query state.
  // Public routes remain usable when the optional backend is unavailable.
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
