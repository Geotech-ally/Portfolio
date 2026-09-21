import React from "react";
import { Container } from "@/components/layout/Container";

type State = { hasError: boolean; error?: Error };

export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_: Error) {
    // In a real app we'd log to an external service here.
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <Container className="prose w-full max-w-2xl">
            <h1>Application error</h1>
            <p>An unexpected error occurred while rendering the application.</p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2"
                onClick={() => location.reload()}
              >
                Reload
              </button>
            </div>
            {isDev && this.state.error ? (
              <details className="mt-4 whitespace-pre-wrap">
                <summary>Show error</summary>
                <pre>{String(this.state.error)}</pre>
              </details>
            ) : null}
          </Container>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
