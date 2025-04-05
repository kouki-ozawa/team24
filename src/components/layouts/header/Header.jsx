"use client"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { User } from "lucide-react"
import { useLocalStorage } from "@/components/utils/UseLocalStorage"
import { useUser } from "@/hooks/useUser"
import { useState, useEffect } from "react"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { value: userId, removeValue: removeUserId, isLoading: isStorageLoading } = useLocalStorage("userId")

  // ユーザーIDが変更されたときにAPIリクエストを確実に行うために依存配列にuserIdを指定
  const { user, loading: isUserLoading, mutate } = useUser(userId)
  const [userName, setUserName] = useState("読み込み中...")

  // ユーザーIDが変わった時に強制的に再フェッチする
  useEffect(() => {
    if (userId) {
      // SWRのキャッシュを更新して再フェッチを強制する
      mutate()
    }
  }, [userId, mutate])

  // ユーザー名を設定
  useEffect(() => {
    if (!isUserLoading && user && user.name) {
      setUserName(user.name)
    } else if (!isUserLoading && (!user || !user.name)) {
      setUserName("ゲスト")
    }
  }, [user, isUserLoading])

  // ログインページではナビゲーションを表示しない
  if (pathname === "/") {
    return null
  }

  const handleLogout = () => {
    // ローカルストレージからIDを消去
    removeUserId()

    // ルートページへ遷移
    router.push("/")
  }

  // ローディング状態
  const isLoading = isStorageLoading || (isUserLoading && userId)

  // ページタイトルのマッピング
  const pageTitles = {
    "/dashboard": "ダッシュボード",
    "/questions": "スキル診断",
    "/users": "ユーザー管理",
    "/projects": "プロジェクト管理",
    "/tasks": "タスク一覧",
  }

  // 動的なパスの処理
  const getPageTitle = () => {
    if (pathname.startsWith("/projects/create")) return "プロジェクト作成"
    return pageTitles[pathname] || "SkillMatch"
  }

  if (isLoading) {
    return (
      <header className="bg-white border-b z-50 sticky top-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900 md:ml-0">読み込み中...</div>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b z-50 sticky top-0">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900 md:ml-0 text-center md:text-left">{getPageTitle()}</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">{userName}さん</span>
            <span className="inline sm:hidden text-sm font-medium text-gray-700">
              {userName.length > 5 ? userName.substring(0, 5) + "..." : userName}
            </span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
            <span className="hidden sm:inline">ログアウト</span>
            <span className="inline sm:hidden">退出</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
