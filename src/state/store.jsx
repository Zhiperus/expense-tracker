import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./navigation/navigationSlice";
import transactionReducer from "./transaction/transactionSlice";

export const store = configureStore({
  reducer: { navigation: navigationReducer, transaction: transactionReducer },
});

export default store;
