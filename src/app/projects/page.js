"use client";
import Link from "next/link";
import useProjectAll from "@/hooks/useProjectAll";

export default function ProjectListPage() {
  const { projects, loading, error } = useProjectAll();

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map((project) => (
        <Link
          href={`/projects/${project.id}`}
          key={project.id}
          className="block rounded-xl shadow-md p-4 transition hover:scale-105"
          style={{ backgroundColor: project.color || "#f0f0f0" }}
        >
          <h2 className="text-xl font-semibold mb-1">{project.title}</h2>
          <p className="text-sm text-gray-800 mb-2">{project.description}</p>
          <p className="text-sm text-gray-600">
            締切: {new Date(project.deadline).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}
