"use client";

import type { Member } from "../../_lib/clothes";
import { useSettingsLanguage } from "../_lib/LanguageContext";

type MemberSectionProps = {
  members: Member[];
  memberLimit: number;
  onMembersChange: (members: Member[]) => void;
};

export function MemberSection({ members, memberLimit }: MemberSectionProps) {
  const { t } = useSettingsLanguage();

  const atLimit = members.length >= memberLimit;

  return (
    <>
      <section className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(60,47,43,0.08)]">
        <h2 className="font-serif text-sm font-semibold text-ink">{t.memberSection.heading}</h2>

        <ul className="mt-3 divide-y divide-linen">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-ink">
                {member.name}
                <span className="ml-1.5 text-ink-soft">({member.memberId})</span>
              </span>
              <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-ink-soft">
                {t.memberSection.role[member.role]}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs text-ink-soft">
          {t.memberSection.countLabel(members.length, memberLimit)}
        </p>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(60,47,43,0.08)]">
        <h2 className="font-serif text-sm font-semibold text-ink">{t.memberSection.submitButton}</h2>

        {atLimit ? (
          <p className="mt-3 text-xs text-ink-soft">{t.memberSection.limitReached}</p>
        ) : (
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-espresso py-2.5 text-sm font-medium text-on-espresso"
          >
            {t.memberSection.qrButton}
          </button>
        )}
      </section>
    </>
  );
}
