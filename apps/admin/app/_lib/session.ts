import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7日

// 単一管理者アカウントのMVP実装のため、DBセッションテーブルは持たず、
// ADMIN_SESSION_SECRET に対するHMACの一致だけでセッションを検証する。
// 2FA・IPアドレス制限・監査ログは要件定義書 9章の将来要件として未実装。
function computeSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return createHmac("sha256", secret).update("admin-session").digest("hex");
}

export function issueSessionToken(): string {
  return computeSessionToken();
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const expected = Buffer.from(computeSessionToken(), "hex");
    const actual = Buffer.from(token, "hex");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}
