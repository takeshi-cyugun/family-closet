export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 20;

export function parsePageSize(value: string | undefined): PageSize {
  const parsed = Number(value);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed) ? (parsed as PageSize) : DEFAULT_PAGE_SIZE;
}
