"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProjectDetailPage({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/project/${params.id}`);
        if (!response.ok) {
          throw new Error("プロジェクトの取得に失敗しました");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={() => router.push("/projects")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            プロジェクト一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">プロジェクトが見つかりません</p>
          <Button
            onClick={() => router.push("/projects")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            プロジェクト一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="fixed left-0 top-20 flex items-center text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm pl-4 pr-6 py-2 rounded-r-full border border-gray-200 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          戻る
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                project.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {project.status === "completed" ? "完了" : "進行中"}
            </span>
            <span className="text-sm text-gray-500">
              進捗: {project.progress ?? 0}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">期間</p>
                <p className="mt-1 text-gray-900">
                  {project.start_date} 〜 {project.end_date}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">メンバー</p>
                <p className="mt-1 text-gray-900">
                  {project.members?.length || 0} / {project.required_members} 名
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">プロジェクト詳細</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">説明</p>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {project.documents && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ドキュメント</h2>
            <p className="text-gray-900 whitespace-pre-wrap">{project.documents}</p>
          </Card>
        )}

        {project.references && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">リファレンス</h2>
            <p className="text-gray-900 whitespace-pre-wrap">{project.references}</p>
          </Card>
        )}
      </div>
    </div>
  );
} 