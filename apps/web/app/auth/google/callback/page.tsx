"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loginWithGoogle } from "../../../actions/loginGoogle";

type Status = "processing" | "error";

const GENERIC_ERROR_MESSAGE = "Google認証に失敗しました。もう一度お試しください。";

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<Status>("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Supabase(ローカル)はimplicitフローで動作しており、アクセストークンはURLのハッシュ部分で
    // 返ってくる（クエリの?code=ではない）。/auth/confirmedの確認リンク処理と同じ形式。
    const url = new URL(window.location.href);
    const plan = url.searchParams.get("plan") === "walk_in" ? "walk_in" : "chest";

    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(rawHash);
    const accessToken = hashParams.get("access_token");
    const errorDescription = hashParams.get("error_description") ?? url.searchParams.get("error_description");

    if (errorDescription) {
      setStatus("error");
      setErrorMessage(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
      return;
    }

    if (!accessToken) {
      setStatus("error");
      setErrorMessage(GENERIC_ERROR_MESSAGE);
      return;
    }

    // 成功時はloginWithGoogle内でredirect('/list')するため、ここに結果が返ってくるのは失敗時のみ
    loginWithGoogle(accessToken, plan).then((result) => {
      setStatus("error");
      setErrorMessage(result.error);
    });
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center text-ink">
      {status === "processing" && (
        <>
          <p className="text-4xl">⏳</p>
          <h1 className="font-serif text-lg font-bold">Googleアカウントを確認しています...</h1>
        </>
      )}

      {status === "error" && (
        <>
          <p className="text-4xl">⚠️</p>
          <h1 className="font-serif text-lg font-bold">ログインできませんでした</h1>
          <p className="text-sm text-ink-soft">{errorMessage}</p>
          <Link
            href="/signup"
            className="mt-2 rounded-md bg-espresso px-5 py-2.5 text-sm font-medium text-on-espresso"
          >
            サインアップ画面へ
          </Link>
        </>
      )}
    </div>
  );
}
