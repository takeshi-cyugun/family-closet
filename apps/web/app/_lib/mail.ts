const RESEND_API_URL = 'https://api.resend.com/emails';

// ファミリー作成完了メール送信（Supabaseの確認メールとは別の2通目）。
// RESEND_API_KEY未設定時は開発環境等とみなし、エラーにせず送信をスキップする。
export async function sendFamilyCreatedEmail(to: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set; skipping family-created email to', to);
    return;
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@family-closet.com',
      to,
      subject: 'ファミリークロゼットへようこそ！アカウント作成が完了しました',
      html: `
        <p>ファミリークロゼットへのご登録ありがとうございます。</p>
        <p>アカウントの作成が完了しました。ログイン画面からメールアドレスとパスワードでログインしてください。</p>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend API error (${response.status}): ${text}`);
  }
}
