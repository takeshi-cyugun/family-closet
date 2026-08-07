import type { LanguageCode } from "./i18n";

export type HomeDictionary = {
  appName: string;
  tagline: string;
  guestCta: string;
  registerCta: string;
  features: { icon: string; title: string; description: string }[];
  loginHeading: string;
  loginForm: {
    familyId: string;
    memberId: string;
    password: string;
    missingFields: string;
    locked: (countdown: string) => string;
    loggingIn: string;
    login: string;
  };
  ownerLoginForm: {
    email: string;
    password: string;
    missingFields: string;
    locked: (countdown: string) => string;
    loggingIn: string;
    login: string;
  };
  footer: {
    terms: string;
    privacy: string;
    languageSelect: string;
  };
};

const ja: HomeDictionary = {
  appName: "ファミリークロゼット",
  tagline:
    "誰のどの服が、どこにあるか。写真を撮るだけでAIが自動整理。家族みんなで共有できるクローゼット管理アプリです。",
  guestCta: "まずはお試し（登録不要）",
  registerCta: "ファミリーを新規作成",
  features: [
    {
      icon: "👨‍👩‍👧‍👦",
      title: "家族で共有",
      description: "誰のどの服が使用中か保管中かを、家族みんなでいつでも確認できます。",
    },
    {
      icon: "🤖",
      title: "AI自動タグ付け",
      description: "写真を撮るだけでカテゴリや色をAIが自動認識。入力の手間を省きます。",
    },
  ],
  loginHeading: "ログイン",
  loginForm: {
    familyId: "ファミリーID",
    memberId: "メンバーID",
    password: "パスワード",
    missingFields: "ファミリーID・メンバーID・パスワードを入力してください",
    locked: (countdown) => `ロック中（残り ${countdown}）`,
    loggingIn: "ログイン中...",
    login: "ログイン",
  },
  ownerLoginForm: {
    email: "メールアドレス",
    password: "パスワード",
    missingFields: "メールアドレスとパスワードを入力してください",
    locked: (countdown) => `ロック中（残り ${countdown}）`,
    loggingIn: "ログイン中...",
    login: "ログイン",
  },
  footer: {
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    languageSelect: "言語選択",
  },
};

const en: HomeDictionary = {
  appName: "Family Closet",
  tagline:
    "See whose clothes are where at a glance. Just snap a photo and AI organizes it for you. A closet management app the whole family can share.",
  guestCta: "Try it now (no sign-up)",
  registerCta: "Create a new family",
  features: [
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Share with family",
      description: "See who owns which clothes and whether they're in use or stored, anytime.",
    },
    {
      icon: "🤖",
      title: "AI auto-tagging",
      description: "Just take a photo — AI recognizes the category and color for you automatically.",
    },
  ],
  loginHeading: "Log in",
  loginForm: {
    familyId: "Family ID",
    memberId: "Member ID",
    password: "Password",
    missingFields: "Please enter your Family ID, Member ID, and password",
    locked: (countdown) => `Locked (${countdown} remaining)`,
    loggingIn: "Logging in...",
    login: "Log in",
  },
  ownerLoginForm: {
    email: "Email address",
    password: "Password",
    missingFields: "Please enter your email address and password",
    locked: (countdown) => `Locked (${countdown} remaining)`,
    loggingIn: "Logging in...",
    login: "Log in",
  },
  footer: {
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    languageSelect: "Select language",
  },
};

const zhCN: HomeDictionary = {
  appName: "家庭衣橱",
  tagline: "谁的哪件衣服放在哪里，一目了然。只需拍照，AI 自动整理。家人可共同使用的衣橱管理应用。",
  guestCta: "立即试用（无需注册）",
  registerCta: "创建新家庭",
  features: [
    {
      icon: "👨‍👩‍👧‍👦",
      title: "家人共享",
      description: "随时确认谁的哪件衣服正在使用中或保管中。",
    },
    {
      icon: "🤖",
      title: "AI 自动标记",
      description: "只需拍照，AI 会自动识别分类和颜色，省去手动输入的麻烦。",
    },
  ],
  loginHeading: "登录",
  loginForm: {
    familyId: "家庭ID",
    memberId: "成员ID",
    password: "密码",
    missingFields: "请输入家庭ID、成员ID和密码",
    locked: (countdown) => `锁定中（剩余 ${countdown}）`,
    loggingIn: "登录中...",
    login: "登录",
  },
  ownerLoginForm: {
    email: "邮箱地址",
    password: "密码",
    missingFields: "请输入邮箱地址和密码",
    locked: (countdown) => `锁定中（剩余 ${countdown}）`,
    loggingIn: "登录中...",
    login: "登录",
  },
  footer: {
    terms: "服务条款",
    privacy: "隐私政策",
    languageSelect: "选择语言",
  },
};

const zhTW: HomeDictionary = {
  appName: "家庭衣櫥",
  tagline: "誰的哪件衣服放在哪裡，一目瞭然。只需拍照，AI 自動整理。家人可共同使用的衣櫥管理應用程式。",
  guestCta: "立即試用（無需註冊）",
  registerCta: "建立新家庭",
  features: [
    {
      icon: "👨‍👩‍👧‍👦",
      title: "家人共享",
      description: "隨時確認誰的哪件衣服正在使用中或保管中。",
    },
    {
      icon: "🤖",
      title: "AI 自動標記",
      description: "只需拍照，AI 會自動辨識分類和顏色，省去手動輸入的麻煩。",
    },
  ],
  loginHeading: "登入",
  loginForm: {
    familyId: "家庭ID",
    memberId: "成員ID",
    password: "密碼",
    missingFields: "請輸入家庭ID、成員ID和密碼",
    locked: (countdown) => `鎖定中（剩餘 ${countdown}）`,
    loggingIn: "登入中...",
    login: "登入",
  },
  ownerLoginForm: {
    email: "電子郵件地址",
    password: "密碼",
    missingFields: "請輸入電子郵件地址和密碼",
    locked: (countdown) => `鎖定中（剩餘 ${countdown}）`,
    loggingIn: "登入中...",
    login: "登入",
  },
  footer: {
    terms: "服務條款",
    privacy: "隱私政策",
    languageSelect: "選擇語言",
  },
};

const HOME_DICTIONARIES: Record<LanguageCode, HomeDictionary> = {
  ja,
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export function getHomeDictionary(lang: LanguageCode = "ja"): HomeDictionary {
  return HOME_DICTIONARIES[lang] ?? HOME_DICTIONARIES.ja;
}
