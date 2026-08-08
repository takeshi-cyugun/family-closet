"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { joinFamily } from "../../actions/joinFamily";
import type { JoinDictionary } from "../_lib/i18n";

type JoinFormProps = {
  token: string;
  t: JoinDictionary["form"];
};

export function JoinForm({ token, t }: JoinFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) {
      setError(t.nameRequired);
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await joinFamily(token, displayName);

    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/list");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-xs flex-col gap-3 text-left">
      <div className="flex flex-col gap-1">
        <label htmlFor="displayName" className="text-sm font-medium text-ink">
          {t.nameLabel}
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t.namePlaceholder}
          autoFocus
          className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
        />
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-md bg-espresso py-3 text-sm font-semibold text-on-espresso disabled:opacity-50"
      >
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
