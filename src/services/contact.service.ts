import { supabase } from "@/lib/supabase";
import { z } from "zod";

/**
 * Shared with the contact form's react-hook-form resolver. Server-side,
 * RLS additionally restricts this table to INSERT-only for anonymous
 * users (no SELECT), so even a successful insert never lets the client
 * read back other people's messages. Basic rate limiting is documented
 * in docs/SECURITY.md (Supabase Edge Function + IP/window check) since a
 * pure RLS policy cannot rate-limit by itself.
 */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, "Message is too short").max(4000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export async function submitContactMessage(input: ContactMessageInput): Promise<void> {
  const parsed = contactMessageSchema.parse(input);
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.name,
    email: parsed.email,
    subject: parsed.subject ?? null,
    message: parsed.message,
    status: "new",
  });
  if (error) throw error;
}
