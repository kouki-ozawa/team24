import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload); // 永続化
    },
    clearUserId: (state) => {
      state.userId = null;
      localStorage.removeItem("userId");
    },
    loadUserId: (state) => {
      const savedId = localStorage.getItem("userId");
      if (savedId) state.userId = savedId;
    },
  },
});

export const { setUserId, clearUserId, loadUserId } = userSlice.actions;
export default userSlice.reducer;
