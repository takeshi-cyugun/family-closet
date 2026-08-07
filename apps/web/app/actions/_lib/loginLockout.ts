import { headers } from 'next/headers';
import { db, loginAttempts } from '@repo/database';
import { eq, and, gt } from 'drizzle-orm';

const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 5 * 60 * 1000;

// アカウント・IP単位で5分間に5回失敗するとロックする（サーバー側ブルートフォース対策）
export async function isLocked(identifier: string): Promise<boolean> {
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MS);
  const rows = await db
    .select({ id: loginAttempts.id })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.identifier, identifier), gt(loginAttempts.createdAt, since)));
  return rows.length >= MAX_ATTEMPTS;
}

export async function recordFailure(identifier: string): Promise<void> {
  await db.insert(loginAttempts).values({ identifier });
}

export async function clearAttempts(identifier: string): Promise<void> {
  await db.delete(loginAttempts).where(eq(loginAttempts.identifier, identifier));
}

export async function getClientIp(): Promise<string | null> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return headerList.get('x-real-ip');
}
