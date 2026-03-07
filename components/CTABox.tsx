import Link from 'next/link';

export function CTABox({
  title,
  body,
  buttonLabel,
  buttonHref,
}: {
  title: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
}) {
  const isExternal = /^https?:\/\//.test(buttonHref);

  return (
    <section className="cta" aria-label="Call to action">
      <strong>{title}</strong>
      <p className="muted" style={{ margin: '6px 0 12px' }}>{body}</p>
      {isExternal ? (
        <a
          className="kbd"
          href={buttonHref}
          rel="nofollow sponsored noopener noreferrer"
          target="_blank"
        >
          {buttonLabel}
        </a>
      ) : (
        <Link className="kbd" href={buttonHref}>
          {buttonLabel}
        </Link>
      )}
    </section>
  );
}
