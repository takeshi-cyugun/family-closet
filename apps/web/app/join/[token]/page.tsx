"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { lookupInviteToken } from "../../actions/joinFamily";
import { useLanguage } from "../../_lib/LanguageContext";
import { getJoinDictionary } from "../_lib/i18n";
import { JoinForm } from "../_components/JoinForm";

type LookupState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "limit_reached" }
  | { status: "ok"; familyName: string };

export default function JoinPage() {
  const { token } = useParams<{ token: string }>();
  const { language } = useLanguage();
  const t = getJoinDictionary(language);
  const [state, setState] = useState<LookupState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    lookupInviteToken(token).then((result) => {
      if (cancelled) return;
      setState(result.status === "ok" ? { status: "ok", familyName: result.familyName } : { status: result.status });
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-cream px-6 py-16 text-center text-ink">
      <span className="text-5xl">🧺</span>
      <h1 className="mt-4 font-serif text-xl font-bold">{t.heading}</h1>

      {state.status === "loading" && <p className="mt-6 text-sm text-ink-soft">{t.loading}</p>}
      {state.status === "invalid" && <p className="mt-6 text-sm text-red-600 dark:text-red-400">{t.invalid}</p>}
      {state.status === "limit_reached" && (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400">{t.limitReached}</p>
      )}
      {state.status === "ok" && (
        <>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">{t.subheading(state.familyName)}</p>
          <JoinForm token={token} t={t.form} />
        </>
      )}
    </div>
  );
}
