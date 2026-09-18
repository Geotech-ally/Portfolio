import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Section, SectionHeading } from "@/components/layout/Section";
import { contactMessageSchema, submitContactMessage, type ContactMessageInput } from "@/services/contact.service";
import { trackEvent } from "@/services/analytics.service";
import { Button } from "@/components/ui/button";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function Contact() {
  usePageMetadata({
    title: "Contact | Geoffrey Akoo",
    description: "Contact Geoffrey Akoo for product, engineering and cybersecurity opportunities.",
    path: "/contact",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [honeypotValue, setHoneypotValue] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({ resolver: zodResolver(contactMessageSchema) });

  async function onSubmit(values: ContactMessageInput) {
    setStatus("idle");
    if (honeypotValue) {
      setStatus("success");
      reset();
      setHoneypotValue("");
      return;
    }
    try {
      await submitContactMessage(values);
      trackEvent("contact_submission");
      setStatus("success");
      reset();
      setHoneypotValue("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section>
      <SectionHeading eyebrow="Get in touch" title="Contact" description="Tell me a bit about what you're building, and I’ll reply as soon as I can." />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-5">
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="company">Leave this field empty</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypotValue}
            onChange={(event) => setHoneypotValue(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-foreground">Name</label>
          <input
            id="name"
            type="text"
            className="w-full rounded-md border border-border-strong bg-background-raised px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? <p id="name-error" role="alert" className="mt-1 text-sm text-danger">{errors.name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-foreground">Email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-border-strong bg-background-raised px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? <p id="email-error" role="alert" className="mt-1 text-sm text-danger">{errors.email.message}</p> : null}
        </div>

        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm text-foreground">Subject</label>
          <input
            id="subject"
            type="text"
            className="w-full rounded-md border border-border-strong bg-background-raised px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            {...register("subject")}
          />
          {errors.subject ? <p id="subject-error" role="alert" className="mt-1 text-sm text-danger">{errors.subject.message}</p> : null}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm text-foreground">Message</label>
          <textarea
            id="message"
            rows={6}
            className="w-full rounded-md border border-border-strong bg-background-raised px-3 py-2.5 text-sm outline-none focus-visible:border-primary"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message")}
          />
          {errors.message ? <p id="message-error" role="alert" className="mt-1 text-sm text-danger">{errors.message.message}</p> : null}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>

        {status === "success" ? (
          <p role="status" className="text-sm text-success">Message sent successfully. I&apos;ll get back to you as soon as possible.</p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="text-sm text-danger">Something went wrong sending your message. Please try again.</p>
        ) : null}
      </form>
    </Section>
  );
}
