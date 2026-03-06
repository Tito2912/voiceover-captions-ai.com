import Link from 'next/link';
import { getAllPosts } from '@/lib/content';

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="stack">
      <section className="hero">
        <h1>AI voiceovers & captions (SEO-first)</h1>
        <p>
          Practical workflows, checklists and comparisons (with clean internal linking and schema).
        </p>
      </section>

      <section className="card">
        <h2>Articles</h2>
        <ul className="list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`}>{p.title}</Link>
              <div className="muted">{p.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
