"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import RequireAuth from "@/components/RequireAuth";
import { useLocalStorage } from "@/components/utils/UseLocalStorage";
import { Search, RefreshCw, PenSquare, Trash2 } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const { value: userId } = useLocalStorage("userId");
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
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
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      alert("ユーザー情報の取得に失敗しました。後でもう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  // 初期読み込み
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 検索機能
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // ユーザー編集ページへ遷移
  const handleEditUser = (userId) => {
    router.push(`/users/${userId}/edit`);
  };

  // ユーザー削除
  const handleDeleteUser = async (userId) => {
    if (!confirm("このユーザーを削除してもよろしいですか？")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("ユーザーの削除に失敗しました");
      }

      // 成功したら一覧を更新
      fetchUsers();
      alert("ユーザーを削除しました");
    } catch (error) {
      console.error("ユーザー削除エラー:", error);
      alert("ユーザーの削除に失敗しました。もう一度お試しください。");
    }
  };

  const content = (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
        <Button onClick={() => router.push("/users/new")} className="bg-blue-600">
          新規ユーザー作成
        </Button>
      </div>

      {/* 検索と更新 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ユーザー名・メールで検索..."
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          更新
        </Button>
      </div>

      {/* ユーザーテーブル */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">ユーザー名</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">メールアドレス</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">登録日</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="flex justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                    <p className="mt-2 text-gray-500">読み込み中...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery ? "検索条件に一致するユーザーが見つかりません" : "ユーザーがいません"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{user._id.substring(0, 8)}...</td>
                    <td className="px-4 py-3">{user.username || "未設定"}</td>
                    <td className="px-4 py-3 text-sm">{user.email || "未設定"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ja-JP') : "不明"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user._id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <PenSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
}
