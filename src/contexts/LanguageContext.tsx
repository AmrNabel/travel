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
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    // Get initial language from i18n
    const currentLang = (i18n.language || 'en') as Language;
    setLanguage(currentLang);
    setDirection(currentLang === 'ar-EG' ? 'rtl' : 'ltr');

    // Update HTML dir and lang attributes
    document.documentElement.dir = currentLang === 'ar-EG' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang === 'ar-EG' ? 'ar' : 'en';
  }, [i18n.language]);

  const changeLanguage = async (lang: Language) => {
    await i18n.changeLanguage(lang);
    setLanguage(lang);
    const newDir = lang === 'ar-EG' ? 'rtl' : 'ltr';
    setDirection(newDir);

    // Update HTML attributes
    document.documentElement.dir = newDir;
    document.documentElement.lang = lang === 'ar-EG' ? 'ar' : 'en';

    // Store preference
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, direction, changeLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

