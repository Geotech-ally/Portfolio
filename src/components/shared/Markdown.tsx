import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders Markdown to React elements directly — never dangerouslySetInnerHTML,
 * and no rehype-raw plugin, so literal HTML embedded in stored content is
 * printed as text rather than executed. This is the sanitization boundary
 * for blog_posts.content_markdown and security_writeups.content_markdown.
 */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-content max-w-none text-body text-foreground-muted">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
