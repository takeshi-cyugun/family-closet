"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { FamilyIdField } from "./_components/FamilyIdField";
import type { FamilyIdStatus } from "./_components/FamilyIdField";
import { registerFamily } from "../actions/registerFamily";
import { getSettingsData } from "../actions/settings";
import { useLanguage } from "../_lib/LanguageContext";
import { getRegisterDictionary } from "./_lib/i18n";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const MEMBER_ID_PATTERN = /^[a-zA-Z0-9_-]{2,20}$/;

type Plan = "chest" | "walk_in";

type Errors = Partial<
  Record<"email" | "password" | "passwordConfirm" | "familyId" | "memberId" | "displayName" | "agreeTerms", string>
>;

export default function RegisterPage() {
  const { language } = useLanguage();
  const t = getRegisterDictionary(language);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [familyIdStatus, setFamilyIdStatus] = useState<FamilyIdStatus>("idle");
  const [memberId, setMemberId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [plan, setPlan] = useState<Plan>("chest");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [hasGuestSession, setHasGuestSession] = useState(false);
  const [guestItemCount, setGuestItemCount] = useState(0);
  const [migrateGuestData, setMigrateGuestData] = useState(false);

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdFamilyId, setCreatedFamilyId] = useState<string | null>(null);

  useEffect(() => {
    getSettingsData().then((settings) => {
      if (settings?.isGuest) {
        setHasGuestSession(true);
        setGuestItemCount(settings.itemCount);
        setMigrateGuestData(true);
      }
    });
  }, []);

  function validate(): Errors {
    const next: Errors = {};
    if (!EMAIL_PATTERN.test(email)) next.email = t.errors.email;
    if (!PASSWORD_PATTERN.test(password)) next.password = t.errors.password;
    if (password !== passwordConfirm) next.passwordConfirm = t.errors.passwordConfirm;
    if (familyIdStatus !== "available") next.familyId = t.errors.familyId;
    if (!MEMBER_ID_PATTERN.test(memberId)) next.memberId = t.errors.memberId;
    if (!displayName.trim()) next.displayName = t.errors.displayName;
    if (!agreeTerms) next.agreeTerms = t.errors.agreeTerms;
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);

    const result = await registerFamily({
      email,
      password,
      familyId,
      memberId,
      displayName: displayName.trim(),
      plan,
      migrateGuestData: hasGuestSession && migrateGuestData,
    });

    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setCreatedFamilyId(familyId);
  }

  if (createdFamilyId) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center text-ink">
        <p className="text-4xl">📨</p>
        <h1 className="font-serif text-lg font-bold">{t.success.heading}</h1>
        <p className="text-sm text-ink-soft">
          {t.success.familyIdLine(createdFamilyId)}
          <br />
          {t.success.emailLine(email)}
        </p>
        {hasGuestSession && migrateGuestData && (
          <p className="text-sm text-ink-soft">{t.success.migratedNotice(guestItemCount)}</p>
        )}
        <p className="text-xs text-ink-faint">{t.success.confirmNotice}</p>
        <Link
          href="/"
          className="mt-2 rounded-md bg-espresso px-5 py-2.5 text-sm font-medium text-on-espresso"
        >
          {t.success.backToTop}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <header className="flex h-14 items-center bg-espresso px-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-on-espresso">
          {t.headerBrand}
        </Link>
      </header>

      <main className="flex-1 px-4 py-6">
        <h1 className="mb-1 font-serif text-lg font-bold">{t.pageTitle}</h1>
        <p className="mb-6 text-sm text-ink-soft">{t.pageSubtitle}</p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              {t.fields.email.label}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.fields.email.placeholder}
              className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
            />
            {errors.email && <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              {t.fields.password.label}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.fields.password.placeholder}
              className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
            />
            {errors.password && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="passwordConfirm" className="text-sm font-medium text-ink">
              {t.fields.passwordConfirm.label}
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
            />
            {errors.passwordConfirm && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.passwordConfirm}</p>
            )}
          </div>

          <FamilyIdField
            value={familyId}
            onChange={setFamilyId}
            status={familyIdStatus}
            onStatusChange={setFamilyIdStatus}
            t={t.familyId}
          />
          {errors.familyId && (
            <p className="-mt-4 text-xs text-red-600 dark:text-red-400">{errors.familyId}</p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="memberId" className="text-sm font-medium text-ink">
              {t.fields.memberId.label}
            </label>
            <input
              id="memberId"
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder={t.fields.memberId.placeholder}
              autoComplete="off"
              className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
            />
            {errors.memberId && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.memberId}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="displayName" className="text-sm font-medium text-ink">
              {t.fields.displayName.label}
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.fields.displayName.placeholder}
              className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
            />
            {errors.displayName && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.displayName}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-ink">{t.planSection.heading}</span>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                name="plan"
                checked={plan === "chest"}
                onChange={() => setPlan("chest")}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>{t.planSection.chest}</span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                name="plan"
                checked={plan === "walk_in"}
                onChange={() => setPlan("walk_in")}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>{t.planSection.walkIn}</span>
            </label>
          </div>

          {hasGuestSession && (
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={migrateGuestData}
                onChange={(e) => setMigrateGuestData(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>{t.migrateGuestData(guestItemCount)}</span>
            </label>
          )}

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <span>
              {t.agree.prefix}
              <a href="/terms" className="underline">
                {t.agree.terms}
              </a>
              {t.agree.and}
              <a href="/privacy" className="underline">
                {t.agree.privacy}
              </a>
              {t.agree.suffix}
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="-mt-4 text-xs text-red-600 dark:text-red-400">{errors.agreeTerms}</p>
          )}

          {submitError && <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-espresso py-3 text-sm font-semibold text-on-espresso disabled:opacity-50"
          >
            {submitting ? t.submit.creating : t.submit.create}
          </button>
        </form>
      </main>
    </div>
  );
}
