import type { Metadata } from 'next';
import './globals.css';
import { CookieBanner } from '@/components/CookieBanner';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

const SITE_URL = 'https://voiceover-captions-ai.com';
const BRAND = 'Voiceover Captions AI';
const OG_IMAGE = '/images/voiceover-captions-ai-logo.png';

export const metadata: Metadata = {
  title: {
    default: BRAND,
    template: `%s | ${BRAND}`,
  },
  description: 'SEO-first content site for AI voiceovers, dubbing and captions.',
  icons: { icon: '/favicon.ico' },
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: BRAND,
    description: 'SEO-first content site for AI voiceovers, dubbing and captions.',
    url: SITE_URL,
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND,
    description: 'SEO-first content site for AI voiceovers, dubbing and captions.',
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="container">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
