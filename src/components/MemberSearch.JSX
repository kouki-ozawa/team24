"use client";
import { useState, useEffect } from "react";

export default function MemberSearch({ onAddMember }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users?name=${encodeURIComponent(
              searchTerm
            )}`
          );
          if (!response.ok) throw new Error("ユーザーの取得に失敗しました");
          const data = await response.json();
          // API のレスポンスは [{ user_id, name }, ...] を想定
          setResults(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="メンバー名で検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-2 w-full"
      />
      {loading && <p className="mt-2 text-gray-600">検索中...</p>}
      {results.length > 0 && (
        <ul className="mt-2 border rounded divide-y">
          {results.map((user) => (
            <li
              key={user.user_id}
              className="p-2 hover:bg-gray-100 flex justify-between items-center"
            >
              <span>{user.name}</span>
              <button
                onClick={() => {
                  if (onAddMember) onAddMember(user);
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                追加
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}