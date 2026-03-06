import Link from 'next/link';
import { TableOfContents } from '@/components/TableOfContents';
import { FAQ } from '@/components/FAQ';
import { CTABox } from '@/components/CTABox';
import type { Post } from '@/lib/types';

export function ArticleLayout({ post }: { post: Post }) {
  return (
    <article className="article stack">
      <header>
        <div className="badges">
          <span className="badge">{post.type.toUpperCase()}</span>
          {post.primaryKeyword ? <span className="badge">KW: {post.primaryKeyword}</span> : null}
          {post.updatedAt ? <span className="badge">Updated: {new Date(post.updatedAt).toLocaleDateString()}</span> : null}
        </div>
        <h1>{post.title}</h1>
        <p className="lede">{post.description}</p>

        {post.jumpLinks?.length ? (
          <div className="card">
            <strong>Jump to</strong>
            <ul className="list">
              {post.jumpLinks.map((j) => (
                <li key={j.href}>
                  <a href={j.href}>{j.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </header>

      <div className="grid">
        <div className="stack">
          {post.quickAnswer?.length ? (
            <section className="card" aria-label="Quick answer">
              <strong>Quick answer</strong>
              <ul className="list">
                {post.quickAnswer.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="stack">{post.content}</div>

          {post.cta ? (
            <CTABox
              title={post.cta.title}
              body={post.cta.body}
              buttonLabel={post.cta.buttonLabel}
              buttonHref={post.cta.buttonHref}
            />
          ) : null}

          <hr className="hr" />

          {post.faq?.length ? <FAQ items={post.faq} /> : null}

          {post.internalLinks?.length ? (
            <section className="card">
              <h2 id="next-steps">Next steps</h2>
              <ul className="list">
                {post.internalLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.anchor}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="toc" aria-label="Table of contents">
          <div className="card">
            <strong>On this page</strong>
            <TableOfContents headings={post.headings} />
          </div>
        </aside>
      </div>
    </article>
  );
}
