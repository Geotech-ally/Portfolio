import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { signInWithPassword } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginInput = z.infer<typeof loginSchema>;

/**
 * There is no self-registration screen anywhere in this app on purpose
 * (see docs/SECURITY.md #80). Admin accounts are provisioned directly in
 * the Supabase dashboard or via the CLI, then given `profiles.role = 'admin'`
 * through a migration/seed — never through a public form.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  if (!isLoading && isAuthenticated) return <Navigate to="/admin" replace />;

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    try {
      await signInWithPassword(values.email, values.password);
      navigate("/admin", { replace: true });
    } catch {
      // Never surface whether the email exists or the password was wrong —
      // a generic message avoids account enumeration.
      setFormError("Invalid email or password.");
    }
  }

  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm space-y-5">
        <div>
          <p className="text-meta mb-1">Admin</p>
          <h1 className="text-heading-md text-foreground">Sign in</h1>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-foreground">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className="w-full rounded-md border border-border-strong bg-background-raised px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? <p role="alert" className="mt-1 text-sm text-danger">{errors.email.message}</p> : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-foreground">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-md border border-border-strong bg-background-raised px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password ? <p role="alert" className="mt-1 text-sm text-danger">{errors.password.message}</p> : null}
        </div>

        {formError ? <p role="alert" className="text-sm text-danger">{formError}</p> : null}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Container>
  );
}
