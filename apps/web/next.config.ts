import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
