// packages/i18n/src/index.ts
import ja from '../dictionaries/ja.json';
import en from '../dictionaries/en.json';

export type Language = 'ja' | 'en' | 'zh-CN';

const dictionaries = {
  ja,
  en,
  'zh-CN': en, // 中国語未作成時のフォールバック（作成後差し替え）
};

export const getDictionary = (lang: Language = 'ja') => {
  return dictionaries[lang] || dictionaries.ja;
};