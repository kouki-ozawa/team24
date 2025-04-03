import { Geist, Geist_Mono } from "next/font/google";
import "../components/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Skill Match App",
  description: "あなたのスキルを診断します",
};


//レイアウト
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
