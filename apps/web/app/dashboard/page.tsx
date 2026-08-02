"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "../_components/Header";
import { BottomNav, BottomNavSpacer } from "../_components/BottomNav";
import { MemberTabs, ALL_ID } from "./_components/MemberTabs";
import { FilterBar, EMPTY_FILTER } from "./_components/FilterBar";
import type { FilterState } from "./_components/FilterBar";
import { ClothesGrid } from "./_components/ClothesGrid";
import { Pagination } from "./_components/Pagination";
import { GuestTrialBanner } from "./_components/GuestTrialBanner";
import { mockClothes, mockMembers } from "../_lib/clothes";
import { useLanguage } from "../_lib/LanguageContext";
import { getDashboardDictionary } from "./_lib/i18n";

const ITEMS_PER_PAGE = 10; // 2列 x 5行

export default function DashboardPage() {
  const [selectedMemberId, setSelectedMemberId] = useState(ALL_ID);
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [page, setPage] = useState(1);

  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  const filteredClothes = useMemo(() => {
    const keyword = filter.keyword.trim().toLowerCase();

    return mockClothes.filter((item) => {
      if (selectedMemberId !== ALL_ID && item.ownerId !== selectedMemberId) return false;
      if (filter.category && item.category !== filter.category) return false;
      if (filter.status && item.status !== filter.status) return false;
      if (filter.season && item.season !== filter.season) return false;
      if (filter.size && item.size !== filter.size) return false;
      if (keyword) {
        const haystack = `${item.name} ${item.color ?? ""} ${item.memo ?? ""}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });
  }, [selectedMemberId, filter]);

  useEffect(() => {
    setPage(1);
  }, [selectedMemberId, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredClothes.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedClothes = filteredClothes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-black">
      <Header />
      <GuestTrialBanner />
      <MemberTabs members={mockMembers} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />
      <FilterBar filter={filter} onChange={setFilter} />

      <p className="px-4 pt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {t.itemsCount(filteredClothes.length)}
      </p>

      <main className="flex flex-1 flex-col">
        <ClothesGrid items={pagedClothes} members={mockMembers} />
      </main>

      <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
