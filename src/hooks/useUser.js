import { useState, useEffect } from "react";
import useSWR from 'swr';

// フェッチャー関数
async function fetcher(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Fetch error:", res.status, errorText);
            throw new Error("ユーザー情報の取得に失敗しました");
        }
        return res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const useUser = (id) => {
  // 環境変数をログ出力（デバッグ用）
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  
  // APIエンドポイントを調整
  // 正しいパスの例: '/api/user/{id}'
  const apiUrl = id ? `${process.env.NEXT_PUBLIC_API_URL}/user/${id}` : null;
  console.log('Adjusted API URL:', apiUrl);
  
  // SWRでデータ取得
  const { data, error, isLoading, mutate } = useSWR(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: false, // ページフォーカス時に再検証しない
      shouldRetryOnError: false, // エラー時に自動再試行しない（デバッグ中）
    }
  );

  return {
    user: data,
    loading: isLoading,
    error: error?.message,
    mutate, // SWRのmutate関数を返す
  };
};
