'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../lib/i18n/config';

type Language = 'en' | 'ar-EG';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  changeLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>('ar-EG');
  const [direction, setDirection] = useState<Direction>('rtl');

  useEffect(() => {
    const normalizeLanguage = (lng: string | null | undefined): Language =>
      lng === 'ar-EG' || lng === 'ar' ? 'ar-EG' : 'en';

    const applyLanguage = (lang: Language) => {
      setLanguage(lang);
      const newDir = lang === 'ar-EG' ? 'rtl' : 'ltr';
      setDirection(newDir);

      document.documentElement.dir = newDir;
      document.documentElement.lang = lang === 'ar-EG' ? 'ar' : 'en';
    };

    const handleLanguageChange = (lng: string) => {
      applyLanguage(normalizeLanguage(lng));
    };

    const storedLangRaw =
      typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
    const storedLang =
      storedLangRaw === null ? null : normalizeLanguage(storedLangRaw);
    const initialLang: Language = storedLang ?? 'ar-EG';

    applyLanguage(initialLang);

    if (!storedLang && typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', initialLang);
    }

    if (i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang);
    }

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = async (lang: Language) => {
    await i18n.changeLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{ language, direction, changeLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
