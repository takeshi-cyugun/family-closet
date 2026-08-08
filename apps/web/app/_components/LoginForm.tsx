"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginFamily } from "../actions/login";
import type { HomeDictionary } from "../_lib/homeI18n";

const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 5 * 60;

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type LoginFormProps = {
  t: HomeDictionary["loginForm"];
};

export function LoginForm({ t }: LoginFormProps) {
  const router = useRouter();
  const [familyId, setFamilyId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

  useEffect(() => {
    if (lockSecondsLeft <= 0) return;
    const timer = setTimeout(() => setLockSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [lockSecondsLeft]);

  const locked = lockSecondsLeft > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (locked) return;
    setError(null);

    if (!familyId.trim() || !memberId.trim() || !password) {
      setError(t.missingFields);
      return;
    }

    const trimmedFamilyId = familyId.trim();
    const trimmedMemberId = memberId.trim();

    setSubmitting(true);
    const result = await loginFamily(trimmedFamilyId, trimmedMemberId, password);
    setSubmitting(false);

    if (!result.success) {
      const nextFailCount = failCount + 1;
      setFailCount(nextFailCount);
      if (nextFailCount >= MAX_ATTEMPTS) {
        setLockSecondsLeft(LOCK_SECONDS);
      }
      setError(result.error);
      return;
    }

    setFailCount(0);

    if (result.firstLogin) {
      router.push("/change-password");
    } else {
      router.push("/list");
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="loginFamilyId" className="text-sm font-medium text-ink">
          {t.familyId}
        </label>
        <input
          id="loginFamilyId"
          type="text"
          value={familyId}
          onChange={(e) => setFamilyId(e.target.value)}
          disabled={locked}
          autoComplete="off"
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="loginMemberId" className="text-sm font-medium text-ink">
          {t.memberId}
        </label>
        <input
          id="loginMemberId"
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          disabled={locked}
          autoComplete="off"
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="loginPassword" className="text-sm font-medium text-ink">
          {t.password}
        </label>
        <input
          id="loginPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={locked}
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink disabled:opacity-50"
        />
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting || locked}
        className="mt-1 rounded-md bg-espresso py-2.5 text-sm font-semibold text-on-espresso disabled:opacity-50"
      >
        {locked ? t.locked(formatCountdown(lockSecondsLeft)) : submitting ? t.loggingIn : t.login}
      </button>
    </form>
  );
}
