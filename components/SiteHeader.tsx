import Link from 'next/link';
import Image from 'next/image';

const AFFILIATE_URL = 'https://try.elevenlabs.io/q4qifzaxhkwg';

export function SiteHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Voiceover Captions AI">
          <Image
            src="/images/voiceover-captions-ai-logo.png"
            alt="Voiceover Captions AI"
            width={180}
            height={36}
            priority
          />
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/ai-voiceover-captions-workflow">Workflow</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <a href={AFFILIATE_URL} rel="nofollow sponsored noopener noreferrer" target="_blank">
            Try ElevenLabs
          </a>
        </nav>
      </div>
    </header>
  );
}
