import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

async function countRows(table: "projects" | "blog_posts" | "security_writeups" | "contact_messages" | "newsletter_subscribers") {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export default function AdminDashboard() {
  const { data } = useQuery({
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

  return (
    <div>
      <h1 className="text-heading-lg text-foreground">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border p-6">
            <p className="text-meta">{c.label}</p>
            <p className="text-heading-lg mt-2 text-foreground">{c.value ?? "—"}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-lg border border-dashed border-border p-6 text-sm text-foreground-muted">
        Full CRUD screens for projects, blog posts, security writeups, skills, experience,
        certifications and site settings are the next phase of this build (Phase 7 in
        docs/MIGRATION.md) — this overview reads live counts from Supabase now, but create/edit/delete
        forms aren't wired up yet.
      </div>
    </div>
  );
}
