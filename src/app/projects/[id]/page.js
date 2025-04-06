"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { use } from "react";
import { ProjectMessageList } from "@/components/Project/ProjectMessage";
import { ProjectTaskList } from "@/components/Project/ProjectTask";

const COLORS = [
  { name: "青", value: "#3B82F6" },
  { name: "緑", value: "#10B981" },
  { name: "黄", value: "#F59E0B" },
  { name: "赤", value: "#EF4444" },
  { name: "紫", value: "#8B5CF6" },
  { name: "ピンク", value: "#EC4899" },
];

export default function ProjectDetailPage({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const projectId = use(params).id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // プロジェクトデータの取得
        const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`);
        if (!projectResponse.ok) throw new Error("プロジェクトの取得に失敗しました");
        const projectData = await projectResponse.json();
        setProject(projectData);

        // タスクデータの取得
        try {
          const tasksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/project/${projectId}`);
          if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            setTasks(tasksData);
          } else {
            console.warn("タスクの取得に失敗しました。空のタスクリストを設定します。");
            setTasks([]);
          }
        } catch (tasksErr) {
          console.warn("タスクの取得中にエラーが発生しました:", tasksErr);
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleTasksChange = (newTasks) => {
    setTasks(newTasks);
  };

  const handleColorChange = async (newColor) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...project,
          color: newColor
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error("カラーの更新に失敗しました");
      }
      
      const updatedProject = await response.json();
      setProject(updatedProject);
    } catch (err) {
      console.error("Error updating color:", err);
      alert("カラーの更新に失敗しました。もう一度お試しください。");
    }
  };

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
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    テーマカラー
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => handleColorChange(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          project.color === color.value
                            ? "border-gray-900 scale-110"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
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
            <ProjectTaskList
              projectId={projectId}
              tasks={tasks}
              onTasksChange={handleTasksChange}
            />
          </div>

          <div className="bg-gray-50 rounded-lg shadow-sm p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">メッセージ</h2>
            <ProjectMessageList projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}
