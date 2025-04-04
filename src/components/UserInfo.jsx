"use client";

import React from "react";
import { useUser } from "../hooks/useUser";

export default function UserInfo({ userId }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>ユーザー情報が見つかりません。</p>;

  return (
    <div className="mt-8 p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">ユーザー情報</h2>
      <ul className="space-y-2 text-gray-700 text-sm">
        <li>
          <strong>名前:</strong> {user.name}
        </li>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>技術力:</strong> {user.technical_skill}
        </li>
        <li>
          <strong>問題解決力:</strong> {user.problem_solving_ability}
        </li>
        <li>
          <strong>コミュニケーション:</strong> {user.communication_skill}
        </li>
        <li>
          <strong>リーダーシップ:</strong> {user.leadership_and_collaboration}
        </li>
        <li>
          <strong>フロントエンド:</strong> {user.frontend_skill}
        </li>
        <li>
          <strong>バックエンド:</strong> {user.backend_skill}
        </li>
        <li>
          <strong>インフラ:</strong> {user.infrastructure_skill}
        </li>
        <li>
          <strong>セキュリティ意識:</strong> {user.security_awareness}
        </li>
      </ul>
    </div>
  );
}
