import React, { createContext, useContext, useState, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslations from '@/locales/fr.json';
import arTranslations from '@/locales/ar.json';

type Language = 'fr' | 'ar';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Get initial language from localStorage or default to 'fr'
const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('language');
  if (saved === 'ar' || saved === 'fr') return saved;
  return 'fr';
};

const initialLanguage = getInitialLanguage();

// Fix import paths for translation files if alias '@' does not work
// Try relative imports if you get module not found errors
// import frTranslations from '../locales/fr.json';
// import arTranslations from '../locales/ar.json';
// If you use Vite/CRA alias '@', keep as is, otherwise use relative path
let frTranslationsResolved = frTranslations;
let arTranslationsResolved = arTranslations;

// If import fails, fallback to empty object (prevents runtime crash)
if (!frTranslationsResolved) frTranslationsResolved = {};
if (!arTranslationsResolved) arTranslationsResolved = {};

i18next
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslationsResolved },
      ar: { translation: arTranslationsResolved }
    },
    lng: initialLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    i18next.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    // Ensure HTML dir/lang are correct on mount
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t: (key: string) => i18next.t(key)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};