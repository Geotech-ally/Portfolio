import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { Container } from "@/components/layout/Container";

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
  const { isLoading, isAuthenticated, profile } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (profile && profile.role !== "admin" && profile.role !== "editor") {
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
          onClick={() => signOut()}
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
