"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RequireAuth from "@/components/RequireAuth";
import { useLocalStorage } from "@/components/utils/UseLocalStorage";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";

export default function NewUserPage() {
  const router = useRouter();
  const { value: userId } = useLocalStorage("userId");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // デフォルトロール
    bio: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // 入力変更ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ユーザー作成
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // 入力検証
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("ユーザー名、メールアドレス、パスワードは必須項目です");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("ユーザーの作成に失敗しました");
      }
      
      // 成功メッセージ
      alert("ユーザーを作成しました");
      // ユーザー一覧ページに戻る
      router.push("/users");
    } catch (error) {
      console.error("ユーザー作成エラー:", error);
      setError("ユーザーの作成に失敗しました。もう一度お試しください。");
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

      <h1 className="text-2xl font-bold mb-6">新規ユーザー作成</h1>

      <Card className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* パスワード */}
          <div>
            <Label htmlFor="password">
              パスワード<span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
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
                  作成中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  ユーザーを作成
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
} 