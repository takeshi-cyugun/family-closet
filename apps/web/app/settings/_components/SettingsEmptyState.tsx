"use client";

import { Header } from "../../_components/Header";
import { BottomNav, BottomNavSpacer } from "../../_components/BottomNav";
import { SettingsLanguageProvider, useSettingsLanguage } from "../_lib/LanguageContext";

function EmptyStateContent() {
  const { t } = useSettingsLanguage();

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <Header title={t.headerTitle} />
      <main className="flex flex-1 items-center justify-center px-4 py-6 text-center text-sm text-ink-soft">
        まだファミリーが作成されていません。洋服を登録するとファミリーが作成されます。
      </main>
      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}

// ゲストが一度も/items/createを訪れておらず、まだfamiliesレコードが作られていない場合の案内
export function SettingsEmptyState() {
  return (
    <SettingsLanguageProvider>
      <EmptyStateContent />
    </SettingsLanguageProvider>
  );
}
