"use client";

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue = null) {
  // 初期状態ではクライアントサイドレンダリングが完了していないため、
  // サーバーサイドレンダリング時にエラーを防ぐためにステートを使用
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // クライアントサイドでのみ実行
      const storedValue = localStorage.getItem(key);
      setValue(storedValue !== null ? storedValue : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue]);

  // 値を設定して localStorage に保存する関数
  const setStoredValue = (newValue) => {
    try {
      // 値の更新
      setValue(newValue);
      
      // localStorage に保存
      if (newValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, newValue);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // ローカルストレージから値を削除する関数
  const removeValue = () => {
    try {
      setValue(null);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { value, setValue: setStoredValue, removeValue, isLoading };
}

// コンポーネントとしても利用できるようにラッパーコンポーネントを提供
export default function LocalStorageValue({ keyName, children }) {
  const { value, isLoading } = useLocalStorage(keyName);

  if (isLoading) {
    return null; // またはローディングインジケータ
  }

  // children がファンクションの場合、値を渡して実行
  if (typeof children === 'function') {
    return children(value);
  }

  // それ以外の場合は、単にchildrenを返す
  return children;
} 