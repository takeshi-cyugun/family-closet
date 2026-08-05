"use client";

import type { Member } from "../../_lib/clothes";
import { useLanguage } from "../../_lib/LanguageContext";
import { getDashboardDictionary } from "../_lib/i18n";

const ALL_ID = "all";

type MemberTabsProps = {
  members: Member[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function MemberTabs({ members, selectedId, onSelect }: MemberTabsProps) {
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  const tabs = [{ id: ALL_ID, name: t.allMembers }, ...members];

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3">
      {tabs.map((tab) => {
        const isSelected = tab.id === selectedId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-espresso text-on-espresso"
                : "bg-sand text-ink-soft hover:bg-linen"
            }`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}

export { ALL_ID };
