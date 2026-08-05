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
import { getClothesForFamily } from "../actions/clothes";
import { getFamilyMembers } from "../actions/members";
import type { ClothesItem, Member } from "../_lib/clothes";
import { useLanguage } from "../_lib/LanguageContext";
import { getDashboardDictionary } from "./_lib/i18n";

const ITEMS_PER_PAGE = 10; // 2列 x 5行

export default function DashboardPage() {
  const [selectedMemberId, setSelectedMemberId] = useState(ALL_ID);
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [page, setPage] = useState(1);
  const [clothes, setClothes] = useState<ClothesItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getClothesForFamily(), getFamilyMembers()]).then(([items, familyMembers]) => {
      if (cancelled) return;
      setClothes(items);
      setMembers(familyMembers);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredClothes = useMemo(() => {
    const keyword = filter.keyword.trim().toLowerCase();

    return clothes.filter((item) => {
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
  }, [clothes, selectedMemberId, filter]);

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
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <Header />
      <GuestTrialBanner />
      {members.length > 1 && (
        <MemberTabs members={members} selectedId={selectedMemberId} onSelect={setSelectedMemberId} />
      )}
      <FilterBar filter={filter} onChange={setFilter} />

      <p className="px-4 pt-3 text-xs text-ink-soft">{t.itemsCount(filteredClothes.length)}</p>

      <main className="flex flex-1 flex-col">
        {loading ? (
          <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-ink-soft">
            読み込み中...
          </div>
        ) : (
          <ClothesGrid items={pagedClothes} members={members} />
        )}
      </main>

      <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
