import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { add, del } = transactionSlice.actions;

export default transactionSlice.reducer;
