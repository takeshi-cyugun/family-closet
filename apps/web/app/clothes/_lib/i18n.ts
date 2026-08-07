import type { LanguageCode } from "../../_lib/i18n";

export type ClothesFormDictionary = {
  headerTitle: string;
  photo: {
    label: string;
    selectCta: string;
    previewAlt: string;
    rotate: string;
    remove: string;
    analyzing: string;
  };
  fields: {
    name: { label: string; placeholder: string };
    category: { label: string; placeholder: string };
    size: string;
    color: { label: string; placeholder: string };
    season: string;
    owner: string;
    status: string;
    memo: string;
  };
  errors: {
    photoRequired: string;
    nameRequired: string;
    colorRequired: string;
    uploadIncomplete: string;
  };
  submit: {
    register: string;
    registering: string;
    save: string;
    saving: string;
    uploading: string;
  };
  delete: {
    link: string;
    confirm: string;
    cancel: string;
    confirmButton: string;
    deleting: string;
  };
  detail: {
    title: string;
    close: string;
    prevAria: string;
    nextAria: string;
    editButton: string;
  };
  limitModal: {
    title: string;
    descGuest: string;
    descMember: string;
    ctaGuest: string;
    ctaMember: string;
    close: string;
  };
};

const ja: ClothesFormDictionary = {
  headerTitle: "アイテム登録",
  photo: {
    label: "画像",
    selectCta: "画像を選択",
    previewAlt: "選択した写真のプレビュー",
    rotate: "90度回転",
    remove: "写真を削除",
    analyzing: "AI解析中...",
  },
  fields: {
    name: { label: "名前", placeholder: "例: ダウンコート" },
    category: { label: "カテゴリ", placeholder: "例: コート" },
    size: "サイズ",
    color: { label: "色", placeholder: "例: ネイビー" },
    season: "シーズン",
    owner: "オーナー",
    status: "ステータス",
    memo: "メモ（説明、収納場所）",
  },
  errors: {
    photoRequired: "写真を選択してください",
    nameRequired: "名前を入力してください",
    colorRequired: "色を入力してください",
    uploadIncomplete: "写真のアップロードが完了していません。もう一度写真を選択してください。",
  },
  submit: {
    register: "登録する",
    registering: "登録中...",
    save: "保存する",
    saving: "保存中...",
    uploading: "写真をアップロード中...",
  },
  delete: {
    link: "削除する",
    confirm: "本当に削除しますか？この操作は取り消せません。",
    cancel: "キャンセル",
    confirmButton: "削除する",
    deleting: "削除中...",
  },
  detail: {
    title: "洋服の詳細",
    close: "閉じる",
    prevAria: "前の洋服",
    nextAria: "次の洋服",
    editButton: "編集する",
  },
  limitModal: {
    title: "アイテム数の上限に達しました",
    descGuest: "お試し利用ではこれ以上登録できません。ファミリー登録すると、上限が増えて引き続きご利用いただけます。",
    descMember: "現在のプランの登録上限に達しています。プランをアップグレードすると、引き続き登録いただけます。",
    ctaGuest: "ファミリーを登録する",
    ctaMember: "プランをアップグレード",
    close: "閉じる",
  },
};

const en: ClothesFormDictionary = {
  headerTitle: "Item Registration",
  photo: {
    label: "Photo",
    selectCta: "Select image",
    previewAlt: "Preview of selected photo",
    rotate: "Rotate 90°",
    remove: "Remove photo",
    analyzing: "Analyzing with AI...",
  },
  fields: {
    name: { label: "Name", placeholder: "e.g. Down coat" },
    category: { label: "Category", placeholder: "e.g. Coat" },
    size: "Size",
    color: { label: "Color", placeholder: "e.g. Navy" },
    season: "Season",
    owner: "Owner",
    status: "Status",
    memo: "Memo (description, storage location)",
  },
  errors: {
    photoRequired: "Please select a photo",
    nameRequired: "Please enter a name",
    colorRequired: "Please enter a color",
    uploadIncomplete: "The photo upload hasn't finished. Please select the photo again.",
  },
  submit: {
    register: "Register",
    registering: "Registering...",
    save: "Save",
    saving: "Saving...",
    uploading: "Uploading photo...",
  },
  delete: {
    link: "Delete",
    confirm: "Are you sure you want to delete this? This action cannot be undone.",
    cancel: "Cancel",
    confirmButton: "Delete",
    deleting: "Deleting...",
  },
  detail: {
    title: "Item Details",
    close: "Close",
    prevAria: "Previous item",
    nextAria: "Next item",
    editButton: "Edit",
  },
  limitModal: {
    title: "Item limit reached",
    descGuest: "You've reached the trial limit. Register your family to raise the limit and keep adding items.",
    descMember: "You've reached your current plan's item limit. Upgrade your plan to keep adding items.",
    ctaGuest: "Register your family",
    ctaMember: "Upgrade plan",
    close: "Close",
  },
};

const zhCN: ClothesFormDictionary = {
  headerTitle: "登记物品",
  photo: {
    label: "图片",
    selectCta: "选择图片",
    previewAlt: "所选照片预览",
    rotate: "旋转90度",
    remove: "删除照片",
    analyzing: "AI 识别中...",
  },
  fields: {
    name: { label: "名称", placeholder: "例：羽绒服" },
    category: { label: "分类", placeholder: "例：大衣" },
    size: "尺寸",
    color: { label: "颜色", placeholder: "例：藏青色" },
    season: "季节",
    owner: "所有者",
    status: "状态",
    memo: "备注（说明、收纳位置）",
  },
  errors: {
    photoRequired: "请选择照片",
    nameRequired: "请输入名称",
    colorRequired: "请输入颜色",
    uploadIncomplete: "照片尚未上传完成，请重新选择照片。",
  },
  submit: {
    register: "登记",
    registering: "登记中...",
    save: "保存",
    saving: "保存中...",
    uploading: "照片上传中...",
  },
  delete: {
    link: "删除",
    confirm: "确定要删除吗？此操作无法撤销。",
    cancel: "取消",
    confirmButton: "删除",
    deleting: "删除中...",
  },
  detail: {
    title: "物品详情",
    close: "关闭",
    prevAria: "上一件",
    nextAria: "下一件",
    editButton: "编辑",
  },
  limitModal: {
    title: "已达到物品数量上限",
    descGuest: "试用模式下无法继续登记。完成家庭注册后可提高上限，继续使用。",
    descMember: "已达到当前套餐的登记上限。升级套餐后即可继续登记。",
    ctaGuest: "注册家庭",
    ctaMember: "升级套餐",
    close: "关闭",
  },
};

const zhTW: ClothesFormDictionary = {
  headerTitle: "登記物品",
  photo: {
    label: "圖片",
    selectCta: "選擇圖片",
    previewAlt: "所選照片預覽",
    rotate: "旋轉90度",
    remove: "刪除照片",
    analyzing: "AI 辨識中...",
  },
  fields: {
    name: { label: "名稱", placeholder: "例：羽絨外套" },
    category: { label: "分類", placeholder: "例：大衣" },
    size: "尺寸",
    color: { label: "顏色", placeholder: "例：藏青色" },
    season: "季節",
    owner: "擁有者",
    status: "狀態",
    memo: "備註（說明、收納位置）",
  },
  errors: {
    photoRequired: "請選擇照片",
    nameRequired: "請輸入名稱",
    colorRequired: "請輸入顏色",
    uploadIncomplete: "照片尚未上傳完成，請重新選擇照片。",
  },
  submit: {
    register: "登記",
    registering: "登記中...",
    save: "儲存",
    saving: "儲存中...",
    uploading: "照片上傳中...",
  },
  delete: {
    link: "刪除",
    confirm: "確定要刪除嗎？此操作無法復原。",
    cancel: "取消",
    confirmButton: "刪除",
    deleting: "刪除中...",
  },
  detail: {
    title: "物品詳情",
    close: "關閉",
    prevAria: "上一件",
    nextAria: "下一件",
    editButton: "編輯",
  },
  limitModal: {
    title: "已達到物品數量上限",
    descGuest: "試用模式下無法繼續登記。完成家庭註冊後可提高上限，繼續使用。",
    descMember: "已達到目前方案的登記上限。升級方案後即可繼續登記。",
    ctaGuest: "註冊家庭",
    ctaMember: "升級方案",
    close: "關閉",
  },
};

const CLOTHES_FORM_DICTIONARIES: Record<LanguageCode, ClothesFormDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export function getClothesFormDictionary(lang: LanguageCode = "ja"): ClothesFormDictionary {
  return CLOTHES_FORM_DICTIONARIES[lang] ?? CLOTHES_FORM_DICTIONARIES.ja;
}
