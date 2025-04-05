"use client";

import React from "react";
import { useUser } from "../hooks/useUser";

export default function UserInfo({ userId }) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <p className="text-gray-600">読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-gray-600">ユーザー情報が見つかりません。</p>;

  return (
    <div className="flex">
      <div className="mt-10 p-6 max-w-2xl mx-auto border rounded-2xl shadow-md bg-white flex-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">👤 ユーザー情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
          <InfoItem label="名前" value={user.name} />
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="技術力" value={user.technical_skill} />
          <InfoItem label="問題解決力" value={user.problem_solving_ability} />
          <InfoItem label="コミュニケーション" value={user.communication_skill} />
          <InfoItem label="リーダーシップ" value={user.leadership_and_collaboration} />
          <InfoItem label="フロントエンド" value={user.frontend_skill} />
          <InfoItem label="バックエンド" value={user.backend_skill} />
          <InfoItem label="インフラ" value={user.infrastructure_skill} />
          <InfoItem label="セキュリティ意識" value={user.security_awareness} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="mt-1 text-gray-900">{value ?? "未入力"}</span>
    </div>
  );
}