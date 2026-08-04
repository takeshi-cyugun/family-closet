'use server';

import { cookies } from 'next/headers';
import { createSupabaseServerClient, CLOTHES_STORAGE_BUCKET } from '@repo/database';

// Privateバケットのため署名付きURLを発行する。有効期限は実用上ほぼ恒久的な10年とする。
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 365 * 10;

export type UploadImageResult =
  | { success: true; path: string; url: string }
  | { success: false; error: string };

export async function uploadClothesImage(formData: FormData): Promise<UploadImageResult> {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { success: false, error: '画像ファイルが見つかりません。' };
  }
  if (!file.type.startsWith('image/')) {
    return { success: false, error: '画像ファイルを選択してください。' };
  }

  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value ?? 'unassigned';

  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const path = `${familyId}/${crypto.randomUUID()}.${ext}`;

  const supabase = createSupabaseServerClient();
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(CLOTHES_STORAGE_BUCKET)
    .upload(path, buffer, { contentType: file.type });

  if (uploadError) {
    console.error('Failed to upload image:', uploadError);
    return { success: false, error: '画像のアップロードに失敗しました。' };
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from(CLOTHES_STORAGE_BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRES_IN_SECONDS);

  if (signedError || !signedData) {
    console.error('Failed to create signed URL:', signedError);
    return { success: false, error: '画像URLの生成に失敗しました。' };
  }

  return { success: true, path, url: signedData.signedUrl };
}
