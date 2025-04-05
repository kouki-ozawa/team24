"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RequireAuth from "@/components/RequireAuth";
import { UserRound, RefreshCw, PenSquare, ArrowLeft } from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ログイン中のユーザーIDを取得
  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    } catch (error) {
      console.error("ローカルストレージアクセスエラー:", error);
    }
  }, []);

  // ユーザー情報を取得
  const fetchUserProfile = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("ユーザー情報の取得に失敗しました");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      setError("ユーザー情報の取得に失敗しました。後でもう一度お試しください。");
      alert("ユーザー情報の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  // ユーザーIDが変更されたら情報を取得
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

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

      <h1 className="text-2xl font-bold mb-6">マイアカウント</h1>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ユーザー情報を読み込み中...</p>
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchUserProfile} className="flex items-center mx-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            再読み込み
          </Button>
        </Card>
      ) : user ? (
        <div className="space-y-6">
          {/* ユーザー情報カード */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                {user.username ? user.username.substring(0, 2).toUpperCase() : "??"}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.username || "名前未設定"}
                    </h2>
                    <p className="text-gray-500 flex items-center mt-1">
                      {user.email}
                    </p>
                    {user.role && (
                      <p className="text-sm text-gray-600 mt-1">
                        ロール: {user.role === "admin" ? "管理者" : "一般ユーザー"}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleGoToSettings}
                    className="mt-4 md:mt-0 flex items-center"
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    設定
                  </Button>
                </div>
              </div>
            </div>
            
            {/* 基本情報 */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.joinedAt && (
                <div className="flex items-center text-gray-600">
                  <span>登録日: {new Date(user.joinedAt).toLocaleDateString('ja-JP')}</span>
                </div>
              )}
            </div>
            
            {/* 自己紹介 */}
            {user.bio && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <UserRound className="w-4 h-4 mr-2" />
                  自己紹介
                </h3>
                <p className="text-gray-600 whitespace-pre-line">{user.bio}</p>
              </div>
            )}
          </Card>

          {/* スキル情報 */}
          {(user.technical_skill !== undefined || 
            user.problem_solving_ability !== undefined ||
            user.communication_skill !== undefined ||
            user.leadership_and_collaboration !== undefined ||
            user.security_awareness !== undefined) && (
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">スキル評価</h3>
              <div className="space-y-4">
                {Object.entries({
                  "技術スキル": user.technical_skill,
                  "問題解決能力": user.problem_solving_ability,
                  "コミュニケーションスキル": user.communication_skill,
                  "リーダーシップと協調性": user.leadership_and_collaboration,
                  "セキュリティ意識": user.security_awareness
                }).map(([name, value]) => (
                  value !== undefined && (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-gray-700">{name}</span>
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-8 rounded-sm ${
                                i < value ? "bg-blue-500" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {value}/5
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                最終更新: {user.last_assessment_date 
                  ? new Date(user.last_assessment_date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "未評価"}
              </div>
            </Card>
          )}

          {/* スキル診断リンク */}
          <div className="text-center">
            <Button 
              onClick={handleGoToSkillDiagnosis}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              スキル診断を受ける
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <UserRound className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">ユーザー情報が見つかりませんでした</p>
        </Card>
      )}
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
}
