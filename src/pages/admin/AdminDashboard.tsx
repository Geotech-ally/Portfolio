import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ErrorState } from "@/components/shared/AsyncStates";

async function countRows(table: "projects" | "blog_posts" | "security_writeups" | "contact_messages" | "newsletter_subscribers") {
  const result = table === "blog_posts"
    ? await supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("content_status", "published")
    : await supabase.from(table).select("*", { count: "exact", head: true });
  const { count, error } = result;
  if (error) throw error;
  return count ?? 0;
}

export default function AdminDashboard() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => ({
      projects: await countRows("projects"),
      posts: await countRows("blog_posts"),
      writeups: await countRows("security_writeups"),
      messages: await countRows("contact_messages"),
      subscribers: await countRows("newsletter_subscribers"),
    }),
  });

  const cards = [
    { label: "Total projects", value: data?.projects },
    { label: "Published posts", value: data?.posts },
    { label: "Security writeups", value: data?.writeups },
    { label: "Messages", value: data?.messages },
    { label: "Subscribers", value: data?.subscribers },
  ];

  if (isPending) {
    return (
      <div>
        <h1 className="text-heading-lg text-foreground">Overview</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading dashboard counts">
          {cards.map((card) => <div key={card.label} className="h-28 animate-pulse rounded-lg border border-border bg-background-raised" />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="text-heading-lg text-foreground">Overview</h1>
        <div className="mt-8">
          <ErrorState message="Dashboard counts could not be loaded. Check your access or try again." />
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-md border border-border-strong bg-surface-raised px-4 py-2 text-sm hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-heading-lg text-foreground">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-6">
            <p className="text-meta">{c.label}</p>
            <p className="text-heading-lg mt-2 text-foreground">{c.value ?? "—"}</p>
          </div>
        ))}
      </div>
      <div className="surface-inset mt-10 border-dashed p-6 text-sm text-foreground-muted">
        The admin overview is connected to live Supabase counts. Full CMS CRUD forms remain a follow-up implementation task before the admin workspace is considered complete.
      </div>
    </div>
  );
}
