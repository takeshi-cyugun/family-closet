import Link from "next/link";
import { ClothesForm } from "../_components/ClothesForm";

export default function NewClothesPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-black">
      <header className="flex h-14 items-center justify-between border-b border-black/10 px-4 dark:border-white/10">
        <h1 className="text-base font-bold">洋服を登録</h1>
        <Link href="/dashboard" className="text-sm text-neutral-500 dark:text-neutral-400">
          キャンセル
        </Link>
      </header>

      <main className="flex-1 px-4 py-6">
        <ClothesForm mode="new" />
      </main>
    </div>
  );
}
