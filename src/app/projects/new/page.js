"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useFetchProjects from "@/hooks/useFetchProject";

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
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    start: "",
    deadline: "",
    color: "#FFFFFF",
    image: "string",
    document: "",
    reference: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://skill-match-api-mongo.onrender.com/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...projectData,
          color: "#FFFFFF" // デフォルトの色を設定
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
      }
    } catch (err) {
      console.error("プロジェクトの作成に失敗しました:", err);
      alert("プロジェクトの作成に失敗しました。もう一度お試しください。");
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
              <textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクトの説明を入力"
                required
              />
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
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                作成する
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 