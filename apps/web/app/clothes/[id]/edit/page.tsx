import { notFound } from "next/navigation";
import { ClothesForm } from "../../_components/ClothesForm";
import { getClothesDetail } from "../../../actions/clothes";
import { EditPageHeader } from "../../_components/EditPageHeader";
import { BottomNav, BottomNavSpacer } from "../../../_components/BottomNav";

export default async function EditClothesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getClothesDetail(id);
  if (!data) notFound();
  const item = data.item;

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <EditPageHeader />

      <main className="flex-1 px-4 py-6">
        <ClothesForm mode="edit" initialItem={item} />
      </main>

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
