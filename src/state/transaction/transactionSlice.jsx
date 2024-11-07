import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = { value: [] };

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    add: (state, action) => {
      state.value.push(action.payload);
    },
    del: (state, action) => {
      state.value = state.value.filter(
        (transaction) => transaction.UID !== action.payload
      );
    },
    set: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { add, del, set } = transactionSlice.actions;

export default transactionSlice.reducer;
