import { useState, useEffect } from "react";
import useSWR from 'swr';

// フェッチャー関数
const fetcher = async (url) => {
  console.log('Fetching from URL:', url); // デバッグ用ログ
  try {
    const res = await fetch(url);
    console.log('Response status:', res.status); // レスポンスステータスを確認
    
    if (!res.ok) {
      const error = new Error('ユーザー情報の取得に失敗しました');
      error.info = await res.json().catch(() => ({})); // JSONパースエラーを防止
      error.status = res.status;
      throw error;
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch error:', err); // エラー詳細をログ
    throw err;
  }
};

export const useUser = (id) => {
  // 環境変数をログ出力（デバッグ用）
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
  
  // APIエンドポイントを調整
  // 正しいパスの例: '/api/user/{id}'
  const apiUrl = id ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')}/api/user/${id}` : null;
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
