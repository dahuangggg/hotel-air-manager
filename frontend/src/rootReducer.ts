import { combineReducers } from "redux";
import { History } from "history";

import authReducer from "./slices/authSlice";

export default function createRootReducer(history: History) {
  return combineReducers({
    auth: authReducer,
  });
}