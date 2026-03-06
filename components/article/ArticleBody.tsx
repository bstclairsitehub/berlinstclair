import { TiptapRenderer } from '@/lib/tiptap-renderer';

interface ArticleBodyProps {
  content: any;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/*
        Multi-column newspaper layout.
        On md+ screens: 3 columns with a thin rule between them.
        On mobile: single column for readability.
        The dropcap is applied via Tailwind first-letter utilities on the
        wrapping element — TiptapRenderer must render a <p> as its first child
        for the CSS pseudo-selector to work correctly.
      */}
      <div
        className={[
          // Column layout
          'columns-1 md:columns-2 lg:columns-3',
          // Column gap and rule
          'gap-8',
          // Body typography
          'font-body text-lg text-dp-text leading-relaxed',
          // Dropcap on the very first letter of the content block
          'first-letter:float-left',
          'first-letter:text-7xl',
          'first-letter:font-headline',
          'first-letter:leading-none',
          'first-letter:mr-2',
          'first-letter:mt-1',
          'first-letter:text-dp-text',
        ].join(' ')}
        style={{
          columnRule: '1px solid #DFDFDF',
          columnGap: '2rem',
        }}
      >
        {/*
          Prose-style overrides injected via a scoped wrapper class.
          These ensure that headings, blockquotes, lists, etc. from
          TiptapRenderer render with correct NYT-style typography even
          when the Tailwind base reset strips default browser styles.
        */}
        <div className="article-body-prose">
          <TiptapRenderer content={content} />
        </div>
      </div>

      {/*
        Global styles injected as a <style> tag (Server Component safe).
        Scoped to .article-body-prose to avoid leaking into other elements.
      */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            .article-body-prose p {
              margin-bottom: 1.25em;
            }
            .article-body-prose h2 {
              font-family: var(--font-headline, 'Playfair Display', serif);
              font-size: 1.5rem;
              font-weight: 700;
              line-height: 1.25;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              color: #1A1A1A;
              /* Prevent column break immediately after a heading */
              break-after: avoid;
              column-span: all;
            }
            .article-body-prose h3 {
              font-family: var(--font-headline, 'Playfair Display', serif);
              font-size: 1.25rem;
              font-weight: 700;
              line-height: 1.3;
              margin-top: 1.25em;
              margin-bottom: 0.4em;
              color: #1A1A1A;
              break-after: avoid;
            }
            .article-body-prose blockquote {
              border-left: 3px solid #1A1A1A;
              padding-left: 1rem;
              margin: 1.5em 0;
              font-style: italic;
              font-size: 1.125rem;
              color: #333;
              break-inside: avoid;
            }
            .article-body-prose ul {
              list-style: disc;
              padding-left: 1.5rem;
              margin-bottom: 1em;
            }
            .article-body-prose ol {
              list-style: decimal;
              padding-left: 1.5rem;
              margin-bottom: 1em;
            }
            .article-body-prose li {
              margin-bottom: 0.4em;
            }
            .article-body-prose a {
              color: #326891;
              text-decoration: underline;
              text-decoration-thickness: 1px;
              text-underline-offset: 2px;
            }
            .article-body-prose a:hover {
              color: #1A1A1A;
            }
            .article-body-prose code {
              font-family: 'Courier New', Courier, monospace;
              font-size: 0.875em;
              background-color: #F7F7F7;
              border: 1px solid #DFDFDF;
              padding: 0.125em 0.375em;
              border-radius: 2px;
            }
            .article-body-prose pre {
              background-color: #F7F7F7;
              border: 1px solid #DFDFDF;
              padding: 1rem;
              overflow-x: auto;
              margin-bottom: 1.25em;
              break-inside: avoid;
            }
            .article-body-prose pre code {
              background: none;
              border: none;
              padding: 0;
            }
            .article-body-prose img {
              width: 100%;
              height: auto;
              break-inside: avoid;
              margin: 1em 0;
            }
            .article-body-prose strong {
              font-weight: 700;
              color: #1A1A1A;
            }
            .article-body-prose em {
              font-style: italic;
            }
          `,
        }}
      />
    </div>
  );
}
