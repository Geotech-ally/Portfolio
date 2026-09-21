import { Container } from "@/components/layout/Container";

export function ConfigError() {
  const urlPresent = Boolean(import.meta.env.VITE_SUPABASE_URL);
  const keyPresent = Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Container className="prose w-full max-w-2xl">
        <h1>Configuration required</h1>
        <p>
          The application requires public Supabase configuration to run. This is expected for local development.
        </p>
        <ul>
          <li>VITE_SUPABASE_URL: {urlPresent ? "present" : "missing"}</li>
          <li>VITE_SUPABASE_PUBLISHABLE_KEY: {keyPresent ? "present" : "missing"}</li>
        </ul>
        <p>
          Copy <strong>.env.example</strong> to <strong>.env</strong> and add your project's public Supabase values.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2"
            onClick={() => location.reload()}
          >
            Reload
          </button>
        </div>
      </Container>
    </div>
  );
}
