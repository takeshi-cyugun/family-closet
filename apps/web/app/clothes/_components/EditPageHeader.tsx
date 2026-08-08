"use client";

import { Header } from "../../_components/Header";
import { useLanguage } from "../../_lib/LanguageContext";
import { getClothesFormDictionary } from "../_lib/i18n";

export function EditPageHeader() {
  const { language } = useLanguage();
  const t = getClothesFormDictionary(language);

  return <Header title={t.editHeaderTitle} />;
}
