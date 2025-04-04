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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="mt-2 text-sm text-gray-600">
            エンジニアのスキル情報を登録・管理できます
          </p>
        </div>

        <div className="space-y-8">
          {/* ユーザー登録フォームトグルボタン */}
          <div className="flex justify-end">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {showForm ? 'フォームを閉じる' : '新しいユーザーを登録'}
            </Button>
          </div>

          {/* メッセージ表示 */}
          {message.text && (
            <div className={`rounded-lg p-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* ユーザー登録フォーム */}
          {showForm && (
            <Card className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  新規ユーザー登録
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 基本情報 */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700">
                          名前
                        </Label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700">
                          メールアドレス
                        </Label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="engineer_type_id" className="text-gray-700">
                          エンジニアタイプ
                        </Label>
                        <select
                          id="engineer_type_id"
                          name="engineer_type_id"
                          value={formData.engineer_type_id}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="1">フロントエンドエンジニア</option>
                          <option value="2">バックエンドエンジニア</option>
                          <option value="3">フルスタックエンジニア</option>
                          <option value="4">インフラエンジニア</option>
                          <option value="5">データエンジニア</option>
                        </select>
                      </div>
                    </div>

                    {/* スキル評価 */}
                    <div className="space-y-4">
                      {Object.entries({
                        technical_skill: "技術スキル",
                        problem_solving_ability: "問題解決力",
                        communication_skill: "コミュニケーション",
                        security_awareness: "セキュリティ意識",
                        leadership_and_collaboration: "リーダーシップと協調性",
                        learning_and_adaptability: "学習力と適応力"
                      }).map(([key, label]) => (
                        <div key={key}>
                          <Label htmlFor={key} className="text-gray-700 flex justify-between">
                            <span>{label}</span>
                            <span className="text-blue-600">{formData[key]}</span>
                          </Label>
                          <input
                            id={key}
                            name={key}
                            type="range"
                            min="1"
                            max="5"
                            value={formData[key]}
                            onChange={handleChange}
                            className="mt-2 w-full accent-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
                    >
                      {isLoading ? "登録中..." : "登録する"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          )}

          {/* ユーザー一覧 */}
          <Card className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                登録済みユーザー一覧
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        名前
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        メール
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        技術力
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        問題解決力
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        コミュニケーション
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.technical_skill}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.problem_solving_ability}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.communication_skill}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
