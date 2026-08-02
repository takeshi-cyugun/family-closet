import { ClothesCard } from "./ClothesCard";
import type { ClothesItem, Member } from "../../_lib/clothes";

type ClothesGridProps = {
  items: ClothesItem[];
  members: Member[];
};

export function ClothesGrid({ items, members }: ClothesGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-neutral-500 dark:text-neutral-400">
        条件に一致する洋服が見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {items.map((item) => (
        <ClothesCard
          key={item.id}
          item={item}
          owner={members.find((member) => member.id === item.ownerId)}
        />
      ))}
    </div>
  );
}
