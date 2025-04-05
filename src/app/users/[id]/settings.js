"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import RequireAuth from "@/components/RequireAuth";
import { ArrowLeft, Save, Loader2, RefreshCw } from "lucide-react";
import UserInfo from "@/components/UserInfo";

export default function UserSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const userInfoRef = useRef(null);

  // ローカルストレージから権限チェック
  useEffect(() => {
    try {
      const storedUserId = localStorage.getItem("userId");
      
      // URLのIDとローカルストレージのIDが一致するか確認
      if (storedUserId !== params.id) {
        alert("このページを表示する権限がありません");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("ローカルストレージアクセスエラー:", error);
    }
  }, [params.id, router]);

  // フォーム送信時のハンドラー
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("プロフィールの更新に失敗しました");
      }

      setSuccessMessage("プロフィールを更新しました");
      alert("プロフィールを更新しました");
      
      // 更新後にユーザー情報表示を更新するためにリフレッシュ
      setShowUserInfo(true);
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      alert(error.message || "プロフィールの更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  // 入力値の変更を処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // プロフィールページに戻る
  const handleGoBack = () => {
    router.push("/users");
  };

  // ユーザー情報の表示切替
  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  const content = (
    <div className="p-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 flex items-center text-gray-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        プロフィールに戻る
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">アカウント設定</h1>
        <Button
          variant="outline"
          onClick={toggleUserInfo}
          className="flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {showUserInfo ? "編集フォームを表示" : "現在の情報を表示"}
        </Button>
      </div>

      {showUserInfo ? (
        <div ref={userInfoRef} className="mb-6">
          <UserInfo userId={params.id} />
        </div>
      ) : (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 p-4 rounded-md text-green-700 text-sm mb-4">
                {successMessage}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="ユーザー名を入力"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="メールアドレスを入力"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="自己紹介を入力（任意）"
                rows={5}
              />
              <p className="text-xs text-gray-500">スキルや経歴、興味のある分野などを共有しましょう</p>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="flex items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    変更を保存
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
} 