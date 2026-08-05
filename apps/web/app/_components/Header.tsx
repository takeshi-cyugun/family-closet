"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../_lib/LanguageContext";
import { getDashboardDictionary } from "../dashboard/_lib/i18n";

const CURRENT_MEMBER_ID = "dad";

type HeaderProps = {
  title?: string;
};

export function Header({ title }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);
  const displayTitle = title ?? t.appName;

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
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-espresso px-4">
      <Link href="/dashboard" className="font-serif text-lg font-semibold tracking-tight text-on-espresso">
        {displayTitle}
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-on-espresso text-sm font-semibold text-espresso"
          aria-label={t.header.userMenu}
        >
          {CURRENT_MEMBER_ID.charAt(0).toUpperCase()}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-lg border border-linen bg-cream shadow-lg">
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-sand"
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
