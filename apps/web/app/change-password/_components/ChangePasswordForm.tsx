"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { clearForcePasswordChange, getPendingLogin } from "../../_lib/session";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

type Errors = Partial<Record<"currentPassword" | "newPassword" | "newPasswordConfirm", string>>;

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    const pending = getPendingLogin();

    if (!currentPassword) {
      next.currentPassword = "現在のパスワードを入力してください";
    } else if (pending && currentPassword !== pending.currentPassword) {
      next.currentPassword = "現在のパスワードが正しくありません";
    }

    if (!PASSWORD_PATTERN.test(newPassword)) {
      next.newPassword = "8文字以上の英数字混合で入力してください";
    }
    if (newPassword !== newPasswordConfirm) {
      next.newPasswordConfirm = "新しいパスワードが一致しません";
    }

    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);

    clearForcePasswordChange();
    router.push("/dashboard");
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="currentPassword" className="text-sm font-medium">
          現在のパスワード
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
        {errors.currentPassword && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.currentPassword}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="newPassword" className="text-sm font-medium">
          新しいパスワード
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="8文字以上の英数字混合"
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
        {errors.newPassword && <p className="text-xs text-red-600 dark:text-red-400">{errors.newPassword}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="newPasswordConfirm" className="text-sm font-medium">
          新しいパスワード（確認用）
        </label>
        <input
          id="newPasswordConfirm"
          type="password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
        {errors.newPasswordConfirm && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.newPasswordConfirm}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-md bg-black py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {submitting ? "変更中..." : "パスワードを変更して利用開始"}
      </button>
    </form>
  );
}
