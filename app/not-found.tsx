import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function NotFoundPage() {
  return (
    <main className="container">
      <section className="section-padding">
        <h1>Page not found</h1>
        <p>The page you requested doesn&apos;t exist (or has been moved).</p>
        <Link className="btn btn-primary" href="/">
          Back to {SITE.brandName}
        </Link>
      </section>
    </main>
  );
}
