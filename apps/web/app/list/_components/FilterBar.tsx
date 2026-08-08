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
      <span className="text-ink-soft">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className="rounded-md border border-linen bg-white px-3 py-2 text-base text-ink"
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
    <div className="border-b border-linen px-4 py-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={filter.keyword}
          onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
          placeholder={t.searchPlaceholder}
          className="min-w-0 flex-1 rounded-md border border-linen bg-white px-3 py-2 text-base text-ink placeholder:text-ink-faint"
        />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="relative shrink-0 rounded-md bg-espresso px-3 py-2 text-sm font-medium text-on-espresso"
        >
          {t.filter}
          {activeCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-ink">
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
            className="absolute inset-0 bg-ink/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-cream p-4 pb-6">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-linen" />
            <h2 className="mb-3 font-serif text-base font-semibold text-ink">{t.filter}</h2>

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
                className="flex-1 rounded-md bg-espresso py-2.5 text-sm font-medium text-on-espresso"
              >
                {t.reset}
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-md bg-espresso py-2.5 text-sm font-medium text-on-espresso"
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
