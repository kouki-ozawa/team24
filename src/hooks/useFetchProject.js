import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 10; // ページネーションの項目数

export default function useFetchProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
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

  return {
    projects,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  };
}
