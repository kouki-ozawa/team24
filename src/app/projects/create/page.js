"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    required_members: 1,
    status: "active",
    skills_required: {
      technical_skill: 1,
      problem_solving_ability: 1,
      communication_skill: 1,
      security_awareness: 1,
      leadership_and_collaboration: 1,
      learning_and_adaptability: 1
    }
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name.includes('.')) {
      // スキル要件のフィールドの場合
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'range' ? parseInt(value) : value
        }
      }));
    } else {
      // 通常のフィールドの場合
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("プロジェクトの作成に失敗しました");
      }

      router.push("/projects");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新規プロジェクト作成</h1>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="text-gray-600"
          >
            戻る
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">プロジェクト名</Label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <Label htmlFor="description">プロジェクト説明</Label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start_date">開始日</Label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="end_date">終了日</Label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="required_members">必要メンバー数</Label>
              <input
                id="required_members"
                name="required_members"
                type="number"
                min="1"
                required
                value={formData.required_members}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">必要なスキル要件</h3>
              
              <div>
                <Label htmlFor="skills_required.technical_skill">
                  技術スキル: {formData.skills_required.technical_skill}
                </Label>
                <input
                  id="skills_required.technical_skill"
                  name="skills_required.technical_skill"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.skills_required.technical_skill}
                  onChange={handleChange}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="skills_required.problem_solving_ability">
                  問題解決力: {formData.skills_required.problem_solving_ability}
                </Label>
                <input
                  id="skills_required.problem_solving_ability"
                  name="skills_required.problem_solving_ability"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.skills_required.problem_solving_ability}
                  onChange={handleChange}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="skills_required.communication_skill">
                  コミュニケーション: {formData.skills_required.communication_skill}
                </Label>
                <input
                  id="skills_required.communication_skill"
                  name="skills_required.communication_skill"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.skills_required.communication_skill}
                  onChange={handleChange}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="skills_required.security_awareness">
                  セキュリティ意識: {formData.skills_required.security_awareness}
                </Label>
                <input
                  id="skills_required.security_awareness"
                  name="skills_required.security_awareness"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.skills_required.security_awareness}
                  onChange={handleChange}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="skills_required.leadership_and_collaboration">
                  リーダーシップと協調性: {formData.skills_required.leadership_and_collaboration}
                </Label>
                <input
                  id="skills_required.leadership_and_collaboration"
                  name="skills_required.leadership_and_collaboration"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.skills_required.leadership_and_collaboration}
                  onChange={handleChange}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <Label htmlFor="skills_required.learning_and_adaptability">
                  学習力と適応力: {formData.skills_required.learning_and_adaptability}
                </Label>
                <input
                  id="skills_required.learning_and_adaptability"
                  name="skills_required.learning_and_adaptability"
                  type="range"
                  min="1"
                  max="5"
                  value={formData.skills_required.learning_and_adaptability}
                  onChange={handleChange}
                  className="w-full mt-2"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "作成中..." : "プロジェクトを作成"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
