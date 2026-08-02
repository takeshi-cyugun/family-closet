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
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="閉じる"
        className="absolute inset-0 bg-black/50"
        onClick={() => router.back()}
      />
      <div className="relative z-10 flex h-dvh w-full flex-col overflow-y-auto bg-neutral-50 dark:bg-black">
        {children}
      </div>
    </div>
  );
}
