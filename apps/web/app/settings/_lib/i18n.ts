import type { LanguageCode } from "../../_lib/i18n";
import type { MemberRole } from "../../_lib/clothes";
import type { PlanTier } from "../_data/constants";

export type SettingsDictionary = {
  headerTitle: string;
  loading: string;
  pageTitle: string;
  guestBanner: {
    trialNotice: (days: number) => string;
    trialDesc: string;
    registerCta: string;
  };
  accountInfo: {
    familyNameLabel: string;
    memberNameLabel: string;
    editButton: string;
    saveButton: string;
    cancelButton: string;
    saving: string;
    familyNamePlaceholder: string;
    memberNamePlaceholder: string;
    updateError: string;
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
    qrButton: string;
    deleteButton: string;
    errors: {
      nameRequired: string;
      invalidMemberId: string;
      duplicateMemberId: string;
    };
    deleteModal: {
      heading: string;
      confirmSimple: string;
      itemsWarning: (count: number) => string;
      reassignOption: string;
      deleteItemsOption: string;
      confirmButton: string;
      cancelButton: string;
      deleting: string;
      loadError: string;
      deleteError: string;
    };
    qrModal: {
      heading: string;
      description: string;
      qrTab: string;
      urlTab: string;
      copyButton: string;
      copiedNotice: string;
      closeButton: string;
      loadError: string;
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
  loading: "読み込み中...",
  pageTitle: "ファミリー・メンバー設定",
  guestBanner: {
    trialNotice: (days) => `お試し利用中です（残り${days}日）`,
    trialDesc: "正式にファミリー登録すると、メンバー追加やデータの永続保存ができるようになります。",
    registerCta: "ファミリーを本登録する",
  },
  accountInfo: {
    familyNameLabel: "ファミリー名",
    memberNameLabel: "メンバー",
    editButton: "編集",
    saveButton: "保存",
    cancelButton: "キャンセル",
    saving: "保存中...",
    familyNamePlaceholder: "例: 山田家",
    memberNamePlaceholder: "例: パパ",
    updateError: "更新に失敗しました。",
  },
  memberSection: {
    heading: "家族メンバー管理",
    role: { admin: "代表者", member: "メンバー" },
    countLabel: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}名` : `${count} / 無制限`,
    addedNotice: (memberId) => `メンバー「${memberId}」を追加しました。`,
    initialPasswordLabel: "初期パスワード：",
    passwordNotice: "このパスワードをメンバーに伝えてください。初回ログイン時に変更が必要です。",
    limitReached: "メンバー数の上限に達しています。追加するにはプランのアップグレードが必要です。",
    displayNameLabel: "表示名",
    displayNamePlaceholder: "例: 次女",
    memberIdLabel: "メンバーID",
    memberIdPlaceholder: "例: jijo",
    submitButton: "メンバーを追加",
    qrButton: "QRコード表示",
    deleteButton: "削除",
    errors: {
      nameRequired: "表示名を入力してください",
      invalidMemberId: "メンバーIDは半角英数字・アンダースコア・ハイフンで2〜20文字",
      duplicateMemberId: "このメンバーIDは既に使用されています",
    },
    deleteModal: {
      heading: "メンバーを削除",
      confirmSimple: "このメンバーを削除しますか？この操作は取り消せません。",
      itemsWarning: (count) => `このメンバーは${count}着のアイテムを所有しています。削除前にどうするか選んでください。`,
      reassignOption: "アイテムを代表者名義に引き継ぐ",
      deleteItemsOption: "アイテムも一緒に削除する",
      confirmButton: "削除する",
      cancelButton: "キャンセル",
      deleting: "削除中...",
      loadError: "情報の取得に失敗しました。",
      deleteError: "削除に失敗しました。",
    },
    qrModal: {
      heading: "メンバーを招待",
      description: "このQRコードまたはURLを招待したい家族に共有してください。読み取る（開く）と表示名の入力だけで参加できます。",
      qrTab: "QRコード",
      urlTab: "招待URL",
      copyButton: "コピー",
      copiedNotice: "コピーしました",
      closeButton: "閉じる",
      loadError: "招待情報の取得に失敗しました。",
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
    memberCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}名` : `${count} / 無制限`,
    itemCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}着` : `${count} / 無制限`,
    upgradeCta: "プランをアップグレード",
  },
};

const en: SettingsDictionary = {
  headerTitle: "Settings",
  loading: "Loading...",
  pageTitle: "Family & Member Settings",
  guestBanner: {
    trialNotice: (days) => `You're on a free trial (${days} days left)`,
    trialDesc: "Register your family officially to add members and keep your data permanently.",
    registerCta: "Complete family registration",
  },
  accountInfo: {
    familyNameLabel: "Family name",
    memberNameLabel: "Member",
    editButton: "Edit",
    saveButton: "Save",
    cancelButton: "Cancel",
    saving: "Saving...",
    familyNamePlaceholder: "e.g. The Smiths",
    memberNamePlaceholder: "e.g. Dad",
    updateError: "Failed to update.",
  },
  memberSection: {
    heading: "Family Members",
    role: { admin: "Owner", member: "Member" },
    countLabel: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit} members` : `${count} / Unlimited members`,
    addedNotice: (memberId) => `Member "${memberId}" has been added.`,
    initialPasswordLabel: "Initial password: ",
    passwordNotice: "Share this password with the member. It must be changed at first login.",
    limitReached: "You've reached the member limit. Upgrade your plan to add more members.",
    displayNameLabel: "Display name",
    displayNamePlaceholder: "e.g. Younger daughter",
    memberIdLabel: "Member ID",
    memberIdPlaceholder: "e.g. jijo",
    submitButton: "Add member",
    qrButton: "Show QR code",
    deleteButton: "Remove",
    errors: {
      nameRequired: "Please enter a display name",
      invalidMemberId: "Member ID must be 2-20 alphanumeric characters, underscores, or hyphens",
      duplicateMemberId: "This member ID is already in use",
    },
    deleteModal: {
      heading: "Remove member",
      confirmSimple: "Remove this member? This action cannot be undone.",
      itemsWarning: (count) => `This member owns ${count} item(s). Choose what to do with them before removing.`,
      reassignOption: "Transfer items to the owner",
      deleteItemsOption: "Delete the items too",
      confirmButton: "Remove",
      cancelButton: "Cancel",
      deleting: "Removing...",
      loadError: "Failed to load info.",
      deleteError: "Failed to remove member.",
    },
    qrModal: {
      heading: "Invite a member",
      description: "Share this QR code or URL with the family member you'd like to invite. Scanning or opening it lets them join by just entering a display name.",
      qrTab: "QR code",
      urlTab: "Invite URL",
      copyButton: "Copy",
      copiedNotice: "Copied",
      closeButton: "Close",
      loadError: "Failed to load invite info.",
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
    memberCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit} members` : `${count} / Unlimited members`,
    itemCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit} items` : `${count} / Unlimited items`,
    upgradeCta: "Upgrade plan",
  },
};

const zhCN: SettingsDictionary = {
  headerTitle: "设置",
  loading: "加载中...",
  pageTitle: "家庭与成员设置",
  guestBanner: {
    trialNotice: (days) => `试用中（剩余${days}天）`,
    trialDesc: "完成正式的家庭注册后，即可添加成员并永久保存数据。",
    registerCta: "完成家庭注册",
  },
  accountInfo: {
    familyNameLabel: "家庭名称",
    memberNameLabel: "成员",
    editButton: "编辑",
    saveButton: "保存",
    cancelButton: "取消",
    saving: "保存中...",
    familyNamePlaceholder: "例：山田家",
    memberNamePlaceholder: "例：爸爸",
    updateError: "更新失败。",
  },
  memberSection: {
    heading: "家庭成员管理",
    role: { admin: "代表人", member: "成员" },
    countLabel: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}人` : `${count} / 无限`,
    addedNotice: (memberId) => `已添加成员「${memberId}」。`,
    initialPasswordLabel: "初始密码：",
    passwordNotice: "请将此密码告知该成员。首次登录时需要修改密码。",
    limitReached: "已达到成员数量上限。升级套餐后可继续添加成员。",
    displayNameLabel: "显示名称",
    displayNamePlaceholder: "例：小女儿",
    memberIdLabel: "成员ID",
    memberIdPlaceholder: "例：jijo",
    submitButton: "添加成员",
    qrButton: "显示二维码",
    deleteButton: "删除",
    errors: {
      nameRequired: "请输入显示名称",
      invalidMemberId: "成员ID须为2〜20位的半角英数字、下划线或连字符",
      duplicateMemberId: "该成员ID已被使用",
    },
    deleteModal: {
      heading: "删除成员",
      confirmSimple: "确定要删除该成员吗？此操作无法撤销。",
      itemsWarning: (count) => `该成员拥有 ${count} 件物品。请选择删除前的处理方式。`,
      reassignOption: "将物品转移给代表人",
      deleteItemsOption: "同时删除物品",
      confirmButton: "删除",
      cancelButton: "取消",
      deleting: "删除中...",
      loadError: "获取信息失败。",
      deleteError: "删除失败。",
    },
    qrModal: {
      heading: "邀请成员",
      description: "将此二维码或链接分享给想邀请的家人。扫描或打开后，只需输入显示名称即可加入。",
      qrTab: "二维码",
      urlTab: "邀请链接",
      copyButton: "复制",
      copiedNotice: "已复制",
      closeButton: "关闭",
      loadError: "获取邀请信息失败。",
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
    memberCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}人` : `${count} / 无限`,
    itemCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}件` : `${count} / 无限`,
    upgradeCta: "升级套餐",
  },
};

const zhTW: SettingsDictionary = {
  headerTitle: "設定",
  loading: "載入中...",
  pageTitle: "家庭與成員設定",
  guestBanner: {
    trialNotice: (days) => `試用中（剩餘${days}天）`,
    trialDesc: "完成正式的家庭註冊後，即可新增成員並永久保存資料。",
    registerCta: "完成家庭註冊",
  },
  accountInfo: {
    familyNameLabel: "家庭名稱",
    memberNameLabel: "成員",
    editButton: "編輯",
    saveButton: "儲存",
    cancelButton: "取消",
    saving: "儲存中...",
    familyNamePlaceholder: "例：山田家",
    memberNamePlaceholder: "例：爸爸",
    updateError: "更新失敗。",
  },
  memberSection: {
    heading: "家庭成員管理",
    role: { admin: "代表人", member: "成員" },
    countLabel: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}人` : `${count} / 無限`,
    addedNotice: (memberId) => `已新增成員「${memberId}」。`,
    initialPasswordLabel: "初始密碼：",
    passwordNotice: "請將此密碼告知該成員。首次登入時需要修改密碼。",
    limitReached: "已達成員數量上限。升級方案後可繼續新增成員。",
    displayNameLabel: "顯示名稱",
    displayNamePlaceholder: "例：小女兒",
    memberIdLabel: "成員ID",
    memberIdPlaceholder: "例：jijo",
    submitButton: "新增成員",
    qrButton: "顯示QR碼",
    deleteButton: "刪除",
    errors: {
      nameRequired: "請輸入顯示名稱",
      invalidMemberId: "成員ID須為2〜20位的半形英數字、底線或連字號",
      duplicateMemberId: "該成員ID已被使用",
    },
    deleteModal: {
      heading: "刪除成員",
      confirmSimple: "確定要刪除該成員嗎？此操作無法復原。",
      itemsWarning: (count) => `該成員擁有 ${count} 件物品。請選擇刪除前的處理方式。`,
      reassignOption: "將物品轉移給代表人",
      deleteItemsOption: "同時刪除物品",
      confirmButton: "刪除",
      cancelButton: "取消",
      deleting: "刪除中...",
      loadError: "取得資訊失敗。",
      deleteError: "刪除失敗。",
    },
    qrModal: {
      heading: "邀請成員",
      description: "將此QR碼或連結分享給想邀請的家人。掃描或開啟後，只需輸入顯示名稱即可加入。",
      qrTab: "QR碼",
      urlTab: "邀請連結",
      copyButton: "複製",
      copiedNotice: "已複製",
      closeButton: "關閉",
      loadError: "取得邀請資訊失敗。",
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
    memberCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}人` : `${count} / 無限`,
    itemCountValue: (count, limit) => Number.isFinite(limit) ? `${count} / ${limit}件` : `${count} / 無限`,
    upgradeCta: "升級方案",
  },
};

export const SETTINGS_DICTIONARIES: Record<LanguageCode, SettingsDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};
