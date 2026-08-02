import { notFound } from "next/navigation";
import { getClothesNeighbors } from "../../../_lib/clothes";
import { Modal } from "../../../_components/Modal";
import { ClothesDetailContent } from "../../../clothes/[id]/_components/ClothesDetailContent";

export default async function InterceptedClothesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = getClothesNeighbors(id);
  if (!data) notFound();

  return (
    <Modal>
      <ClothesDetailContent item={data.item} prevId={data.prevId} nextId={data.nextId} closeTo="back" />
    </Modal>
  );
}
