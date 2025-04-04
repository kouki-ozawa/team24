import { useState, useEffect } from "react";

export default function useProject(project_id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(""); // エラーメッセージをリセット
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${project_id}`
        );

        if (!res.ok) {
          throw new Error("プロジェクトの取得に失敗しました");
        }

        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (project_id) {
      fetchProject();
    }
  }, [project_id]);

  return { project, loading, error };
}
