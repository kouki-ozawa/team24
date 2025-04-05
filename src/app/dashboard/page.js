"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { User, BarChart3, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  // ローカルストレージからユーザーIDを取得
  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    } catch (error) {
      console.error("ローカルストレージアクセスエラー:", error);
    }
  }, []);

  const content = (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          
          {/* ユーザープロフィールへのリンク */}
          {userId && (
            <Link href="/users" className="mt-4 sm:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline">プロフィール</span>
                <span className="inline sm:hidden">プロフィール</span>
              </Button>
            </Link>
          )}
        </div>
        
        {/* ウェルカムカード */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 mb-6">
          <h1 className="text-xl font-semibold mb-2 sm:mb-4">ようこそ！</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            このダッシュボードでは、あなたのスキル情報やプロジェクトの進捗状況を確認できます。
          </p>
        </div>
        
        {/* メインコンテンツグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* スキル診断カード */}
          <div className="bg-blue-50 rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium text-blue-900 mb-2">スキル診断</h3>
              <BarChart3 className="text-blue-500 h-6 w-6" />
            </div>
            <p className="text-blue-700 text-sm mb-4">
              あなたのスキルを診断して、最適なプロジェクトを見つけましょう。
            </p>
            <Link href="/questions" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              診断を開始する
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {/* プロジェクト管理カード */}
          <div className="bg-green-50 rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium text-green-900 mb-2">プロジェクト管理</h3>
              <Briefcase className="text-green-500 h-6 w-6" />
            </div>
            <p className="text-green-700 text-sm mb-4">
              参加中のプロジェクトや、新しい機会を確認できます。
            </p>
            <Link href="/projects" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800">
              プロジェクトを見る
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {/* その他の機能カード（例：お知らせ） */}
          <div className="bg-purple-50 rounded-lg shadow p-4 sm:p-6 transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium text-purple-900 mb-2">お知らせ</h3>
              <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">新着</span>
            </div>
            <p className="text-purple-700 text-sm mb-4">
              最新のアップデートやシステムのお知らせをチェックしましょう。
            </p>
            <ul className="text-sm text-purple-800 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                システムメンテナンスのお知らせ
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                新機能のリリース予定
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
}