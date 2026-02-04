"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations, type Locale, type TranslationKey } from "../lib/i18n";

const STORAGE_KEY = "orgopivy_locale";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "fr" ? "fr" : "en";
  } catch {
    return "en";
  }
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLocaleState(getStoredLocale());
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {}
  }

  function t(key: TranslationKey): string {
    return translations[locale][key] ?? translations.en[key] ?? key;
  }

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      t: (key: TranslationKey) => translations.en[key] ?? key,
    };
  }
  return ctx;
}
