import { getMemberHistory } from "../../actions/members";
import { parsePageSize } from "../../_lib/pagination";
import { MemberHistoryTable } from "../_components/MemberHistoryTable";
import { PageSizeSelect } from "../_components/PageSizeSelect";
import { Pagination } from "../_components/Pagination";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const { page: pageParam, pageSize: pageSizeParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const requestedPageSize = parsePageSize(pageSizeParam);
  const { items, totalCount, page, pageSize } = await getMemberHistory(requestedPage, requestedPageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">メンバー履歴（{totalCount}件）</h2>
        <PageSizeSelect pageSize={pageSize} basePath="/members" />
      </div>
      <MemberHistoryTable members={items} />
      <Pagination currentPage={page} totalPages={totalPages} pageSize={pageSize} basePath="/members" />
    </div>
  );
}
