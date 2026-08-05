"use client";

import { Header } from "../_components/Header";
import { BottomNav, BottomNavSpacer } from "../_components/BottomNav";
import { ClothesForm } from "../clothes/_components/ClothesForm";
import { useLanguage } from "../_lib/LanguageContext";
import { getClothesFormDictionary } from "../clothes/_lib/i18n";

export default function NewClothesPage() {
  const { language } = useLanguage();
  const t = getClothesFormDictionary(language);

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-black">
      <Header title={t.headerTitle} />

      <main className="flex-1 px-4 py-6">
        <ClothesForm mode="new" />
      </main>

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
