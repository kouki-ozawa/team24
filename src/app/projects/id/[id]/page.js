"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { use } from "react";
import { ProjectMessageList } from "@/components/Project/ProjectMessage";
import ProjectTask from "@/components/Project/ProjectTask";
import useProjectDetail from "@/hooks/useProjectDetail";

export default function ProjectDetailPage({ params }) {
  const router = useRouter();

  const projectId = use(params).id;

  const { project, tasks, loading, error } = useProjectDetail(projectId);

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-12 -ml-8">
          <Button
            variant="outline"
            size="sm"
            className="group flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-l-none rounded-r-full pl-4 pr-6 border-l-0 transition-all duration-200 ease-in-out hover:shadow-md border-gray-300 shadow-sm"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="font-medium tracking-wide">一覧に戻る</span>
          </Button>
        </div>
        <div className="space-y-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {project.title || "No Project Name"}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {project.description || "No description"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-lg shadow-sm p-8 space-y-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                プロジェクト情報
              </h2>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      開始日
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {project.start || "未設定"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      終了日
                    </p>
                    <p className="text-gray-900 font-medium text-lg">
                      {project.deadline || "未設定"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    メンバー
                  </p>
                  <p className="text-gray-900 font-medium text-lg">
                    {project.members || "未設定"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">
              タスク一覧
            </h2>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <ProjectTask key={task._id || task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                タスクはまだ登録されていません
              </p>
            )}
          </div>

          <ProjectMessageList projectId={projectId}></ProjectMessageList>
        </div>
      </div>
    </div>
  );
}
