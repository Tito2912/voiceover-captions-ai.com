#!/usr/bin/env node
/**
 * Voiceover-Captions-AI — tools/check.mjs
 * QA automatique (Node >= 18, ESM) pour le site déployé sur Netlify.
 *
 * Vérifie :
 *  - Liens (200/3xx ; liste 4xx/5xx)
 *  - Canonical, hreflang (FR/EN + x-default)
 *  - OG / Twitter cards
 *  - robots.txt (expose les sitemaps, n’interdit pas /en/)
 *  - sitemaps (index -> sitemaps FR/EN en absolu https://www.voiceover-captions-ai.com/)
 *  - Headers sécurité via HEAD sur / et /en/
 *  - Budgets poids : CSS < 120 Ko, JS < 80 Ko
 *
 * Usage :
 *   node tools/check.mjs --base https://www.voiceover-captions-ai.com --out tools/report.md
 *
 * Note : ce script n’a aucune dépendance externe. Il utilise fetch natif (Node >= 18).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARGS = parseArgs(process.argv.slice(2));
const BASE = ensureTrailingSlash(ARGS.base || "https://www.voiceover-captions-ai.com/");
const OUT  = ARGS.out || path.join(__dirname, "report.md");
const TIMEOUT_MS = 20000;
const USER_AGENT = "VOCA-QA/1.0 (+https://www.voiceover-captions-ai.com/)";

// Budgets
const CSS_BUDGET = 120 * 1024; // 120 Ko
const JS_BUDGET  = 80  * 1024; // 80 Ko

// Pages à auditer
const PAGES = [
  "/", "/en/",
  "/blog.html", "/en/blog.html",
  "/blog-elevenlabs.html", "/en/blog-elevenlabs.html",
  "/mentions-legales", "/politique-de-confidentialite",
  "/legal-notice", "/privacy-policy",
  "/404.html"
];

// Sélecteurs / clés à vérifier
const SEO_CHECKS = {
  canonical: /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,
  hreflang: /<link[^>]+rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/ig,
  ogTitle: /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i,
  ogDesc:  /<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i,
  ogImage: /<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i,
  twCard:  /<meta[^>]+name=["']twitter:card["'][^>]*content=["']([^"']+)["'][^>]*>/i,
  twTitle: /<meta[^>]+name=["']twitter:title["'][^>]*content=["']([^"']+)["'][^>]*>/i,
};

const LINK_HREF = /<a\s+[^>]*href=["']([^"']+)["']/ig;
const SRC_ATTR  = /\s(?:src|href)=["']([^"']+)["']/ig;

(async function run(){
  const started = Date.now();
  const lines = [];
  section(lines, `QA report — ${new Date().toISOString()}`);
  section(lines, `Base: ${BASE}`);

  // 1) Vérifications par page
  const perPageReports = [];
  for (const p of PAGES) {
    const url = new URL(rel(p), BASE).toString();
    const res = await get(url);
    const ok = res && res.status < 400;
    perPageReports.push({ page: p, status: res?.status ?? 0, ok });

    const html = (res?.status < 400) ? await res.text() : "";
    const pageReport = auditHTML(p, url, html);
    lines.push(`\n## Page: ${p} — HTTP ${res?.status ?? "ERR"}`);
    lines.push(...pageReport.lines);

    // Liens sur la page
    const linkSet = extractLinks(html, url);
    const linkChecks = await checkLinks(linkSet);
    lines.push("\n**Liens externes/internes (4xx/5xx)**");
    if (linkChecks.bad.length === 0) {
      lines.push("- Aucun lien en erreur. ✅");
    } else {
      for (const b of linkChecks.bad) {
        lines.push(`- ${b.url} → ${b.status}`);
      }
    }
  }

  // 2) robots.txt
  lines.push("\n## robots.txt");
  const robotsUrl = new URL("robots.txt", BASE).toString();
  const robotsRes = await get(robotsUrl);
  let robotsWarn = [];
  if (robotsRes?.status < 400) {
    const robots = await robotsRes.text();
    if (!/sitemap:\s*https:\/\/www\.voiceover-captions-ai\.com\/sitemap\.xml/i.test(robots)) {
      robotsWarn.push("robots.txt: sitemap.xml non référencé");
    }
    if (/Disallow:\s*\/en\//i.test(robots)) {
      robotsWarn.push("robots.txt: /en/ NE doit pas être interdit");
    }
  } else robotsWarn.push(`robots.txt HTTP ${robotsRes?.status ?? "ERR"}`);
  reportList(lines, robotsWarn);

  // 3) Sitemaps
  lines.push("\n## Sitemaps");
  const smIndex = await get(new URL("sitemap.xml", BASE));
  const smWarn = [];
  if (smIndex?.status < 400) {
    const xml = await smIndex.text();
    if (!/https:\/\/www\.voiceover-captions-ai\.com\/sitemap-fr\.xml/i.test(xml)) {
      smWarn.push("sitemap.xml: lien vers sitemap-fr.xml manquant");
    }
    if (!/https:\/\/www\.voiceover-captions-ai\.com\/sitemap-en\.xml/i.test(xml)) {
      smWarn.push("sitemap.xml: lien vers sitemap-en.xml manquant");
    }
  } else smWarn.push(`sitemap.xml HTTP ${smIndex?.status ?? "ERR"}`);
  reportList(lines, smWarn);

  // 4) Headers sécurité (sur / et /en/)
  lines.push("\n## Security headers (HEAD)");
  const headRoot = await head(BASE);
  const headEn   = await head(new URL("en/", BASE).toString());
  const requiredHeaders = [
    "content-security-policy",
    "strict-transport-security",
    "referrer-policy",
    "permissions-policy",
    "x-content-type-options",
    "x-frame-options"
  ];
  const secReport = [];
  secReport.push(reportHeaders(" / ", headRoot?.headers, requiredHeaders));
  secReport.push(reportHeaders(" /en/ ", headEn?.headers, requiredHeaders));
  lines.push(...secReport.flat());

  // 5) Budgets poids CSS/JS
  lines.push("\n## Budgets poids (assets)");
  const cssURL = new URL("assets/styles.min.css", BASE).toString();
  const jsURL  = new URL("assets/main.min.js", BASE).toString();
  const cssHead = await head(cssURL);
  const jsHead  = await head(jsURL);
  const cssLen = contentLength(cssHead);
  const jsLen  = contentLength(jsHead);
  lines.push(`- styles.min.css : ${fmtSize(cssLen)} (${cssLen <= CSS_BUDGET ? "✅ OK" : "❌ > 120 Ko"})`);
  lines.push(`- main.min.js    : ${fmtSize(jsLen)} (${jsLen <= JS_BUDGET ? "✅ OK" : "❌ > 80 Ko"})`);

  // 6) Récap global des pages
  lines.push("\n## Récapitulatif HTTP des pages");
  for (const r of perPageReports) {
    lines.push(`- ${r.page} → ${r.status} ${r.ok ? "✅" : "❌"}`);
  }

  // Écriture du report
  await ensureDir(path.dirname(OUT));
  await fs.writeFile(OUT, lines.join("\n") + "\n", "utf8");

  // Log console
  console.log(`Report écrit → ${OUT}`);
  console.log(`Durée: ${Math.round((Date.now() - started)/1000)}s`);
})().catch(err => {
  console.error("Erreur QA:", err);
  process.exitCode = 1;
});

/* =============================== Helpers ================================ */

function parseArgs(argv){
  const out = {};
  for (let i=0;i<argv.length;i++){
    const a = argv[i];
    if (a === "--base") out.base = argv[++i];
    else if (a === "--out") out.out = argv[++i];
  }
  return out;
}
function ensureTrailingSlash(u){
  return u.endsWith("/") ? u : u + "/";
}
function rel(u){
  if (u.startsWith("/")) return u.slice(1);
  return u;
}
async function ensureDir(dir){
  await fs.mkdir(dir, { recursive: true });
}

function section(lines, title){
  lines.push(`\n# ${title}`);
}

function reportList(lines, arr){
  if (!arr.length) lines.push("- Aucun problème détecté. ✅");
  else for (const i of arr) lines.push(`- ${i}`);
}

function fmtSize(n){
  if (typeof n !== "number" || !isFinite(n)) return "n/a";
  return `${(n/1024).toFixed(1)} Ko`;
}

function contentLength(headRes){
  const h = headRes?.headers?.get("content-length");
  return h ? parseInt(h, 10) : NaN;
}

function timeout(ms){ return new Promise((_,rej)=>setTimeout(()=>rej(new Error("Timeout")),ms)); }

async function head(url){
  try{
    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "user-agent": USER_AGENT },
      signal: ctrl.signal
    });
    clearTimeout(t);
    return res;
  }catch(e){
    return null;
  }
}

async function get(url){
  try{
    const ctrl = new AbortController();
    const t = setTimeout(()=>ctrl.abort(), TIMEOUT_MS);
    const u = new URL(url);
    u.searchParams.set("_qa", Date.now().toString());
    const res = await fetch(u, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": USER_AGENT, "accept": "text/html,application/xhtml+xml" },
      signal: ctrl.signal
    });
    clearTimeout(t);
    return res;
  }catch(e){
    return null;
  }
}

function auditHTML(pagePath, url, html){
  const out = { lines: [] };
  if (!html) {
    out.lines.push("- Impossible de charger le HTML. ❌");
    return out;
  }

  // Canonical
  const can = html.match(SEO_CHECKS.canonical)?.[1] || "";
  const canOK = can.startsWith("https://www.voiceover-captions-ai.com/");
  out.lines.push(`- Canonical: ${can || "manquant"} ${canOK ? "✅" : "❌ (doit être absolu en https + www)"}`);

  // Hreflang
  const hreflangs = [];
  let m;
  while ((m = SEO_CHECKS.hreflang.exec(html)) !== null) {
    hreflangs.push({ lang: m[1], href: m[2] });
  }
  const hasFR = hreflangs.some(h => /^fr$/i.test(h.lang));
  const hasEN = hreflangs.some(h => /^en$/i.test(h.lang));
  const hasXD = hreflangs.some(h => /^x-default$/i.test(h.lang));
  out.lines.push(`- hreflang: FR=${hasFR?"✅":"❌"} EN=${hasEN?"✅":"❌"} x-default=${hasXD?"✅":"❌"}`);

  // OG/Twitter
  const ogTitle = !!html.match(SEO_CHECKS.ogTitle);
  const ogDesc  = !!html.match(SEO_CHECKS.ogDesc);
  const ogImage = !!html.match(SEO_CHECKS.ogImage);
  const twCard  = !!html.match(SEO_CHECKS.twCard);
  const twTitle = !!html.match(SEO_CHECKS.twTitle);
  out.lines.push(`- OpenGraph: title=${ogTitle?"✅":"❌"} desc=${ogDesc?"✅":"❌"} image=${ogImage?"✅":"❌"}`);
  out.lines.push(`- Twitter: card=${twCard?"✅":"❌"} title=${twTitle?"✅":"❌"}`);

  return out;
}

function extractLinks(html, pageURL){
  const links = new Set();
  // <a href="">
  let m;
  while ((m = LINK_HREF.exec(html)) !== null) {
    const href = sanitizeRef(m[1]);
    if (href) addURL(links, pageURL, href);
  }
  // assets src/href
  while ((m = SRC_ATTR.exec(html)) !== null) {
    const href = sanitizeRef(m[1]);
    if (href) addURL(links, pageURL, href);
  }
  // Filtre : on garde seulement http(s) + mêmes origines
  return Array.from(links).filter(u => /^https?:\/\//.test(u));
}

function sanitizeRef(href){
  if (!href || href.startsWith("javascript:") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  return href;
}

function addURL(set, pageURL, href){
  try{
    const u = new URL(href, pageURL).toString();
    set.add(u);
  }catch{ /* ignore */ }
}

async function checkLinks(urls){
  const bad = [];
  // On HEAD d’abord, puis GET si HEAD non supporté
  await Promise.all(urls.map(async (u) => {
    const h = await head(u);
    let status = h?.status ?? 0;
    if (!status || status >= 400 || status === 405) {
      const g = await get(u);
      status = g?.status ?? status;
    }
    if (!status || status >= 400) bad.push({ url: u, status });
  }));
  return { bad };
}

function reportHeaders(label, headers, required){
  const out = [];
  if (!headers) return [`- ${label} (HEAD failed) ❌`];
  const kv = Object.fromEntries(Array.from(headers.entries()));
  const misses = required.filter(h => !(h in kv));
  if (misses.length === 0) out.push(`- ${label} : tous les en-têtes présents ✅`);
  else out.push(`- ${label} : manquants → ${misses.join(", ")} ❌`);
  // Affiche les valeurs utiles pour trace
  for (const key of required) {
    if (kv[key]) out.push(`  - ${key}: ${kv[key]}`);
  }
  return out;
}
