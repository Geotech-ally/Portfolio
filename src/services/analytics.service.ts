import { supabase } from "@/lib/supabase";

export type AnalyticsEventName =
  | "page_view"
  | "project_view"
  | "blog_view"
  | "resume_download"
  | "contact_submission"
  | "newsletter_subscription"
  | "github_click"
  | "external_link_click";

/**
 * Fire-and-forget, best-effort. No cookies, no IP storage, no fingerprinting
 * — just an event name, the path, and small non-identifying metadata. RLS
 * allows anonymous INSERT only; SELECT is admin-only.
 */
export function trackEvent(event: AnalyticsEventName, metadata?: Record<string, unknown>): void {
  void supabase
    .from("analytics_events")
    .insert({
      event_name: event,
      path: typeof window !== "undefined" ? window.location.pathname : null,
      metadata: metadata ?? null,
    })
    .then(({ error }) => {
      if (error) {
        // Analytics must never break the app or surface to the user.
        // eslint-disable-next-line no-console
        console.debug("analytics event failed", error.message);
      }
    });
}
