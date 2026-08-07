"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { completeOwnerSignup } from "../../actions/completeOwnerSignup";

type Status = "processing" | "success" | "error";

const MISSING_TOKEN_MESSAGE =
  "確認情報が見つかりませんでした。メール内のリンクからアクセスしてください。";

export default function EmailConfirmedPage() {
  // 確認リンクのトークンはURLのハッシュ部分にあり、サーバーからは見えない
  // （ハッシュはHTTPリクエストに含まれない）ため、SSR/CSRの初期描画は必ず
  // "processing" で揃え、実際の判定と作成処理はeffect内でのみ行う。
  const [status, setStatus] = useState<Status>("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(rawHash);
    const accessToken = params.get("access_token");
    const errorDescription = params.get("error_description");

    if (errorDescription) {
      setStatus("error");
      setErrorMessage(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
      return;
    }

    if (!accessToken) {
      setStatus("error");
      setErrorMessage(MISSING_TOKEN_MESSAGE);
      return;
    }

    completeOwnerSignup(accessToken).then((result) => {
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    });
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center text-ink">
      {status === "processing" && (
        <>
          <p className="text-4xl">⏳</p>
          <h1 className="font-serif text-lg font-bold">確認しています...</h1>
          <p className="text-sm text-ink-soft">アカウントを作成しています。しばらくお待ちください。</p>
        </>
      )}

      {status === "success" && (
        <>
          <p className="text-4xl">✅</p>
          <h1 className="font-serif text-lg font-bold">メールアドレスの確認が完了しました</h1>
          <p className="text-sm text-ink-soft">ファミリーの作成が完了しました。メールアドレスとパスワードでログインしてください。</p>
          <Link
            href="/"
            className="mt-2 rounded-md bg-espresso px-5 py-2.5 text-sm font-medium text-on-espresso"
          >
            ログイン画面へ
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <p className="text-4xl">⚠️</p>
          <h1 className="font-serif text-lg font-bold">確認できませんでした</h1>
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
