import type { LanguageCode } from "../../_lib/i18n";
import type { MemberRole } from "../../_lib/clothes";
import type { PlanTier } from "../_data/constants";

export type SettingsDictionary = {
  headerTitle: string;
  pageTitle: string;
  guestBanner: {
    trialNotice: (days: number) => string;
    trialDesc: string;
    registerCta: string;
  };
  accountInfo: {
    familyId: string;
    memberId: string;
  };
  memberSection: {
    heading: string;
    role: Record<MemberRole, string>;
    countLabel: (count: number, limit: number) => string;
    addedNotice: (memberId: string) => string;
    initialPasswordLabel: string;
    passwordNotice: string;
    limitReached: string;
    displayNameLabel: string;
    displayNamePlaceholder: string;
    memberIdLabel: string;
    memberIdPlaceholder: string;
    submitButton: string;
    errors: {
      nameRequired: string;
      invalidMemberId: string;
      duplicateMemberId: string;
    };
  };
  languageSection: {
    label: string;
  };
  planSection: {
    heading: string;
    planNames: Record<PlanTier, string>;
    memberCountLabel: string;
    itemCountLabel: string;
    memberCountValue: (count: number, limit: number) => string;
    itemCountValue: (count: number, limit: number) => string;
    upgradeCta: string;
  };
};

const ja: SettingsDictionary = {
  headerTitle: "設定",
  pageTitle: "ファミリー・メンバー設定",
  guestBanner: {
    trialNotice: (days) => `お試し利用中です（残り${days}日）`,
    trialDesc: "正式にファミリー登録すると、メンバー追加やデータの永続保存ができるようになります。",
    registerCta: "ファミリーを本登録する",
  },
  accountInfo: {
    familyId: "ファミリーID",
    memberId: "メンバーID",
  },
  memberSection: {
    heading: "家族メンバー管理",
    role: { admin: "代表者", member: "メンバー" },
    countLabel: (count, limit) => `${count} / ${limit}名`,
    addedNotice: (memberId) => `メンバー「${memberId}」を追加しました。`,
    initialPasswordLabel: "初期パスワード：",
    passwordNotice: "このパスワードをメンバーに伝えてください。初回ログイン時に変更が必要です。",
    limitReached: "メンバー数の上限に達しています。追加するにはプランのアップグレードが必要です。",
    displayNameLabel: "表示名",
    displayNamePlaceholder: "例: 次女",
    memberIdLabel: "メンバーID",
    memberIdPlaceholder: "例: jijo",
    submitButton: "メンバーを追加",
    errors: {
      nameRequired: "表示名を入力してください",
      invalidMemberId: "メンバーIDは半角英数字・アンダースコア・ハイフンで2〜20文字",
      duplicateMemberId: "このメンバーIDは既に使用されています",
    },
  },
  languageSection: {
    label: "表示言語",
  },
  planSection: {
    heading: "プラン・利用状況",
    planNames: {
      guest: "Fitting Plan（お試し）",
      free: "Chest Plan（有料）",
      paid: "Walk-in Plan（有料）",
    },
    memberCountLabel: "メンバー数",
    itemCountLabel: "登録着数",
    memberCountValue: (count, limit) => `${count} / ${limit}名`,
    itemCountValue: (count, limit) => `${count} / ${limit}着`,
    upgradeCta: "プランをアップグレード",
  },
};

const en: SettingsDictionary = {
  headerTitle: "Settings",
  pageTitle: "Family & Member Settings",
  guestBanner: {
    trialNotice: (days) => `You're on a free trial (${days} days left)`,
    trialDesc: "Register your family officially to add members and keep your data permanently.",
    registerCta: "Complete family registration",
  },
  accountInfo: {
    familyId: "Family ID",
    memberId: "Member ID",
  },
  memberSection: {
    heading: "Family Members",
    role: { admin: "Owner", member: "Member" },
    countLabel: (count, limit) => `${count} / ${limit} members`,
    addedNotice: (memberId) => `Member "${memberId}" has been added.`,
    initialPasswordLabel: "Initial password: ",
    passwordNotice: "Share this password with the member. It must be changed at first login.",
    limitReached: "You've reached the member limit. Upgrade your plan to add more members.",
    displayNameLabel: "Display name",
    displayNamePlaceholder: "e.g. Younger daughter",
    memberIdLabel: "Member ID",
    memberIdPlaceholder: "e.g. jijo",
    submitButton: "Add member",
    errors: {
      nameRequired: "Please enter a display name",
      invalidMemberId: "Member ID must be 2-20 alphanumeric characters, underscores, or hyphens",
      duplicateMemberId: "This member ID is already in use",
    },
  },
  languageSection: {
    label: "Display language",
  },
  planSection: {
    heading: "Plan & Usage",
    planNames: {
      guest: "Fitting Plan (Trial)",
      free: "Chest Plan (Paid)",
      paid: "Walk-in Plan (Paid)",
    },
    memberCountLabel: "Members",
    itemCountLabel: "Registered items",
    memberCountValue: (count, limit) => `${count} / ${limit} members`,
    itemCountValue: (count, limit) => `${count} / ${limit} items`,
    upgradeCta: "Upgrade plan",
  },
};

const zhCN: SettingsDictionary = {
  headerTitle: "设置",
  pageTitle: "家庭与成员设置",
  guestBanner: {
    trialNotice: (days) => `试用中（剩余${days}天）`,
    trialDesc: "完成正式的家庭注册后，即可添加成员并永久保存数据。",
    registerCta: "完成家庭注册",
  },
  accountInfo: {
    familyId: "家庭ID",
    memberId: "成员ID",
  },
  memberSection: {
    heading: "家庭成员管理",
    role: { admin: "代表人", member: "成员" },
    countLabel: (count, limit) => `${count} / ${limit}人`,
    addedNotice: (memberId) => `已添加成员「${memberId}」。`,
    initialPasswordLabel: "初始密码：",
    passwordNotice: "请将此密码告知该成员。首次登录时需要修改密码。",
    limitReached: "已达到成员数量上限。升级套餐后可继续添加成员。",
    displayNameLabel: "显示名称",
    displayNamePlaceholder: "例：小女儿",
    memberIdLabel: "成员ID",
    memberIdPlaceholder: "例：jijo",
    submitButton: "添加成员",
    errors: {
      nameRequired: "请输入显示名称",
      invalidMemberId: "成员ID须为2〜20位的半角英数字、下划线或连字符",
      duplicateMemberId: "该成员ID已被使用",
    },
  },
  languageSection: {
    label: "显示语言",
  },
  planSection: {
    heading: "套餐与使用情况",
    planNames: {
      guest: "Fitting 套餐（试用）",
      free: "Chest 套餐（付费）",
      paid: "Walk-in 套餐（付费）",
    },
    memberCountLabel: "成员数",
    itemCountLabel: "登记衣物数",
    memberCountValue: (count, limit) => `${count} / ${limit}人`,
    itemCountValue: (count, limit) => `${count} / ${limit}件`,
    upgradeCta: "升级套餐",
  },
};

const zhTW: SettingsDictionary = {
  headerTitle: "設定",
  pageTitle: "家庭與成員設定",
  guestBanner: {
    trialNotice: (days) => `試用中（剩餘${days}天）`,
    trialDesc: "完成正式的家庭註冊後，即可新增成員並永久保存資料。",
    registerCta: "完成家庭註冊",
  },
  accountInfo: {
    familyId: "家庭ID",
    memberId: "成員ID",
  },
  memberSection: {
    heading: "家庭成員管理",
    role: { admin: "代表人", member: "成員" },
    countLabel: (count, limit) => `${count} / ${limit}人`,
    addedNotice: (memberId) => `已新增成員「${memberId}」。`,
    initialPasswordLabel: "初始密碼：",
    passwordNotice: "請將此密碼告知該成員。首次登入時需要修改密碼。",
    limitReached: "已達成員數量上限。升級方案後可繼續新增成員。",
    displayNameLabel: "顯示名稱",
    displayNamePlaceholder: "例：小女兒",
    memberIdLabel: "成員ID",
    memberIdPlaceholder: "例：jijo",
    submitButton: "新增成員",
    errors: {
      nameRequired: "請輸入顯示名稱",
      invalidMemberId: "成員ID須為2〜20位的半形英數字、底線或連字號",
      duplicateMemberId: "該成員ID已被使用",
    },
  },
  languageSection: {
    label: "顯示語言",
  },
  planSection: {
    heading: "方案與使用狀況",
    planNames: {
      guest: "Fitting 方案（試用）",
      free: "Chest 方案（付費）",
      paid: "Walk-in 方案（付費）",
    },
    memberCountLabel: "成員數",
    itemCountLabel: "登記衣物數",
    memberCountValue: (count, limit) => `${count} / ${limit}人`,
    itemCountValue: (count, limit) => `${count} / ${limit}件`,
    upgradeCta: "升級方案",
  },
};

export const SETTINGS_DICTIONARIES: Record<LanguageCode, SettingsDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};
