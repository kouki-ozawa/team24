"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RequireAuth from "@/components/RequireAuth";
import { useLocalStorage } from "@/components/utils/UseLocalStorage";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";

export default function EditUserPage({ params }) {
  const userId = params.id;
  const router = useRouter();
  const { value: currentUserId } = useLocalStorage("userId");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    bio: ""
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // ユーザー情報を取得
  const fetchUserData = async () => {
    setIsLoading(true);
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
      setFormData({
        username: data.username || "",
        email: data.email || "",
        role: data.role || "user",
        bio: data.bio || ""
      });
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      setError("ユーザー情報の取得に失敗しました。後でもう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  // 初期データ読み込み
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // 入力変更ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ユーザー更新
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // 入力検証
    if (!formData.username.trim() || !formData.email.trim()) {
      setError("ユーザー名とメールアドレスは必須項目です");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("ユーザーの更新に失敗しました");
      }
      
      // 成功メッセージ
      alert("ユーザー情報を更新しました");
      // ユーザー一覧ページに戻る
      router.push("/users");
    } catch (error) {
      console.error("ユーザー更新エラー:", error);
      setError("ユーザーの更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  // ユーザー一覧に戻る
  const handleGoBack = () => {
    router.push("/users");
  };

  const content = (
    <div className="p-6 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 flex items-center text-gray-600"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        ユーザー一覧に戻る
      </Button>

      <h1 className="text-2xl font-bold mb-6">ユーザー編集</h1>

      {isLoading ? (
        <Card className="p-6">
          <div className="flex justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <p className="text-center text-gray-500">ユーザー情報を読み込み中...</p>
        </Card>
      ) : (
        <Card className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ユーザーID (読み取り専用) */}
            <div>
              <Label htmlFor="userId">ユーザーID</Label>
              <Input
                id="userId"
                value={userId}
                readOnly
                className="mt-1 bg-gray-50"
              />
            </div>

            {/* ユーザー名 */}
            <div>
              <Label htmlFor="username">
                ユーザー名<span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            {/* メールアドレス */}
            <div>
              <Label htmlFor="email">
                メールアドレス<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            {/* 役割 */}
            <div>
              <Label htmlFor="role">役割</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-10 mt-1 px-3 py-2 border rounded-md"
              >
                <option value="user">一般ユーザー</option>
                <option value="admin">管理者</option>
              </select>
            </div>

            {/* 自己紹介 */}
            <div>
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* 送信ボタン */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    更新中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
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