import type { ReactNode } from "react";
import { AlertTriangle, Inbox } from "lucide-react";

export function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-lg border border-border bg-background-raised" />
      ))}
    </div>
  );
}

/** Suspense fallback for lazily-loaded routes. */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[72rem] px-5 py-16 sm:px-8 sm:py-24" role="status" aria-label="Loading page">
      <div className="h-4 w-24 animate-pulse rounded bg-background-raised" />
      <div className="mt-4 h-9 w-2/3 max-w-md animate-pulse rounded bg-background-raised" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg border border-border bg-background-raised" />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-10 text-foreground-muted">
      <Inbox size={22} aria-hidden />
      <p className="text-foreground">{title}</p>
      {description ? <p className="text-sm">{description}</p> : null}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong loading this content." }: { message?: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg border border-danger/40 bg-danger/5 p-6 text-sm text-foreground">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-danger" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

export function AsyncSection({
  isLoading,
  isError,
  isEmpty,
  emptyTitle,
  emptyDescription,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  children: ReactNode;
}) {
  if (isLoading) return <LoadingGrid />;
  if (isError) return <ErrorState />;
  if (isEmpty) return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <>{children}</>;
}
