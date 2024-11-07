import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: { _id: "", name: "" } };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = { _id: "", name: "" };
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
