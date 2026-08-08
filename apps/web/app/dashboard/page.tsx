import { getClothesPage } from "../actions/clothes";
import { getFamilyMembers } from "../actions/members";
import { DashboardClient } from "./_components/DashboardClient";
import { ITEMS_PER_PAGE } from "./_lib/pagination";

export default async function DashboardPage() {
  const [{ items, total }, members] = await Promise.all([
    getClothesPage({}, 1, ITEMS_PER_PAGE),
    getFamilyMembers(),
  ]);

  return <DashboardClient initialItems={items} initialTotal={total} initialMembers={members} />;
}
