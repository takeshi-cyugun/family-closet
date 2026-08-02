"use client";

import { useState } from "react";
import { Header } from "../_components/Header";
import { BottomNav, BottomNavSpacer } from "../_components/BottomNav";
import { mockMembers } from "../_lib/clothes";
import type { Member } from "../_lib/clothes";
import { AccountInfoCard } from "./_components/AccountInfoCard";
import { GuestBanner } from "./_components/GuestBanner";
import { MemberSection } from "./_components/MemberSection";
import { LanguageSection } from "./_components/LanguageSection";
import { PlanSection } from "./_components/PlanSection";
import { MOCK_IS_GUEST, MOCK_SESSION } from "./_data/mock";
import { SettingsLanguageProvider, useSettingsLanguage } from "./_lib/LanguageContext";

function SettingsPageContent() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const { t } = useSettingsLanguage();

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-black">
      <Header />

      <main className="flex-1 px-4 py-6">
        <h1 className="mb-4 text-lg font-bold">{t.pageTitle}</h1>

        <div className="flex flex-col gap-4">
          {MOCK_IS_GUEST && <GuestBanner />}
          <AccountInfoCard />
          {MOCK_SESSION.role === "admin" && (
            <MemberSection members={members} onMembersChange={setMembers} />
          )}
          <LanguageSection />
          <PlanSection memberCount={members.length} />
        </div>
      </main>

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SettingsLanguageProvider>
      <SettingsPageContent />
    </SettingsLanguageProvider>
  );
}
