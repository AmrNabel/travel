'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function SEOUpdater() {
  const { t, language } = useLanguage() as { t: (k: string) => string; language: string };

  useEffect(() => {
    const title = `${t('common.appName')} — ${t('home.hero.title')}`;
    const description = t('common.seoDescription');

    if (typeof document !== 'undefined') {
      document.title = title;

      let meta = document.querySelector("meta[name='description']") as
        | HTMLMetaElement
        | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;

      // ensure favicon link exists (use the svg we add in public)
      const ensureFavicon = (rel: string) => {
        let link = document.querySelector(
          `link[rel='${rel}'][href='/favicon.svg']`
        ) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement('link');
          link.rel = rel as any;
          link.href = '/favicon.svg';
          document.head.appendChild(link);
        }
      };
      ensureFavicon('icon');
      ensureFavicon('shortcut icon');
      ensureFavicon('apple-touch-icon');
    }
  }, [t, language]);

  return null;
}


