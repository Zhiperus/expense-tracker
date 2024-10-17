import { createSlice } from "@reduxjs/toolkit";
import { connect } from "react-redux";

const initialState = { value: [1, 0, 0, 0] };

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    changeTab: (state, action) => {
      switch (action.payload) {
        case 1:
          state.value = [1, 0, 0, 0];
          break;
        case 2:
          state.value = [0, 1, 0, 0];
          break;
        case 3:
          state.value = [0, 0, 1, 0];
          break;
        case 4:
          state.value = [0, 0, 0, 1];
          break;
        default:
          state.value;
          break;
      }
    },
  },
});

export const { changeTab } = navigationSlice.actions;

export default navigationSlice.reducer;
