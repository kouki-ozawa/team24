"use client";

import React, { useState } from "react";
import { useProjectMessages } from "@/hooks/useProjectMessage";
import { useSWRConfig } from "swr";

export const ProjectMessageList = ({ projectId }) => {
  const { mutate } = useSWRConfig();
  const { messages, loading, error } = useProjectMessages(projectId);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          project_id: projectId,
          context: newMessage,
          data: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setNewMessage("");
        mutate(); // 再取得してUI更新（useSWR使用前提）
      } else {
        console.error("送信失敗");
      }
    } catch (err) {
      console.error("エラー:", err);
    }

    setSending(false);
  };

  return (
    <div className="space-y-6 p-4">
      {/* メッセージ一覧 */}
      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">エラー: {error}</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400">メッセージはありません。</p>
      ) : (
        <div className="space-y-4">
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
      )}

      {/* 新規メッセージ送信 */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-4 border-t mt-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md resize-none"
          rows={3}
          placeholder="メッセージを入力..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? "送信中..." : "送信"}
        </button>
      </form>
    </div>
  );
};
