import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export class SupabaseConfigurationError extends Error {
  readonly code = "SUPABASE_CONFIGURATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

function sanitizeDiagnosticText(value: string): string {
  return value
    .replaceAll(supabasePublishableKey, supabasePublishableKey ? "[publishable key redacted]" : "")
    .replaceAll(supabaseUrl, supabaseUrl ? "[Supabase URL redacted]" : "");
}

export const SUPABASE_CONFIG_PRESENT = Boolean(supabaseUrl && supabasePublishableKey);
export const SUPABASE_URL_VALID = Boolean(supabaseUrl && isValidHttpUrl(supabaseUrl));

let supabaseClient: ReturnType<typeof createClient<Database>> | undefined;
let initializationError: Error | null = null;

if (!SUPABASE_CONFIG_PRESENT) {
  initializationError = new SupabaseConfigurationError(
    "Supabase configuration is missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY."
  );
} else if (!SUPABASE_URL_VALID) {
  initializationError = new SupabaseConfigurationError("VITE_SUPABASE_URL must be an absolute HTTP or HTTPS URL.");
} else {
  try {
    supabaseClient = createClient<Database>(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error("Supabase client initialization failed.");
  }
}

export const SUPABASE_CLIENT_INITIALIZED = Boolean(supabaseClient);

export interface SupabaseConfigurationStatus {
  supabaseUrlConfigured: boolean;
  supabaseKeyConfigured: boolean;
  supabaseUrlValid: boolean;
  clientInitialized: boolean;
}

export function getSupabaseConfigurationStatus(): SupabaseConfigurationStatus {
  return {
    supabaseUrlConfigured: Boolean(supabaseUrl),
    supabaseKeyConfigured: Boolean(supabasePublishableKey),
    supabaseUrlValid: SUPABASE_URL_VALID,
    clientInitialized: SUPABASE_CLIENT_INITIALIZED,
  };
}

function requireSupabaseClient(): ReturnType<typeof createClient<Database>> {
  if (supabaseClient) return supabaseClient;
  throw initializationError ?? new SupabaseConfigurationError("Supabase client is not initialized.");
}

export type SupabaseConnectionStatus =
  | "connected"
  | "missing-config"
  | "invalid-url"
  | "client-initialization-failure"
  | "invalid-key"
  | "network-failure"
  | "database-query-failed"
  | "rls-or-permission-failure"
  | "missing-table-or-schema"
  | "authentication-failure";

export interface SupabaseConnectionDiagnostic {
  status: SupabaseConnectionStatus;
  configuration: SupabaseConfigurationStatus;
  message: string;
  visibleProfileRows?: number;
}

declare global {
  interface Window {
    __portfolioDiagnostics?: {
      getSupabaseConfigurationStatus: typeof getSupabaseConfigurationStatus;
      diagnoseSupabaseConnection: typeof diagnoseSupabaseConnection;
    };
  }
}

function getFailureStatus(error: unknown): SupabaseConnectionStatus {
  const details = error && typeof error === "object"
    ? error as { code?: string; status?: number; message?: string }
    : {};
  const message = (details.message ?? String(error)).toLowerCase();

  if (/invalid api key|invalid supabase key|api key is invalid/.test(message) || details.status === 401 && /api key/.test(message)) {
    return "invalid-key";
  }
  if (details.code === "42P01" || details.code === "PGRST205" || /table .* not found|could not find the table/.test(message)) {
    return "missing-table-or-schema";
  }
  if (details.code === "42501" || details.status === 403 || /permission denied|row-level security|rls/.test(message)) {
    return "rls-or-permission-failure";
  }
  if (details.status === 401 || /jwt expired|invalid jwt|not authenticated/.test(message)) {
    return "authentication-failure";
  }
  if (!details.status && (error instanceof TypeError || /network|fetch failed|failed to fetch/.test(message))) {
    return "network-failure";
  }
  return "database-query-failed";
}

/** Explicit, read-only diagnostic; never sends or returns credentials. */
export async function diagnoseSupabaseConnection(): Promise<SupabaseConnectionDiagnostic> {
  const configuration = getSupabaseConfigurationStatus();
  if (!configuration.supabaseUrlConfigured || !configuration.supabaseKeyConfigured) {
    return { status: "missing-config", configuration, message: "A required Supabase setting is missing." };
  }
  if (!configuration.supabaseUrlValid) {
    return { status: "invalid-url", configuration, message: "The configured Supabase URL is not a valid HTTP or HTTPS URL." };
  }
  if (!configuration.clientInitialized) {
    return { status: "client-initialization-failure", configuration, message: "The Supabase client could not be initialized." };
  }

  try {
    const { count, error } = await requireSupabaseClient()
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (error) {
      return {
        status: getFailureStatus(error),
        configuration,
        message: sanitizeDiagnosticText(error.message),
      };
    }

    return {
      status: "connected",
      configuration,
      message: "Supabase API and the profiles query are reachable.",
      visibleProfileRows: count ?? 0,
    };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return { status: "client-initialization-failure", configuration, message: error.message };
    }
    return {
      status: getFailureStatus(error),
      configuration,
      message: error instanceof Error ? sanitizeDiagnosticText(error.message) : "Supabase diagnostic request failed.",
    };
  }
}

if (import.meta.env.DEV) {
  console.info("[Supabase]", getSupabaseConfigurationStatus());
  if (initializationError) {
    console.error("[Supabase] client initialization issue", {
      name: initializationError.name,
      message: sanitizeDiagnosticText(initializationError.message),
    });
  }

  if (typeof window !== "undefined") {
    window.__portfolioDiagnostics = { getSupabaseConfigurationStatus, diagnoseSupabaseConnection };
  }
}

const clientProxy = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_target, property) {
    const client = requireSupabaseClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export const supabase = (supabaseClient ?? clientProxy) as ReturnType<typeof createClient<Database>>;
