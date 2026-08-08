import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pnpmモノレポでは apps/web/node_modules/sharp はシンボリックリンクで、実体は
  // リポジトリルートの node_modules/.pnpm 配下（sharp本体・@img/sharp-linux-x64・
  // @img/sharp-libvips-linux-x64 等のネイティブバイナリを含む）にある。既定のトレーシングルート
  // (=apps/web)だとその外側にある実体ファイルが出力ファイルトレーシングの対象外になり、
  // Vercel(本番, linux-x64)で "ERR_DLOPEN_FAILED: libvips-cpp.so.8.18.3: cannot open shared
  // object file" となってuploadClothesImage()が本番でのみ失敗していた。トレーシングルートを
  // モノレポルートまで広げ、念のためsharp関連パッケージを明示的にも含める
  // （Next.js公式ドキュメント記載の定番対処）。
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/*": [
      "node_modules/sharp/**/*",
      "../../node_modules/.pnpm/sharp@*/node_modules/@img/**/*",
      "../../node_modules/.pnpm/@img+sharp-linux-x64@*/**/*",
      "../../node_modules/.pnpm/@img+sharp-libvips-linux-x64@*/**/*",
    ],
  },
  experimental: {
    // ダッシュボードはcookies()を読むため常に動的レンダリングになり、既定(0秒)だと
    // 詳細画面から戻るたびにRSCを毎回サーバーへ取りに行ってしまう。作成/更新/削除アクションは
    // revalidatePath('/list')を呼んでいるので、このキャッシュがあっても更新は即座に反映される。
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    // ローカルSupabase(127.0.0.1)はプライベートIPのため、Next.jsの画像最適化プロキシがSSRF対策で
    // フェッチを拒否する（"resolved to private ip"）。本番のSupabaseはパブリックホスト名なので問題ない。
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/sign/**",
      },
      {
        protocol: "https",
        hostname: "mybevoxtpldxseantozi.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default nextConfig;
