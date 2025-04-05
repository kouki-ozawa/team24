import { useState, useEffect } from "react";

export default function useProjectAll() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project`);

        if (!res.ok) {
          throw new Error("プロジェクト一覧の取得に失敗しました");
        }

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message || "不明なエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}
