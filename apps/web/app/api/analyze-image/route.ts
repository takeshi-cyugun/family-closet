// apps/web/app/api/analyze-image/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: '画像ファイルが見つかりません。' },
        { status: 400 }
      );
    }

    // 画像ファイルを Base64 に変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // Gemini 1.5 Flash モデルの準備
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
      画像の洋服を解析し、以下の JSON フォーマットで結果を返してください。
      解説やテキストは不要です。JSONのみを出力してください。

      {
        "category": "洋服のカテゴリ（例: コート, トップス, Tシャツ, パンツ, スカート, ワンピース, アウター, キッズ服, その他）",
        "color": "メインの色（例: ブラック, ホワイト, ネイビー, グレー, ベージュ, レッド, ブルー, グリーン, その他）"
      }
    `;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // 抽出された JSON のパース
    const parsedData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      category: parsedData.category || 'その他',
      color: parsedData.color || 'その他',
    });
  } catch (error) {
    console.error('Gemini API Analysis Error:', error);
    return NextResponse.json(
      { error: '画像のAI解析に失敗しました。' },
      { status: 500 }
    );
  }
}