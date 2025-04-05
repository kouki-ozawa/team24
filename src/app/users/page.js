"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RequireAuth from "@/components/RequireAuth";
import { ArrowLeft, PenSquare, LineChart, RefreshCw } from "lucide-react";
import UserInfo from "@/components/user/UserInfo";

export default function UserProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ローカルストレージからユーザーIDを取得
  useEffect(() => {
    try {
      setLoading(true);
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    } catch (error) {
      console.error("ローカルストレージアクセスエラー:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ダッシュボードに戻る
  const handleGoBack = () => {
    router.push("/dashboard");
  };

  // スキル診断ページへ移動
  const handleGoToSkillDiagnosis = () => {
    router.push("/questions");
  };

  const content = (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 flex items-center text-gray-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        ダッシュボードに戻る
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">マイアカウント</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : !userId ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">ログインしていません</p>
        </Card>
      ) : (
        <>
          <UserInfo userId={userId} />
          
          {/* スキル診断リンク */}
          <div className="text-center mt-6">
            <Button 
              onClick={handleGoToSkillDiagnosis}
              className="flex items-center mx-auto bg-blue-600 hover:bg-blue-700 text-white transition-all"
            >
              <LineChart className="w-4 h-4 mr-2" />
              スキル診断を受ける
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              スキル診断を受けて、あなたのスキルプロフィールを更新しましょう
            </p>
          </div>
          
          {/* プロジェクト推薦セクション */}
          <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">あなたにおすすめのプロジェクト</h2>
            <p className="text-gray-600 mb-4">
              あなたのスキルプロファイルに基づいて、参加可能なプロジェクトを探索しましょう。
            </p>
            <Button
              onClick={() => router.push('/projects')}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              プロジェクトを探す
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
}
