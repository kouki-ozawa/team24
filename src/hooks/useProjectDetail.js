import { useState, useEffect } from "react";

const useProjectDetail = (projectId) => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // プロジェクトデータの取得
        const projectResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`
        );
        if (!projectResponse.ok)
          throw new Error("プロジェクトの取得に失敗しました");
        const projectData = await projectResponse.json();
        setProject(projectData);

        // タスクデータの取得
        const tasksResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/project/${projectId}`
        );
        const tasksData = await tasksResponse.json();

        // タスクデータの処理
        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else if (tasksData.tasks) {
          setTasks(tasksData.tasks);
        } else {
          console.log("Unexpected tasks data structure:", tasksData);
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { project, tasks, loading, error };
};

export default useProjectDetail;
