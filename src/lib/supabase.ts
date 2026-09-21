import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const SUPABASE_CONFIG_PRESENT = Boolean(supabaseUrl && supabaseAnonKey);

let supabaseClient: ReturnType<typeof createClient<Database>> | unknown;

if (SUPABASE_CONFIG_PRESENT) {
  supabaseClient = createClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
} else {
  // Avoid throwing at module initialization so the app can render a
  // developer-facing configuration error UI. Accessing the client at
  // runtime will throw a clear error instead.
  const handler: ProxyHandler<object> = {
    get() {
      throw new Error(
        "Supabase client unavailable: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. Copy .env.example to .env and fill in your Supabase project credentials."
      );
    },
    apply() {
      throw new Error(
        "Supabase client unavailable: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing. Copy .env.example to .env and fill in your Supabase project credentials."
      );
    },
  };

  supabaseClient = new Proxy({}, handler) as unknown as ReturnType<typeof createClient<Database>>;
}

export const supabase = supabaseClient as ReturnType<typeof createClient<Database>>;
