"use client";

import { useState } from "react";
import { CATEGORIES, SEASONS, SIZES, STATUSES } from "../../_lib/clothes";
import type { Category, Season, Size, ClothesStatus } from "../../_lib/clothes";
import { useLanguage } from "../../_lib/LanguageContext";
import { getDashboardDictionary } from "../_lib/i18n";

export type FilterState = {
  category: Category | "";
  status: ClothesStatus | "";
  season: Season | "";
  size: Size | "";
  keyword: string;
};

export const EMPTY_FILTER: FilterState = {
  category: "",
  status: "",
  season: "",
  size: "",
  keyword: "",
};

type FilterBarProps = {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
};

function countActive(filter: FilterState) {
  return [filter.category, filter.status, filter.season, filter.size].filter(Boolean).length;
}

function SelectField<T extends string>({
  label,
  value,
  options,
  noSelectLabel,
  getLabel,
  onChange,
}: {
  label: string;
  value: T | "";
  options: readonly T[];
  noSelectLabel: string;
  getLabel?: (value: T) => string;
  onChange: (value: T | "") => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className="rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
      >
        <option value="">{noSelectLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {getLabel ? getLabel(option) : option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ filter, onChange }: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount = countActive(filter);

  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  return (
    <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={filter.keyword}
          onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
          placeholder={t.searchPlaceholder}
          className="min-w-0 flex-1 rounded-md border border-black/10 bg-white px-3 py-2 text-base dark:border-white/15 dark:bg-neutral-900"
        />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="relative shrink-0 rounded-md border border-black/10 px-3 py-2 text-sm font-medium dark:border-white/15"
        >
          {t.filter}
          {activeCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white dark:bg-white dark:text-black">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-30">
          <button
            type="button"
            aria-label={t.close}
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-6 dark:bg-neutral-900">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-black/15 dark:bg-white/20" />
            <h2 className="mb-3 text-base font-semibold">{t.filter}</h2>

            <div className="flex flex-col gap-3">
              <SelectField
                label={t.categoryLabel}
                value={filter.category}
                options={CATEGORIES}
                noSelectLabel={t.noSelect}
                getLabel={(cat) => t.categories[cat] ?? cat}
                onChange={(category) => onChange({ ...filter, category })}
              />
              <SelectField
                label={t.statusLabel}
                value={filter.status}
                options={STATUSES}
                noSelectLabel={t.noSelect}
                getLabel={(st) => t.statuses[st] ?? st}
                onChange={(status) => onChange({ ...filter, status })}
              />
              <SelectField
                label={t.seasonLabel}
                value={filter.season}
                options={SEASONS}
                noSelectLabel={t.noSelect}
                getLabel={(sn) => t.seasons[sn] ?? sn}
                onChange={(season) => onChange({ ...filter, season })}
              />
              <SelectField
                label={t.sizeLabel}
                value={filter.size}
                options={SIZES}
                noSelectLabel={t.noSelect}
                onChange={(size) => onChange({ ...filter, size })}
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...EMPTY_FILTER, keyword: filter.keyword })}
                className="flex-1 rounded-md border border-black/10 py-2.5 text-sm font-medium dark:border-white/15"
              >
                {t.reset}
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-md bg-black py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
              >
                {t.apply}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
