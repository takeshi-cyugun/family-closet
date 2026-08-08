"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteFamily } from "../../actions/families";

type DeleteFamilyButtonProps = {
  familyId: string;
  familyName: string;
  memberCount: number;
  clothesCount: number;
};

export function DeleteFamilyButton({ familyId, familyName, memberCount, clothesCount }: DeleteFamilyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, isPending]);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      // 成功時はdeleteFamily内でredirect('/')するため、ここに結果が返ってくるのは失敗時のみ
      const result = await deleteFamily(familyId);
      setError(result.error);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        削除する
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-family-heading"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 id="delete-family-heading" className="text-base font-bold text-neutral-900">
              「{familyName}」を削除しますか？
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              メンバー{memberCount}人・アイテム{clothesCount}件もすべて削除されます。この操作は取り消せません。
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
