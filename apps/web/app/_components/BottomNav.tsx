"use client";

import Link from "next/link";
import { useLanguage } from "../_lib/LanguageContext";
import { getDashboardDictionary } from "../dashboard/_lib/i18n";

export function BottomNav() {
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard, icon: "📋" },
    { href: "/clothes/new", label: t.nav.add, icon: "➕" },
    { href: "/settings", label: t.nav.settings, icon: "⚙️" },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-black/90"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-stretch">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function BottomNavSpacer() {
  return <div aria-hidden style={{ height: "calc(4rem + env(safe-area-inset-bottom))" }} />;
}
