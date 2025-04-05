import React from "react";
import { useProjectMessages } from "@/hooks/useProjectMessages";

export const ProjectMessageList = ({ projectId }) => {
  const { messages, loading, error } = useProjectMessages(projectId);

  if (loading) return <p className="text-gray-500">読み込み中...</p>;
  if (error) return <p className="text-red-500">エラー: {error}</p>;
  if (!messages.length)
    return <p className="text-gray-400">メッセージはありません。</p>;

  return (
    <div className="space-y-4 p-4">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="bg-white rounded-2xl shadow p-4 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-blue-600">
              {msg.user_name}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(msg.data).toLocaleString()}
            </p>
          </div>
          <p className="text-gray-800">{msg.context}</p>
        </div>
      ))}
    </div>
  );
};
