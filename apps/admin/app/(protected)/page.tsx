import { getFamilies } from "../actions/families";
import { FamiliesTable } from "./_components/FamiliesTable";

export default async function FamiliesPage() {
  const families = await getFamilies();

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-xl font-bold">ファミリー一覧（{families.length}件）</h2>
      <FamiliesTable families={families} />
    </div>
  );
}
