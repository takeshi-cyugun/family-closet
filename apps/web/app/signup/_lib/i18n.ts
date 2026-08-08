import type { LanguageCode } from "../../_lib/i18n";

export type SignupDictionary = {
  headerBrand: string;
  pageTitle: string;
  pageSubtitle: string;
  methodChoice: {
    heading: string;
    emailButton: string;
    emailDescription: string;
    googleButton: string;
    googleDescription: string;
    googleRedirecting: string;
    googleError: string;
  };
  agree: {
    prefix: string;
    terms: string;
    and: string;
    privacy: string;
    suffix: string;
  };
  emailStep: {
    back: string;
    fields: {
      email: { label: string; placeholder: string };
      password: { label: string; placeholder: string };
      passwordConfirm: { label: string };
    };
    errors: {
      email: string;
      password: string;
      passwordConfirm: string;
    };
    planSection: {
      heading: string;
      chestName: string;
      chestDescription: string;
      chestPrice: string;
      walkInName: string;
      walkInDescription: string;
      walkInPrice: string;
    };
    submit: {
      idle: string;
      submitting: string;
    };
  };
  success: {
    heading: string;
    emailLine: (email: string) => string;
    trialNotice: string;
    loginButton: string;
  };
};

const ja: SignupDictionary = {
  headerBrand: "ファミリークロゼット",
  pageTitle: "サインアップ",
  pageSubtitle: "家族代表アカウントを作成します。",
  methodChoice: {
    heading: "登録方法を選択してください",
    emailButton: "メールアドレスで登録",
    emailDescription: "自分で決めたパスワードでしっかり管理できます",
    googleButton: "Googleで登録",
    googleDescription: "パスワード入力不要、ワンタップですぐ始められます",
    googleRedirecting: "Googleに接続中...",
    googleError: "Google認証を開始できませんでした。もう一度お試しください。",
  },
  agree: {
    prefix: "",
    terms: "利用規約",
    and: "および",
    privacy: "プライバシーポリシー",
    suffix: "に同意する",
  },
  emailStep: {
    back: "戻る",
    fields: {
      email: { label: "メールアドレス", placeholder: "you@example.com" },
      password: { label: "パスワード", placeholder: "8文字以上の英数字混合" },
      passwordConfirm: { label: "パスワード（確認用）" },
    },
    errors: {
      email: "有効なメールアドレスを入力してください",
      password: "8文字以上の英数字混合で入力してください",
      passwordConfirm: "パスワードが一致しません",
    },
    planSection: {
      heading: "プランを選択してください",
      chestName: "チェストプラン",
      chestDescription: "メンバー5人・50着まで登録できます",
      chestPrice: "$5/月",
      walkInName: "ウォークインプラン",
      walkInDescription: "メンバー・着数どちらも無制限です",
      walkInPrice: "$15/月",
    },
    submit: {
      idle: "サインアップ",
      submitting: "送信中...",
    },
  },
  success: {
    heading: "確認メールを送信しました",
    emailLine: (email) => `${email} 宛に認証用URLを送信しました。`,
    trialNotice: "メール内のリンクをクリックすると、ファミリーの作成が完了します。",
    loginButton: "ログイン画面へ",
  },
};

const en: SignupDictionary = {
  headerBrand: "Family Closet",
  pageTitle: "Sign up",
  pageSubtitle: "Create your family owner account.",
  methodChoice: {
    heading: "Choose how you'd like to sign up",
    emailButton: "Sign up with email",
    emailDescription: "Set your own password and stay in full control",
    googleButton: "Sign up with Google",
    googleDescription: "No password needed — get started in one tap",
    googleRedirecting: "Connecting to Google...",
    googleError: "Couldn't start Google sign-in. Please try again.",
  },
  agree: {
    prefix: "I agree to the ",
    terms: "Terms of Service",
    and: " and ",
    privacy: "Privacy Policy",
    suffix: ".",
  },
  emailStep: {
    back: "Back",
    fields: {
      email: { label: "Email address", placeholder: "you@example.com" },
      password: { label: "Password", placeholder: "8+ characters, letters and numbers" },
      passwordConfirm: { label: "Password (confirm)" },
    },
    errors: {
      email: "Please enter a valid email address",
      password: "Please enter 8+ characters with letters and numbers",
      passwordConfirm: "Passwords do not match",
    },
    planSection: {
      heading: "Choose a plan",
      chestName: "Chest Plan",
      chestDescription: "Up to 5 members and 50 items",
      chestPrice: "$5/mo",
      walkInName: "Walk-in Plan",
      walkInDescription: "Unlimited members and items",
      walkInPrice: "$15/mo",
    },
    submit: {
      idle: "Sign up",
      submitting: "Submitting...",
    },
  },
  success: {
    heading: "Confirmation email sent",
    emailLine: (email) => `A verification link has been sent to ${email}.`,
    trialNotice: "Clicking the link in the email will finish setting up your family.",
    loginButton: "Go to login",
  },
};

const zhCN: SignupDictionary = {
  headerBrand: "家庭衣橱",
  pageTitle: "注册",
  pageSubtitle: "建立家庭代表人账户。",
  methodChoice: {
    heading: "请选择注册方式",
    emailButton: "使用邮箱注册",
    emailDescription: "自行设置密码，安全可控",
    googleButton: "使用Google注册",
    googleDescription: "无需输入密码，一键即可开始",
    googleRedirecting: "正在连接Google...",
    googleError: "无法启动Google登录，请重试。",
  },
  agree: {
    prefix: "我同意",
    terms: "服务条款",
    and: "和",
    privacy: "隐私政策",
    suffix: "。",
  },
  emailStep: {
    back: "返回",
    fields: {
      email: { label: "邮箱地址", placeholder: "you@example.com" },
      password: { label: "密码", placeholder: "8位以上英数字组合" },
      passwordConfirm: { label: "密码（确认）" },
    },
    errors: {
      email: "请输入有效的邮箱地址",
      password: "请输入8位以上英数字组合",
      passwordConfirm: "两次输入的密码不一致",
    },
    planSection: {
      heading: "请选择套餐",
      chestName: "Chest 套餐",
      chestDescription: "最多5名成员・50件物品",
      chestPrice: "$5/月",
      walkInName: "Walk-in 套餐",
      walkInDescription: "成员数与件数均无限制",
      walkInPrice: "$15/月",
    },
    submit: {
      idle: "注册",
      submitting: "提交中...",
    },
  },
  success: {
    heading: "确认邮件已发送",
    emailLine: (email) => `验证链接已发送至 ${email}。`,
    trialNotice: "点击邮件中的链接后，家庭账户即创建完成。",
    loginButton: "前往登录",
  },
};

const zhTW: SignupDictionary = {
  headerBrand: "家庭衣櫥",
  pageTitle: "註冊",
  pageSubtitle: "建立家庭代表人帳戶。",
  methodChoice: {
    heading: "請選擇註冊方式",
    emailButton: "使用電子郵件註冊",
    emailDescription: "自行設定密碼，安全可控",
    googleButton: "使用Google註冊",
    googleDescription: "無需輸入密碼，一鍵即可開始",
    googleRedirecting: "正在連接Google...",
    googleError: "無法啟動Google登入，請重試。",
  },
  agree: {
    prefix: "我同意",
    terms: "服務條款",
    and: "和",
    privacy: "隱私政策",
    suffix: "。",
  },
  emailStep: {
    back: "返回",
    fields: {
      email: { label: "電子郵件地址", placeholder: "you@example.com" },
      password: { label: "密碼", placeholder: "8位以上英數字組合" },
      passwordConfirm: { label: "密碼（確認）" },
    },
    errors: {
      email: "請輸入有效的電子郵件地址",
      password: "請輸入8位以上英數字組合",
      passwordConfirm: "兩次輸入的密碼不一致",
    },
    planSection: {
      heading: "請選擇方案",
      chestName: "Chest 方案",
      chestDescription: "最多5名成員・50件物品",
      chestPrice: "$5/月",
      walkInName: "Walk-in 方案",
      walkInDescription: "成員數與件數皆無限制",
      walkInPrice: "$15/月",
    },
    submit: {
      idle: "註冊",
      submitting: "送出中...",
    },
  },
  success: {
    heading: "確認郵件已寄送",
    emailLine: (email) => `驗證連結已寄送至 ${email}。`,
    trialNotice: "點擊郵件中的連結後，家庭帳戶即建立完成。",
    loginButton: "前往登入",
  },
};

const SIGNUP_DICTIONARIES: Record<LanguageCode, SignupDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export function getSignupDictionary(lang: LanguageCode = "ja"): SignupDictionary {
  return SIGNUP_DICTIONARIES[lang] ?? SIGNUP_DICTIONARIES.ja;
}
