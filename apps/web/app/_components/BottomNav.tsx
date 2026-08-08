"use client";

import Link from "next/link";
import { LayoutGrid, Plus, Settings } from "lucide-react";
import { useLanguage } from "../_lib/LanguageContext";
import { getDashboardDictionary } from "../list/_lib/i18n";

export function BottomNav() {
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  const navItems = [
    { href: "/list", label: t.nav.dashboard, Icon: LayoutGrid },
    { href: "/items/create", label: t.nav.add, Icon: Plus },
    { href: "/settings", label: t.nav.settings, Icon: Settings },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 bg-espresso"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-stretch">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs text-on-espresso/70 hover:text-on-espresso"
          >
            <Icon size={20} strokeWidth={1.75} aria-hidden />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function BottomNavSpacer() {
  return <div aria-hidden style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }} />;
}
