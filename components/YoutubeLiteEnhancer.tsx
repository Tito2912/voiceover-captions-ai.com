'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function YoutubeLiteEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const player = target?.closest('.youtube-lite') as HTMLElement | null;
      if (!player) return;

      event.preventDefault();

      const videoId = player.getAttribute('data-id');
      if (!videoId) return;
      if (player.querySelector('iframe')) return;

      const videoTitle = player.getAttribute('data-title') || 'YouTube video';

      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
      iframe.title = videoTitle;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';

      player.innerHTML = '';
      player.appendChild(iframe);
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  return null;
}

