import { useEffect, useState } from "react";

export const useProjectMessages = (projectId, skip = 0, limit = 10) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/messages/project/${projectId}?skip=${skip}&limit=${limit}`
        );
        if (!res.ok) throw new Error("メッセージの取得に失敗しました");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [projectId, skip, limit]);

  return { messages, loading, error };
};
