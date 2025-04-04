"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // ログインページとユーザー登録ページではナビゲーションを表示しない
  if (pathname === "/" || pathname === "/users/register") {
    return null;
  }

  const navigation = [
    { name: "スキル診断", href: "/questions" },
    { name: "ユーザー管理", href: "/users" },
    { name: "プロジェクト管理", href: "/projects" },
  ];

  const handleLogout = () => {
    // ローカルストレージからIDを消去
    localStorage.removeItem('userId');  // もしくは使用しているキー名に応じて変更
    
    // ルートページへ遷移
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-gray-900"
            >
              SkillMatch
            </Link>
            <div className="ml-10 hidden space-x-4 sm:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  } px-3 py-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
