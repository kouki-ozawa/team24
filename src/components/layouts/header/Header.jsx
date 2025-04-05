"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useLocalStorage } from "@/components/utils/UseLocalStorage";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { value: userId, removeValue: removeUserId, isLoading } = useLocalStorage("userId");

  // ログインページではナビゲーションを表示しない
  if (pathname === "/" ) {
    return null;
  }

  const handleLogout = () => {
    // ローカルストレージからIDを消去
    removeUserId();
    
    // ルートページへ遷移
    router.push("/");
  };

  if (isLoading) {
    return (
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">読み込み中...</div>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900">
          {pathname === "/dashboard" && "ダッシュボード"}
          {pathname === "/questions" && "スキル診断"}
          {pathname === "/users" && "ユーザー管理"}
          {pathname === "/projects" && "プロジェクト管理"}
          {pathname.startsWith("/projects/create") && "プロジェクト作成"}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {userId ? `ID: ${userId}` : 'ゲスト'}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  );
}
