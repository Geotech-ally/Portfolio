export function AdminUnavailable({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-heading-lg text-foreground">{title}</h1>
      <p className="text-body mt-4 max-w-lg text-foreground-muted">
        This management screen is not enabled in the current deployment. The underlying schema,
        authorization model, and service layer are in place for a future admin content workflow.
      </p>
    </div>
  );
}
