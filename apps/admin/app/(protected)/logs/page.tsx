import { getSystemLogs } from "../../actions/logs";
import { parsePageSize } from "../../_lib/pagination";
import { CreateSystemLogForm } from "../_components/CreateSystemLogForm";
import { PageSizeSelect } from "../_components/PageSizeSelect";
import { Pagination } from "../_components/Pagination";
import { SystemLogsTable } from "../_components/SystemLogsTable";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  const { page: pageParam, pageSize: pageSizeParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const requestedPageSize = parsePageSize(pageSizeParam);
  const { items, totalCount, page, pageSize } = await getSystemLogs(requestedPage, requestedPageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">通知・障害ログ（{totalCount}件）</h2>
        <PageSizeSelect pageSize={pageSize} basePath="/logs" />
      </div>
      <CreateSystemLogForm />
      <SystemLogsTable logs={items} />
      <Pagination currentPage={page} totalPages={totalPages} pageSize={pageSize} basePath="/logs" />
    </div>
  );
}
