"use client";

import { useEffect, useState } from "react";
import { Header } from "../_components/Header";
import { BottomNav, BottomNavSpacer } from "../_components/BottomNav";
import type { Member } from "../_lib/clothes";
import { getFamilyMembers } from "../actions/members";
import { getSettingsData } from "../actions/settings";
import type { SettingsData } from "../actions/settings";
import { PLAN_LIMITS } from "./_data/constants";
import { AccountInfoCard } from "./_components/AccountInfoCard";
import { GuestBanner } from "./_components/GuestBanner";
import { MemberSection } from "./_components/MemberSection";
import { LanguageSection } from "./_components/LanguageSection";
import { PlanSection } from "./_components/PlanSection";
import { SettingsLanguageProvider, useSettingsLanguage } from "./_lib/LanguageContext";

function SettingsPageContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useSettingsLanguage();

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSettingsData(), getFamilyMembers()]).then(([data, familyMembers]) => {
      if (cancelled) return;
      setSettings(data);
      setMembers(familyMembers);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col bg-cream text-ink">
        <Header title={t.headerTitle} />
        <main className="flex flex-1 items-center justify-center px-4 py-6 text-sm text-ink-soft">
          {t.loading}
        </main>
        <BottomNavSpacer />
        <BottomNav />
      </div>
    );
  }

  if (!settings) {
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

  const limits = PLAN_LIMITS[settings.planTier];

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <Header title={t.headerTitle} />

      <main className="flex-1 px-4 py-6">
        <h1 className="mb-4 font-serif text-lg font-bold">{t.pageTitle}</h1>

        <div className="flex flex-col gap-4">
          {settings.isGuest && settings.guestDaysLeft !== null && (
            <GuestBanner daysLeft={settings.guestDaysLeft} />
          )}
          <AccountInfoCard
            familyName={settings.familyName}
            memberName={settings.memberName}
            onFamilyNameChange={(name) =>
              setSettings((prev) => (prev ? { ...prev, familyName: name } : prev))
            }
            onMemberNameChange={(name) => {
              setSettings((prev) => (prev ? { ...prev, memberName: name } : prev));
              setMembers((prev) =>
                prev.map((member) => (member.id === settings.memberDbId ? { ...member, name } : member))
              );
            }}
          />
          {settings.role === "admin" && (
            <MemberSection
              members={members}
              memberLimit={limits.memberLimit}
              onMembersChange={setMembers}
            />
          )}
          <LanguageSection />
        </div>

        <h1 className="mb-4 mt-6 font-serif text-lg font-bold">{t.planSection.heading}</h1>

        <div className="flex flex-col gap-4">
          <PlanSection
            tier={settings.planTier}
            memberCount={members.length}
            memberLimit={limits.memberLimit}
            itemCount={settings.itemCount}
            itemLimit={limits.itemLimit}
          />
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
