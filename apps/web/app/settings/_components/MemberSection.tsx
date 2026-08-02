"use client";

import { useState, type FormEvent } from "react";
import { addMember, mockMembers } from "../../_lib/clothes";
import type { Member } from "../../_lib/clothes";
import { MOCK_PLAN, issueInitialPassword } from "../_data/mock";
import { useSettingsLanguage } from "../_lib/LanguageContext";

const MEMBER_ID_PATTERN = /^[a-zA-Z0-9_-]{2,20}$/;

type MemberSectionProps = {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
};

export function MemberSection({ members, onMembersChange }: MemberSectionProps) {
  const { t } = useSettingsLanguage();
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [issued, setIssued] = useState<{ memberId: string; password: string } | null>(null);

  const atLimit = members.length >= MOCK_PLAN.memberLimit;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIssued(null);

    if (!name.trim()) {
      setError(t.memberSection.errors.nameRequired);
      return;
    }
    if (!MEMBER_ID_PATTERN.test(memberId)) {
      setError(t.memberSection.errors.invalidMemberId);
      return;
    }
    if (members.some((member) => member.id === memberId)) {
      setError(t.memberSection.errors.duplicateMemberId);
      return;
    }

    const created = addMember({ id: memberId, name: name.trim() });
    const password = issueInitialPassword();
    onMembersChange([...mockMembers]);
    setIssued({ memberId: created.id, password });
    setError(null);
    setName("");
    setMemberId("");
  }

  return (
    <section className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <h2 className="text-sm font-semibold">{t.memberSection.heading}</h2>

      <ul className="mt-3 divide-y divide-black/10 dark:divide-white/10">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between py-2 text-sm">
            <span>
              {member.name}
              <span className="ml-1.5 text-neutral-500 dark:text-neutral-400">({member.id})</span>
            </span>
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
              {t.memberSection.role[member.role]}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {t.memberSection.countLabel(members.length, MOCK_PLAN.memberLimit)}
      </p>

      {issued && (
        <div className="mt-3 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/40">
          <p className="text-emerald-800 dark:text-emerald-300">
            {t.memberSection.addedNotice(issued.memberId)}
          </p>
          <p className="mt-1 text-emerald-800 dark:text-emerald-300">
            {t.memberSection.initialPasswordLabel}
            <span className="font-mono font-semibold">{issued.password}</span>
          </p>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
            {t.memberSection.passwordNotice}
          </p>
        </div>
      )}

      {atLimit ? (
        <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
          {t.memberSection.limitReached}
        </p>
      ) : (
        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="newMemberName" className="text-sm font-medium">
              {t.memberSection.displayNameLabel}
            </label>
            <input
              id="newMemberName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.memberSection.displayNamePlaceholder}
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="newMemberId" className="text-sm font-medium">
              {t.memberSection.memberIdLabel}
            </label>
            <input
              id="newMemberId"
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder={t.memberSection.memberIdPlaceholder}
              autoComplete="off"
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
            />
          </div>
          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            className="rounded-md border border-black/10 py-2.5 text-sm font-medium dark:border-white/15"
          >
            {t.memberSection.submitButton}
          </button>
        </form>
      )}
    </section>
  );
}
