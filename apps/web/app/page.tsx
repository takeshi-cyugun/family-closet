"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "./_components/LoginForm";
import { startGuestSession } from "./_lib/session";
import { LANGUAGES } from "./_lib/i18n";
import type { LanguageCode } from "./_lib/i18n";

const FEATURES = [
  {
    icon: "👨‍👩‍👧‍👦",
    title: "家族で共有",
    description: "誰のどの服が使用中か保管中かを、家族みんなでいつでも確認できます。",
  },
  {
    icon: "🤖",
    title: "AI自動タグ付け",
    description: "写真を撮るだけでカテゴリや色をAIが自動認識。入力の手間を省きます。",
  },
] as const;

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState<LanguageCode>("ja");

  function handleGuestStart() {
    startGuestSession();
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col bg-cream text-ink">
      <section className="flex flex-col items-center gap-5 px-6 pb-8 pt-16 text-center">
        <span className="text-5xl">🧺</span>
        <h1 className="font-serif text-3xl font-bold tracking-tight">ファミリークロゼット</h1>
        <p className="max-w-sm text-sm text-ink-soft">
          誰のどの服が、どこにあるか。写真を撮るだけでAIが自動整理。家族みんなで共有できるクローゼット管理アプリです。
        </p>

        <div className="mt-2 flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={handleGuestStart}
            className="rounded-md bg-espresso py-3 text-sm font-semibold text-on-espresso"
          >
            まずはお試し（登録不要）
          </button>
          <Link
            href="/register"
            className="rounded-md border border-linen py-3 text-center text-sm font-medium text-ink"
          >
            ファミリーを新規作成
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-3xl gap-4 px-6 py-8 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg bg-white p-4 text-center shadow-[0_2px_8px_rgba(60,47,43,0.08)]"
          >
            <span className="text-3xl">{feature.icon}</span>
            <h2 className="mt-2 font-serif text-sm font-semibold text-ink">{feature.title}</h2>
            <p className="mt-1 text-xs text-ink-soft">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-sm px-6 py-8">
        <h2 className="mb-4 font-serif text-base font-bold text-ink">ログイン</h2>
        <LoginForm />
      </section>

      <footer className="mt-auto border-t border-linen px-6 py-6 text-center">
        <div className="flex justify-center gap-4 text-xs text-ink-soft">
          <a href="/terms" className="underline">
            利用規約
          </a>
          <a href="/privacy" className="underline">
            プライバシーポリシー
          </a>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageCode)}
          aria-label="言語選択"
          className="mx-auto mt-4 rounded-md border border-linen bg-white px-3 py-1.5 text-xs text-ink"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </footer>
    </div>
  );
}
