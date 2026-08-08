import { getFamilies, type FamilyFilters as FamilyFiltersType } from "../../actions/families";
import { parsePageSize } from "../../_lib/pagination";
import { FamiliesTable } from "../_components/FamiliesTable";
import { FamilyFilters } from "../_components/FamilyFilters";
import { PageSizeSelect } from "../_components/PageSizeSelect";
import { Pagination } from "../_components/Pagination";

export default async function FamiliesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    keyword?: string;
    planType?: string;
  }>;
}) {
  const { page: pageParam, pageSize: pageSizeParam, keyword, planType } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);
  const requestedPageSize = parsePageSize(pageSizeParam);
  const filters: FamilyFiltersType = {
    keyword: keyword || undefined,
    planType: planType || undefined,
  };
  const { items, totalCount, page, pageSize } = await getFamilies(requestedPage, requestedPageSize, filters);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const filterQuery = { keyword: filters.keyword, planType: filters.planType };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">ファミリー一覧（{totalCount}件）</h2>
        <PageSizeSelect pageSize={pageSize} basePath="/families" filters={filterQuery} />
      </div>
      <FamilyFilters keyword={filters.keyword} planType={filters.planType} pageSize={pageSize} />
      <FamiliesTable families={items} />
      <Pagination currentPage={page} totalPages={totalPages} pageSize={pageSize} basePath="/families" filters={filterQuery} />
    </div>
  );
}
