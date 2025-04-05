"use client";

import React, { useState } from "react";
import { useProjectMessages } from "@/hooks/useProjectMessage";
import { useSWRConfig } from "swr";
import { Pencil, X, Check, Trash2 } from "lucide-react";

export const ProjectMessageList = ({ projectId }) => {
  const { mutate } = useSWRConfig();
  const { messages, loading, error } = useProjectMessages(projectId);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "メッセージ",
          description: newMessage,
          project_id: projectId,
          status: "active",
          deadline: new Date().toISOString().split('T')[0],
          assignee: localStorage.getItem("user_id") || "未割り当て"
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

  const handleEdit = (message) => {
    setEditingMessageId(message._id);
    setEditingContent(message.context);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleUpdateMessage = async (messageId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/message/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: editingContent,
          status: "active",
          deadline: new Date().toISOString().split('T')[0]
        }),
      });

      if (res.ok) {
        setEditingMessageId(null);
        setEditingContent("");
        mutate(); // 再取得してUI更新
      } else {
        console.error("更新失敗");
      }
    } catch (err) {
      console.error("エラー:", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("このメッセージを削除してもよろしいですか？")) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/message/${messageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        mutate(); // 再取得してUI更新
      } else {
        console.error("削除失敗");
      }
    } catch (err) {
      console.error("エラー:", err);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* メッセージ一覧 */}
      {loading ? (
        <p className="text-gray-500">読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">エラー: {error}</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400">No Message</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white rounded-2xl shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-blue-600">
                  {msg.assignee || "未割り当て"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">
                    {msg.deadline}
                  </p>
                  {msg.assignee === localStorage.getItem("user_id") && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(msg)}
                        className="text-gray-400 hover:text-gray-600"
                        title="編集"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="text-red-400 hover:text-red-600"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {editingMessageId === msg._id ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md resize-none"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="キャンセル"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateMessage(msg._id)}
                      className="text-green-500 hover:text-green-700 p-1"
                      title="保存"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800">{msg.description}</p>
              )}
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
