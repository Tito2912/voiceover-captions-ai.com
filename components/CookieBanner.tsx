'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Consent = 'accepted' | 'refused';

const STORAGE_KEY = 'voiceover_captions_ai_cookies_v1';
const GA4_ID = 'G-952B25HTV8';

function ensureGa4Loaded() {
  const w = window as any;
  if (w.__vca_ga4_loaded) return;
  w.__vca_ga4_loaded = true;

  w.dataLayer = w.dataLayer || [];
  w.gtag =
    w.gtag ||
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments);
    };

  const ext = document.createElement('script');
  ext.async = true;
  ext.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(ext);

  w.gtag('js', new Date());
  w.gtag('config', GA4_ID, { anonymize_ip: true });
}

export function CookieBanner() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY) as Consent | null;
      if (consent === 'accepted') ensureGa4Loaded();
      if (consent === 'accepted' || consent === 'refused') {
        setHidden(true);
        return;
      }
      setHidden(false);
    } catch {
      setHidden(false);
    }
  }, []);

  function set(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // ignore
    }
    if (consent === 'accepted') ensureGa4Loaded();
    setHidden(true);
  }

  return (
    <div aria-label="Cookie banner" aria-live="polite" className={`cookie-banner ${hidden ? 'hidden' : ''}`} role="dialog">
      <p>
        We use analytics cookies (Google Analytics 4) to improve the site. <Link href="/privacy-policy">Privacy policy</Link>
      </p>
      <div className="cookie-actions">
        <button className="cookie-btn cookie-btn--primary" onClick={() => set('accepted')} type="button">
          Accept
        </button>
        <button className="cookie-btn" onClick={() => set('refused')} type="button">
          Refuse
        </button>
      </div>
    </div>
  );
}

