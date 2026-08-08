"use client";

import { useState } from "react";
import type { Member } from "../../_lib/clothes";
import { useSettingsLanguage } from "../_lib/LanguageContext";
import { getOrCreateInviteToken } from "../../actions/invite";
import { InviteQrCode } from "./InviteQrCode";

type MemberSectionProps = {
  members: Member[];
  memberLimit: number;
  onMembersChange: (members: Member[]) => void;
};

type InviteTab = "qr" | "url";

export function MemberSection({ members, memberLimit }: MemberSectionProps) {
  const { t } = useSettingsLanguage();

  const atLimit = members.length >= memberLimit;

  const [showInvite, setShowInvite] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [tab, setTab] = useState<InviteTab>("qr");
  const [copied, setCopied] = useState(false);

  async function openInvite() {
    setShowInvite(true);
    setInviteError(null);
    setCopied(false);
    const result = await getOrCreateInviteToken();
    if (!result.success) {
      setInviteError(t.memberSection.qrModal.loadError);
      return;
    }
    setInviteUrl(`${window.location.origin}/join/${result.token}`);
  }

  function closeInvite() {
    setShowInvite(false);
  }

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
  }

  return (
    <>
      <section className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(60,47,43,0.08)]">
        <h2 className="font-serif text-sm font-semibold text-ink">{t.memberSection.heading}</h2>

        <ul className="mt-3 divide-y divide-linen">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between py-2 text-sm">
              <span className="text-ink">{member.name}</span>
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
            onClick={openInvite}
            className="mt-3 w-full rounded-md bg-espresso py-2.5 text-sm font-medium text-on-espresso"
          >
            {t.memberSection.qrButton}
          </button>
        )}
      </section>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={t.memberSection.qrModal.closeButton}
            className="absolute inset-0 bg-black/60"
            onClick={closeInvite}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-cream p-6 text-center shadow-2xl">
            <h2 className="font-serif text-lg font-bold text-ink">{t.memberSection.qrModal.heading}</h2>
            <p className="mt-2 text-xs text-ink-soft">{t.memberSection.qrModal.description}</p>

            {inviteError ? (
              <p className="mt-6 text-sm text-red-600 dark:text-red-400">{inviteError}</p>
            ) : !inviteUrl ? (
              <div className="mt-6 h-60 w-60 mx-auto animate-pulse rounded-md bg-sand" />
            ) : (
              <>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTab("qr")}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      tab === "qr" ? "bg-espresso text-on-espresso" : "bg-sand text-ink-soft"
                    }`}
                  >
                    {t.memberSection.qrModal.qrTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("url")}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      tab === "url" ? "bg-espresso text-on-espresso" : "bg-sand text-ink-soft"
                    }`}
                  >
                    {t.memberSection.qrModal.urlTab}
                  </button>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3">
                  {tab === "qr" ? (
                    <InviteQrCode url={inviteUrl} alt={t.memberSection.qrModal.heading} />
                  ) : (
                    <>
                      <p className="w-full break-all rounded-md border border-linen bg-white px-3 py-2 text-left text-xs text-ink">
                        {inviteUrl}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="w-full rounded-md border border-linen py-2 text-sm font-medium text-ink"
                      >
                        {copied ? t.memberSection.qrModal.copiedNotice : t.memberSection.qrModal.copyButton}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={closeInvite}
              className="mt-6 w-full rounded-md border border-linen py-2.5 text-sm text-ink"
            >
              {t.memberSection.qrModal.closeButton}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
