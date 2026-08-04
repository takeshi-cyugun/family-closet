export type ClothesStatus = "使用中" | "保管中" | "譲渡/廃棄予定";

export type Season = "通年" | "春" | "夏" | "秋" | "冬" | "春夏" | "秋冬";

export type Category =
  | "コート"
  | "アウター"
  | "トップス"
  | "パンツ"
  | "ワンピース"
  | "スカート"
  | "インナー"
  | "靴"
  | "バッグ"
  | "帽子"
  | "その他";

export type Size =
  | "70"
  | "80"
  | "90"
  | "100"
  | "110"
  | "120"
  | "130"
  | "140"
  | "150"
  | "160"
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "FREE";

export type MemberRole = "admin" | "member";

export type Member = {
  id: string;
  memberId: string;
  name: string;
  role: MemberRole;
};

export type ClothesItem = {
  id: string;
  name: string;
  category: string;
  color?: string;
  ownerId: string;
  status: ClothesStatus;
  season: Season;
  size: Size;
  memo?: string;
  photoDataUrl?: string;
  createdAt?: string;
};

export const CATEGORIES: Category[] = [
  "コート",
  "アウター",
  "トップス",
  "パンツ",
  "ワンピース",
  "スカート",
  "インナー",
  "靴",
  "バッグ",
  "帽子",
  "その他",
];

export const STATUSES: ClothesStatus[] = ["使用中", "保管中", "譲渡/廃棄予定"];

export type DbClothesStatus = "in_use" | "stored" | "disposal_planned";

const DB_TO_UI_STATUS: Record<DbClothesStatus, ClothesStatus> = {
  in_use: "使用中",
  stored: "保管中",
  disposal_planned: "譲渡/廃棄予定",
};

const UI_TO_DB_STATUS: Record<ClothesStatus, DbClothesStatus> = {
  使用中: "in_use",
  保管中: "stored",
  "譲渡/廃棄予定": "disposal_planned",
};

export function mapDbStatusToUiStatus(status: string): ClothesStatus {
  return DB_TO_UI_STATUS[status as DbClothesStatus] ?? "使用中";
}

export function mapUiStatusToDbStatus(status: ClothesStatus): DbClothesStatus {
  return UI_TO_DB_STATUS[status];
}

export const SEASONS: Season[] = ["通年", "春", "夏", "秋", "冬", "春夏", "秋冬"];

export const SIZES: Size[] = [
  "70",
  "80",
  "90",
  "100",
  "110",
  "120",
  "130",
  "140",
  "150",
  "160",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "FREE",
];

export const CATEGORY_ICON: Record<Category, string> = {
  コート: "🧥",
  アウター: "🧥",
  トップス: "👕",
  パンツ: "👖",
  ワンピース: "👗",
  スカート: "👗",
  インナー: "🎽",
  靴: "👟",
  バッグ: "👜",
  帽子: "🧢",
  その他: "🧺",
};

const DEFAULT_CATEGORY_ICON = "🧺";

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICON[category as Category] ?? DEFAULT_CATEGORY_ICON;
}

export const mockMembers: Member[] = [
  { id: "dad", memberId: "dad", name: "パパ", role: "admin" },
  { id: "mom", memberId: "mom", name: "ママ", role: "member" },
  { id: "elder-daughter", memberId: "elder-daughter", name: "長女", role: "member" },
  { id: "son", memberId: "son", name: "長男", role: "member" },
];

export const mockClothes: ClothesItem[] = [
  { id: "1", name: "ダウンコート", category: "コート", color: "ネイビー", ownerId: "dad", status: "使用中", season: "冬", size: "L" },
  { id: "2", name: "ボーダーTシャツ", category: "トップス", color: "白×紺", ownerId: "elder-daughter", status: "使用中", season: "春夏", size: "120" },
  { id: "3", name: "デニムパンツ", category: "パンツ", color: "ブルー", ownerId: "son", status: "保管中", season: "通年", size: "110" },
  { id: "4", name: "花柄ワンピース", category: "ワンピース", color: "ピンク", ownerId: "elder-daughter", status: "使用中", season: "夏", size: "130" },
  { id: "5", name: "プリーツスカート", category: "スカート", color: "ベージュ", ownerId: "mom", status: "保管中", season: "秋冬", size: "M" },
  { id: "6", name: "スニーカー", category: "靴", color: "ホワイト", ownerId: "son", status: "使用中", season: "通年", size: "110", memo: "紐タイプ" },
  { id: "7", name: "ニット帽", category: "帽子", color: "グレー", ownerId: "dad", status: "保管中", season: "冬", size: "FREE" },
  { id: "8", name: "レインコート", category: "アウター", color: "イエロー", ownerId: "son", status: "使用中", season: "春夏", size: "110" },
  { id: "9", name: "カーディガン", category: "トップス", color: "ベージュ", ownerId: "mom", status: "使用中", season: "春夏", size: "L" },
  { id: "10", name: "チノパン", category: "パンツ", color: "カーキ", ownerId: "dad", status: "使用中", season: "秋冬", size: "L" },
  { id: "11", name: "浴衣", category: "その他", color: "紺×白", ownerId: "elder-daughter", status: "保管中", season: "夏", size: "120" },
  { id: "12", name: "フォーマルワンピース", category: "ワンピース", color: "ブラック", ownerId: "mom", status: "譲渡/廃棄予定", season: "通年", size: "M" },
  { id: "13", name: "半袖シャツ", category: "トップス", color: "水色", ownerId: "son", status: "使用中", season: "夏", size: "100" },
  { id: "14", name: "サンダル", category: "靴", color: "ブラウン", ownerId: "elder-daughter", status: "使用中", season: "夏", size: "120" },
  { id: "15", name: "マウンテンパーカー", category: "アウター", color: "オリーブ", ownerId: "dad", status: "保管中", season: "秋", size: "XL" },
  { id: "16", name: "ロンパース", category: "その他", color: "イエロー", ownerId: "son", status: "譲渡/廃棄予定", season: "通年", size: "80" },
  { id: "17", name: "ストローハット", category: "帽子", color: "ナチュラル", ownerId: "mom", status: "使用中", season: "夏", size: "FREE" },
  { id: "18", name: "スウェットパンツ", category: "パンツ", color: "グレー", ownerId: "elder-daughter", status: "使用中", season: "秋冬", size: "130" },
];

export function findClothesById(id: string): ClothesItem | undefined {
  return mockClothes.find((item) => item.id === id);
}

export type ClothesNeighbors = {
  item: ClothesItem;
  prevId: string | null;
  nextId: string | null;
};

export function getClothesNeighbors(id: string): ClothesNeighbors | null {
  const index = mockClothes.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return {
    item: mockClothes[index],
    prevId: index > 0 ? mockClothes[index - 1].id : null,
    nextId: index < mockClothes.length - 1 ? mockClothes[index + 1].id : null,
  };
}

export function addClothesItem(item: Omit<ClothesItem, "id" | "createdAt">): ClothesItem {
  const created: ClothesItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().slice(0, 10),
  };
  mockClothes.unshift(created);
  return created;
}

export function updateClothesItem(
  id: string,
  patch: Omit<ClothesItem, "id" | "createdAt">
): ClothesItem | undefined {
  const index = mockClothes.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  const updated: ClothesItem = { ...patch, id, createdAt: mockClothes[index].createdAt };
  mockClothes[index] = updated;
  return updated;
}

export function deleteClothesItem(id: string): void {
  const index = mockClothes.findIndex((item) => item.id === id);
  if (index !== -1) mockClothes.splice(index, 1);
}

const MOCK_AI_CATEGORIES: Category[] = ["トップス", "アウター", "パンツ", "ワンピース", "靴"];

export async function mockAnalyzeImage(): Promise<{ category: Category }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { category: MOCK_AI_CATEGORIES[Math.floor(Math.random() * MOCK_AI_CATEGORIES.length)] };
}
