import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./navigation/navigationSlice";
import transactionReducer from "./transaction/transactionSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    transaction: transactionReducer,
    user: userReducer,
  },
});

export default store;
