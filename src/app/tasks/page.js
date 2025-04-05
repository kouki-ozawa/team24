"use client";

import React, { useState, useEffect } from 'react';

const Spinner = () => (
    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
    </svg>
);

const TaskPage = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const [projectMapping, setProjectMapping] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ローカルストレージからも取得（props の userId がなければ利用）
    const storedUserId = typeof window !== 'undefined' && localStorage.getItem("userId");
    const effectiveUserId = userId || storedUserId;

    useEffect(() => {
        // 有効なユーザーIDがない場合はフェッチを中断
        if (!effectiveUserId) {
            setError("ユーザーIDが見つかりません");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const taskResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project`);
                if (!taskResponse.ok) {
                    throw new Error('タスク取得中のネットワークエラー');
                }
                const tasksData = await taskResponse.json();

                const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
                if (!projectResponse.ok) {
                    throw new Error('プロジェクト取得中のネットワークエラー');
                }
                const projectsData = await projectResponse.json();

                const mapping = {};
                projectsData.forEach(project => {
                    mapping[project.id] = project.title;
                });

                // task.user_id がオブジェクトの場合も考慮
                const userTasks = tasksData.filter(task => {
                    const taskUserId =
                        typeof task.user_id === 'object' && task.user_id !== null
                            ? (task.user_id._id ? task.user_id._id : task.user_id.toString())
                            : task.user_id;
                    // デバッグ用ログ
                    console.log("タスクのuser_id:", String(taskUserId).trim(), "有効なuserId:", String(effectiveUserId).trim());
                    return String(taskUserId).trim() === String(effectiveUserId).trim();
                });

                setTasks(userTasks);
                setProjectMapping(mapping);
            } catch (err) {
                setError(err.message || 'エラーが発生しました');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [effectiveUserId]);

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div>読み込み中</div>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">タスク一覧</h1>
            {tasks.length === 0 ? (
                <p className="text-gray-600">タスクが存在しません</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <li key={task.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                            <p className="text-sm text-blue-500 mb-1">
                                {projectMapping[task.project_id] || "プロジェクト名不明"}
                            </p>
                            <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                            <p className="mt-2 text-gray-600">{task.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskPage;