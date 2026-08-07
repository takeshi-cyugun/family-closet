"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { OwnerLoginForm } from "./_components/OwnerLoginForm";
import { startGuestSession } from "./_lib/session";
import { LANGUAGES } from "./_lib/i18n";
import type { LanguageCode } from "./_lib/i18n";
import { LANGUAGE_FLAGS } from "./_lib/languageFlags";
import { useLanguage } from "./_lib/LanguageContext";
import { getHomeDictionary } from "./_lib/homeI18n";

// トップページの言語切替のみ、日本語を末尾に表示する
const FOOTER_LANGUAGES = [...LANGUAGES.filter((lang) => lang.code !== "ja"), LANGUAGES.find((lang) => lang.code === "ja")!];

function LanguageSelect({
  language,
  onChange,
  ariaLabel,
}: {
  language: LanguageCode;
  onChange: (code: LanguageCode) => void;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selected = FOOTER_LANGUAGES.find((lang) => lang.code === language) ?? FOOTER_LANGUAGES[0];
  const SelectedFlag = LANGUAGE_FLAGS[selected.code];

  return (
    <div ref={containerRef} className="relative mx-auto mt-4 w-40">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-md border border-linen bg-white px-3 py-1.5 text-left text-xs text-ink"
      >
        <SelectedFlag className="h-3.5 w-5 shrink-0 rounded-sm object-cover" />
        <span className="flex-1">{selected.label}</span>
        <span aria-hidden="true" className="text-ink-soft">
          ▾
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute bottom-full left-0 z-10 mb-1 w-full overflow-hidden rounded-md border border-linen bg-white shadow-lg"
        >
          {FOOTER_LANGUAGES.map((lang) => {
            const Flag = LANGUAGE_FLAGS[lang.code];
            const isSelected = lang.code === language;
            return (
              <li key={lang.code} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(lang.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-ink hover:bg-sand ${
                    isSelected ? "bg-sand" : ""
                  }`}
                >
                  <Flag className="h-3.5 w-5 shrink-0 rounded-sm object-cover" />
                  <span>{lang.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const t = getHomeDictionary(language);

  function handleGuestStart() {
    startGuestSession();
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col bg-cream text-ink">
      <section className="flex flex-col items-center gap-5 px-6 pb-8 pt-16 text-center">
        <span className="text-5xl">🧺</span>
        <h1 className="font-serif text-3xl font-bold tracking-tight">{t.appName}</h1>
        <p className="max-w-sm text-sm text-ink-soft">{t.tagline}</p>

        <div className="mt-2 flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={handleGuestStart}
            className="rounded-md bg-espresso py-3 text-sm font-semibold text-on-espresso"
          >
            {t.guestCta}
          </button>
          <Link
            href="/signup"
            className="rounded-md border border-linen py-3 text-center text-sm font-medium text-ink"
          >
            {t.registerCta}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-xl gap-4 px-6 py-8 sm:grid-cols-2">
        {t.features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg bg-white p-4 text-center shadow-[0_2px_8px_rgba(60,47,43,0.08)]"
          >
            <span className="text-3xl">{feature.icon}</span>
            <h2 className="mt-2 font-serif text-sm font-semibold text-ink">{feature.title}</h2>
            <p className="mt-1 text-xs text-ink-soft">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-sm px-6 py-8">
        <h2 className="mb-4 font-serif text-base font-bold text-ink">{t.loginHeading}</h2>
        <OwnerLoginForm t={t.ownerLoginForm} />
      </section>

      <footer className="mt-auto border-t border-linen px-6 py-6 text-center">
        <div className="flex justify-center gap-4 text-xs text-ink-soft">
          <a href="/terms" className="underline">
            {t.footer.terms}
          </a>
          <a href="/privacy" className="underline">
            {t.footer.privacy}
          </a>
        </div>
        <LanguageSelect language={language} onChange={setLanguage} ariaLabel={t.footer.languageSelect} />
      </footer>
    </div>
  );
}
