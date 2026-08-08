import type { LanguageCode } from "../../_lib/i18n";

export type JoinDictionary = {
  heading: string;
  loading: string;
  invalid: string;
  limitReached: string;
  subheading: (familyName: string) => string;
  form: {
    nameLabel: string;
    namePlaceholder: string;
    nameRequired: string;
    submit: string;
    submitting: string;
  };
};

const ja: JoinDictionary = {
  heading: "ファミリーに参加",
  loading: "確認中...",
  invalid: "この招待リンクは無効です。",
  limitReached: "このファミリーはメンバー数の上限に達しています。",
  subheading: (familyName) => `「${familyName}」に参加します。表示する名前を入力してください。`,
  form: {
    nameLabel: "表示名",
    namePlaceholder: "例: 次女",
    nameRequired: "表示名を入力してください",
    submit: "参加する",
    submitting: "参加中...",
  },
};

const en: JoinDictionary = {
  heading: "Join your family",
  loading: "Checking invite...",
  invalid: "This invite link is invalid.",
  limitReached: "This family has reached its member limit.",
  subheading: (familyName) => `You're joining "${familyName}". Enter the name you'd like to use.`,
  form: {
    nameLabel: "Display name",
    namePlaceholder: "e.g. Younger daughter",
    nameRequired: "Please enter a display name",
    submit: "Join",
    submitting: "Joining...",
  },
};

const zhCN: JoinDictionary = {
  heading: "加入家庭",
  loading: "确认中...",
  invalid: "该邀请链接无效。",
  limitReached: "该家庭已达到成员数量上限。",
  subheading: (familyName) => `即将加入「${familyName}」。请输入您的显示名称。`,
  form: {
    nameLabel: "显示名称",
    namePlaceholder: "例：小女儿",
    nameRequired: "请输入显示名称",
    submit: "加入",
    submitting: "加入中...",
  },
};

const zhTW: JoinDictionary = {
  heading: "加入家庭",
  loading: "確認中...",
  invalid: "此邀請連結無效。",
  limitReached: "該家庭已達成員數量上限。",
  subheading: (familyName) => `即將加入「${familyName}」。請輸入您的顯示名稱。`,
  form: {
    nameLabel: "顯示名稱",
    namePlaceholder: "例：小女兒",
    nameRequired: "請輸入顯示名稱",
    submit: "加入",
    submitting: "加入中...",
  },
};

const JOIN_DICTIONARIES: Record<LanguageCode, JoinDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export function getJoinDictionary(lang: LanguageCode = "ja"): JoinDictionary {
  return JOIN_DICTIONARIES[lang] ?? JOIN_DICTIONARIES.ja;
}
