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
  description: "This is an online teaching material (Web application) for data science education for high school students.",
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
