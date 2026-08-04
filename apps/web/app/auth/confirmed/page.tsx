import Link from "next/link";

export default function EmailConfirmedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center dark:bg-black">
      <p className="text-4xl">✅</p>
      <h1 className="text-lg font-bold">メールアドレスの確認が完了しました</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        ファミリーID・メンバーID・パスワードでログインしてください。
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
      >
        ログイン画面へ
      </Link>
    </div>
  );
}
