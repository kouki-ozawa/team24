"use client";

import React, { useState } from "react";

export default function MessageBoard({ messages, userId, projectId }) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);

    const res = await fetch("/api/messages/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        project_id: projectId,
        context: newMessage,
        data: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      setNewMessage("");
      location.reload(); // or update state manually if必要
    } else {
      console.error("Failed to post message");
    }

    setSending(false);
  };

  return (
    <div className="space-y-6 p-4">
      {/* 投稿フォーム */}
      <form onSubmit={handleSubmit} className="space-y-2">
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

      {/* メッセージリスト */}
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
    </div>
  );
}
