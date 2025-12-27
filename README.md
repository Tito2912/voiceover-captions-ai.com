# Voiceover-Captions-AI
**Site d’affiliation ElevenLabs — FR/EN — Netlify-ready — RGPD (Consent Mode v2)**  
Domaine canonique : **https://www.voiceover-captions-ai.com** (avec forçage **www**)

---

## 1) Objectif & périmètre
- Affiliate unique : `https://try.elevenlabs.io/q4qifzaxhkwg` (tous les CTA et liens produit).
- Produits & features (Studio 3.0) : Expressive Voiceovers, Eleven Music, AI Sound Effects, Voice Isolation, Voice Changer, Automatic Captioning, Speech Correction, Multiplayer Commenting, AI Script Generator.
- Bilingue **FR/EN** (x-default = EN). Redirection langue **humains uniquement** (exclusion bots).
- Accessibilité **WCAG 2.2 AA**, Core Web Vitals 2025 (CLS≈0), SEO 2025 (OG/Twitter, JSON-LD).
- RGPD : Consent Mode v2 (GA4 **désactivé par défaut**), bannière opt-in, préférences persistées 13 mois.

---

## 2) Déploiement Netlify

### 2.1. Structure & publication
- **Repo** : placez tous les fichiers à la racine (site statique pur).
- **Netlify** → New site from Git → relier le dépôt → Build command : _none_ → Publish dir : `.`  
- Les fichiers clés déjà fournis :
  - `/_redirects` : HTTPS + **www**, 404 custom, canonical `/` ↔ `/index.html`, `/en/` ↔ `/en/index.html`.
  - `/netlify.toml` : en-têtes sécurité, **CSP stricte**, caches, preloads CSS/JS.

### 2.2. En-têtes sécurité (déjà configurés)
- **CSP** (domaines autorisés) : `self`, `www.youtube-nocookie.com`, `youtu.be`, `*.googlevideo.com`, `i.ytimg.com`, `www.googletagmanager.com`, `www.google-analytics.com`, `fonts.googleapis.com`, `fonts.gstatic.com`, `translate.googleapis.com`, `translate.google.com`, `gstatic.com`, `elevenlabs.io`, `*.elevenlabs.io`, `try.elevenlabs.io`.
- **HSTS** 2 ans + `preload`, **Referrer-Policy** : strict-origin-when-cross-origin, **Permissions-Policy** minimale, **X-Content-Type-Options** : nosniff, **X-Frame-Options** : DENY, **COOP** : same-origin.
- **Remarque CSP** : `script-src` contient `unsafe-inline` **uniquement** pour les balises **JSON-LD**. Pour une CSP 100% sans inline :  
  1) déplacer les JSON-LD vers des fichiers statiques et les inclure via `<script src>` **ou**  
  2) remplacer `unsafe-inline` par des **hashes SHA-256** de chaque bloc.

### 2.3. Cache
- HTML : `s-maxage=600` (CDN 10 min), `must-revalidate`.  
- Assets `/assets/*` & `/images/*` : 1 an **immutable**.  
- `robots.txt` & sitemaps : 1 heure.

---

## 3) Google Analytics 4 + Consent Mode v2

### 3.1. Paramétrage GA4
- ID : **G-952B25HTV8** (injecté **après consentement** uniquement).
- Par défaut : `ad_storage=denied`, `analytics_storage=denied`.  
- Opt-in via bannière → `analytics_storage=granted` + chargement de `gtag/js`.

### 3.2. Événements GA4 (dans `/assets/main.js`)
- `cta_click {label, location, lang, variant}`
- `video_play {video_id, location, lang}`
- `faq_toggle {question_id, state, lang}`
- `lang_redirect {from, to, ua_is_bot}`
- `consent_granted / consent_denied {version, lang}`
- `newsletter_submit {status:"success", lang}`

> Trace de consentement : `localStorage` clé `voca_consent` → `{version, analytics:boolean, ts}`.

---

## 4) Newsletter (Apps Script + Google Sheet)

### 4.1. Front-end
- Formulaires sur `index.html`, `blog.html`, `blog-elevenlabs.html` (FR & EN).  
- Champs : `email` (required), `consent` (required), `lang`, honeypot `company`, délai anti-bot.

### 4.2. Endpoint
- **URL provisoire** intégrée : `https://script.google.com/macros/s/AKfycbx-demo/exec`.  
- Pour mettre votre propre endpoint : créer la Web App Apps Script et remplacer l’URL **dans tous les formulaires**.

### 4.3. Back-end (fourni)
- `apps-script/Code.gs` :  
  - Accepte JSON `{email, lang, consent_version, ua, source}`  
  - Valide, écrit dans l’onglet Google Sheet `newsletter-elevenlabs`.  
  - Réponse `{ok:true}`.  
- Fichier de données initial : `/data/newsletter-elevenlabs.csv` (entêtes).

---

## 5) Arborescence finale

/
├─ index.html
├─ blog.html
├─ blog-elevenlabs.html
├─ mentions-legales.html
├─ politique-de-confidentialite.html
├─ 404.html
├─ en/
│ ├─ index.html
│ ├─ blog.html
│ ├─ blog-elevenlabs.html
│ ├─ legal-notice.html
│ └─ privacy-policy.html
├─ assets/
│ ├─ styles.css
│ └─ main.js
├─ images/
│ ├─ elevenlabs-studio-3.0.png
│ ├─ miniature-youtube-elevenlabs-studio-3.0.png
│ └─ elevenlabs-symbol.svg
├─ data/
│ └─ newsletter-elevenlabs.csv
├─ apps-script/
│ └─ Code.gs
├─ tools/
│ ├─ check.mjs
│ └─ report.md ← généré après exécution (voir §6)
├─ robots.txt
├─ sitemap.xml
├─ sitemap-fr.xml
├─ sitemap-en.xml
├─ _redirects
└─ netlify.toml

yaml
Copier le code

> **Note** : Les fichiers d’image listés supposent l’upload des assets fournis (ZIP). Les pages les référencent sans placeholder.

---

## 6) QA & vérifications

### 6.1. Script QA (Node ≥ 18)
- Installer Node ≥ 18.  
- Exécuter le script :
  ```bash
  node tools/check.mjs --base https://www.voiceover-captions-ai.com --out tools/report.md
Le script vérifie :

Liens (200/3xx ; liste 4xx/5xx)

Canonical absolu (https + www), hreflang (FR/EN + x-default)

OG/Twitter (title/desc/image, twitter:card)

robots.txt (sitemaps exposés, pas de blocage /en/)

sitemap.xml indexe sitemap-fr.xml & sitemap-en.xml (absolus)

Headers sécurité via HEAD sur / et /en/

Budgets CSS < 120 Ko, JS < 80 Ko

6.2. Accessibilité
Navigation clavier : burger, FAQ <details>, bannière cookies, formulaires.

Focus visible (outline), skip-link, labels explicites, aria-live sur messages de formulaire.

Vidéos YouTube : privacy-enhanced (www.youtube-nocookie.com), chargées sur action (lazy).

6.3. Core Web Vitals (Lighthouse)
Objectifs : Performance ≥ 90 / Accessibilité ≥ 95 / SEO ≥ 95 / Best Practices ≥ 95

CLS ≈ 0 : images avec dimensions + aspect-ratio, iframes lazy, pas d’inlines bloquants.

6.4. SEO
Canonical absolu (https://www.voiceover-captions-ai.com/...).

Hreflang FR/EN + x-default (pointant EN).

JSON-LD : Organization, SoftwareApplication (Studio 3.0), BreadcrumbList, FAQPage, Article, WebSite+SearchAction.

7) Personnalisation & maintenance
7.1. Palette ElevenLabs (styles.css)
Palette actuelle = fallback marquée [À vérifier] (voir en-tête de styles.css).

Une fois les hexcodes officiels confirmés (CSS/brand kit ElevenLabs), remplacez :

css
Copier le code
--accent: #ff6b00; /* [À vérifier] */
--muted:  #6e6e6e; /* [À vérifier] */
Conservez le commentaire source (URL + date) dans le fichier.

7.2. GA4
Pour activer GA4 en prod : aucune action si le bandeau est accepté (chargement auto via main.js).

Pour forcer une CSP sans inline, basculer les JSON-LD vers des fichiers statiques et retirer unsafe-inline de script-src dans netlify.toml.

7.3. Redirection de langue
Exclusion bots par regex UA (Googlebot, Bingbot, Yandex, etc.).

Redirection uniquement depuis la racine FR (/ ou /index.html) vers /en/ si navigator.language ne commence pas par fr.

Évite de perturber l’indexation (les bots ne sont pas redirigés).

8) Checklist finale
 CTA : tous les liens → https://try.elevenlabs.io/q4qifzaxhkwg (rel="noopener sponsored").

 Aucune erreur console (Chrome DevTools).

 Lighthouse (Mobile & Desktop) : objectifs atteints.

 Consentement : bannière opt-in, refus/acceptation fonctionnels, préférence persistée.

 Newsletter : soumission OK → Apps Script → ligne insérée dans Google Sheet.

 YouTube : l’iframe se charge uniquement après clic.

 Sitemaps accessibles et valides (Search Console).

 CSP : aucune violation dans l’onglet Sécurité/Console.

 _redirects : redirections 301 attendues (vers https + www).

9) Commandes utiles
Tester rapidement les en-têtes (curl)
bash
Copier le code
curl -I https://www.voiceover-captions-ai.com/
curl -I https://www.voiceover-captions-ai.com/en/
Générer le rapport QA
bash
Copier le code
node tools/check.mjs --base https://www.voiceover-captions-ai.com --out tools/report.md
10) Licence & mentions
© E-Com Shop — SIREN 934934308 — 60 rue François 1er, 75008 PARIS — contact.ecomshopfrance@gmail.com

Affiliation : ce site peut percevoir une commission si vous cliquez sur « Essayer ElevenLabs ».

makefile
Copier le code
::contentReference[oaicite:0]{index=0}