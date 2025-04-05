import { ProjectMessageList } from "@/components/ProjectMessageList";

export default function ProjectPage({ projectId }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">メッセージ一覧</h1>
      <ProjectMessageList projectId={projectId} />
    </div>
  );
}
