"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RequireAuth from "@/components/RequireAuth";
import { useLocalStorage } from "@/components/utils/UseLocalStorage";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  UserRound,
  Briefcase,
  MapPin,
  Link as LinkIcon,
  GitHub,
  Trash2,
  Plus,
  BookOpen,
} from "lucide-react";

export default function UserSettingsPage({ params }) {
  const userId = params.id;
  const router = useRouter();
  const { toast } = useToast();
  const { value: currentUserId } = useLocalStorage("userId");
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    company: "",
    website: "",
    github: "",
    skills: []
  });
  const [newSkill, setNewSkill] = useState({ name: "", level: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
      
      // フォームデータを初期化
      setFormData({
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        location: data.location || "",
        company: data.company || "",
        website: data.website || "",
        github: data.github || "",
        skills: data.skills || []
      });
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
    // 本人以外のアクセスを拒否
    if (currentUserId !== userId) {
      toast({
        title: "エラー",
        description: "このページにアクセスする権限がありません。",
        variant: "destructive",
      });
      router.push(`/users/${userId}`);
      return;
    }
    
    if (userId) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentUserId]);

  // フォーム入力の処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 新しいスキルの入力処理
  const handleNewSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({
      ...newSkill,
      [name]: name === "level" ? parseInt(value, 10) : value
    });
  };

  // スキルの追加
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const updatedSkills = [...formData.skills, { ...newSkill }];
    setFormData({
      ...formData,
      skills: updatedSkills
    });
    // 入力をリセット
    setNewSkill({ name: "", level: 1 });
  };

  // スキルの削除
  const handleRemoveSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  // 更新を保存
  const handleSave = async () => {
    // 入力検証
    if (!formData.username.trim() || !formData.email.trim()) {
      toast({
        title: "入力エラー",
        description: "ユーザー名とメールアドレスは必須項目です。",
        variant: "destructive",
      });
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
        throw new Error("プロフィールの更新に失敗しました");
      }

      // 成功メッセージ
      toast({
        title: "成功",
        description: "プロフィールが正常に更新されました",
      });
      
      // プロフィールページに戻る
      router.push(`/users/${userId}`);
    } catch (error) {
      console.error("プロフィール更新エラー:", error);
      toast({
        title: "エラー",
        description: "プロフィールの更新に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // プロフィールページに戻る
  const handleGoBack = () => {
    router.push(`/users/${userId}`);
  };

  const content = (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 flex items-center text-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          プロフィールに戻る
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">プロフィール設定</h1>

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
        ) : (
          <div className="space-y-6">
            {/* 基本情報 */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <UserRound className="w-5 h-5 mr-2" />
                基本情報
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">ユーザー名*</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">メールアドレス*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">自己紹介</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            </Card>
            
            {/* 追加情報 */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <Briefcase className="w-5 h-5 mr-2" />
                追加情報
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      所在地
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company" className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      会社・所属
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website" className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-1" />
                      ウェブサイト
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="https://"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="github" className="flex items-center">
                      <GitHub className="w-4 h-4 mr-1" />
                      GitHubユーザー名
                    </Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>
            
            {/* スキル */}
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <BookOpen className="w-5 h-5 mr-2" />
                スキル
              </h2>
              
              {/* 登録済みスキル */}
              <div className="mb-6">
                <Label className="mb-2 block">登録済みスキル</Label>
                {formData.skills.length === 0 ? (
                  <p className="text-gray-500 text-sm">スキルが登録されていません</p>
                ) : (
                  <div className="space-y-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center">
                          <span className="font-medium">{skill.name}</span>
                          {skill.level && (
                            <span className="ml-2 bg-blue-100 text-blue-800 px-1.5 rounded-full text-xs">
                              レベル: {skill.level}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* 新規スキル追加 */}
              <div className="space-y-4">
                <Label>新規スキル追加</Label>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <div className="flex-1">
                    <Input
                      name="name"
                      value={newSkill.name}
                      onChange={handleNewSkillChange}
                      placeholder="スキル名"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <select
                      name="level"
                      value={newSkill.level}
                      onChange={handleNewSkillChange}
                      className="w-full h-10 px-3 py-2 border rounded-md"
                    >
                      <option value={1}>レベル1</option>
                      <option value={2}>レベル2</option>
                      <option value={3}>レベル3</option>
                      <option value={4}>レベル4</option>
                      <option value={5}>レベル5</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleAddSkill}
                    disabled={!newSkill.name.trim()}
                    className="flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    追加
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* 保存ボタン */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                変更を保存
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <RequireAuth>{content}</RequireAuth>;
} 