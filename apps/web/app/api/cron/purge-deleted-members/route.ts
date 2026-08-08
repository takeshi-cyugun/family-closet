// 14日間の猶予期間を過ぎたソフトデリート済みメンバーを物理削除するバッチ処理。
// Vercel Cron から日次で呼ばれる想定（apps/web/vercel.json）。CRON_SECRETで保護する。
import { NextResponse } from 'next/server';
import { db, members, clothes, createSupabaseServerClient, CLOTHES_STORAGE_BUCKET } from '@repo/database';
import { and, eq, isNotNull, lte } from 'drizzle-orm';

const GRACE_PERIOD_DAYS = 14;

// 署名付きURL（.../object/sign/<bucket>/<path>?token=...）からStorage上のパスを取り出す
function extractStoragePath(imageUrl: string, bucket: string): string | null {
  const escapedBucket = bucket.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = imageUrl.match(new RegExp(`/object/sign/${escapedBucket}/([^?]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
  const targets = await db
    .select()
    .from(members)
    .where(and(isNotNull(members.deletedAt), lte(members.deletedAt, cutoff)));

  const supabase = createSupabaseServerClient();
  let purgedMembers = 0;
  let purgedClothes = 0;
  const failedMemberIds: string[] = [];

  for (const member of targets) {
    try {
      const items = await db.select().from(clothes).where(eq(clothes.ownerMemberId, member.id));

      const paths = items
        .map((item) => extractStoragePath(item.imageUrl, CLOTHES_STORAGE_BUCKET))
        .filter((path): path is string => Boolean(path));

      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage.from(CLOTHES_STORAGE_BUCKET).remove(paths);
        if (storageError) {
          console.error(`Failed to remove storage files for member ${member.id}:`, storageError);
        }
      }

      if (items.length > 0) {
        await db.delete(clothes).where(eq(clothes.ownerMemberId, member.id));
        purgedClothes += items.length;
      }

      if (member.authUserId) {
        const { error: authError } = await supabase.auth.admin.deleteUser(member.authUserId);
        if (authError) {
          console.error(`Failed to delete auth user for member ${member.id}:`, authError);
        }
      }

      await db.delete(members).where(eq(members.id, member.id));
      purgedMembers += 1;
    } catch (error) {
      console.error(`Failed to purge member ${member.id}:`, error);
      failedMemberIds.push(member.id);
    }
  }

  return NextResponse.json({ purgedMembers, purgedClothes, failedMemberIds });
}
