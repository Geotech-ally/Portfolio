import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/shared/AsyncStates";

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/security-lab", label: "Security Lab" },
  { to: "/admin/messages", label: "Messages" },
];

/**
 * Frontend route protection here is for UX only (hide the shell, redirect
 * unauthenticated visitors) — see docs/SECURITY.md. It is not the
 * authorization boundary. Every admin query still goes through Supabase
 * RLS, which independently re-checks profiles.role = 'admin' server-side.
 */
export function AdminLayout() {
  const { isLoading, isAuthenticated, profile, error: authError, isAvailable } = useAuth();

  if (isLoading) return <p className="p-8 text-sm text-foreground-muted" role="status">Checking admin session…</p>;
  if (!isAvailable || authError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-16">
        <h1 className="text-heading-md mb-4 text-foreground">Admin access unavailable</h1>
        <ErrorState message="We can’t verify admin access right now. Please try again later." />
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 self-start rounded-md border border-border-strong bg-surface-raised px-4 py-2 text-sm hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
      </main>
    );
  }
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 border-r border-border p-6 md:block">
        <p className="text-meta mb-6">Admin</p>
        <nav className="space-y-1">
          {ADMIN_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="block rounded-md px-3 py-2 text-sm text-foreground-muted hover:bg-background-raised hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => void signOut().catch((error: unknown) => {
            if (import.meta.env.DEV) console.error("Admin sign-out failed", error);
          })}
          className="mt-8 text-sm text-foreground-muted hover:text-foreground"
        >
          Sign out
        </button>
      </aside>
      <main className="flex-1">
        <Container className="py-10">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
