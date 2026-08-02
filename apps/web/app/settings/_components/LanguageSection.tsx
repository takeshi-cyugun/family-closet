"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "../../_lib/i18n";
import type { LanguageCode } from "../../_lib/i18n";
import { LANGUAGE_FLAGS } from "../../_lib/languageFlags";
import { useSettingsLanguage } from "../_lib/LanguageContext";

export function LanguageSection() {
  const { language, setLanguage, t } = useSettingsLanguage();
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

  const selected = LANGUAGES.find((lang) => lang.code === language) ?? LANGUAGES[0];
  const SelectedFlag = LANGUAGE_FLAGS[selected.code];

  function handleSelect(code: LanguageCode) {
    setLanguage(code);
    setOpen(false);
  }

  return (
    <section className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <span id="language-label" className="text-sm font-semibold">
        {t.languageSection.label}
      </span>
      <div ref={containerRef} className="relative mt-2">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby="language-label"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-left text-base dark:border-white/15 dark:bg-neutral-900"
        >
          <SelectedFlag className="h-4 w-6 shrink-0 rounded-sm object-cover" />
          <span className="flex-1">{selected.label}</span>
          <span aria-hidden="true" className="text-xs opacity-60">
            ▾
          </span>
        </button>
        {open && (
          <ul
            role="listbox"
            aria-labelledby="language-label"
            className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-black/10 bg-white shadow-lg dark:border-white/15 dark:bg-neutral-900"
          >
            {LANGUAGES.map((lang) => {
              const Flag = LANGUAGE_FLAGS[lang.code];
              const isSelected = lang.code === language;
              return (
                <li key={lang.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-base hover:bg-black/5 dark:hover:bg-white/10 ${
                      isSelected ? "bg-black/5 dark:bg-white/10" : ""
                    }`}
                  >
                    <Flag className="h-4 w-6 shrink-0 rounded-sm object-cover" />
                    <span>{lang.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
