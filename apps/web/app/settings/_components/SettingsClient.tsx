"use client";

import { useState } from "react";
import { Header } from "../../_components/Header";
import { useCurrentMember } from "../../_lib/MemberContext";
import { BottomNav, BottomNavSpacer } from "../../_components/BottomNav";
import type { Member } from "../../_lib/clothes";
import type { SettingsData } from "../../actions/settings";
import { PLAN_LIMITS } from "../_data/constants";
import { AccountInfoCard } from "./AccountInfoCard";
import { GuestBanner } from "./GuestBanner";
import { MemberSection } from "./MemberSection";
import { LanguageSection } from "./LanguageSection";
import { PlanSection } from "./PlanSection";
import { SettingsLanguageProvider, useSettingsLanguage } from "../_lib/LanguageContext";

type SettingsClientProps = {
  initialData: SettingsData;
};

function SettingsPageContent({ initialData }: SettingsClientProps) {
  const [members, setMembers] = useState<Member[]>(initialData.members);
  const [settings, setSettings] = useState(initialData);
  const { t } = useSettingsLanguage();
  const { setMemberName: setHeaderMemberName } = useCurrentMember();

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
              setSettings((prev) => ({ ...prev, familyName: name }))
            }
            onMemberNameChange={(name) => {
              setSettings((prev) => ({ ...prev, memberName: name }));
              setMembers((prev) =>
                prev.map((member) => (member.id === settings.memberDbId ? { ...member, name } : member))
              );
              setHeaderMemberName(name);
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
            canUpgrade={settings.role === "admin"}
          />
        </div>
      </main>

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}

export function SettingsClient({ initialData }: SettingsClientProps) {
  return (
    <SettingsLanguageProvider>
      <SettingsPageContent initialData={initialData} />
    </SettingsLanguageProvider>
  );
}
