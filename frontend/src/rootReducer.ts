import { combineReducers } from "redux";
import { History } from "history";

import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";

export default function createRootReducer(history: History) {
  return combineReducers({
    auth: authReducer,
    admin: adminReducer,
  });
}
