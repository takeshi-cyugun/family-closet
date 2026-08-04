'use server';

import { redirect } from 'next/navigation';
import { ensureGuestFamily } from './ensureGuestFamily';

export async function startGuestSession() {
  await ensureGuestFamily();

  // ダッシュボードへ手動リダイレクト
  redirect('/dashboard');
}