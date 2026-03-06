'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLangFromPathname, privacyPath, SITE, UI_TRANSLATIONS } from '@/lib/site';

type Consent = 'accepted' | 'refused';

const STORAGE_KEY = 'cookie_consent';
const CONSENT_MAX_AGE_DAYS = 365;

function readConsentFromLegacyStorage(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    // Legacy format: { value: { analytics: boolean }, expiry: number }
    const parsed = JSON.parse(raw) as any;
    if (parsed && typeof parsed === 'object') {
      const expiry = parsed.expiry;
      if (typeof expiry === 'number' && Date.now() > expiry) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      const value = parsed.value ?? parsed;
      if (typeof value?.analytics === 'boolean') return value.analytics ? 'accepted' : 'refused';
      if (value === 'accepted' || value === 'refused') return value;
    }

    if (raw === 'accepted' || raw === 'refused') return raw;
  } catch {
    // ignore
  }

  return null;
}

function writeConsentToStorage(consent: Consent) {
  try {
    const payload = {
      value: {
        necessary: true,
        analytics: consent === 'accepted',
        timestamp: new Date().toISOString(),
      },
      expiry: Date.now() + CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

function ensureGa4Loaded() {
  const id = SITE.ga4Id;
  if (!id) return;

  const w = window as any;
  if (w.__voiceover_ga4_loaded) return;
  w.__voiceover_ga4_loaded = true;

  const existing = document.querySelector(`script[src*=\"googletagmanager.com/gtag/js?id=${CSS.escape(id)}\"]`);
  if (!existing) {
    const ext = document.createElement('script');
    ext.async = true;
    ext.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(ext);
  }

  const inline = document.createElement('script');
  inline.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}', { anonymize_ip: true });
  `;
  document.head.appendChild(inline);
}

export function CookieBanner() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = UI_TRANSLATIONS[lang];

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const consent = readConsentFromLegacyStorage();
    if (consent === 'accepted') ensureGa4Loaded();
    setHidden(consent === 'accepted' || consent === 'refused');
  }, []);

  function set(consent: Consent) {
    writeConsentToStorage(consent);
    if (consent === 'accepted') ensureGa4Loaded();
    setHidden(true);
  }

  return (
    <div
      aria-label="Cookie consent"
      aria-live="polite"
      className="cookie-banner"
      hidden={hidden}
      id="cookie-consent"
      role="dialog"
    >
      <div className="cookie-content">
        <p>
          {t.cookie} <Link href={privacyPath(lang)}>{t.cookiePrivacyLink}</Link>
        </p>
        <div className="cookie-buttons">
          <button className="cookie-btn necessary" id="cookie-necessary" onClick={() => set('refused')} type="button">
            {t.cookieNecessary}
          </button>
          <button className="cookie-btn accept" id="cookie-accept" onClick={() => set('accepted')} type="button">
            {t.cookieAccept}
          </button>
        </div>
      </div>
    </div>
  );
}

