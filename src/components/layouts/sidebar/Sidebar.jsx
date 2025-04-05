"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Brain,
  Users,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // ローカルストレージから状態を復元
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);
  
  // 状態変更時にローカルストレージに保存
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  // ログインページではサイドバーを表示しない
  if (pathname === "/" ) {
    return null;
  }

  const navigation = [
    {
      name: "ダッシュボード",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "マイアカウント",
      href: "/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "スキル診断",
      href: "/questions",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      name: "タスク管理",
      href: "/tasks",
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      name: "プロジェクト管理",
      href: "/projects",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      name: "タスク一覧",
      href: "/tasks",
      icon: <Menu className="w-5 h-5" />,
    },
    {
      name: "ユーザー情報",
      href: "/",
      icon: <FolderKanban className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`h-screen bg-white border-r transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ロゴエリア */}
      <div className={`p-4 border-b flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!isCollapsed && <Link href="/dashboard" className="text-xl font-bold text-gray-900">SkillMatch</Link>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="flex-shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="w-6 h-6" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>
      
      {/* ナビゲーションエリア */}
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={isCollapsed ? "w-6 h-6" : "w-5 h-5"}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}