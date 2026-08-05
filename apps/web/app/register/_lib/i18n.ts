import type { LanguageCode } from "../../_lib/i18n";

export type RegisterDictionary = {
  headerBrand: string;
  pageTitle: string;
  pageSubtitle: string;
  fields: {
    email: { label: string; placeholder: string };
    password: { label: string; placeholder: string };
    passwordConfirm: { label: string };
    memberId: { label: string; placeholder: string };
    displayName: { label: string; placeholder: string };
  };
  familyId: {
    label: string;
    placeholder: string;
    status: {
      invalid: string;
      checking: string;
      available: string;
      taken: string;
    };
  };
  errors: {
    email: string;
    password: string;
    passwordConfirm: string;
    familyId: string;
    memberId: string;
    displayName: string;
    agreeTerms: string;
  };
  planSection: {
    heading: string;
    chest: string;
    walkIn: string;
  };
  migrateGuestData: (count: number) => string;
  agree: {
    prefix: string;
    terms: string;
    and: string;
    privacy: string;
    suffix: string;
  };
  submit: {
    creating: string;
    create: string;
  };
  success: {
    heading: string;
    familyIdLine: (familyId: string) => string;
    emailLine: (email: string) => string;
    migratedNotice: (count: number) => string;
    confirmNotice: string;
    backToTop: string;
  };
};

const ja: RegisterDictionary = {
  headerBrand: "ファミリークロゼット",
  pageTitle: "ファミリーを新規作成",
  pageSubtitle: "代表者アカウントを作成します。",
  fields: {
    email: { label: "代表者メールアドレス", placeholder: "you@example.com" },
    password: { label: "代表者パスワード", placeholder: "8文字以上の英数字混合" },
    passwordConfirm: { label: "パスワード(確認用)" },
    memberId: { label: "代表者メンバーID", placeholder: "例: dad, taro" },
    displayName: { label: "代表者表示名", placeholder: "例: パパ" },
  },
  familyId: {
    label: "希望ファミリーID",
    placeholder: "例: yamada-family",
    status: {
      invalid: "半角英数字とハイフンのみ、3文字以上で入力してください",
      checking: "確認中...",
      available: "✓ このIDは使用できます",
      taken: "✕ このIDは既に使用されています",
    },
  },
  errors: {
    email: "有効なメールアドレスを入力してください",
    password: "8文字以上の英数字混合で入力してください",
    passwordConfirm: "パスワードが一致しません",
    familyId: "利用可能なファミリーIDを入力してください",
    memberId: "半角英数字・アンダースコア・ハイフンで2〜20文字",
    displayName: "表示名を入力してください",
    agreeTerms: "利用規約とプライバシーポリシーへの同意が必要です",
  },
  planSection: {
    heading: "プラン選択",
    chest: "チェストプラン（有料・メンバー5人まで・50着まで）",
    walkIn: "ウォークインプラン（有料・メンバー数/着数無制限）",
  },
  migrateGuestData: (count) => `お試し利用中のデータ(${count}着)を引き継ぐ`,
  agree: {
    prefix: "",
    terms: "利用規約",
    and: "および",
    privacy: "プライバシーポリシー",
    suffix: "に同意する",
  },
  submit: {
    creating: "作成中...",
    create: "ファミリーを作成して始める",
  },
  success: {
    heading: "ファミリーを作成しました",
    familyIdLine: (familyId) => `ファミリーID「${familyId}」を作成しました。`,
    emailLine: (email) => `${email} 宛に確認メールを送信しましたので、メール内のリンクをクリックしてください。`,
    migratedNotice: (count) => `お試し利用中の洋服データ${count}着を引き継ぎました。`,
    confirmNotice: "メール確認が完了するまでログインできません。",
    backToTop: "トップに戻る",
  },
};

const en: RegisterDictionary = {
  headerBrand: "Family Closet",
  pageTitle: "Create a new family",
  pageSubtitle: "Create the owner account for your family.",
  fields: {
    email: { label: "Owner email address", placeholder: "you@example.com" },
    password: { label: "Owner password", placeholder: "8+ characters, letters and numbers" },
    passwordConfirm: { label: "Password (confirm)" },
    memberId: { label: "Owner member ID", placeholder: "e.g. dad, taro" },
    displayName: { label: "Owner display name", placeholder: "e.g. Dad" },
  },
  familyId: {
    label: "Desired Family ID",
    placeholder: "e.g. yamada-family",
    status: {
      invalid: "Use only letters, numbers, and hyphens, 3+ characters",
      checking: "Checking...",
      available: "✓ This ID is available",
      taken: "✕ This ID is already taken",
    },
  },
  errors: {
    email: "Please enter a valid email address",
    password: "Please enter 8+ characters with letters and numbers",
    passwordConfirm: "Passwords do not match",
    familyId: "Please enter an available Family ID",
    memberId: "2-20 alphanumeric characters, underscores, or hyphens",
    displayName: "Please enter a display name",
    agreeTerms: "You must agree to the Terms of Service and Privacy Policy",
  },
  planSection: {
    heading: "Select a plan",
    chest: "Chest Plan (Paid — up to 5 members, up to 50 items)",
    walkIn: "Walk-in Plan (Paid — unlimited members and items)",
  },
  migrateGuestData: (count) => `Carry over trial data (${count} items)`,
  agree: {
    prefix: "I agree to the ",
    terms: "Terms of Service",
    and: " and ",
    privacy: "Privacy Policy",
    suffix: ".",
  },
  submit: {
    creating: "Creating...",
    create: "Create family and get started",
  },
  success: {
    heading: "Family created",
    familyIdLine: (familyId) => `Family ID "${familyId}" has been created.`,
    emailLine: (email) => `A confirmation email has been sent to ${email}. Please click the link in the email.`,
    migratedNotice: (count) => `Carried over ${count} items from your trial.`,
    confirmNotice: "You can't log in until email confirmation is complete.",
    backToTop: "Back to top",
  },
};

const zhCN: RegisterDictionary = {
  headerBrand: "家庭衣橱",
  pageTitle: "建立新家庭",
  pageSubtitle: "建立代表人账户。",
  fields: {
    email: { label: "代表人邮箱地址", placeholder: "you@example.com" },
    password: { label: "代表人密码", placeholder: "8位以上英数字组合" },
    passwordConfirm: { label: "密码（确认）" },
    memberId: { label: "代表人成员ID", placeholder: "例：dad、taro" },
    displayName: { label: "代表人显示名称", placeholder: "例：爸爸" },
  },
  familyId: {
    label: "期望的家庭ID",
    placeholder: "例：yamada-family",
    status: {
      invalid: "仅限半角英数字和连字符，3位以上",
      checking: "确认中...",
      available: "✓ 此ID可以使用",
      taken: "✕ 此ID已被使用",
    },
  },
  errors: {
    email: "请输入有效的邮箱地址",
    password: "请输入8位以上英数字组合",
    passwordConfirm: "两次输入的密码不一致",
    familyId: "请输入可用的家庭ID",
    memberId: "请输入2〜20位半角英数字、下划线或连字符",
    displayName: "请输入显示名称",
    agreeTerms: "需要同意服务条款和隐私政策",
  },
  planSection: {
    heading: "选择套餐",
    chest: "Chest 套餐（付费・最多5名成员・最多50件）",
    walkIn: "Walk-in 套餐（付费・成员数/件数无限制）",
  },
  migrateGuestData: (count) => `继承试用中的数据（${count}件）`,
  agree: {
    prefix: "我同意",
    terms: "服务条款",
    and: "和",
    privacy: "隐私政策",
    suffix: "。",
  },
  submit: {
    creating: "创建中...",
    create: "创建家庭并开始使用",
  },
  success: {
    heading: "家庭已创建",
    familyIdLine: (familyId) => `已创建家庭ID「${familyId}」。`,
    emailLine: (email) => `确认邮件已发送至 ${email}，请点击邮件中的链接。`,
    migratedNotice: (count) => `已继承试用中的${count}件衣物数据。`,
    confirmNotice: "邮箱确认完成前无法登录。",
    backToTop: "返回首页",
  },
};

const zhTW: RegisterDictionary = {
  headerBrand: "家庭衣櫥",
  pageTitle: "建立新家庭",
  pageSubtitle: "建立代表人帳戶。",
  fields: {
    email: { label: "代表人電子郵件地址", placeholder: "you@example.com" },
    password: { label: "代表人密碼", placeholder: "8位以上英數字組合" },
    passwordConfirm: { label: "密碼（確認）" },
    memberId: { label: "代表人成員ID", placeholder: "例：dad、taro" },
    displayName: { label: "代表人顯示名稱", placeholder: "例：爸爸" },
  },
  familyId: {
    label: "期望的家庭ID",
    placeholder: "例：yamada-family",
    status: {
      invalid: "僅限半形英數字和連字號，3位以上",
      checking: "確認中...",
      available: "✓ 此ID可以使用",
      taken: "✕ 此ID已被使用",
    },
  },
  errors: {
    email: "請輸入有效的電子郵件地址",
    password: "請輸入8位以上英數字組合",
    passwordConfirm: "兩次輸入的密碼不一致",
    familyId: "請輸入可用的家庭ID",
    memberId: "請輸入2〜20位半形英數字、底線或連字號",
    displayName: "請輸入顯示名稱",
    agreeTerms: "需要同意服務條款和隱私政策",
  },
  planSection: {
    heading: "選擇方案",
    chest: "Chest 方案（付費・最多5名成員・最多50件）",
    walkIn: "Walk-in 方案（付費・成員數/件數無限制）",
  },
  migrateGuestData: (count) => `繼承試用中的資料（${count}件）`,
  agree: {
    prefix: "我同意",
    terms: "服務條款",
    and: "和",
    privacy: "隱私政策",
    suffix: "。",
  },
  submit: {
    creating: "建立中...",
    create: "建立家庭並開始使用",
  },
  success: {
    heading: "家庭已建立",
    familyIdLine: (familyId) => `已建立家庭ID「${familyId}」。`,
    emailLine: (email) => `確認郵件已寄送至 ${email}，請點擊郵件中的連結。`,
    migratedNotice: (count) => `已繼承試用中的${count}件衣物資料。`,
    confirmNotice: "電子郵件確認完成前無法登入。",
    backToTop: "返回首頁",
  },
};

const REGISTER_DICTIONARIES: Record<LanguageCode, RegisterDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export function getRegisterDictionary(lang: LanguageCode = "ja"): RegisterDictionary {
  return REGISTER_DICTIONARIES[lang] ?? REGISTER_DICTIONARIES.ja;
}
