'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

const SUPPORTED = new Set(['en', 'es']);
const STORAGE_KEY = 'i18nextLng';

export function getStoredLang(): string | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val) {
      const lang = val.slice(0, 2);
      return SUPPORTED.has(lang) ? lang : null;
    }
  } catch { /* localStorage not available */ }
  return null;
}

export function setStoredLang(lang: string) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* noop */ }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(() => i18n.isInitialized);

  useEffect(() => {
    if (!i18n.isInitialized) {
      const handleInit = () => setReady(true);
      i18n.on('initialized', handleInit);
      return () => { i18n.off('initialized', handleInit); };
    }

    // Apply stored language preference after mount — runs only on the client,
    // so server and client always start from 'en' (no hydration mismatch).
    const stored = getStoredLang();
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored);
    }
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
