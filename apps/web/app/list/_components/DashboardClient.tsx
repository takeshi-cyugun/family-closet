"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "../../_components/Header";
import { BottomNav, BottomNavSpacer } from "../../_components/BottomNav";
import { MemberTabs, ALL_ID } from "./MemberTabs";
import { FilterBar, EMPTY_FILTER } from "./FilterBar";
import type { FilterState } from "./FilterBar";
import { ClothesGrid } from "./ClothesGrid";
import { Pagination } from "./Pagination";
import { GuestTrialBanner } from "./GuestTrialBanner";
import { getClothesPage } from "../../actions/clothes";
import type { ClothesItem, Member } from "../../_lib/clothes";
import { useLanguage } from "../../_lib/LanguageContext";
import { getDashboardDictionary } from "../_lib/i18n";
import { ITEMS_PER_PAGE } from "../_lib/pagination";

const KEYWORD_DEBOUNCE_MS = 300;

type DashboardClientProps = {
  initialItems: ClothesItem[];
  initialTotal: number;
  initialMembers: Member[];
};

export function DashboardClient({ initialItems, initialTotal, initialMembers }: DashboardClientProps) {
  const [selectedMemberId, setSelectedMemberId] = useState(ALL_ID);
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [debouncedKeyword, setDebouncedKeyword] = useState(filter.keyword);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [fetching, setFetching] = useState(false);
  const members = initialMembers;

  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  // 自由入力のキーワードだけデバウンスする（カテゴリ等のプルダウンは即時反映でよい）
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(filter.keyword), KEYWORD_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filter.keyword]);

  const isFirstRender = useRef(true);

  // 初回はサーバーから受け取った初期データをそのまま使うので、絞り込み・ページが変わった時だけ取得し直す
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let cancelled = false;
    setFetching(true);
    getClothesPage(
      {
        ownerMemberId: selectedMemberId !== ALL_ID ? selectedMemberId : undefined,
        category: filter.category || undefined,
        status: filter.status || undefined,
        season: filter.season || undefined,
        size: filter.size || undefined,
        keyword: debouncedKeyword || undefined,
      },
      page,
      ITEMS_PER_PAGE
    ).then((result) => {
      if (cancelled) return;
      setItems(result.items);
      setTotal(result.total);
      setFetching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedMemberId, filter.category, filter.status, filter.season, filter.size, debouncedKeyword, page]);

  function handleMemberSelect(id: string) {
    setSelectedMemberId(id);
    setPage(1);
  }

  function handleFilterChange(next: FilterState) {
    setFilter(next);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <Header />
      <GuestTrialBanner />
      {members.length > 1 && (
        <MemberTabs members={members} selectedId={selectedMemberId} onSelect={handleMemberSelect} />
      )}
      <FilterBar filter={filter} onChange={handleFilterChange} />

      <p className="px-4 pt-3 text-xs text-ink-soft">{t.itemsCount(total)}</p>

      <main className={`flex flex-1 flex-col transition-opacity ${fetching ? "opacity-50" : ""}`}>
        <ClothesGrid items={items} members={members} />
      </main>

      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
