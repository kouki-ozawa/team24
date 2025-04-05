"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TECH_STACKS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "Go",
  "C#",
  "Swift",
  "Kotlin",
  "Docker",
  "AWS",
  "GCP",
  "Azure",
];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    required_members: "",
    documents: "",
    references: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("プロジェクトの作成に失敗しました");
      }

      router.push("/projects");
    } catch (err) {
      setError(err.message);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechStackChange = (tech) => {
    setFormData((prev) => ({
      ...prev,
      tech_stacks: prev.tech_stacks.includes(tech)
        ? prev.tech_stacks.filter((t) => t !== tech)
        : [...prev.tech_stacks, tech],
    }));
  };

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="fixed left-0 top-20 flex items-center text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm pl-4 pr-6 py-2 rounded-r-full border border-gray-200 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          戻る
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            新規プロジェクト作成
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            新しいプロジェクトの詳細を入力してください
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                プロジェクト名 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクト名を入力"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明 *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクトの説明を入力"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  開始日 *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:ml-1 [&::-webkit-date-and-time-value]:text-left [&::-webkit-date-and-time-value]:w-[calc(100%-24px)] [&::-webkit-date-and-time-value]:whitespace-nowrap [&:not([value])]:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                  終了日 *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:ml-1 [&::-webkit-date-and-time-value]:text-left [&::-webkit-date-and-time-value]:w-[calc(100%-24px)] [&::-webkit-date-and-time-value]:whitespace-nowrap [&:not([value])]:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="required_members" className="block text-sm font-medium text-gray-700 mb-1">
                参加人数 *
              </label>
              <input
                type="number"
                id="required_members"
                name="required_members"
                required
                min="1"
                value={formData.required_members}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="参加人数を入力"
              />
            </div>

            <div>
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">
                Documents
              </label>
              <textarea
                id="documents"
                name="documents"
                value={formData.documents}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクトに関連するドキュメントのURLや説明を入力"
              />
            </div>

            <div>
              <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-1">
                References
              </label>
              <textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="プロジェクトに関連する参考資料のURLや説明を入力"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "作成中..." : "作成する"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 