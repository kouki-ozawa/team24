"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    technical_skill: 3,
    problem_solving_ability: 3,
    communication_skill: 3,
    security_awareness: 3,
    leadership_and_collaboration: 3,
    learning_and_adaptability: 3,
    engineer_type_id: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);

  // ユーザー一覧を取得
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://skill-match-api-mock.onrender.com/users');
      if (!response.ok) throw new Error('ユーザー一覧の取得に失敗しました');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('このユーザーを削除してもよろしいですか？')) return;
    
    try {
      const response = await fetch(`https://skill-match-api-mock.onrender.com/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('ユーザーの削除に失敗しました');
      
      setMessage({ type: 'success', text: 'ユーザーを削除しました！' });
      fetchUsers(); // ユーザー一覧を更新
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('https://skill-match-api-mock.onrender.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('ユーザー登録に失敗しました');

      const data = await response.json();
      setMessage({ type: 'success', text: 'ユーザーを登録しました！' });
      setFormData({
        name: "",
        email: "",
        technical_skill: 3,
        problem_solving_ability: 3,
        communication_skill: 3,
        security_awareness: 3,
        leadership_and_collaboration: 3,
        learning_and_adaptability: 3,
        engineer_type_id: 1
      });
      
      // ユーザー一覧を更新
      fetchUsers();
      
      // 3秒後にメッセージを消す
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        setShowForm(false);
      }, 3000);

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' ? parseInt(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ホームに戻る
          </Link>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'フォームを閉じる' : '新しいユーザーを登録'}
        </Button>

        {message.text && (
          <div className={`mb-6 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-6">新規ユーザー登録</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">名前</Label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="technical_skill">
                    技術スキル: {formData.technical_skill}
                  </Label>
                  <input
                    id="technical_skill"
                    name="technical_skill"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.technical_skill}
                    onChange={handleChange}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="problem_solving_ability">
                    問題解決力: {formData.problem_solving_ability}
                  </Label>
                  <input
                    id="problem_solving_ability"
                    name="problem_solving_ability"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.problem_solving_ability}
                    onChange={handleChange}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="communication_skill">
                    コミュニケーション: {formData.communication_skill}
                  </Label>
                  <input
                    id="communication_skill"
                    name="communication_skill"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.communication_skill}
                    onChange={handleChange}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="security_awareness">
                    セキュリティ意識: {formData.security_awareness}
                  </Label>
                  <input
                    id="security_awareness"
                    name="security_awareness"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.security_awareness}
                    onChange={handleChange}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="leadership_and_collaboration">
                    リーダーシップと協調性: {formData.leadership_and_collaboration}
                  </Label>
                  <input
                    id="leadership_and_collaboration"
                    name="leadership_and_collaboration"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.leadership_and_collaboration}
                    onChange={handleChange}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="learning_and_adaptability">
                    学習力と適応力: {formData.learning_and_adaptability}
                  </Label>
                  <input
                    id="learning_and_adaptability"
                    name="learning_and_adaptability"
                    type="range"
                    min="1"
                    max="5"
                    value={formData.learning_and_adaptability}
                    onChange={handleChange}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="engineer_type_id">エンジニアタイプ</Label>
                <select
                  id="engineer_type_id"
                  name="engineer_type_id"
                  value={formData.engineer_type_id}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="1">フロントエンドエンジニア</option>
                  <option value="2">バックエンドエンジニア</option>
                  <option value="3">フルスタックエンジニア</option>
                  <option value="4">インフラエンジニア</option>
                  <option value="5">データエンジニア</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "登録中..." : "登録する"}
              </Button>
            </form>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">登録済みユーザー一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メール</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">技術力</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">問題解決力</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コミュニケーション</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.technical_skill}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.problem_solving_ability}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.communication_skill}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        削除
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
