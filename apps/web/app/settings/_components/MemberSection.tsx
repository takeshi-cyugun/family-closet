"use client";

import { useState, type FormEvent } from "react";
import { addMember } from "../../actions/addMember";
import { getFamilyMembers } from "../../actions/members";
import type { Member } from "../../_lib/clothes";
import { useSettingsLanguage } from "../_lib/LanguageContext";

const MEMBER_ID_PATTERN = /^[a-zA-Z0-9_-]{2,20}$/;

type MemberSectionProps = {
  members: Member[];
  memberLimit: number;
  onMembersChange: (members: Member[]) => void;
};

export function MemberSection({ members, memberLimit, onMembersChange }: MemberSectionProps) {
  const { t } = useSettingsLanguage();
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [issued, setIssued] = useState<{ memberId: string; password: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const atLimit = members.length >= memberLimit;

  async function handleSubmit(e: FormEvent) {
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
    if (members.some((member) => member.memberId === memberId)) {
      setError(t.memberSection.errors.duplicateMemberId);
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await addMember({ memberId, displayName: name.trim() });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    const refreshed = await getFamilyMembers();
    onMembersChange(refreshed);
    setIssued({ memberId: result.memberId, password: result.password });
    setName("");
    setMemberId("");
  }

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
          <p className="mt-3 text-xs text-ink-soft">{t.memberSection.limitReached}</p>
        ) : (
          <form className="mt-3 flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1">
              <label htmlFor="newMemberName" className="text-sm font-medium text-ink">
                {t.memberSection.displayNameLabel}
              </label>
              <input
                id="newMemberName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.memberSection.displayNamePlaceholder}
                className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="newMemberId" className="text-sm font-medium text-ink">
                {t.memberSection.memberIdLabel}
              </label>
              <input
                id="newMemberId"
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder={t.memberSection.memberIdPlaceholder}
                autoComplete="off"
                className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
              />
            </div>
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-espresso py-2.5 text-sm font-medium text-on-espresso disabled:opacity-50"
            >
              {submitting ? "追加中..." : t.memberSection.submitButton}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
