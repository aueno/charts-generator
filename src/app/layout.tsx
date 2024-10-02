import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { Noto_Sans_JP } from 'next/font/google'

const notojp = Noto_Sans_JP({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "統計解析システム",
  description: "高校生向けのデータサイエンス教育のためのオンライン教材（Webアプリケーション）として開発しました．度数分布表（ヒストグラム）生成，散布図・相関分析，回帰分析（最小二乗法）などの機能があります．",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const now = new Date();
  const year = now.getFullYear();
  return (
    <html lang="ja">
      <meta name="google-site-verification" content="ooDp7hdOd9opoE9GzdznpYfsuS-FSnbwSRMKSu2S5EY" />
      <body className={notojp.className}>{children}
        <footer>
          <hr />
          <div className="flex justify-center space-x-4">
            <p className="text-lg">&copy; 2024-{year} <a href="https://aueno.github.io/">aueno</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
