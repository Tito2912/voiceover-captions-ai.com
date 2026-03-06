'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function shouldSkipVideoAutoplay(): boolean {
  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return true;

    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    if (isSmallScreen) return true;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const saveData = Boolean(connection && connection.saveData);
    const effectiveType = String(connection?.effectiveType ?? '');
    const slowConnection = ['slow-2g', '2g', '3g'].includes(effectiveType);

    return saveData || slowConnection;
  } catch {
    return false;
  }
}

function hydrateHeroVideo(video: HTMLVideoElement) {
  if ((video as any).dataset?.loaded === 'true') return;

  const source = video.querySelector('source');
  const src = (source?.getAttribute('data-src') ?? (video as any).dataset?.src) as string | null;
  if (!src) return;

  if (source) {
    source.setAttribute('src', src);
    source.removeAttribute('data-src');
  } else {
    video.setAttribute('src', src);
  }

  (video as any).dataset.loaded = 'true';
  try {
    video.muted = true;
    video.load();
    void video.play();
  } catch {
    // ignore
  }
}

export function HeroVideoEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video.hero-video'));
    if (!videos.length) return;
    if (shouldSkipVideoAutoplay()) return;

    const hydrate = () => {
      for (const v of videos) hydrateHeroVideo(v);
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => hydrate(), { timeout: 1500 });
      return;
    }

    const timeout = setTimeout(hydrate, 1200);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
