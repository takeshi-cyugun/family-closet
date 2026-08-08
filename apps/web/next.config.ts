import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pnpmモノレポでは apps/web/node_modules/sharp はシンボリックリンクで、実体はリポジトリルートの
  // node_modules/.pnpm 配下（sharp本体・@img/sharp-linux-x64・@img/sharp-libvips-linux-x64等の
  // ネイティブバイナリを含む）にある。Next.js 16の既定ビルドバンドラであるTurbopackはこの
  // 多段シンボリックリンクを最後まで辿り切れず、Vercel(本番, linux-x64)で
  // "ERR_DLOPEN_FAILED: libvips-cpp.so.8.18.3: cannot open shared object file" となって
  // uploadClothesImage()が本番でのみ失敗していたため、`package.json`のbuildを
  // `next build --webpack` に変更した（webpackの.nft.jsonトレースでlibvips本体まで正しく
  // 含まれることをローカルビルドで確認済み）。
  // なお outputFileTracingRoot をモノレポルートまで広げる対処も試したが、Vercel側の
  // 「Root Directory=apps/web」設定の外を参照することになり、Next.js自体のビルドは成功する一方で
  // Vercelの出力パッケージング処理("Deploying outputs...")が原因不明のエラーで失敗した
  // （--forceでキャッシュなしでも再現、cache起因ではない）。webpack切り替えのみで
  // node_modules/sharp/**/* が実体まで辿れることを確認済みのため、outputFileTracingRootは設定しない。
  outputFileTracingIncludes: {
    "/*": ["node_modules/sharp/**/*"],
  },
  experimental: {
    // ダッシュボードはcookies()を読むため常に動的レンダリングになり、既定(0秒)だと
    // 詳細画面から戻るたびにRSCを毎回サーバーへ取りに行ってしまう。作成/更新/削除アクションは
    // revalidatePath('/list')を呼んでいるので、このキャッシュがあっても更新は即座に反映される。
    staleTimes: {
      dynamic: 30,
    },
    serverActions: {
      // 既定1MBだとスマホ撮影のオリジナル写真（リサイズはサーバー側でsharpが行うため未圧縮のまま送る）
      // で容易に超過し、"Body exceeded 1 MB limit"でuploadClothesImage()が失敗するため引き上げる。
      bodySizeLimit: "10mb",
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
