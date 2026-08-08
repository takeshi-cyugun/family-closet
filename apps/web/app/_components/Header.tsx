"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../_lib/LanguageContext";
import { useCurrentMember } from "../_lib/MemberContext";
import { getDashboardDictionary } from "../list/_lib/i18n";
import { logout } from "../actions/logout";

type HeaderProps = {
  title?: string;
};

export function Header({ title }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { memberName, canLogout } = useCurrentMember();
  const t = getDashboardDictionary(language);
  const displayTitle = title ?? t.appName;
  const avatarInitial = memberName ? memberName.trim().charAt(0).toUpperCase() : "";

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
      <Link href="/list" className="font-serif text-lg font-semibold tracking-tight text-on-espresso">
        {displayTitle}
      </Link>

      <div className="relative" ref={menuRef}>
        {canLogout ? (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-on-espresso text-sm font-semibold text-espresso"
            aria-label={t.header.userMenu}
          >
            {avatarInitial}
          </button>
        ) : (
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-on-espresso text-sm font-semibold text-espresso"
          >
            {avatarInitial}
          </span>
        )}

        {canLogout && menuOpen && (
          <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-lg border border-linen bg-cream shadow-lg">
            <button
              type="button"
              disabled={loggingOut}
              className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-sand disabled:opacity-50"
              onClick={async () => {
                setMenuOpen(false);
                setLoggingOut(true);
                await logout();
              }}
            >
              {t.header.logout}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
