"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLanguage } from "../../_lib/LanguageContext";
import type { LanguageCode } from "../../_lib/i18n";
import { SETTINGS_DICTIONARIES, type SettingsDictionary } from "./i18n";

type SettingsLanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: SettingsDictionary;
};

const SettingsLanguageContext = createContext<SettingsLanguageContextValue | null>(null);

export function SettingsLanguageProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage();

  return (
    <SettingsLanguageContext.Provider
      value={{ language, setLanguage, t: SETTINGS_DICTIONARIES[language] ?? SETTINGS_DICTIONARIES.ja }}
    >
      {children}
    </SettingsLanguageContext.Provider>
  );
}

export function useSettingsLanguage() {
  const ctx = useContext(SettingsLanguageContext);
  if (!ctx) {
    throw new Error("useSettingsLanguage must be used within SettingsLanguageProvider");
  }
  return ctx;
}
