import React from "react";

const ProjectTask = ({ task }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {task.title || "タイトルなし"}
          </h3>
          <p className="text-gray-600">{task.description || "説明なし"}</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">期限:</span>
              <span className="text-sm font-medium">
                {task.deadline || "未設定"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">ステータス:</span>
              <span className="text-sm font-medium">
                {task.status || "未設定"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;
