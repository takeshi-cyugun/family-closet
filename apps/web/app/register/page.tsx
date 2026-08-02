"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FamilyIdField } from "./_components/FamilyIdField";
import type { FamilyIdStatus } from "./_components/FamilyIdField";
import { MOCK_GUEST_ITEM_COUNT, MOCK_HAS_GUEST_SESSION } from "./_data/mock";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const MEMBER_ID_PATTERN = /^[a-zA-Z0-9_-]{2,20}$/;

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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [migrateGuestData, setMigrateGuestData] = useState(MOCK_HAS_GUEST_SESSION);

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdFamilyId, setCreatedFamilyId] = useState<string | null>(null);

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

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
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
          {email} 宛に本人確認用のメールを送信しましたので、メール内のリンクをご確認ください。
        </p>
        {migrateGuestData && MOCK_HAS_GUEST_SESSION && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            お試し利用中の洋服データ{MOCK_GUEST_ITEM_COUNT}着を引き継ぎました。
          </p>
        )}
        <Link
          href="/dashboard"
          className="mt-2 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          ダッシュボードへ進む
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

          {MOCK_HAS_GUEST_SESSION && (
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={migrateGuestData}
                onChange={(e) => setMigrateGuestData(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                お試し利用中のデータ({MOCK_GUEST_ITEM_COUNT}着)を引き継ぐ
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
