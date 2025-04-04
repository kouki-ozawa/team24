/**
 * ユーザーAPI関連の関数
 */

const API_URL = "https://skill-match-api-mock.onrender.com";

// すべてのユーザーを取得
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error("ユーザーの取得に失敗しました");
    }
    return await response.json();
  } catch (error) {
    console.error("ユーザー取得エラー:", error);
    throw error;
  }
};

// 新しいユーザーを作成
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("ユーザー作成に失敗しました");
    }
    return await response.json();
  } catch (error) {
    console.error("ユーザー作成エラー:", error);
    throw error;
  }
};

// ユーザー情報を更新
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("ユーザー更新に失敗しました");
    }
    return await response.json();
  } catch (error) {
    console.error("ユーザー更新エラー:", error);
    throw error;
  }
};