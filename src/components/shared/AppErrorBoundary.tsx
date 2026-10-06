import React from "react";
import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { Container } from "@/components/layout/Container";

type State = { hasError: boolean; error?: Error };

export function ApplicationErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground" role="alert">
      <Container className="w-full max-w-xl rounded-2xl border border-border bg-surface-raised p-8 shadow-lg sm:p-10">
        <p className="text-meta mb-3">Application status</p>
        <h1 className="text-heading-lg text-foreground">Something went wrong</h1>
        <p className="text-body mt-4 text-foreground-muted">
          We’re having trouble connecting to the application right now. Please try again in a moment.
        </p>
        <button
          type="button"
          className="mt-6 rounded-md border border-border-strong bg-background-raised px-4 py-2 text-sm text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </Container>
    </main>
  );
}

export function RouterErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    if (import.meta.env.DEV) console.error("Application route error", error);
  }, [error]);

  return <ApplicationErrorPage />;
}

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) console.error("Application render error", error);
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      return (
        <div>
          <ApplicationErrorPage />
          {isDev && this.state.error ? <pre className="mx-auto max-w-xl overflow-auto whitespace-pre-wrap p-4 text-xs text-danger">{String(this.state.error)}</pre> : null}
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
