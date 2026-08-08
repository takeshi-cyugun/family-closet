import { notFound } from "next/navigation";
import { getClothesDetail } from "../../../actions/clothes";
import { Modal } from "../../../_components/Modal";
import { ClothesDetailContent } from "../../../items/[id]/_components/ClothesDetailContent";

export default async function InterceptedClothesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getClothesDetail(id);
  if (!data) notFound();

  return (
    <Modal>
      <ClothesDetailContent
        item={data.item}
        ownerName={data.ownerName}
        prevId={data.prevId}
        nextId={data.nextId}
        closeTo="back"
        compact
      />
    </Modal>
  );
}
