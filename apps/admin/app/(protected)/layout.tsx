import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated, logoutAdmin } from "../actions/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-8 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold">ファミリークロゼット 管理画面</h1>
          <nav className="flex items-center gap-4 text-sm text-neutral-500">
            <Link href="/" className="hover:text-black">
              ファミリー一覧
            </Link>
            <Link href="/members" className="hover:text-black">
              メンバー履歴
            </Link>
          </nav>
        </div>
        <form action={handleLogout}>
          <button type="submit" className="text-sm text-neutral-500 hover:text-black">
            ログアウト
          </button>
        </form>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
