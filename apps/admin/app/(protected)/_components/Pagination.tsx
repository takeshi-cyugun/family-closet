import Link from "next/link";
import { buildQueryString } from "../../_lib/query";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  pageSize,
  filters = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  pageSize: number;
  filters?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const prevHref =
    currentPage > 1
      ? `${basePath}${buildQueryString({ ...filters, page: currentPage - 1, pageSize })}`
      : null;
  const nextHref =
    currentPage < totalPages
      ? `${basePath}${buildQueryString({ ...filters, page: currentPage + 1, pageSize })}`
      : null;

  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      {prevHref ? (
        <Link
          href={prevHref}
          className="rounded-md border border-black/10 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          前へ
        </Link>
      ) : (
        <span className="rounded-md border border-black/10 px-3 py-1.5 text-sm text-neutral-300">前へ</span>
      )}
      <span className="text-sm text-neutral-500">
        {currentPage} / {totalPages} ページ
      </span>
      {nextHref ? (
        <Link
          href={nextHref}
          className="rounded-md border border-black/10 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          次へ
        </Link>
      ) : (
        <span className="rounded-md border border-black/10 px-3 py-1.5 text-sm text-neutral-300">次へ</span>
      )}
    </div>
  );
}
