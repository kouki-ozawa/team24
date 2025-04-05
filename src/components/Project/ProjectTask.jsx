"use client";

import React, { useState, useEffect } from "react";
import { Pencil, X, Check, Trash2, Plus } from "lucide-react";

export const ProjectTaskList = ({ projectId, tasks: initialTasks, onTasksChange }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    color: "#FFFFFF"
  });
  const [editingTask, setEditingTask] = useState({});

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        deadline: newTask.deadline || null,
        project_id: projectId,
        user_id: localStorage.getItem("user_id") || "string",
        technical_skill: 0,
        problem_solving_ability: 0,
        communication_skill: 0,
        security_awareness: 0,
        leadership_and_collaboration: 0,
        frontend_skill: 0,
        backend_skill: 0,
        infrastructure_skill: 0,
        status: "string",
        color: "#FFFFFF"
      };

      console.log("Adding task with data:", taskData);
      const res = await fetch(`https://skill-match-api-mongo.onrender.com/api/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        const addedTask = await res.json();
        console.log("Added task response:", addedTask);
        const newTask = {
          ...addedTask,
          deadline: taskData.deadline
        };
        setTasks([...tasks, newTask]);
        setIsAddingTask(false);
        setNewTask({
          title: "",
          description: "",
          deadline: "",
          color: "#FFFFFF"
        });
        if (onTasksChange) onTasksChange([...tasks, newTask]);
      } else {
        const errorData = await res.text();
        console.error("タスクの追加に失敗しました - ステータス:", res.status);
        console.error("エラーレスポンス:", errorData);
      }
    } catch (err) {
      console.error("タスクの追加に失敗しました:", err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTask({
      _id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline || ""
    });
    console.log("Editing task:", task);
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const taskData = {
        _id: taskId,
        title: editingTask.title,
        description: editingTask.description,
        deadline: editingTask.deadline || null,
        project_id: projectId,
        user_id: localStorage.getItem("user_id") || "string",
        technical_skill: 0,
        problem_solving_ability: 0,
        communication_skill: 0,
        security_awareness: 0,
        leadership_and_collaboration: 0,
        frontend_skill: 0,
        backend_skill: 0,
        infrastructure_skill: 0,
        status: "string",
        color: "#FFFFFF"
      };

      console.log("Updating task with data:", taskData);
      const res = await fetch(`https://skill-match-api-mongo.onrender.com/api/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        console.log("Updated task response:", updatedTask);
        const updatedTaskWithDeadline = {
          ...updatedTask,
          id: taskId,
          _id: taskId,
          deadline: editingTask.deadline || null
        };
        const newTasks = tasks.map(task => 
          task.id === taskId ? updatedTaskWithDeadline : task
        );
        setTasks(newTasks);
        setEditingTaskId(null);
        setEditingTask({});
        if (onTasksChange) onTasksChange(newTasks);
      } else {
        const errorData = await res.text();
        console.error("タスクの更新に失敗しました - ステータス:", res.status);
        console.error("エラーレスポンス:", errorData);
        console.error("送信したデータ:", taskData);
        alert("タスクの更新に失敗しました。もう一度お試しください。");
      }
    } catch (err) {
      console.error("タスクの更新に失敗しました:", err);
      alert("タスクの更新に失敗しました。もう一度お試しください。");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("このタスクを削除してもよろしいですか？")) {
      return;
    }

    try {
      console.log("Deleting task with ID:", taskId);
      const res = await fetch(`https://skill-match-api-mongo.onrender.com/api/task/${taskId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        }
      });

      if (res.ok) {
        const newTasks = tasks.filter(task => task.id !== taskId);
        setTasks(newTasks);
        if (onTasksChange) {
          onTasksChange(newTasks);
        }
        if (editingTaskId === taskId) {
          setEditingTaskId(null);
          setEditingTask({});
        }
      } else {
        const errorData = await res.text();
        console.error("タスクの削除に失敗しました - ステータス:", res.status);
        console.error("エラーレスポンス:", errorData);
        alert("タスクの削除に失敗しました。もう一度お試しください。");
      }
    } catch (err) {
      console.error("タスクの削除に失敗しました:", err);
      alert("タスクの削除に失敗しました。もう一度お試しください。");
    }
  };

  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(tasks);
    }
  }, [tasks, onTasksChange]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">タスク一覧</h2>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>タスクを追加</span>
        </button>
      </div>

      {isAddingTask && (
        <form onSubmit={handleAddTask} className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">期限</label>
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              追加
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <p className="text-gray-600 text-center py-8">タスクはまだ登録されていません</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              {editingTaskId === task.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">期限</label>
                    <input
                      type="date"
                      value={editingTask.deadline}
                      onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="キャンセル"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateTask(task.id)}
                      className="text-green-500 hover:text-green-700 p-1"
                      title="保存"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {task.title}
                      </h3>
                      <p className="text-gray-600">
                        {task.description}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">期限:</span>
                          <span className="text-sm font-medium">
                            {task.deadline || "未設定"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-gray-400 hover:text-gray-600"
                        title="編集"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-400 hover:text-red-600"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
