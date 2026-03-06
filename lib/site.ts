export const SITE = {
  baseUrl: 'https://voiceover-captions-ai.com',
  domain: 'voiceover-captions-ai.com',
  brandName: 'Voiceover Captions AI',
  productName: 'Voiceover Captions AI',
  ga4Id: 'G-952B25HTV8',
  affiliateUrl: 'https://try.elevenlabs.io/q4qifzaxhkwg',
  companyName: 'E-Com Shop',
  companyAddress: '60 rue François 1er, 75008 PARIS',
  companyId: 'SIREN 934934308',
  managerName: 'Tony CARON',
  hostName: 'Netlify',
  contactEmail: 'contact.ecomshopfrance@gmail.com',
  supportedLangs: ['en', 'fr', 'es', 'de'] as const,
};

export type Lang = (typeof SITE.supportedLangs)[number];

export const UI_TRANSLATIONS: Record<
  Lang,
  {
    blog: string;
    features: string;
    useCases: string;
    pricing: string;
    faq: string;
    legal: string;
    privacy: string;
    cookie: string;
    cookiePrivacyLink: string;
    cookieNecessary: string;
    cookieAccept: string;
    accept: string;
    refuse: string;
    language: string;
    menu: string;
    tryFree: string;
    footerResources: string;
    footerLegal: string;
    footerConnect: string;
    footerAbout: string;
    footerAffiliateBadge: string;
    footerRights: string;
    footerHelpCenter: string;
    footerOfficial: string;
    contact: string;
  }
> = {
  fr: {
    blog: 'Blog',
    features: 'Fonctionnalités',
    useCases: 'Cas d’usage',
    pricing: 'Tarifs',
    faq: 'FAQ',
    legal: 'Mentions légales',
    privacy: 'Politique de confidentialité',
    cookie:
      'Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. En cliquant sur « Tout accepter », vous consentez à l’utilisation de tous les cookies.',
    cookiePrivacyLink: 'Lire notre politique de confidentialité',
    cookieNecessary: 'Nécessaires uniquement',
    cookieAccept: 'Tout accepter',
    accept: 'Accepter',
    refuse: 'Refuser',
    language: 'Langue',
    menu: 'Ouvrir/fermer le menu',
    tryFree: 'Essayer ElevenLabs gratuitement',
    footerResources: 'Ressources',
    footerLegal: 'Légal',
    footerConnect: 'Raccourcis',
    footerAbout: 'Guides indépendants pour voix-off, sous-titres et workflows TTS.',
    footerAffiliateBadge: 'Site indépendant (non officiel) • certains liens peuvent être affiliés',
    footerRights: 'Tous droits réservés.',
    footerHelpCenter: 'Centre d’aide',
    footerOfficial: 'ElevenLabs (officiel)',
    contact: 'Contact',
  },
  en: {
    blog: 'Blog',
    features: 'Features',
    useCases: 'Use Cases',
    pricing: 'Pricing',
    faq: 'FAQ',
    legal: 'Legal notice',
    privacy: 'Privacy policy',
    cookie:
      'We use cookies to enhance your experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
    cookiePrivacyLink: 'Read our Privacy Policy',
    cookieNecessary: 'Necessary Only',
    cookieAccept: 'Accept All',
    accept: 'Accept',
    refuse: 'Refuse',
    language: 'Language',
    menu: 'Menu',
    tryFree: 'Try ElevenLabs Free',
    footerResources: 'Resources',
    footerLegal: 'Legal',
    footerConnect: 'Connect',
    footerAbout: 'Independent guides for AI voiceovers, captions and TTS workflows.',
    footerAffiliateBadge: 'Independent site (not official) • Some links may be affiliate links',
    footerRights: 'All rights reserved.',
    footerHelpCenter: 'Help Center',
    footerOfficial: 'ElevenLabs Official',
    contact: 'Contact',
  },
  es: {
    blog: 'Blog',
    features: 'Características',
    useCases: 'Casos de uso',
    pricing: 'Precios',
    faq: 'FAQ',
    legal: 'Aviso legal',
    privacy: 'Política de privacidad',
    cookie:
      'Utilizamos cookies para mejorar tu experiencia y analizar nuestro tráfico de usuarios. Al hacer clic en "Aceptar todo", aceptas nuestro uso de cookies.',
    cookiePrivacyLink: 'Lea nuestra Política de Privacidad',
    cookieNecessary: 'Sólo necesario',
    cookieAccept: 'Aceptar todos',
    accept: 'Aceptar',
    refuse: 'Rechazar',
    language: 'Idioma',
    menu: 'Menú',
    tryFree: 'Pruebe ElevenLabs Gratis',
    footerResources: 'Recursos',
    footerLegal: 'Legal',
    footerConnect: 'Conectar',
    footerAbout: 'Guías independientes para locución, subtítulos y workflows TTS.',
    footerAffiliateBadge: 'Sitio independiente (no oficial) • algunos enlaces pueden ser de afiliación',
    footerRights: 'Todos los derechos reservados.',
    footerHelpCenter: 'Centro de ayuda',
    footerOfficial: 'ElevenLabs Official',
    contact: 'Contacto',
  },
  de: {
    blog: 'Blog',
    features: 'Eigenschaften',
    useCases: 'Anwendungsfälle',
    pricing: 'Preis',
    faq: 'FAQ',
    legal: 'Rechtliche Hinweise',
    privacy: 'Datenschutzbestimmungen',
    cookie:
      'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unseren Traffic zu analysieren. Durch Anklicken von "Akzeptieren Sie alle", stimmen Sie unserer Verwendung von Cookies zu.',
    cookiePrivacyLink: 'Lesen Sie unsere Datenschutzerklärung',
    cookieNecessary: 'Nur notwendig',
    cookieAccept: 'Alle akzeptieren',
    accept: 'Akzeptieren',
    refuse: 'Ablehnen',
    language: 'Sprache',
    menu: 'Toggle Menü',
    tryFree: 'Versuchen Sie ElevenLabs kostenlos',
    footerResources: 'Ressourcen',
    footerLegal: 'Recht',
    footerConnect: 'Verbindung',
    footerAbout: 'Unabhängige Guides für Voiceover, Untertitel und TTS‑Workflows.',
    footerAffiliateBadge: 'Unabhängige Seite (nicht offiziell) • Einige Links können Affiliate‑Links sein',
    footerRights: 'Alle Rechte vorbehalten.',
    footerHelpCenter: 'Hilfe-Center',
    footerOfficial: 'ElevenLabs Offizielle',
    contact: 'Kontakt',
  },
};

export function normalizeLang(lang: unknown): Lang {
  const normalized = String(lang ?? '').toLowerCase();
  return (SITE.supportedLangs as readonly string[]).includes(normalized) ? (normalized as Lang) : 'en';
}

function normalizePathname(pathname: string): string {
  let path = pathname || '/';
  if (path !== '/') path = path.replace(/\/+$/, '');
  return path.replace(/\.html$/, '');
}

export function getLangFromPathname(pathname: string): Lang {
  const path = normalizePathname(pathname);
  if (path === '/fr' || path.startsWith('/fr/')) return 'fr';
  if (path === '/es' || path.startsWith('/es/')) return 'es';
  if (path === '/de' || path.startsWith('/de/')) return 'de';
  return 'en';
}

export function prefixPath(lang: Lang): string {
  return lang === 'en' ? '' : `/${lang}`;
}

type TranslationKey = 'home' | 'blog_index' | 'voice_to_avatar_2025' | 'legal_notice' | 'privacy_policy';

const ROUTE_BY_KEY: Record<TranslationKey, Record<Lang, string>> = {
  home: {
    en: '/',
    fr: '/fr',
    es: '/es',
    de: '/de',
  },
  blog_index: {
    en: '/blog',
    fr: '/fr/blog',
    es: '/es/blog',
    de: '/de/blog',
  },
  voice_to_avatar_2025: {
    en: '/blog/voice-to-avatar-2025',
    fr: '/fr/blog/voix-avatar-2025',
    es: '/es/blog/voice-to-avatar-2025',
    de: '/de/blog/voice-to-avatar-2025',
  },
  legal_notice: {
    en: '/legal-notice',
    fr: '/fr/mentions-legales',
    es: '/es/legal-notice',
    de: '/de/legal-notice',
  },
  privacy_policy: {
    en: '/privacy-policy',
    fr: '/fr/politique-de-confidentialite',
    es: '/es/privacy-policy',
    de: '/de/privacy-policy',
  },
};

function translationKeyFromPath(pathname: string): TranslationKey | null {
  const p = normalizePathname(pathname);
  if (p === '/' || p === '') return 'home';
  if (p === '/blog') return 'blog_index';
  if (p === '/blog/voice-to-avatar-2025' || p === '/blog/voix-avatar-2025') return 'voice_to_avatar_2025';
  if (p === '/mentions-legales' || p === '/legal-notice') return 'legal_notice';
  if (p === '/politique-de-confidentialite' || p === '/privacy-policy') return 'privacy_policy';
  return null;
}

export function homePath(lang: Lang): string {
  return ROUTE_BY_KEY.home[lang];
}

export function blogIndexPath(lang: Lang): string {
  return ROUTE_BY_KEY.blog_index[lang];
}

export function primaryAffiliateUrl(): string {
  return SITE.affiliateUrl;
}

export function voiceToAvatar2025Path(lang: Lang): string {
  return ROUTE_BY_KEY.voice_to_avatar_2025[lang];
}

export function legalNoticePath(lang: Lang): string {
  return ROUTE_BY_KEY.legal_notice[lang];
}

export function privacyPath(lang: Lang): string {
  return ROUTE_BY_KEY.privacy_policy[lang];
}

export function localizedUrl(pathname: string, lang: Lang): string {
  const target = normalizeLang(lang);
  const path = normalizePathname(pathname);

  // Strip any existing lang prefix (fr/es/de). EN has no prefix.
  const withoutPrefix =
    path === '/fr' || path.startsWith('/fr/')
      ? path.replace(/^\/fr\b/, '') || '/'
      : path === '/es' || path.startsWith('/es/')
        ? path.replace(/^\/es\b/, '') || '/'
        : path === '/de' || path.startsWith('/de/')
          ? path.replace(/^\/de\b/, '') || '/'
          : path === '/en' || path.startsWith('/en/')
            ? path.replace(/^\/en\b/, '') || '/'
          : path;

  const key = translationKeyFromPath(withoutPrefix);
  if (key) return ROUTE_BY_KEY[key][target];

  // Fallback: keep same path after stripping prefix, just add new prefix.
  if (withoutPrefix === '/' || withoutPrefix === '') return homePath(target);
  const cleaned = withoutPrefix.startsWith('/') ? withoutPrefix : `/${withoutPrefix}`;
  return `${prefixPath(target)}${cleaned}`;
}
