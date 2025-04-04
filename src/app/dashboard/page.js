"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // ログイン状態の確認
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/"); // 未ログインの場合はログインページへリダイレクト
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ダッシュボード</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">ようこそ！</h2>
          <p className="text-gray-600">
            このダッシュボードでは、あなたのスキル情報やプロジェクトの進捗状況を確認できます。
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">スキル診断</h3>
              <p className="text-blue-700">
                あなたのスキルを診断して、最適なプロジェクトを見つけましょう。
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 mb-2">プロジェクト管理</h3>
              <p className="text-green-700">
                参加中のプロジェクトや、新しい機会を確認できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
