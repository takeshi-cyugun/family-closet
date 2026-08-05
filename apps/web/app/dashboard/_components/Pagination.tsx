"use client";

import { useLanguage } from "../../_lib/LanguageContext";
import { getDashboardDictionary } from "../_lib/i18n";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-4">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        className="rounded-md bg-espresso px-4 py-2 text-sm font-medium text-on-espresso disabled:opacity-30"
      >
        {t.prevPage}
      </button>

      <span className="text-sm text-ink-soft">{t.pageInfo(currentPage, totalPages)}</span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
        className="rounded-md bg-espresso px-4 py-2 text-sm font-medium text-on-espresso disabled:opacity-30"
      >
        {t.nextPage}
      </button>
    </div>
  );
}
