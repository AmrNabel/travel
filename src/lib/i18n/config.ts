import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import arEGTranslation from './locales/ar-EG/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  'ar-EG': {
    translation: arEGTranslation,
  },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'ar-EG',
    supportedLngs: ['en', 'ar-EG'],
    debug: process.env.NODE_ENV === 'development',

    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
