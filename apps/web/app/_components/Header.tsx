"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../_lib/LanguageContext";
import { getDashboardDictionary } from "../dashboard/_lib/i18n";

const CURRENT_MEMBER_ID = "dad";

type HeaderProps = {
  title?: string;
};

export function Header({ title = "ファミリークロゼット" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-black/10 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <Link href="/dashboard" className="text-lg font-bold tracking-tight">
        {title}
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-white dark:bg-neutral-200 dark:text-black"
          aria-label={t.header.userMenu}
        >
          {CURRENT_MEMBER_ID.charAt(0).toUpperCase()}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900">
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {t.header.logout}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
