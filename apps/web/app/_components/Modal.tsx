"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 bg-black/60"
        onClick={() => router.back()}
      />
      <div className="modal-scrollbar relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-y-auto rounded-3xl bg-cream shadow-2xl">
        {children}
      </div>
    </div>
  );
}
