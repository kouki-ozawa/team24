"use client";

import React, { useState } from "react";
import { useUser } from "../../hooks/useUser";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BarChart3, Edit2, Award, CheckCircle, AlertTriangle } from "lucide-react";
import SkillChart from "./SkillChart";
import ProfileEditor from "./ProfileEditor";

export default function UserInfo({ userId }) {
  const { user, loading, error, mutate } = useUser(userId);
  const [activeTab, setActiveTab] = useState("profile");

  // ローディング状態
  if (loading) {
    return (
      <Card className="p-8 text-center animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6 mx-auto w-40"></div>
        <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-2xl mx-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-5 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // エラー状態
  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-700 mb-2">エラーが発生しました</h3>
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  // データなし
  if (!user) {
    return (
      <Card className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-600">ユーザー情報が見つかりません</p>
      </Card>
    );
  }

  const handleProfileUpdate = (updatedUser) => {
    // APIデータを更新
    mutate(updatedUser);
    setActiveTab("profile"); // 更新後にプロフィールタブに戻る
  };

  // ユーザーの総合スキルレベルを計算（平均値）
  const skillKeys = [
    'technical_skill',
    'problem_solving_ability',
    'communication_skill',
    'leadership_and_collaboration',
    'frontend_skill',
    'backend_skill',
    'infrastructure_skill',
    'security_awareness'
  ];
  
  const averageSkill = Math.round(
    skillKeys.reduce((sum, key) => sum + (user[key] || 0), 0) / skillKeys.length
  );

  return (
    <Card className="overflow-hidden shadow-md rounded-xl border border-gray-200">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <div className="sm:flex">
          {/* サイドバー */}
          <div className="p-5 sm:w-72 border-r border-gray-200 bg-gray-50">
            <div className="flex flex-col items-center mb-6">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-24 w-24 object-cover rounded-full mb-4 border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=User";
                  }}
                />
              ) : (
                <div className="h-24 w-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <User className="h-12 w-12 text-blue-500" />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-800">{user.name || "名前未設定"}</h3>
              
              {/* スキルレベルバッジ */}
              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                <Award className="w-4 h-4 mr-1" />
                平均スキル: {averageSkill}%
              </div>
            </div>

            <TabsList className="flex flex-col w-full bg-transparent p-0 h-auto">
              <TabsTrigger
                value="profile"
                className="justify-start w-full mb-2 px-4 py-3 border-l-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 rounded-r-md"
              >
                <User className="h-4 w-4 mr-3" />
                プロフィール
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="justify-start w-full mb-2 px-4 py-3 border-l-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 rounded-r-md"
              >
                <BarChart3 className="h-4 w-4 mr-3" />
                スキルチャート
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="justify-start w-full mb-2 px-4 py-3 border-l-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 rounded-r-md"
              >
                <Edit2 className="h-4 w-4 mr-3" />
                編集
              </TabsTrigger>
            </TabsList>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1 p-6">
            <TabsContent value="profile" className="m-0 animate-in fade-in-50 duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                ユーザー情報
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
                <InfoItem label="技術力" value={user.technical_skill} />
                <InfoItem label="問題解決力" value={user.problem_solving_ability} />
                <InfoItem label="コミュニケーション" value={user.communication_skill} />
                <InfoItem label="リーダーシップ" value={user.leadership_and_collaboration} />
                <InfoItem label="フロントエンド" value={user.frontend_skill} />
                <InfoItem label="バックエンド" value={user.backend_skill} />
                <InfoItem label="インフラ" value={user.infrastructure_skill} />
                <InfoItem label="セキュリティ意識" value={user.security_awareness} />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="m-0 animate-in fade-in-50 duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                スキルレーダーチャート
              </h2>
              <p className="text-gray-600 mb-6">
                下記のチャートは、あなたの各技術分野におけるスキルレベルを視覚化したものです。
                バランスの取れたスキルセットを目指しましょう。
              </p>
              <SkillChart userData={user} />
            </TabsContent>

            <TabsContent value="edit" className="m-0 animate-in fade-in-50 duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Edit2 className="w-5 h-5 mr-2 text-indigo-500" />
                プロフィール編集
              </h2>
              <ProfileEditor
                userData={user}
                userId={userId}
                onUpdate={handleProfileUpdate}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </Card>
  );
}

function InfoItem({ label, value }) {
  const displayValue = value ?? "未入力";
  
  // スキル値の場合
  const isSkillValue = typeof value === 'number';
  
  // スキルレベルに応じた色を設定
  const getSkillColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };
  
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium mb-1">{label}</span>
      <div>
        {isSkillValue ? (
          <div className="flex items-center">
            <span className={`text-sm font-semibold mr-2 ${value >= 60 ? 'text-blue-700' : 'text-gray-700'}`}>
              {displayValue}%
            </span>
            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getSkillColor(value)}`} 
                style={{ width: `${displayValue}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <span className="text-gray-900">{displayValue}</span>
        )}
      </div>
    </div>
  );
}