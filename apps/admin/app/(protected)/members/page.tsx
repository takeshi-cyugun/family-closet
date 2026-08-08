import { getMemberHistory } from "../../actions/members";
import { MemberHistoryTable } from "../_components/MemberHistoryTable";

export default async function MembersPage() {
  const memberHistory = await getMemberHistory();

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-xl font-bold">メンバー履歴（{memberHistory.length}件）</h2>
      <MemberHistoryTable members={memberHistory} />
    </div>
  );
}
