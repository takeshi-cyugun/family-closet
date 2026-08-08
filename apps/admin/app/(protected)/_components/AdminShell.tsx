"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMaintenanceStatus } from "./MaintenanceStatusContext";

const NAV_ITEMS = [
  { href: "/", label: "ダッシュボード" },
  { href: "/families", label: "ファミリー一覧" },
  { href: "/members", label: "メンバー履歴" },
  { href: "/logs", label: "通知・障害ログ" },
  { href: "/maintenance", label: "メンテナンスモード" },
];

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function AdminShell({
  onLogout,
  children,
}: {
  onLogout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { isMaintenanceActive } = useMaintenanceStatus();

  return (
    <div className="min-h-screen bg-sky-50">
      <header className="flex items-center justify-between border-b border-sky-200 bg-sky-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="メニューを開閉"
            aria-expanded={sidebarOpen}
            className="rounded-md p-2 text-neutral-500 hover:bg-sky-200/60 hover:text-black"
          >
            <HamburgerIcon />
          </button>
          <h1 className="text-lg font-bold">ファミリークロゼット 管理画面</h1>
        </div>
        <div className="flex items-center gap-4">
          {isMaintenanceActive && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              ● メンテナンス中
            </span>
          )}
          <form action={onLogout}>
            <button type="submit" className="text-sm text-neutral-500 hover:text-black">
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <div className="flex">
        <aside
          aria-hidden={!sidebarOpen}
          className={`shrink-0 overflow-hidden border-sky-200 bg-white transition-[width,padding,opacity] duration-500 ease-in-out ${
            sidebarOpen ? "w-56 border-r p-4 opacity-100" : "w-0 border-r-0 p-0 opacity-0"
          }`}
        >
          <nav className="flex w-48 flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={sidebarOpen ? undefined : -1}
                  className={`rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap ${
                    active ? "bg-sky-600 text-white" : "text-neutral-600 hover:bg-sky-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
