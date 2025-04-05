"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RequireAuth from "@/components/RequireAuth";
import { useLocalStorage } from "@/components/utils/UseLocalStorage";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Mail,
  Settings,
  UserRound,
  BookOpen,
  Award,
  RefreshCw,
  Link as LinkIcon,
  GitHub,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";

export default function UserProfilePage({ params }) {
  const userId = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const { value: currentUserId } = useLocalStorage("userId");
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ユーザー情報を取得
  const fetchUserProfile = async () => {
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
      toast({
        title: "エラー",
        description: "ユーザー情報の取得に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 初期読み込み
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ユーザー設定ページに移動
  const handleGoToSettings = () => {
    router.push(`/users/${userId}/settings`);
  };

  // ユーザー一覧に戻る
  const handleGoBack = () => {
    router.push("/users");
  };

  // スキルレベルの表示
  const SkillLevel = ({ level }) => {
    const maxLevel = 5;
    return (
      <div className="flex items-center">
        {[...Array(maxLevel)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-6 mx-0.5 rounded-sm ${
              i < level ? "bg-blue-500" : "bg-gray-200"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{level}/5</span>
      </div>
    );
  };

  // スキルバッジ
  const SkillBadge = ({ skill }) => (
    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-flex items-center mr-2 mb-2">
      <Award className="w-4 h-4 mr-1" />
      {skill.name}
      {skill.level && (
        <span className="ml-1 bg-blue-200 px-1.5 rounded-full text-xs">{skill.level}</span>
      )}
    </div>
  );

  const content = (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 flex items-center text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ユーザー一覧に戻る
        </Button>

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
            {/* プロフィールヘッダー */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                  {user.username ? user.username.substring(0, 2).toUpperCase() : "??"}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user.username || "名前未設定"}
                      </h1>
                      <p className="text-gray-500 flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email}
                      </p>
                    </div>
                    
                    {/* 自分のプロフィールの場合のみ設定ボタンを表示 */}
                    {currentUserId === userId && (
                      <Button
                        onClick={handleGoToSettings}
                        className="mt-4 md:mt-0 flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        設定
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 基本情報 */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.joinedAt && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>登録日: {new Date(user.joinedAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{user.company}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center text-gray-600">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      ウェブサイト
                    </a>
                  </div>
                )}
                {user.github && (
                  <div className="flex items-center text-gray-600">
                    <GitHub className="w-4 h-4 mr-2" />
                    <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      GitHub
                    </a>
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

            {/* スキルセクション */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <BookOpen className="w-5 h-5 mr-2" />
                スキルと経験
              </h2>
              
              {/* スキルタグ */}
              {user.skills && user.skills.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-800 mb-3">スキル</h3>
                  <div className="flex flex-wrap">
                    {user.skills.map((skill, index) => (
                      <SkillBadge key={index} skill={skill} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mb-6">スキルが登録されていません</p>
              )}
              
              {/* スキル評価（あれば表示） */}
              {user.skillRatings && (
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">スキル評価</h3>
                  <div className="space-y-4">
                    {Object.entries(user.skillRatings).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                        <div className="md:col-span-4 text-gray-700">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="md:col-span-8">
                          <SkillLevel level={value} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
            
            {/* プロジェクト参加履歴（あれば表示） */}
            {user.projects && user.projects.length > 0 && (
              <Card className="p-6 bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                  <Briefcase className="w-5 h-5 mr-2" />
                  参加プロジェクト
                </h2>
                <div className="space-y-4">
                  {user.projects.map((project, index) => (
                    <div key={index} className="p-4 border rounded-md hover:border-blue-300 transition-colors">
                      <h3 className="font-medium text-blue-600">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      {project.role && (
                        <p className="text-xs text-gray-500 mt-2">
                          役割: {project.role}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <UserRound className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">ユーザーが見つかりませんでした</p>
          </Card>
        )}
      </div>
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
} 