'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  blogIndexPath,
  getLangFromPathname,
  legalNoticePath,
  privacyPath,
  homePath,
  SITE,
  UI_TRANSLATIONS,
} from '@/lib/site';
import type { Lang } from '@/lib/site';

const LANG_ORDER: Lang[] = ['fr', 'en', 'es', 'de'];

const LANG_LABELS: Record<Lang, Record<Lang, string>> = {
  en: { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' },
  fr: { fr: 'Français', en: 'English', es: 'Español', de: 'Deutsch' },
  es: { fr: 'Français', en: 'Inglés', es: 'Español', de: 'Deutsch' },
  de: { fr: 'Français', en: 'Englisch', es: 'Español', de: 'Deutsch' },
};

export function SiteFooter() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = UI_TRANSLATIONS[lang];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="footer-logo" href={homePath(lang)}>
              <img alt={SITE.brandName} height={32} loading="lazy" src="/images/voiceover-captions-ai-logo.png" width={150} />
              <span className="visually-hidden">{SITE.brandName} homepage</span>
            </Link>
            <p>{t.footerAbout}</p>
            <div className="affiliation-badge">
              <small>{t.footerAffiliateBadge}</small>
            </div>
          </div>

          <div className="footer-nav">
            <h3>{t.footerResources}</h3>
            <ul>
              <li>
                <a href={`${homePath(lang)}#features`}>{t.features}</a>
              </li>
              <li>
                <a href={`${homePath(lang)}#use-cases`}>{t.useCases}</a>
              </li>
              <li>
                <a href={`${homePath(lang)}#pricing`}>{t.pricing}</a>
              </li>
              <li>
                <a href={`${homePath(lang)}#faq`}>{t.faq}</a>
              </li>
              <li>
                <Link href={blogIndexPath(lang)}>{t.blog}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-nav">
            <h3>{t.footerLegal}</h3>
            <ul>
              <li>
                <Link href={privacyPath(lang)}>{t.privacy}</Link>
              </li>
              <li>
                <Link href={legalNoticePath(lang)}>{t.legal}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-nav">
            <h3>{t.footerConnect}</h3>
            <ul>
              <li>
                <a href="https://help.elevenlabs.io/" rel="noopener noreferrer" target="_blank">
                  {t.footerHelpCenter}
                </a>
              </li>
              <li>
                <a href="https://elevenlabs.io/" rel="noopener noreferrer" target="_blank">
                  {t.footerOfficial}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.contactEmail}`}>{t.contact}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>
              © {new Date().getFullYear()} {SITE.brandName}. {t.footerRights}
            </p>
            <div className="language-switcher language-switcher-footer">
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
        </div>
      </div>
    </footer>
  );
}
