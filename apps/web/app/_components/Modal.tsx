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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 bg-espresso/60"
        onClick={() => router.back()}
      />
      <div className="modal-scrollbar relative z-10 flex max-h-[calc(100dvh-3rem)] w-full max-w-sm flex-col overflow-y-auto rounded-[2.5rem] bg-cream shadow-2xl">
        {children}
      </div>
    </div>
  );
}
