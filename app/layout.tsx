import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE } from '@/lib/site';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { CookieBanner } from '@/components/CookieBanner';
import { LangHtmlUpdater } from '@/components/LangHtmlUpdater';
import { FaqEnhancer } from '@/components/FaqEnhancer';
import { YoutubeLiteEnhancer } from '@/components/YoutubeLiteEnhancer';
import { NewsletterEnhancer } from '@/components/NewsletterEnhancer';
import { HeroVideoEnhancer } from '@/components/HeroVideoEnhancer';
import { BodyClassUpdater } from '@/components/BodyClassUpdater';

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

const DEFAULT_DESCRIPTION =
  'Independent, step-by-step workflow for voiceovers and captions: script, TTS generation (ElevenLabs), audio cleanup, subtitle export (SRT/VTT) and QA.';

export const metadata: Metadata = {
  title: {
    default: SITE.brandName,
    template: `%s | ${SITE.brandName}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE.baseUrl),
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/images/favicon.ico', type: 'image/x-icon' }],
    apple: [{ url: '/images/favicon.png', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    title: SITE.brandName,
    description: DEFAULT_DESCRIPTION,
    url: SITE.baseUrl,
    images: [{ url: '/images/elevenlabs-studio-3.0.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.brandName,
    description: DEFAULT_DESCRIPTION,
    images: ['/images/elevenlabs-studio-3.0.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link as="style" fetchPriority="high" href="/assets/styles.min.css" rel="preload" />
        <link href="/assets/styles.min.css" rel="stylesheet" />
        <link as="image" fetchPriority="high" href="/images/elevenlabs-studio-3.0-hero-small.webp" rel="preload" />
      </head>
      <body>
        <LangHtmlUpdater />
        <BodyClassUpdater />
        <HeroVideoEnhancer />
        <YoutubeLiteEnhancer />
        <NewsletterEnhancer />
        <FaqEnhancer />
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
