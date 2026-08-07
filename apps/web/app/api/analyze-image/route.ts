// apps/web/app/api/analyze-image/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const LANGUAGE_NAMES: Record<string, string> = {
  ja: '日本語',
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

// season は言語ごとに「春/夏/秋/冬/通年」に相当する単語をカンマ区切りで返してもらう（フォーム側で自言語ラベルから内部値へ逆引きする）
const SEASON_WORDS: Record<string, string> = {
  ja: '春, 夏, 秋, 冬, 通年',
  en: 'Spring, Summer, Autumn, Winter, All Season',
  'zh-CN': '春季, 夏季, 秋季, 冬季, 四季通用',
  'zh-TW': '春季, 夏季, 秋季, 冬季, 四季通用',
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const language = (formData.get('language') as string | null) || 'ja';
    const languageName = LANGUAGE_NAMES[language] || LANGUAGE_NAMES.ja;
    const seasonWords = SEASON_WORDS[language] || SEASON_WORDS.ja;

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

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
      画像に写っている洋服を分析し、以下の制約に従って必ず単一のJSON形式（配列不可）で出力してください。
      name, category, color の値は必ず ${languageName} で出力してください。

      - name: 色や特徴を踏まえた品物の名前（20文字以内）。
        ※複数の洋服が写っている場合は「〇〇コーデ」や「〇〇セット」という名前にしてください。
      - category: 第一カテゴリ（トップス、ボトムス、アウター、ワンピースなど）。
        ※複数の洋服が写っている場合は「コーディネート」としてください。
      - color: メインの色。
      - season: 次の単語（${languageName}）から選択してください: ${seasonWords}。
        複数該当する場合はカンマ区切り（例: ${seasonWords.split(',')[0].trim()},${seasonWords.split(',')[2].trim()}）。

      出力フォーマット:
      {
        "name": "文字列",
        "category": "文字列",
        "color": "文字列",
        "season": "文字列"
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
      name: parsedData.name || '',
      category: parsedData.category || 'その他',
      color: parsedData.color || '',
      season: parsedData.season || '通年',
    });
  } catch (error) {
    console.error('Gemini API Analysis Error:', error);
    return NextResponse.json(
      { error: '画像のAI解析に失敗しました。' },
      { status: 500 }
    );
  }
}
