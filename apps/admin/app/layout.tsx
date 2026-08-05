import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ファミリークロゼット 管理画面",
  description: "ファミリークロゼット 運営者向け管理画面",
};

// PC専用画面のため、モバイル向けのviewport最適化は行わない。
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen min-w-[1024px] antialiased">{children}</body>
    </html>
  );
}
