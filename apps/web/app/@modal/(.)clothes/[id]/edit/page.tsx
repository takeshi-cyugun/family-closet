import { notFound } from "next/navigation";
import { getClothesDetail } from "../../../../actions/clothes";
import { Modal } from "../../../../_components/Modal";
import { ClothesEditModalContent } from "../../../../clothes/[id]/edit/_components/ClothesEditModalContent";

export default async function InterceptedClothesEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getClothesDetail(id);
  if (!data) notFound();

  return (
    <Modal>
      <ClothesEditModalContent item={data.item} />
    </Modal>
  );
}
