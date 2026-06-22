'use client';

import { useTranslation } from 'react-i18next';
import { setStoredLang } from '@/components/I18nProvider';

const LANGS = ['en', 'es'] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.slice(0, 2) ?? 'en';

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setStoredLang(lang);
  };

  return (
    <div className="inline-flex bg-white/60 backdrop-blur-sm rounded-full p-1 gap-1 shadow-sm">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLang(lang)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
            current === lang
              ? 'bg-seed-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {t(`language.${lang}`)}
        </button>
      ))}
    </div>
  );
}
