"use client";

import { useRouter } from "next/navigation";
import { PAGE_SIZE_OPTIONS } from "../../_lib/pagination";
import { buildQueryString } from "../../_lib/query";

export function PageSizeSelect({
  pageSize,
  basePath,
  filters = {},
}: {
  pageSize: number;
  basePath: string;
  filters?: Record<string, string | undefined>;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-500">
      表示件数
      <select
        value={pageSize}
        onChange={(e) =>
          router.push(`${basePath}${buildQueryString({ ...filters, page: 1, pageSize: e.target.value })}`)
        }
        className="rounded-md border border-black/10 px-2 py-1.5 text-sm text-neutral-700"
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}件
          </option>
        ))}
      </select>
    </label>
  );
}
