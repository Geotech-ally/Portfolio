import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { useProfile } from "@/hooks/useProfile";
import { getSignedUrl, STORAGE_BUCKETS } from "@/lib/storage";
import { trackEvent } from "@/services/analytics.service";
import { LinkButton } from "@/components/ui/link-button";

export default function Resume() {
  const { data: profile } = useProfile();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.resume_url) return;
    // resume_url stores the Storage path; resolve a short-lived signed URL
    // at render time rather than a permanent public link, since the
    // `resume` bucket is private by default (see supabase/migrations).
    getSignedUrl(STORAGE_BUCKETS.resume, profile.resume_url)
      .then(setDownloadUrl)
      .catch(() => setDownloadUrl(null));
  }, [profile?.resume_url]);

  return (
    <Section className="print:max-w-none">
      <SectionHeading eyebrow="CV" title="Resume" />
      {downloadUrl ? (
        <a
          href={downloadUrl}
          download
          onClick={() => trackEvent("resume_download")}
          className="mb-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground print:hidden"
        >
          <Download size={16} /> Download PDF
        </a>
      ) : (
        <p className="text-body mb-8 text-sm text-foreground-muted print:hidden">
          The downloadable resume will appear here once uploaded to Supabase Storage.
        </p>
      )}

      <div className="max-w-2xl border-t border-border-strong pt-6">
        <h1 className="text-heading-lg text-foreground">{profile?.full_name ?? "Geoffrey Akoo"}</h1>
        <p className="text-meta mt-1">{profile?.professional_title ?? "Full-Stack Developer & Cybersecurity Analyst"}</p>
        <p className="text-body mt-4 text-foreground-muted">{profile?.long_bio ?? profile?.short_bio}</p>
      </div>

      <div className="mt-10">
        <LinkButton to="/experience" variant="outline">View full experience timeline</LinkButton>
      </div>
    </Section>
  );
}
