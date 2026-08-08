import { notFound } from "next/navigation";
import { ClothesForm } from "../../_components/ClothesForm";
import { getClothesForEdit } from "../../../actions/clothes";
import { getFamilyMembers } from "../../../actions/members";
import { EditPageHeader } from "../../_components/EditPageHeader";
import { BottomNav, BottomNavSpacer } from "../../../_components/BottomNav";

export default async function EditClothesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [data, members] = await Promise.all([getClothesForEdit(id), getFamilyMembers()]);
  if (!data) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <EditPageHeader />

      <main className="flex-1 px-4 py-6">
        <ClothesForm
          mode="edit"
          initialItem={data.item}
          initialFamilyId={data.familyId}
          initialMembers={members}
        />
      </main>

      <BottomNavSpacer />
      <BottomNav />
    </div>
  );
}
