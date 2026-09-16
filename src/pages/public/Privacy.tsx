import { Section, SectionHeading } from "@/components/layout/Section";

export default function Privacy() {
  return (
    <Section>
      <SectionHeading eyebrow="Legal" title="Privacy" />
      <div className="max-w-2xl space-y-6 text-body text-foreground-muted">
        <div>
          <h2 className="text-heading-md text-foreground">Contact form</h2>
          <p className="mt-2">
            When you submit the contact form, your name, email address and message are stored in a
            private database table. Only I can read these messages. I use them solely to respond to
            your inquiry and do not share them with third parties.
          </p>
        </div>
        <div>
          <h2 className="text-heading-md text-foreground">Newsletter</h2>
          <p className="mt-2">
            If you subscribe to the newsletter, only your email address is stored. You can unsubscribe
            at any time using the link included in every email.
          </p>
        </div>
        <div>
          <h2 className="text-heading-md text-foreground">Analytics</h2>
          <p className="mt-2">
            This site records anonymous, aggregate usage events (page views, project views, link
            clicks) to understand what content is useful. No cookies, IP addresses, or personal
            identifiers are stored alongside these events.
          </p>
        </div>
        <div>
          <h2 className="text-heading-md text-foreground">Local storage</h2>
          <p className="mt-2">
            Your theme preference (light or dark) is stored in your browser's local storage. This
            never leaves your device.
          </p>
        </div>
        <div>
          <h2 className="text-heading-md text-foreground">Third-party services</h2>
          <p className="mt-2">
            This site is built on Supabase (database, authentication and file storage). Supabase's own
            privacy policy governs how it processes data on my behalf.
          </p>
        </div>
      </div>
    </Section>
  );
}
