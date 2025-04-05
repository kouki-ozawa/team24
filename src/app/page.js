"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Auth from "@/components/Auth";
import { RefreshCw } from "lucide-react";

export default function HomePage() {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ローカルストレージからユーザーIDを取得
    const checkLoginStatus = () => {
      setIsLoading(true);
      const savedId = localStorage.getItem("userId");
      
      if (savedId) {
        // ログイン済みの場合、ダッシュボードへリダイレクト
        setUserId(savedId);
        router.push("/dashboard");
      } else {
        // 未ログインの場合、ローディング終了
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [router]);

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-medium text-gray-700">読み込み中...</h2>
      </div>
    );
  }

  // 未ログインの場合、ログイン/登録フォームを表示
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">SkillMatch</h1>
            <p className="text-xl text-gray-600">
              エンジニアスキル診断と最適なプロジェクトマッチングを実現するプラットフォーム
            </p>
          </div>
          <Auth setUserId={setUserId} />
        </div>
      </div>
    </div>
  );
}
