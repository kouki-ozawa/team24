import { useState } from 'react';

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateUser = async (userId, userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // passwordフィールドが含まれている場合、APIリクエストから除外する
      const { password, ...dataToSend } = userData;
      
      // APIエンドポイントを調整
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')}/api/user/${userId}`;
      console.log('Update API URL:', apiUrl); // デバッグ用ログ
      
      const response = await fetch(
        apiUrl,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        }
      );

      console.log('Update response status:', response.status); // レスポンスステータスを確認

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '不明なエラー' }));
        throw new Error(errorData.message || 'ユーザー情報の更新に失敗しました');
      }

      const data = await response.json();
      console.log('Update successful:', data); // 成功データをログ
      setSuccess(true);
      return data;
    } catch (err) {
      console.error('Update error:', err); // エラー詳細をログ
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, success };
}; 