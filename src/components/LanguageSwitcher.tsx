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
    <div data-sheet className="sheet-gradient inline-flex rounded-md p-1 gap-1">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLang(lang)}
          className={`px-3.5 py-1.5 text-base font-semibold rounded transition-colors duration-200 ${
            current === lang
              ? 'bg-seed-600 text-white'
              : 'text-slate-600 hover:bg-seed-600/10 hover:text-seed-700'
          }`}
        >
          {t(`language.${lang}`)}
        </button>
      ))}
    </div>
  );
}
