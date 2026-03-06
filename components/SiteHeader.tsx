'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/site';
import { blogIndexPath, getLangFromPathname, homePath, primaryAffiliateUrl, SITE, UI_TRANSLATIONS } from '@/lib/site';

const LANG_ORDER: Lang[] = ['fr', 'en', 'es', 'de'];

const LANG_LABELS: Record<Lang, Record<Lang, string>> = {
  en: { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' },
  fr: { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' },
  es: { fr: 'Français', en: 'Inglés', es: 'Español', de: 'Deutsch' },
  de: { fr: 'Français', en: 'Englisch', es: 'Español', de: 'Deutsch' },
};

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = UI_TRANSLATIONS[lang];

  const home = homePath(lang);
  const blog = blogIndexPath(lang);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="header">
      <div className="container">
        <Link aria-label={`${SITE.brandName} home`} className="logo" href={home}>
          <picture>
            <source media="(prefers-color-scheme: light)" srcSet="/images/elevenlabs-logo-black.svg" />
            <img
              alt={SITE.brandName}
              decoding="async"
              height={32}
              loading="eager"
              src="/images/voiceover-captions-ai-logo.png"
              width={150}
            />
          </picture>
          <span className="visually-hidden">{SITE.brandName} homepage</span>
        </Link>

        <nav aria-label="Main navigation" className="nav">
          <button
            aria-expanded={open}
            aria-label={t.menu}
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          <ul aria-expanded={open} className="nav-menu" onClick={() => setOpen(false)}>
            <li>
              <a href={`${home}#features`}>{t.features}</a>
            </li>
            <li>
              <a href={`${home}#use-cases`}>{t.useCases}</a>
            </li>
            <li>
              <Link href={blog}>{t.blog}</Link>
            </li>
            <li>
              <a href={`${home}#pricing`}>{t.pricing}</a>
            </li>
            <li>
              <a href={`${home}#faq`}>{t.faq}</a>
            </li>
            <li className="nav-cta">
              <a className="btn btn-primary" href={primaryAffiliateUrl()} rel="noopener sponsored noreferrer" target="_blank">
                {t.tryFree}
              </a>
            </li>
          </ul>
        </nav>

        <div className="language-switcher">
          {LANG_ORDER.map((l) =>
            l === lang ? (
              <span aria-current="true" key={l}>
                {LANG_LABELS[lang][l]}
              </span>
            ) : (
              <a href={homePath(l)} hrefLang={l} key={l} lang={l}>
                {LANG_LABELS[lang][l]}
              </a>
            ),
          )}
        </div>
      </div>
    </header>
  );
}
