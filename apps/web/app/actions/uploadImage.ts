'use server';

import { cookies } from 'next/headers';
import sharp from 'sharp';
import { createSupabaseServerClient, CLOTHES_STORAGE_BUCKET } from '@repo/database';

// Privateバケットのため署名付きURLを発行する。有効期限は実用上ほぼ恒久的な10年とする。
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 365 * 10;

// 一覧サムネイル用の長辺目標サイズ（要件定義書 §5.4: 長辺約300px / 約20KB）
const THUMBNAIL_MAX_EDGE = 300;
const THUMBNAIL_QUALITY = 65;

// 詳細画面の高解像度表示用（過度に大きい原寸アップロードを抑える程度のリサイズ）
const MAIN_MAX_EDGE = 1600;
const MAIN_QUALITY = 82;

export type UploadImageResult =
  | { success: true; imageUrl: string; thumbnailUrl: string }
  | { success: false; error: string };

// 洋服写真をアップロードし、指定角度で回転を焼き込んだ上でWebP変換・リサイズ（本画像+サムネイル）を行う。
// assetIdを固定キーにすることで、回転をやり直すたびに同じパスへ上書き保存する（ゴミファイルを残さない）。
export async function uploadClothesImage(formData: FormData): Promise<UploadImageResult> {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { success: false, error: '画像ファイルが見つかりません。' };
  }
  if (!file.type.startsWith('image/')) {
    return { success: false, error: '画像ファイルを選択してください。' };
  }

  const assetIdRaw = formData.get('assetId');
  const assetId = typeof assetIdRaw === 'string' && assetIdRaw ? assetIdRaw : crypto.randomUUID();

  const rotationRaw = formData.get('rotation');
  const rotation = typeof rotationRaw === 'string' ? Number(rotationRaw) : 0;
  const normalizedRotation = [0, 90, 180, 270].includes(rotation) ? rotation : 0;

  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value ?? 'unassigned';

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const [mainBuffer, thumbnailBuffer] = await Promise.all([
      sharp(buffer)
        .rotate() // EXIFの向き情報を実ピクセルへ反映
        .rotate(normalizedRotation) // ユーザーが指定した回転を焼き込む
        .resize({ width: MAIN_MAX_EDGE, height: MAIN_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: MAIN_QUALITY })
        .toBuffer(),
      sharp(buffer)
        .rotate()
        .rotate(normalizedRotation)
        .resize({ width: THUMBNAIL_MAX_EDGE, height: THUMBNAIL_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: THUMBNAIL_QUALITY })
        .toBuffer(),
    ]);

    const mainPath = `${familyId}/${assetId}.webp`;
    const thumbnailPath = `${familyId}/${assetId}-thumb.webp`;

    const supabase = createSupabaseServerClient();
    const [mainUpload, thumbnailUpload] = await Promise.all([
      supabase.storage
        .from(CLOTHES_STORAGE_BUCKET)
        .upload(mainPath, mainBuffer, { contentType: 'image/webp', upsert: true }),
      supabase.storage
        .from(CLOTHES_STORAGE_BUCKET)
        .upload(thumbnailPath, thumbnailBuffer, { contentType: 'image/webp', upsert: true }),
    ]);

    if (mainUpload.error || thumbnailUpload.error) {
      console.error('Failed to upload image:', mainUpload.error ?? thumbnailUpload.error);
      return { success: false, error: '画像のアップロードに失敗しました。' };
    }

    const [mainSigned, thumbnailSigned] = await Promise.all([
      supabase.storage.from(CLOTHES_STORAGE_BUCKET).createSignedUrl(mainPath, SIGNED_URL_EXPIRES_IN_SECONDS),
      supabase.storage.from(CLOTHES_STORAGE_BUCKET).createSignedUrl(thumbnailPath, SIGNED_URL_EXPIRES_IN_SECONDS),
    ]);

    if (mainSigned.error || !mainSigned.data || thumbnailSigned.error || !thumbnailSigned.data) {
      console.error('Failed to create signed URL:', mainSigned.error ?? thumbnailSigned.error);
      return { success: false, error: '画像URLの生成に失敗しました。' };
    }

    return { success: true, imageUrl: mainSigned.data.signedUrl, thumbnailUrl: thumbnailSigned.data.signedUrl };
  } catch (error) {
    console.error('Failed to process image:', error);
    return { success: false, error: '画像の処理に失敗しました。' };
  }
}
