const PLAN_OPTIONS = [
  { value: "", label: "すべて" },
  { value: "fitting", label: "フィッティング" },
  { value: "chest", label: "チェスト" },
  { value: "walk_in", label: "ウォークイン" },
];

export function FamilyFilters({
  keyword,
  planType,
  pageSize,
}: {
  keyword?: string;
  planType?: string;
  pageSize: number;
}) {
  const hasFilters = Boolean(keyword || planType);

  return (
    <form method="get" className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="keyword" className="text-xs text-neutral-500">
          キーワード
        </label>
        <input
          id="keyword"
          name="keyword"
          type="text"
          defaultValue={keyword}
          placeholder="ファミリー名・代表者・メールアドレス"
          className="w-64 rounded-md border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="planType" className="text-xs text-neutral-500">
          プラン
        </label>
        <select
          id="planType"
          name="planType"
          defaultValue={planType ?? ""}
          className="rounded-md border border-black/10 px-3 py-2 text-sm"
        >
          {PLAN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <input type="hidden" name="pageSize" value={pageSize} />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          絞り込む
        </button>
        {hasFilters && (
          <a
            href="/families"
            className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            リセット
          </a>
        )}
      </div>
    </form>
  );
}
