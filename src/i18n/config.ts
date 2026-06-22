import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

// Always initialize with 'en' so server and client produce the same HTML.
// Stored language preference is applied after mount in I18nProvider.
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
