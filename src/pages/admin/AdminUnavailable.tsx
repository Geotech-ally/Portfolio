export function AdminUnavailable({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-heading-lg text-foreground">{title}</h1>
      <p className="text-body mt-4 max-w-lg text-foreground-muted">
        This management screen is not implemented yet. The database schema and row-level access
        policies provide a foundation, but this admin workflow is not available in the current deployment.
      </p>
    </div>
  );
}
