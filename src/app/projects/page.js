"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // <-- 追加
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

const ITEMS_PER_PAGE = 9;
const DEFAULT_EMPTY_PROJECTS = 9;

const ProgressTab = {
  ALL: "all",
  COMPLETED: "completed",
  YELLOW: "yellow",
  RED: "red",
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState(ProgressTab.ALL);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // URLパラメータからページ番号を取得
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    setCurrentPage(page);

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project`
        );
        if (!response.ok) throw new Error("プロジェクトの取得に失敗しました");
        const data = await response.json();
        // APIのレスポンスを現在のプロジェクト形式にマッピング
        const mappedProjects = data.map((project) => ({
          id: project.id,
          name: project.title,
          description: project.description,
          start: project.start,
          deadline: project.deadline,
          required_members: project.required_members || null,
          status: project.status || "active",
          progress: project.progress || 0,
          members: project.members || [],
          color: project.color || null,
        }));
        setProjects(mappedProjects);
        setTotalPages(Math.ceil(mappedProjects.length / ITEMS_PER_PAGE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push(`/projects?page=${page}`, { scroll: false });
  };

  const handleDelete = async (projectId) => {
    if (!confirm("このプロジェクトを削除してもよろしいですか？")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("プロジェクトの削除に失敗しました");

      // プロジェクト一覧を更新
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      setTotalPages(Math.ceil(updatedProjects.length / ITEMS_PER_PAGE));
      
      // 現在のページが存在しなくなった場合は、最後のページに移動
      if (currentPage > Math.ceil(updatedProjects.length / ITEMS_PER_PAGE)) {
        setCurrentPage(Math.ceil(updatedProjects.length / ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("プロジェクトの削除に失敗しました。もう一度お試しください。");
    }
  };

  const paginatedProjects = projects
    .filter((project) => {
      if (activeTab === ProgressTab.ALL) return true;
      if (activeTab === ProgressTab.COMPLETED) return project.progress === 100;
      if (activeTab === ProgressTab.YELLOW) return project.progress > 0 && project.progress < 100;
      if (activeTab === ProgressTab.RED) return project.progress === 0;
      return true;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // フィルタリングされたプロジェクトの総数を計算
  const filteredProjectsCount = projects.filter((project) => {
    if (activeTab === ProgressTab.ALL) return true;
    if (activeTab === ProgressTab.COMPLETED) return project.progress === 100;
    if (activeTab === ProgressTab.YELLOW) return project.progress > 0 && project.progress < 100;
    if (activeTab === ProgressTab.RED) return project.progress === 0;
    return true;
  }).length;

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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* フィルターなど上部のコントロール部分 */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">プロジェクト一覧</h1>
          <p className="mt-2 text-sm text-gray-600">
            進行中のプロジェクトと完了したプロジェクトを確認できます
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 ${
              isEditing ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            <Pencil className="h-4 w-4" />
            {isEditing ? "編集を終了" : "編集"}
          </Button>
          <Button
            onClick={() => router.push("/projects/new")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            新規プロジェクト作成
          </Button>
        </div>
      </div>

      {/* タブフィルタ */}
      <div className="border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab(ProgressTab.ALL)}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === ProgressTab.ALL
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          すべて
        </button>
        <button
          onClick={() => setActiveTab(ProgressTab.COMPLETED)}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === ProgressTab.COMPLETED
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          完了
        </button>
        <button
          onClick={() => setActiveTab(ProgressTab.YELLOW)}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === ProgressTab.YELLOW
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          進行中
        </button>
        <button
          onClick={() => setActiveTab(ProgressTab.RED)}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === ProgressTab.RED
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          未着手
        </button>
      </div>

      {/* プロジェクト一覧グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project) => (
          <Card
            key={project.id}
            className={`relative overflow-hidden transition-all duration-200 ${
              project.id
                ? "hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                : "opacity-75"
            }`}
            onClick={() => {
              if (project.id && !isEditing) {
                router.push(`/projects/${project.id}?page=${currentPage}`, { scroll: true });
              }
            }}
          >
            {isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(project.id);
                }}
                className="absolute top-2 left-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <div className="absolute top-0 left-0 w-full h-2" style={{ 
              background: project.color 
                ? `linear-gradient(to right, ${project.color}, ${project.color})`
                : 'linear-gradient(to right, #3B82F6, #3B82F6)'
            }}></div>
            <div className="absolute top-2 right-0 p-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 cursor-default ${
                  project.progress === 100
                    ? "bg-green-100/90 text-green-800 group-hover:bg-green-200/90 border border-green-200/50"
                    : project.progress > 0
                    ? "bg-yellow-100/90 text-yellow-800 group-hover:bg-yellow-200/90 border border-yellow-200/50"
                    : "bg-gray-100/90 text-gray-600 group-hover:bg-gray-200/90 border border-gray-200/50"
                }`}
              >
                {project.progress === 100
                  ? "完了"
                  : project.progress > 0
                  ? "進行中"
                  : "新規"}
              </span>
            </div>
            <div className="pt-4 px-6">
              <div className="mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    !project.name ? "text-gray-400" : "text-gray-900"
                  } cursor-default`}
                >
                  {project.name || "No Project Name"}
                </h3>
              </div>

              <div className="mb-6">
                <p className="mt-2 text-sm text-gray-600/90 line-clamp-2 cursor-default">
                  {project.description === ""
                    ? "No description"
                    : project.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-white to-gray-50/30 p-3 rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.02)] border border-gray-100/80 group-hover:border-gray-200/80 group-hover:shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-300">
                  <p className="text-sm font-medium text-gray-700 cursor-default">
                    期間
                  </p>
                  <p className="mt-1.5 text-sm text-gray-900 cursor-default">
                    {project.start && project.deadline ? (
                      `${project.start} 〜 ${project.deadline}`
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400 -ml-[2px]">
                        <span className="font-mono">_</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-mono">_</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-mono">_</span>
                        <span className="mx-2 text-gray-300">〜</span>
                        <span className="font-mono">_</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-mono">_</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-mono">_</span>
                      </span>
                    )}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50/30 p-3 rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.02)] border border-gray-100/80 group-hover:border-gray-200/80 group-hover:shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-300">
                  <p className="text-sm font-medium text-gray-700 cursor-default">
                    メンバー
                  </p>
                  <p className="mt-1.5 text-sm text-gray-900 cursor-default">
                    {project.required_members != null ? (
                      <>
                        <span className="font-semibold">
                          {project.members?.length || 0}
                        </span>
                        <span className="mx-1">/</span>
                        <span className="font-semibold">
                          {project.required_members}
                        </span>
                        <span className="ml-0.5">名</span>
                      </>
                    ) : (
                      <span className="flex justify-end text-gray-400">
                        <span className="font-semibold">0</span>
                        <span className="mx-1">/</span>
                        <span className="font-semibold">0</span>
                        <span className="ml-0.5">名</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-gray-700 cursor-default">
                    進捗
                  </p>
                  <span className="text-sm font-semibold text-gray-900 cursor-default">
                    {project.progress != null
                      ? `${project.progress}%`
                      : "--％"}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-100/80 rounded-full h-3 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        project.progress == null || project.progress < 30
                          ? "bg-gradient-to-r from-red-500 to-red-400 group-hover:from-red-600 group-hover:to-red-500 shadow-[0_1px_2px_rgba(239,68,68,0.2)]"
                          : project.progress < 70
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-400 group-hover:from-yellow-600 group-hover:to-yellow-500 shadow-[0_1px_2px_rgba(234,179,8,0.2)]"
                          : "bg-gradient-to-r from-green-500 to-green-400 group-hover:from-green-600 group-hover:to-green-500 shadow-[0_1px_2px_rgba(34,197,94,0.2)]"
                      }`}
                      style={{ width: `${project.progress ?? 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ページネーション */}
      <div className="mt-8 flex justify-center space-x-2">
        <Button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 w-10 h-10 flex items-center justify-center"
        >
          <span className="text-2xl font-black">◀</span>
        </Button>
        <span className="flex items-center px-4 text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 w-10 h-10 flex items-center justify-center"
        >
          <span className="text-2xl font-black">▶</span>
        </Button>
      </div>
    </div>
  );
}
