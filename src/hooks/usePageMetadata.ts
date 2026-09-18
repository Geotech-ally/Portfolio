import { useEffect } from "react";

export function usePageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}) {
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin;
    const canonicalUrl = `${baseUrl}${path}`;

    document.title = title;

    const setMeta = (selector: string, content: string, attribute = "content") => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        const key = selector.startsWith("meta[name=") ? "name" : "property";
        const target = selector.slice(selector.indexOf("=") + 1, selector.lastIndexOf("]"));
        element.setAttribute(key, target.replace(/['"]/g, ""));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:type"]', "website");
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('link[rel="canonical"]', canonicalUrl, "href");
  }, [description, path, title]);
}
