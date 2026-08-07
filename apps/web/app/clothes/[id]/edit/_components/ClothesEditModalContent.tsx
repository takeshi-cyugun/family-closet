"use client";

import { useRouter } from "next/navigation";
import { ClothesForm } from "../../../_components/ClothesForm";
import type { ClothesItem } from "../../../../_lib/clothes";

export function ClothesEditModalContent({ item }: { item: ClothesItem }) {
  const router = useRouter();

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between bg-espresso px-4">
        <h1 className="font-serif text-base font-bold text-on-espresso">アイテム編集</h1>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="閉じる"
          className="text-xl leading-none text-on-espresso/80 hover:text-on-espresso"
        >
          ✕
        </button>
      </header>

      <main className="flex-1 bg-cream px-4 py-4 text-ink">
        <ClothesForm mode="edit" initialItem={item} compact />
      </main>
    </>
  );
}
