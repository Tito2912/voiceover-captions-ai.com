import Link from 'next/link';
import { getAllPosts } from '@/lib/content';

export default async function HomePage() {
  const pages = await getAllPosts();
  const pinned = new Set([
    'ai-voiceover-captions-workflow',
    'elevenlabs-scribe-v2-transcription-2026',
    'best-ai-caption-tools-2026',
    'elevenlabs-for-captions-2026',
    'caption-workflow-youtube-shorts-2026',
    'transcription-vs-captioning-2026',
    'alternatives-elevenlabs-scribe-2026',
    'voice-to-avatar-2025',
    'blog',
    'about',
    'methodology',
    'sources',
    'contact',
  ]);
  const otherPages = pages.filter((p) => !pinned.has(p.slug));

  return (
    <div className="stack">
      <section className="hero">
        <h1>Voiceover Captions AI</h1>
        <p>Practical workflows, checklists and comparisons for AI voiceovers, captions and transcription.</p>
      </section>

      <section className="card" aria-label="Start here">
        <h2>Start here</h2>
        <ul className="list">
          <li>
            <Link href="/ai-voiceover-captions-workflow">Workflow: voiceover + captions checklist (2026)</Link>
            <div className="muted">A repeatable process from script to exports (SRT/VTT).</div>
          </li>
          <li>
            <Link href="/elevenlabs-scribe-v2-transcription-2026">ElevenLabs Scribe v2 (2026)</Link>
            <div className="muted">Transcription workflow, quality checks, exports.</div>
          </li>
          <li>
            <Link href="/voice-to-avatar-2025">Voice-to-avatar (2025)</Link>
            <div className="muted">What to check before you choose a pipeline.</div>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
            <div className="muted">All pages and guides.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Captions cluster">
        <h2>Captions cluster</h2>
        <ul className="list">
          <li>
            <Link href="/best-ai-caption-tools-2026">Best AI caption tools (2026)</Link>
            <div className="muted">How to compare tools by correction speed, exports and QA.</div>
          </li>
          <li>
            <Link href="/elevenlabs-for-captions-2026">Using ElevenLabs for captions (2026)</Link>
            <div className="muted">Where a voice-first stack helps caption workflows, and where it does not.</div>
          </li>
          <li>
            <Link href="/caption-workflow-youtube-shorts-2026">YouTube Shorts caption workflow (2026)</Link>
            <div className="muted">Mobile-safe captions and short-form export checks.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Transcription cluster">
        <h2>Transcription cluster</h2>
        <ul className="list">
          <li>
            <Link href="/elevenlabs-scribe-v2-transcription-2026">ElevenLabs Scribe v2 (2026)</Link>
            <div className="muted">Transcription at scale for captions, clips and QA.</div>
          </li>
          <li>
            <Link href="/transcription-vs-captioning-2026">Transcription vs captioning (2026)</Link>
            <div className="muted">What changes between transcript accuracy and viewer-readable captions.</div>
          </li>
          <li>
            <Link href="/alternatives-elevenlabs-scribe-2026">Alternatives to ElevenLabs Scribe (2026)</Link>
            <div className="muted">How to compare other workflow types without switching blindly.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Voiceover handoff">
        <h2>Voiceover handoff</h2>
        <ul className="list">
          <li>
            <Link href="/voice-to-avatar-2025">Voice-to-avatar (2025)</Link>
            <div className="muted">Avatar handoff, lip-sync stability and export checklist.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Transparency">
        <h2>Transparency</h2>
        <ul className="list">
          <li>
            <Link href="/methodology">Methodology</Link>
            <div className="muted">How we evaluate tools and workflows.</div>
          </li>
          <li>
            <Link href="/sources">Sources</Link>
            <div className="muted">Official docs and fast verification method.</div>
          </li>
          <li>
            <Link href="/about">About</Link>
            <div className="muted">Affiliate disclosure, updates, corrections.</div>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
            <div className="muted">Questions, corrections, reports.</div>
          </li>
        </ul>
      </section>

      {otherPages.length ? (
        <section className="card" aria-label="All pages">
          <h2>All pages</h2>
          <ul className="list">
            {otherPages.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`}>{p.title}</Link>
                <div className="muted">{p.description}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
