import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        © {new Date().getFullYear()} — Voiceover Captions AI ·{' '}
        <Link href="/legal-notice">Legal notice</Link> ·{' '}
        <Link href="/privacy-policy">Privacy policy</Link>
      </div>
    </footer>
  );
}
