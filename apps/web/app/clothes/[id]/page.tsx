import { notFound } from "next/navigation";
import { getClothesNeighbors } from "../../_lib/clothes";
import { ClothesDetailContent } from "./_components/ClothesDetailContent";

export default async function ClothesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getClothesNeighbors(id);
  if (!data) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50 dark:bg-black">
      <ClothesDetailContent item={data.item} prevId={data.prevId} nextId={data.nextId} closeTo="/dashboard" />
    </div>
  );
}
