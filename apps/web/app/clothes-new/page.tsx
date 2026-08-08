import { BottomNav, BottomNavSpacer } from "../_components/BottomNav";
import { ClothesForm } from "../clothes/_components/ClothesForm";
import { NewPageHeader } from "../clothes/_components/NewPageHeader";

export default function NewClothesPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <NewPageHeader />

      <main className="flex-1 px-4 py-6">
        <ClothesForm mode="new" />
      </main>

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
