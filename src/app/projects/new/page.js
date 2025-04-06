"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useFetchProjects from "@/hooks/useFetchProject";
import { AlertCircle } from "lucide-react";

const TECH_STACKS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "Go",
  "C#",
  "Swift",
  "Kotlin",
  "Docker",
  "AWS",
  "GCP",
  "Azure",
];

export default function NewProject() {
  const router = useRouter();
  const { refreshProjects } = useFetchProjects();
  const [isCreating, setIsCreating] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    start: "",
    deadline: "",
    color: "#3B82F6",
    image: "string",
    document: "",
    reference: ""
  });

  const COLORS = [
    { name: "青", value: "#3B82F6" },
    { name: "緑", value: "#10B981" },
    { name: "黄", value: "#F59E0B" },
    { name: "赤", value: "#EF4444" },
    { name: "紫", value: "#8B5CF6" },
    { name: "ピンク", value: "#EC4899" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("https://skill-match-api-mongo.onrender.com/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: projectData.title,
          description: projectData.description,
          start: projectData.start,
          deadline: projectData.deadline,
          color: projectData.color,
          image: projectData.image,
          document: projectData.document,
          reference: projectData.reference
        }),
      });

      if (res.ok) {
        const createdProject = await res.json();
        console.log("Created project:", createdProject);
        
        // プロジェクト一覧を取得
        const projectsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project`);
        if (!projectsRes.ok) {
          throw new Error("プロジェクト一覧の取得に失敗しました");
        }
        await projectsRes.json(); // プロジェクト一覧を取得して確実にキャッシュを更新
        
        // プロジェクト一覧ページに遷移
        router.push("/projects");
      } else {
        const errorData = await res.text();
        console.error("プロジェクトの作成に失敗しました - ステータス:", res.status);
        console.error("エラーレスポンス:", errorData);
        alert("プロジェクトの作成に失敗しました。もう一度お試しください。");
        setIsCreating(false);
      }
    } catch (err) {
      console.error("プロジェクトの作成に失敗しました:", err);
      alert("プロジェクトの作成に失敗しました。もう一度お試しください。");
      setIsCreating(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            新規プロジェクト作成
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            新しいプロジェクトの詳細を入力してください
          </p>
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-blue-500 mr-3 mt-0.5 flex-shrink-0 w-5 h-5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">タスク自動生成機能</h3>
            <p className="mt-1 text-sm text-blue-700">
              プロジェクトを作成すると、OpenAI APIが自動的にプロジェクトの説明からタスクを生成します。タスクはプロジェクト作成後に「タスク一覧」ページで確認できます。
            </p>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                プロジェクト名 *
              </label>
              <input
                type="text"
                id="title"
                value={projectData.title}
                onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクト名を入力"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明 *
              </label>
              <div className="space-y-1">
                <textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="プロジェクトの説明を入力"
                  required
                />
                <p className="text-xs text-gray-500 italic">
                  詳細な説明を入力すると、より正確なタスクが自動生成されます。
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テーマカラー
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setProjectData({...projectData, color: color.value})}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      projectData.color === color.value
                        ? "border-gray-900 scale-110"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                  開始日 *
                </label>
                <input
                  type="date"
                  id="start"
                  value={projectData.start}
                  onChange={(e) => setProjectData({...projectData, start: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  終了日 *
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={projectData.deadline}
                  onChange={(e) => setProjectData({...projectData, deadline: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
                Documents
              </label>
              <textarea
                id="document"
                value={projectData.document}
                onChange={(e) => setProjectData({...projectData, document: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクトに関連するドキュメントのURLや説明を入力"
              />
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                References
              </label>
              <textarea
                id="reference"
                value={projectData.reference}
                onChange={(e) => setProjectData({...projectData, reference: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクトに関連する参考資料のURLや説明を入力"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                disabled={isCreating}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreating}
              >
                {isCreating ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    作成中...
                  </div>
                ) : (
                  "作成する"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 