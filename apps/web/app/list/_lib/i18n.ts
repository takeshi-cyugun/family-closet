import type { LanguageCode } from "../../_lib/i18n";
import type { Category, Season, ClothesStatus } from "../../_lib/clothes";

export type DashboardDictionary = {
  appName: string;
  loading: string;
  allMembers: string;
  itemsCount: (count: number) => string;
  searchPlaceholder: string;
  filter: string;
  noSelect: string;
  categoryLabel: string;
  statusLabel: string;
  seasonLabel: string;
  sizeLabel: string;
  reset: string;
  apply: string;
  close: string;
  prevPage: string;
  nextPage: string;
  pageInfo: (current: number, total: number) => string;
  guestTrial: (days: number, limit: number) => string;
  registerCta: string;
  unknownOwner: string;
  statuses: Record<ClothesStatus, string>;
  categories: Record<Category, string>;
  seasons: Record<Season, string>;
  nav: {
    dashboard: string;
    add: string;
    settings: string;
  };
  header: {
    userMenu: string;
    logout: string;
  };
};

const ja: DashboardDictionary = {
  appName: "ファミリークロゼット",
  loading: "読み込み中...",
  allMembers: "全員",
  itemsCount: (count) => `${count}件表示中`,
  searchPlaceholder: "フリーワード検索",
  filter: "絞り込み",
  noSelect: "指定なし",
  categoryLabel: "カテゴリ",
  statusLabel: "使用状態",
  seasonLabel: "シーズン",
  sizeLabel: "サイズ",
  reset: "リセット",
  apply: "適用する",
  close: "閉じる",
  prevPage: "← 前へ",
  nextPage: "次へ →",
  pageInfo: (current, total) => `${current} / ${total} ページ`,
  guestTrial: (days, limit) => `お試し利用中（残り${days}日・最大${limit}着まで）`,
  registerCta: "本登録はこちら",
  unknownOwner: "不明",
  statuses: {
    使用中: "使用中",
    保管中: "保管中",
    処分予定: "処分予定",
    処分済: "処分済",
  },
  categories: {
    コート: "コート",
    アウター: "アウター",
    トップス: "トップス",
    パンツ: "パンツ",
    スカート: "スカート",
    ワンピース: "ワンピース",
    インナー: "インナー",
    靴: "靴",
    バッグ: "バッグ",
    帽子: "帽子",
    その他: "その他",
  },
  seasons: {
    通年: "通年",
    春: "春",
    夏: "夏",
    秋: "秋",
    冬: "冬",
    春夏: "春夏",
    秋冬: "秋冬",
  },
  nav: {
    dashboard: "一覧",
    add: "追加",
    settings: "設定",
  },
  header: {
    userMenu: "ユーザーメニュー",
    logout: "ログアウト",
  },
};

const en: DashboardDictionary = {
  appName: "Family Closet",
  loading: "Loading...",
  allMembers: "All",
  itemsCount: (count) => `Showing ${count} ${count === 1 ? "item" : "items"}`,
  searchPlaceholder: "Search by keyword",
  filter: "Filter",
  noSelect: "Any",
  categoryLabel: "Category",
  statusLabel: "Status",
  seasonLabel: "Season",
  sizeLabel: "Size",
  reset: "Reset",
  apply: "Apply",
  close: "Close",
  prevPage: "← Prev",
  nextPage: "Next →",
  pageInfo: (current, total) => `Page ${current} of ${total}`,
  guestTrial: (days, limit) => `Free trial (${days} ${days === 1 ? "day" : "days"} left, max ${limit} items)`,
  registerCta: "Register here",
  unknownOwner: "Unknown",
  statuses: {
    使用中: "In Use",
    保管中: "Stored",
    処分予定: "To Dispose",
    処分済: "Disposed",
  },
  categories: {
    コート: "Coats",
    アウター: "Outerwear",
    トップス: "Tops",
    パンツ: "Pants",
    スカート: "Skirts",
    ワンピース: "Dresses",
    インナー: "Innerwear",
    靴: "Shoes",
    バッグ: "Bags",
    帽子: "Hats",
    その他: "Other",
  },
  seasons: {
    通年: "All Season",
    春: "Spring",
    夏: "Summer",
    秋: "Autumn",
    冬: "Winter",
    春夏: "Spring/Summer",
    秋冬: "Autumn/Winter",
  },
  nav: {
    dashboard: "Items",
    add: "Add",
    settings: "Settings",
  },
  header: {
    userMenu: "User menu",
    logout: "Log out",
  },
};

const zhCN: DashboardDictionary = {
  appName: "家庭衣橱",
  loading: "加载中...",
  allMembers: "全部",
  itemsCount: (count) => `显示 ${count} 件`,
  searchPlaceholder: "关键字搜索",
  filter: "筛选",
  noSelect: "不限",
  categoryLabel: "分类",
  statusLabel: "使用状态",
  seasonLabel: "季节",
  sizeLabel: "尺寸",
  reset: "重置",
  apply: "应用",
  close: "关闭",
  prevPage: "← 上一页",
  nextPage: "下一页 →",
  pageInfo: (current, total) => `第 ${current} / ${total} 页`,
  guestTrial: (days, limit) => `试用中（剩余 ${days} 天・最多 ${limit} 件）`,
  registerCta: "点击此处注册",
  unknownOwner: "未知",
  statuses: {
    使用中: "使用中",
    保管中: "保管中",
    処分予定: "计划处置",
    処分済: "已处置",
  },
  categories: {
    コート: "大衣/外套",
    アウター: "外套",
    トップス: "上衣",
    パンツ: "裤子",
    スカート: "裙子",
    ワンピース: "连衣裙",
    インナー: "内衣/内搭",
    靴: "鞋子",
    バッグ: "包包",
    帽子: "帽子",
    その他: "其他",
  },
  seasons: {
    通年: "四季通用",
    春: "春季",
    夏: "夏季",
    秋: "秋季",
    冬: "冬季",
    春夏: "春夏",
    秋冬: "秋冬",
  },
  nav: {
    dashboard: "列表",
    add: "新增",
    settings: "设置",
  },
  header: {
    userMenu: "用户菜单",
    logout: "退出登录",
  },
};

const zhTW: DashboardDictionary = {
  appName: "家庭衣櫥",
  loading: "載入中...",
  allMembers: "全部",
  itemsCount: (count) => `顯示 ${count} 件`,
  searchPlaceholder: "關鍵字搜尋",
  filter: "篩選",
  noSelect: "不限",
  categoryLabel: "分類",
  statusLabel: "使用狀態",
  seasonLabel: "季節",
  sizeLabel: "尺寸",
  reset: "重設",
  apply: "套用",
  close: "關閉",
  prevPage: "← 上一頁",
  nextPage: "下一頁 →",
  pageInfo: (current, total) => `第 ${current} / ${total} 頁`,
  guestTrial: (days, limit) => `試用中（剩餘 ${days} 天・最多 ${limit} 件）`,
  registerCta: "點擊此處註冊",
  unknownOwner: "未知",
  statuses: {
    使用中: "使用中",
    保管中: "保管中",
    処分予定: "計劃處置",
    処分済: "已處置",
  },
  categories: {
    コート: "大衣/外套",
    アウター: "外套",
    トップス: "上衣",
    パンツ: "褲子",
    スカート: "裙子",
    ワンピース: "連身裙",
    インナー: "內衣/內搭",
    靴: "鞋子",
    バッグ: "包包",
    帽子: "帽子",
    その他: "其他",
  },
  seasons: {
    通年: "四季通用",
    春: "春季",
    夏: "夏季",
    秋: "秋季",
    冬: "冬季",
    春夏: "春夏",
    秋冬: "秋冬",
  },
  nav: {
    dashboard: "列表",
    add: "新增",
    settings: "設定",
  },
  header: {
    userMenu: "使用者選單",
    logout: "登出",
  },
};

export const DASHBOARD_DICTIONARIES: Record<LanguageCode, DashboardDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export function getDashboardDictionary(lang: LanguageCode = "ja"): DashboardDictionary {
  return DASHBOARD_DICTIONARIES[lang] ?? DASHBOARD_DICTIONARIES.ja;
}
