import { notFound } from "next/navigation";
import { getClothesDetail } from "../../actions/clothes";
import { ClothesDetailContent } from "./_components/ClothesDetailContent";

export default async function ClothesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getClothesDetail(id);
  if (!data) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <ClothesDetailContent
        item={data.item}
        ownerName={data.ownerName}
        prevId={data.prevId}
        nextId={data.nextId}
        closeTo="/dashboard"
      />
    </div>
  );
}
