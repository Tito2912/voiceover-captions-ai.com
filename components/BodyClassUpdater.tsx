'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function normalizePathname(pathname: string): string {
  let p = pathname || '/';
  if (p !== '/') p = p.replace(/\/+$/, '');
  return p || '/';
}

function stripLangPrefix(pathname: string): string {
  const p = normalizePathname(pathname);
  const stripped = p.replace(/^\/(fr|es|de)\b/, '');
  return stripped || '/';
}

export function BodyClassUpdater() {
  const pathname = usePathname() ?? '/';

  useEffect(() => {
    try {
      const withoutPrefix = stripLangPrefix(pathname);
      const classes = new Set(document.body.className.split(/\s+/).filter(Boolean));
      classes.delete('blog-hub');
      classes.delete('blog-article');

      if (withoutPrefix === '/blog') classes.add('blog-hub');
      else if (withoutPrefix.startsWith('/blog/')) classes.add('blog-article');

      document.body.className = Array.from(classes).join(' ');
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}

