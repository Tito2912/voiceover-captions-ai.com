import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>© {new Date().getFullYear()} — Voiceover Captions AI</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/about">About</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/sources">Sources</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/legal-notice">Legal notice</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}
