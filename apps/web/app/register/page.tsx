"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { FamilyIdField } from "./_components/FamilyIdField";
import type { FamilyIdStatus } from "./_components/FamilyIdField";
import { registerFamily } from "../actions/registerFamily";
import { getSettingsData } from "../actions/settings";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const MEMBER_ID_PATTERN = /^[a-zA-Z0-9_-]{2,20}$/;

type Plan = "chest" | "walk_in";

type Errors = Partial<
  Record<"email" | "password" | "passwordConfirm" | "familyId" | "memberId" | "displayName" | "agreeTerms", string>
>;

export default function RegisterPage() {
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
    if (!EMAIL_PATTERN.test(email)) next.email = "有効なメールアドレスを入力してください";
    if (!PASSWORD_PATTERN.test(password))
      next.password = "8文字以上の英数字混合で入力してください";
    if (password !== passwordConfirm) next.passwordConfirm = "パスワードが一致しません";
    if (familyIdStatus !== "available") next.familyId = "利用可能なファミリーIDを入力してください";
    if (!MEMBER_ID_PATTERN.test(memberId))
      next.memberId = "半角英数字・アンダースコア・ハイフンで2〜20文字";
    if (!displayName.trim()) next.displayName = "表示名を入力してください";
    if (!agreeTerms) next.agreeTerms = "利用規約とプライバシーポリシーへの同意が必要です";
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
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center dark:bg-black">
        <p className="text-4xl">📨</p>
        <h1 className="text-lg font-bold">ファミリーを作成しました</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          ファミリーID「{createdFamilyId}」を作成しました。
          <br />
          {email} 宛に確認メールを送信しましたので、メール内のリンクをクリックしてください。
        </p>
        {hasGuestSession && migrateGuestData && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            お試し利用中の洋服データ{guestItemCount}着を引き継ぎました。
          </p>
        )}
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          メール確認が完了するまでログインできません。
        </p>
        <Link
          href="/"
          className="mt-2 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          トップに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-black">
      <header className="flex h-14 items-center border-b border-black/10 px-4 dark:border-white/10">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ファミリークロゼット
        </Link>
      </header>

      <main className="flex-1 px-4 py-6">
        <h1 className="mb-1 text-lg font-bold">ファミリーを新規作成</h1>
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
          代表者アカウントを作成します。
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              代表者メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
            />
            {errors.email && <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              代表者パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上の英数字混合"
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
            />
            {errors.password && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="passwordConfirm" className="text-sm font-medium">
              パスワード(確認用)
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
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
          />
          {errors.familyId && (
            <p className="-mt-4 text-xs text-red-600 dark:text-red-400">{errors.familyId}</p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="memberId" className="text-sm font-medium">
              代表者メンバーID
            </label>
            <input
              id="memberId"
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="例: dad, taro"
              autoComplete="off"
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
            />
            {errors.memberId && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.memberId}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="displayName" className="text-sm font-medium">
              代表者表示名
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例: パパ"
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
            />
            {errors.displayName && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.displayName}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">プラン選択</span>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                name="plan"
                checked={plan === "chest"}
                onChange={() => setPlan("chest")}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                チェストプラン（無料・メンバー5人まで・50着まで）
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="radio"
                name="plan"
                checked={plan === "walk_in"}
                onChange={() => setPlan("walk_in")}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                ウォークインプラン（有料・メンバー数/着数無制限）
              </span>
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
              <span>
                お試し利用中のデータ({guestItemCount}着)を引き継ぐ
              </span>
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
              <a href="/terms" className="underline">利用規約</a>および
              <a href="/privacy" className="underline">プライバシーポリシー</a>に同意する
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="-mt-4 text-xs text-red-600 dark:text-red-400">{errors.agreeTerms}</p>
          )}

          {submitError && <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-black py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {submitting ? "作成中..." : "ファミリーを作成して始める"}
          </button>
        </form>
      </main>
    </div>
  );
}
