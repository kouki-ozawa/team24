import { Geist, Geist_Mono } from "next/font/google";
import "../components/styles/globals.css";
import Layout from "@/components/layouts/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ProjectYAKUZA",
  description: "チームビルディング、それは現代のシノギ",
};


//レイアウト
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground`}
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
