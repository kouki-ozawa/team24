"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Brain,
  Users,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  // モバイル向けの表示/非表示状態
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  // 画面サイズがモバイルかどうか
  const [isMobile, setIsMobile] = useState(false)

  // ローカルストレージから状態を復元
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === "undefined") return

    // デスクトップの折りたたみ状態を復元
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }

    // 初期画面サイズをチェック
    setIsMobile(window.innerWidth < 768)

    // 画面サイズの変更を監視
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // 画面が大きくなった場合、モバイルメニューを閉じる
      if (!mobile && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobileOpen])

  // パスが変わったときにモバイルメニューを閉じる
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }, [pathname, isMobile])

  // 状態変更時にローカルストレージに保存
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  // モバイルメニューのトグル
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // 画面遷移後にモバイルメニューを閉じる
  const handleNavigation = () => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }

  // ログインページではサイドバーを表示しない
  if (pathname === "/") {
    return null
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
      name: "プロジェクト管理",
      href: "/projects",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    {
      name: "タスク一覧",
      href: "/tasks",
      icon: <CheckSquare className="w-5 h-5" />,
    },
  ]

  return (
    <>
      {/* モバイル用ハンバーガーメニューボタン - サイドバーが開いていない時のみ表示 */}
      {isMobile && !isMobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="fixed top-16 left-4 z-50 bg-white shadow-sm rounded-full md:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}

      {/* モバイルオーバーレイ - メニューが開いているときに背景を暗くする */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 top-14 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* サイドバー本体 - レスポンシブ対応 */}
      <div
        className={`bg-white border-r transition-all duration-300 flex flex-col z-40
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          ${
            isMobile
              ? isMobileOpen
                ? "w-64 fixed top-14 left-0 h-[calc(100vh-56px)]"
                : "hidden"
              : "flex h-screen sticky top-0"
          }
        `}
      >
        {/* ロゴエリア */}
        <div className={`p-4 border-b flex ${isCollapsed ? "md:justify-center" : "justify-between"} items-center`}>
          {(!isCollapsed || isMobile) && (
            <Link href="/dashboard" onClick={handleNavigation} className="text-xl font-bold text-gray-900">
              SkillMatch
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleCollapse} className="flex-shrink-0 hidden md:flex">
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
              className="flex-shrink-0 md:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* ナビゲーションエリア */}
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavigation}
                  className={`flex items-center ${isCollapsed ? "md:justify-center" : ""} px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className={isCollapsed ? "md:w-6 md:h-6 w-5 h-5" : "w-5 h-5"}>{item.icon}</div>
                  {(!isCollapsed || isMobile) && <span className="ml-3 truncate">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

