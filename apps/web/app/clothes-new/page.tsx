import { Header } from "../_components/Header";
import { BottomNav, BottomNavSpacer } from "../_components/BottomNav";
import { ClothesForm } from "../clothes/_components/ClothesForm";

export default function NewClothesPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-black">
      <Header title="アイテム登録" />

      <main className="flex-1 px-4 py-6">
        <ClothesForm mode="new" />
      </main>

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
