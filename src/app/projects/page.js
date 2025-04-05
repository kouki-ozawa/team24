"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://skill-match-api-mongo.onrender.com/api/project"
        );
        if (!response.ok) throw new Error("プロジェクトの取得に失敗しました");
        const data = await response.json();
        // APIのレスポンスを現在のプロジェクト形式にマッピング
        const mappedProjects = data.map(project => ({
          id: project.id,
          name: project.title,
          description: project.description,
          start: project.start,
          deadline: project.deadline,
          required_members: project.required_members || null,
          status: project.status || "active",
          progress: project.progress || 0,
          members: project.members || []
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

  const filterProjectsByProgress = (projects) => {
    switch (activeTab) {
      case ProgressTab.COMPLETED:
        return projects.filter(project => project.status === "completed");
      case ProgressTab.YELLOW:
        return projects.filter(project => 
          project.status === "active" && 
          project.progress >= 30 && 
          project.progress < 70
        );
      case ProgressTab.RED:
        return projects.filter(project => 
          project.status === "active" && 
          (project.progress == null || project.progress < 30)
        );
      default:
        return projects;
    }
  };

  const filteredProjects = filterProjectsByProgress(projects);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              プロジェクト一覧
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              進行中のプロジェクトと完了したプロジェクトを確認できます
            </p>
          </div>
          <Button
            onClick={() => router.push('/projects/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            新規プロジェクト作成
          </Button>
        </div>

        <div className="mb-6 flex space-x-4 border-b border-gray-200">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((project) => (
            <Card
              key={project.id}
              className={`relative overflow-hidden transition-all duration-200 ${
                project.id
                  ? "hover:shadow-lg hover:scale-[1.01] cursor-pointer"
                  : "opacity-75"
              }`}
              onClick={async () => {
                if (project.id) {
                  try {
                    const response = await fetch(`https://skill-match-api-mongo.onrender.com/api/project/${project.id}`);
                    if (!response.ok) throw new Error("プロジェクトの取得に失敗しました");
                    const data = await response.json();
                    router.push(`/projects/id/${project.id}`);
                  } catch (err) {
                    console.error("プロジェクトの取得に失敗しました:", err);
                  }
                }
              }}
            >
              <div className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${!project.name ? "text-gray-400" : "text-gray-900"} cursor-default`}>
                      {project.name || "No Project Name"}
                    </h3>
                  </div>
                </div>
                <div className="absolute top-0 right-0 mt-2 mr-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 cursor-default ${
                      project.status === "completed"
                        ? "bg-green-100/90 text-green-800 group-hover:bg-green-200/90 border border-green-200/50"
                        : "bg-gray-100/90 text-gray-600 group-hover:bg-gray-200/90 border border-gray-200/50"
                    }`}
                  >
                    {project.status === "active" ? "進行中" : "完了"}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="mt-2 text-sm text-gray-600/90 line-clamp-2 cursor-default">
                    {project.description === "" ? "No description" : project.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-white to-gray-50/30 p-3 rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.02)] border border-gray-100/80 group-hover:border-gray-200/80 group-hover:shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-300">
                    <p className="text-sm font-medium text-gray-700 cursor-default">期間</p>
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
                          <span className="font-semibold">{project.members?.length || 0}</span>
                          <span className="mx-1">/</span>
                          <span className="font-semibold">{project.required_members}</span>
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

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-700 cursor-default">進捗</p>
                    <span className="text-sm font-semibold text-gray-900 cursor-default">{project.progress != null ? `${project.progress}%` : '--％'}</span>
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

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 w-10 h-10 flex items-center justify-center"
            >
              <span className="text-2xl font-black">◀</span>
            </Button>
            <span className="flex items-center px-4 text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 w-10 h-10 flex items-center justify-center"
            >
              <span className="text-2xl font-black">▶</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
