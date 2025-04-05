"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RequireAuth from "@/components/RequireAuth";
import { ArrowLeft, PenSquare } from "lucide-react";
import UserInfo from "@/components/UserInfo";

export default function UserProfilePage() {
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

  // ダッシュボードに戻る
  const handleGoBack = () => {
    router.push("/dashboard");
  };

  // 設定ページへ移動
  const handleGoToSettings = () => {
    if (userId) {
      router.push(`/users/${userId}/settings`);
    }
  };

  // スキル診断ページへ移動
  const handleGoToSkillDiagnosis = () => {
    router.push("/questions");
  };

  const content = (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 flex items-center text-gray-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        ダッシュボードに戻る
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">マイアカウント</h1>
        {userId && (
          <Button
            onClick={handleGoToSettings}
            className="flex items-center"
          >
            <PenSquare className="w-4 h-4 mr-2" />
            設定
          </Button>
        )}
      </div>

      {!userId ? (
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
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              スキル診断を受ける
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
}
