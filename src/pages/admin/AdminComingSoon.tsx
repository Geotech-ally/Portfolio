export function AdminComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-heading-lg text-foreground">{title}</h1>
      <p className="text-body mt-4 max-w-lg text-foreground-muted">
        This CRUD screen isn't built yet — it's scoped for the next implementation phase (see
        docs/MIGRATION.md, Phase 7). The underlying table, RLS policies and service functions already
        exist and are ready to wire up.
      </p>
    </div>
  );
}
