import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link className="brand" href="/">Voiceover Captions AI</Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/ai-voiceover-captions-workflow">Workflow</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/privacy-policy">Privacy</Link>
        </nav>
      </div>
    </header>
  );
}
