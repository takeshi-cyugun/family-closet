import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | ファミリークロゼット",
};

const SECTIONS = [
  {
    title: "1. 基本方針",
    body: [
      "当社は、家族向け衣類管理サービス「ファミリークロゼット」（以下「本サービス」といいます。）における利用者の個人情報の重要性を認識し、個人情報の保護に関する法律その他の関係法令を遵守し、適切に取り扱います。",
    ],
  },
  {
    title: "2. 取得する情報",
    body: [
      "本サービスでは、利用にあたり以下の情報を取得します。",
      "(1) 代表者のメールアドレス（本登録時）",
      "(2) ファミリーID、メンバーID、表示名、ログインパスワード（ハッシュ化して保存されます）",
      "(3) 洋服の写真画像、カテゴリ・色・サイズ・シーズン・使用状況・メモ等の登録情報",
      "(4) 表示言語などの設定情報",
      "(5) ログイン試行に関するアクセスログ（不正アクセス防止の目的で、IPアドレス等を含みます）",
      "(6) お試し利用（フィッティングプラン）時にブラウザに保存される匿名の識別情報",
    ],
  },
  {
    title: "3. 利用目的",
    body: [
      "取得した情報は、以下の目的の範囲内で利用します。",
      "(1) 本サービスの提供、本人確認および認証のため",
      "(2) 写真からカテゴリ・色を自動認識するAI解析機能を提供するため",
      "(3) 不正利用・不正アクセスの防止、利用規約に違反する行為への対応のため",
      "(4) 料金プランの管理および課金処理のため",
      "(5) お問い合わせへの対応のため",
      "(6) 本サービスの改善、新機能の検討のため",
    ],
  },
  {
    title: "4. 第三者への提供・業務委託",
    body: [
      "当社は、以下の外部サービスに業務を委託し、その範囲内で必要な情報を提供します。委託先には、適切な管理を求めます。",
      "(1) Supabase（データベース、認証基盤、画像ストレージの提供）",
      "(2) Google（Gemini API）（登録された洋服写真をカテゴリ・色の自動認識のために送信します）",
      "(3) メール配信事業者（登録確認メール等の送信）",
      "上記のほか、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供することはありません。",
    ],
  },
  {
    title: "5. 家族間での情報共有",
    body: [
      "本サービスの性質上、登録した洋服の写真・カテゴリ・色・使用状況等の情報は、同一ファミリーIDに属する他のメンバーから閲覧可能です。ファミリー内での共有範囲を十分にご理解の上、ご登録ください。",
    ],
  },
  {
    title: "6. データの保存期間",
    body: [
      "1. 本登録済みのファミリーのデータは、当社所定の方法による解約・退会手続きが完了するまで保存します。",
      "2. 登録不要のお試し利用（フィッティングプラン）は、初回利用開始から14日以内に本登録（有料プランへの移行）が行われない場合、登録データを予告なく削除することがあります。",
    ],
  },
  {
    title: "7. Cookie等の利用",
    body: [
      "本サービスでは、ログイン状態の維持のためCookieを利用します。また、お試し利用（フィッティングプラン）の識別および表示言語の記憶のため、ブラウザのlocalStorageを利用します。これらは本サービスの機能提供に必要な範囲でのみ利用し、広告目的のトラッキングには利用しません。",
    ],
  },
  {
    title: "8. 安全管理措置",
    body: [
      "当社は、取得した個人情報の漏えい、滅失またはき損の防止その他の個人情報の安全管理のために、パスワードのハッシュ化、通信の暗号化（TLS）その他の必要かつ適切な措置を講じます。ただし、本サービスは開発中の段階にあり、ファミリー間のデータアクセス制御（行レベルセキュリティ等）は今後強化される予定です。",
    ],
  },
  {
    title: "9. 開示・訂正・削除等の請求",
    body: [
      "利用者は、当社の定める方法により、当社が保有する自己の個人情報の開示、訂正、追加、削除、利用停止を請求することができます。ご希望の場合は、下記お問い合わせ窓口までご連絡ください。",
    ],
  },
  {
    title: "10. プライバシーポリシーの変更",
    body: [
      "当社は、必要に応じて本ポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。",
    ],
  },
  {
    title: "11. お問い合わせ窓口",
    body: ["本ポリシーに関するお問い合わせは、本サービス内のお問い合わせ窓口までご連絡ください。"],
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream text-ink">
      <header className="flex h-14 items-center bg-espresso px-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight text-on-espresso">
          ファミリークロゼット
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="mb-2 font-serif text-2xl font-bold">プライバシーポリシー</h1>
        <p className="mb-8 text-xs text-ink-faint">制定日: 2026年8月5日</p>

        <div className="flex flex-col gap-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 font-serif text-base font-semibold text-ink">{section.title}</h2>
              <div className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink-soft">
                {section.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-ink-soft">以上</p>

        <div className="mt-10 border-t border-linen pt-6">
          <Link href="/" className="text-sm text-ink-soft underline">
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
