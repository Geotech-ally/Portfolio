import { supabase } from "@/lib/supabase";
import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/** Duplicate emails are handled by a unique constraint + upsert, not a pre-check (avoids a race + avoids leaking "already subscribed" as an enumeration oracle). */
export async function subscribeToNewsletter(input: NewsletterInput): Promise<void> {
  const parsed = newsletterSchema.parse(input);
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email: parsed.email, is_active: true, unsubscribed_at: null },
      { onConflict: "email" }
    );
  if (error) throw error;
}

export async function unsubscribeByToken(token: string): Promise<void> {
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token);
  if (error) throw error;
}
