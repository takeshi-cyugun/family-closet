"use client";

import Link from "next/link";
import { Check, Infinity as InfinityIcon, Mail, Shirt } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useLanguage } from "../_lib/LanguageContext";
import { getSignupDictionary } from "./_lib/i18n";
import { signupOwner } from "../actions/signupOwner";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

type Step = "choose" | "email";
type Plan = "chest" | "walk_in";

type Errors = Partial<Record<"email" | "password" | "passwordConfirm", string>>;

function AnimatedPanel({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div
        className={`overflow-hidden transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100 delay-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const { language } = useLanguage();
  const t = getSignupDictionary(language);

  const [step, setStep] = useState<Step>("choose");
  const [googleNotice, setGoogleNotice] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [plan, setPlan] = useState<Plan>("chest");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChooseEmail() {
    setGoogleNotice(false);
    setStep("email");
  }

  function handleChooseGoogle() {
    setGoogleNotice(true);
  }

  function handleBack() {
    setStep("choose");
    setErrors({});
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!EMAIL_PATTERN.test(email)) next.email = t.emailStep.errors.email;
    if (!PASSWORD_PATTERN.test(password)) next.password = t.emailStep.errors.password;
    if (password !== passwordConfirm) next.passwordConfirm = t.emailStep.errors.passwordConfirm;
    return next;
  }

  const isFormValid = Object.keys(validate()).length === 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setSubmitting(true);
    const result = await signupOwner({ email, password, plan });
    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center text-ink">
        <Mail size={40} className="text-espresso" aria-hidden />
        <h1 className="font-serif text-lg font-bold">{t.success.heading}</h1>
        <p className="text-sm text-ink-soft">{t.success.emailLine(email)}</p>
        <p className="text-xs text-ink-faint">{t.success.trialNotice}</p>
        <Link
          href="/"
          className="mt-2 rounded-md bg-espresso px-5 py-2.5 text-sm font-medium text-on-espresso"
        >
          {t.success.loginButton}
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

        <AnimatedPanel open={step === "choose"}>
          <div className="flex flex-col gap-3 pb-1">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                {t.agree.prefix}
                <Link href="/terms" className="underline">
                  {t.agree.terms}
                </Link>
                {t.agree.and}
                <Link href="/privacy" className="underline">
                  {t.agree.privacy}
                </Link>
                {t.agree.suffix}
              </span>
            </label>

            <div className="mt-6 flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">{t.emailStep.planSection.heading}</span>

              <div role="radiogroup" className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  role="radio"
                  aria-checked={plan === "chest"}
                  onClick={() => setPlan("chest")}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-8 text-center transition-colors ${
                    plan === "chest" ? "border-espresso bg-sand" : "border-linen bg-white"
                  }`}
                >
                  {plan === "chest" && (
                    <span
                      aria-hidden
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-espresso text-on-espresso"
                    >
                      <Check size={12} />
                    </span>
                  )}
                  <Shirt size={36} aria-hidden />
                  <span className="text-sm font-medium text-ink">{t.emailStep.planSection.chestName}</span>
                  <span className="text-xs text-ink-soft">{t.emailStep.planSection.chestDescription}</span>
                  <span className="text-base font-bold text-ink">{t.emailStep.planSection.chestPrice}</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={plan === "walk_in"}
                  onClick={() => setPlan("walk_in")}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border px-3 py-8 text-center transition-colors ${
                    plan === "walk_in" ? "border-espresso bg-sand" : "border-linen bg-white"
                  }`}
                >
                  {plan === "walk_in" && (
                    <span
                      aria-hidden
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-espresso text-on-espresso"
                    >
                      <Check size={12} />
                    </span>
                  )}
                  <InfinityIcon size={36} aria-hidden />
                  <span className="text-sm font-medium text-ink">{t.emailStep.planSection.walkInName}</span>
                  <span className="text-xs text-ink-soft">{t.emailStep.planSection.walkInDescription}</span>
                  <span className="text-base font-bold text-ink">{t.emailStep.planSection.walkInPrice}</span>
                </button>
              </div>
            </div>

            <span className="mt-6 block text-sm font-medium text-ink">{t.methodChoice.heading}</span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleChooseEmail}
                disabled={!agreeTerms}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-linen bg-white px-3 py-8 text-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Mail size={36} aria-hidden />
                <span className="text-sm font-medium text-ink">{t.methodChoice.emailButton}</span>
                <span className="text-xs text-ink-soft">{t.methodChoice.emailDescription}</span>
              </button>

              <button
                type="button"
                onClick={handleChooseGoogle}
                disabled={!agreeTerms}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-linen bg-white px-3 py-8 text-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-base font-bold text-cream"
                >
                  G
                </span>
                <span className="text-sm font-medium text-ink">{t.methodChoice.googleButton}</span>
                <span className="text-xs text-ink-soft">{t.methodChoice.googleDescription}</span>
              </button>
            </div>

            {googleNotice && <p className="text-xs text-ink-faint">{t.methodChoice.googlePlaceholder}</p>}
          </div>
        </AnimatedPanel>

        <AnimatedPanel open={step === "email"}>
          <form className="flex flex-col gap-4 pt-1" onSubmit={handleSubmit} noValidate>
            <button
              type="button"
              onClick={handleBack}
              className="flex w-fit items-center gap-1 text-sm text-ink-soft hover:text-ink"
            >
              <span aria-hidden>←</span>
              {t.emailStep.back}
            </button>

            <div className="flex flex-col gap-1">
              <label htmlFor="signup-email" className="text-sm font-medium text-ink">
                {t.emailStep.fields.email.label}
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailStep.fields.email.placeholder}
                className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
              />
              {errors.email && <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="signup-password" className="text-sm font-medium text-ink">
                {t.emailStep.fields.password.label}
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.emailStep.fields.password.placeholder}
                className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
              />
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="signup-password-confirm" className="text-sm font-medium text-ink">
                {t.emailStep.fields.passwordConfirm.label}
              </label>
              <input
                id="signup-password-confirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
              />
              {errors.passwordConfirm && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.passwordConfirm}</p>
              )}
            </div>

            {submitError && <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting || !isFormValid}
              className="mt-2 rounded-md bg-espresso py-3 text-sm font-semibold text-on-espresso disabled:opacity-50"
            >
              {submitting ? t.emailStep.submit.submitting : t.emailStep.submit.idle}
            </button>
          </form>
        </AnimatedPanel>
      </main>
    </div>
  );
}
