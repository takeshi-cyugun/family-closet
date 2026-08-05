import Link from "next/link";

export default function EmailConfirmedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center text-ink">
      <p className="text-4xl">✅</p>
      <h1 className="font-serif text-lg font-bold">メールアドレスの確認が完了しました</h1>
      <p className="text-sm text-ink-soft">ファミリーID・メンバーID・パスワードでログインしてください。</p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-espresso px-5 py-2.5 text-sm font-medium text-on-espresso"
      >
        ログイン画面へ
      </Link>
    </div>
  );
}
