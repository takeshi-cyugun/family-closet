import { ChangePasswordForm } from "./_components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-neutral-50 px-6 py-10 dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-lg font-bold">初回ログインのため、パスワードの変更が必要です</h1>
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
          変更が完了するまで、他の画面はご利用いただけません。
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
