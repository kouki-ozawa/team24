"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Auth({ setUserId }) {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const endpoint = isLogin
        ? `${process.env.NEXT_PUBLIC_API_URL}/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/signup`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "エラーが発生しました");
      }

      const data = await res.json();

      if (isLogin) {
        const userId = data.user_id;
        //本来はJWTトークンを保存するが、ここではuserIdを保存
        localStorage.setItem("userId", userId);
        setUserId(userId);
        router.push("/");
      } else {
        alert("アカウント作成に成功しました。ログインしてください。");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? "ログイン" : "新規登録"}
      </h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? "送信中..." : isLogin ? "ログイン" : "新規登録"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <button onClick={toggleMode} className="text-blue-600 hover:underline">
          {isLogin
            ? "アカウントをお持ちでない方はこちら"
            : "ログインに切り替え"}
        </button>
      </div>
    </div>
  );
}
